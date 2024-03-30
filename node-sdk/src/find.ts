import * as path from 'path';

import * as core from '@actions/core'; 
import type {GlobOptions} from '@actions/glob';

import {METADATA_FILENAME} from './constants';
import * as glob from './glob';

/**
 * @param toTrustedPath A function ensuring path is valid before returning it
 *
 * @returns Trusted metadata path list
 */
export async function trustedMetadataPaths(
    globPattern: string,
    toTrustedPath: (untrustedPath: string) => string,
    globOptions: GlobOptions|undefined = undefined
): Promise<string[]> {
    const finalPattern = globPattern.split('\n').map(item => toTrustedPath(path.join(item.trim(), '**', METADATA_FILENAME))).join('\n');
    core.debug('Find metadata paths with ' + globPattern);

    const list = [];
    for await (const fp of glob.lookup(finalPattern, globOptions)) {
        list.push(fp);
    }

    return list;
}
