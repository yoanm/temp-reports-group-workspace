export function buildWorkflowRunUrl(
    serverUrl: string,
    repositorySlug: string,
    runId: string,
    prNumber: (string|number|null|undefined) = undefined
): string {
    return serverUrl + '/' + repositorySlug + '/actions/runs/' + runId + (!prNumber ? '' : '?pr=' + prNumber);
}

export function enhanceWorkflowJobRunUrl(jobUrl: string, prNumber: (string|number|null|undefined) = undefined) {
    return jobUrl + (!prNumber ? '' : '?pr=' + prNumber);
}
