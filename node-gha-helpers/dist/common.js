export function buildWorkflowRunUrl(serverUrl, repositorySlug, runId, prNumber = undefined) {
    return serverUrl + '/' + repositorySlug + '/actions/runs/' + runId + (!prNumber ? '' : '?pr=' + prNumber);
}
export function buildWorkflowJobRunUrl({ html_url: jobUrl }, prNumber = undefined) {
    return jobUrl + (!prNumber ? '' : '?pr=' + prNumber);
}
//# sourceMappingURL=common.js.map