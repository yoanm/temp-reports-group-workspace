import type { Metadata } from "./interfaces";
/**
 * Ensure a trailing separator exists. Easier to re-use for end-user
 *
 * @returns Same *untrusted* path with a trailing separator
 */
export declare function withTrailingSeparator(untrustedPath: string): string;
export declare function trustedPathHelpers(): TrustedPathChecker;
export interface TrustedPathChecker {
    trust: (untrustedPath: string) => string;
    toWorkspaceRelative: (untrustedPath: string) => string;
    trustedMetadataUnder: (untrustedGroupPath: string) => Metadata;
}
