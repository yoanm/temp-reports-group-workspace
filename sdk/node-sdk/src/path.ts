import fs from 'fs';
import * as core from '@actions/core';

import path from 'path';
const {GITHUB_WORKSPACE} = process.env;

import type {Metadata} from "./interfaces";
import {METADATA_FILENAME} from './constants';

/**
 * Ensure a trailing separator exists. Easier to re-use for end-user
 *
 * @returns Same *untrusted* path with a trailing separator
 */
export function withTrailingSeparator(untrustedPath: string): string {
    if (untrustedPath.length && path.sep !== untrustedPath[untrustedPath.length - 1]) {
        return untrustedPath + path.sep
    }

    return untrustedPath;
}

export function trustedPathHelpers(): TrustedPathChecker {
    return trustFrom(GITHUB_WORKSPACE!);
}

function formatErrorDetails(workspacePath: string, untrustedPath: string, normalizedPath: string): string {
    return ' Workspace: "' + workspacePath + '"'
        + ' Path: "' + normalizedPath + '"'
        + (untrustedPath !== normalizedPath ? ' (provided: "' + untrustedPath + '")' : '');
}


function avoidPoisonNullBytesAttack(untrustedPath: string) {
    if (untrustedPath.indexOf('\0') !== -1) {
        throw new Error('Potential "Poison Null Bytes" attack detected !');
    }
}
function avoidRelativePathAttack(workspacePath: string, untrustedPath: string) {
    const normalizedPath = path.resolve(untrustedPath);
    if (normalizedPath.indexOf(workspacePath) !== 0) {
        throw new Error(
            'Potential "Relative Path" attack detected !\n' + formatErrorDetails(workspacePath, untrustedPath, normalizedPath)
        );
    }
}

function mustBeStrictlyIn(workspacePath: string, untrustedPath: string) {
    const normalizedPath = path.resolve(untrustedPath);
    if (path.dirname(normalizedPath) !== workspacePath) {
        throw new Error(
            'Path should lead to the workspace directory only !\n' + formatErrorDetails(workspacePath, untrustedPath, normalizedPath)
        );
    }
}

export interface TrustedPathChecker {
    trust: (untrustedPath: string) => string;
    toWorkspaceRelative: (untrustedPath: string) => string;
    trustedMetadataUnder: (untrustedGroupPath: string) => Metadata;
}

function trustFrom(workspacePath: string, zeroDepth: boolean = false): TrustedPathChecker {
    // Ensure workspace path is ok
    avoidPoisonNullBytesAttack(workspacePath)
    if (!path.isAbsolute(workspacePath)) {
        throw new Error('Workspace path must be an absolute path');
    }
    const helpers: TrustedPathChecker = {
        trust: (untrustedPath) => {
            avoidPoisonNullBytesAttack(untrustedPath);
            if (zeroDepth) {
                mustBeStrictlyIn(workspacePath, untrustedPath);
            } else {
                avoidRelativePathAttack(workspacePath, untrustedPath);
            }

            return untrustedPath; // Becomes trusted then :)
        },
        /**
         * @returns Trusted relative path from workspace directory to `untrustedPath`
         */
        toWorkspaceRelative: (untrustedPath) => {
            return helpers.trust(path.relative(workspacePath, untrustedPath));
        },
        trustedMetadataUnder: (untrustedGroupPath) => {
            const trustedPath = helpers.trust(path.join(untrustedGroupPath, METADATA_FILENAME));
            const content = fs.readFileSync(trustedPath).toString();
            core.debug(untrustedGroupPath + ' content=' + content);

            const untrustedMetadata = JSON.parse(content) as Metadata;
            const trustedGroupPath = path.dirname(trustedPath);
            // Ensure `reports` hasn't been tampered with ! (may lead to files outside the directory)
            const trustedReportPathsConverter = trustFrom(path.resolve(trustedGroupPath), true);

            return {
                name: untrustedMetadata.name,
                format: untrustedMetadata.format,
                reports: untrustedMetadata.reports.map(r => trustedReportPathsConverter.trust(path.join(trustedGroupPath, r))),
                flags: untrustedMetadata.flags,
                path: withTrailingSeparator(trustedGroupPath),
            };
        }
    };

    return helpers;
}
