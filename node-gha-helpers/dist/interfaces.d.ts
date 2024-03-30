export type GHAContext = {
    repositoryOwner: string;
    repositoryName: string;
    commitSha: string;
    branch: string;
    prNumber: (number | undefined);
    isPrFromFork: boolean;
    workflowName: string;
    runId: string;
    workflowRunUrl: string;
    serverUrl: string;
};
export type GHAContextGetter = () => GHAContext;
export type ContextHelperSet = {
    getContext: GHAContextGetter;
    eventHelpers: GHAEventHelpers;
    contextHelpers: GHAContextHelpers;
};
export interface GHAContextHelpers {
    getContext: GHAContextGetter;
    getCommitSha: () => string;
    getPrNumber: () => number | undefined;
    getWorkflowName: () => string;
    getRunId: () => string;
}
export interface GHAEventHelpers {
    isWorkflowRunEvent: () => boolean;
    isPullRequestEvent: () => boolean;
    isPushEvent: () => boolean;
}
