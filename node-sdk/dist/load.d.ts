import type { GlobOptions } from '@actions/glob';
import type { Metadata } from "./interfaces";
import type { TrustedPathChecker } from "./path";
/**
 * @param toTrustedPath A function ensuring path is valid before returning it
 */
export declare function loadMetadataListFrom(globPattern: string, trustedPathChecker: TrustedPathChecker, globOptions?: GlobOptions | undefined): Promise<Metadata[]>;
