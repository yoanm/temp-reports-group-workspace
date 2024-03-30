import type { GHAContext } from "./interfaces";
export declare function getContext(): GHAContext;
export declare function getCommitSha(): string;
export declare function getPrNumber(): number | undefined;
export declare function getWorkflowName(): string;
export declare function getRunId(): string;
export declare function getBranch(): string;
export declare function isPRFromFork(): boolean;
