import * as core from '@actions/core';
import type {GlobOptions} from '@actions/glob';

import * as path from 'path';

import * as find from './find';
import type {Metadata} from "./interfaces";
import type {TrustedPathChecker} from "./path";

/**
 * @param toTrustedPath A function ensuring path is valid before returning it
 */
export async function loadMetadataListFrom(
    globPattern: string,
    trustedPathChecker: TrustedPathChecker,
    globOptions: GlobOptions|undefined = undefined
): Promise<Metadata[]> {
    const trustedMetadataPathList = await find.trustedMetadataPaths(globPattern, trustedPathChecker.toWorkspaceRelative, globOptions);

    return trustedMetadataPathList.map((trustedMetadataPath) => {
        const trustedGroupPath = path.dirname(trustedMetadataPath);
        core.info('Load ' + trustedGroupPath);

        return trustedPathChecker.trustedMetadataUnder(trustedGroupPath);
    });
}
