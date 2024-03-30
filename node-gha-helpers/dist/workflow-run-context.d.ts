import type { GHAContext } from "./interfaces";
export declare const getContext: () => GHAContext;
export declare const getPrNumber: () => number | undefined;
export declare const getCommitSha: () => string;
export declare const getWorkflowName: () => string;
export declare const getRunId: () => string;
export declare const getBranch: () => string;
export declare const isPRFromFork: () => boolean;
