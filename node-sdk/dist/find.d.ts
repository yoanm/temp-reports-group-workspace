import type { GlobOptions } from '@actions/glob';
/**
 * @param toTrustedPath A function ensuring path is valid before returning it
 *
 * @returns Trusted metadata path list
 */
export declare function trustedMetadataPaths(globPattern: string, toTrustedPath: (untrustedPath: string) => string, globOptions?: GlobOptions | undefined): Promise<string[]>;
