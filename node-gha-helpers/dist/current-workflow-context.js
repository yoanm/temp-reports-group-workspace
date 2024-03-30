import { context as ghaContext } from '@actions/github';
const { payload: ghaEvent } = ghaContext;
import { isPullRequestEvent, isPushEvent } from './current-workflow-event';
import { buildWorkflowRunUrl } from "./common";
export function getContext() {
    const prNumber = getPrNumber();
    const runId = getRunId();
    return {
        repositoryOwner: ghaContext.repo.owner,
        repositoryName: ghaContext.repo.repo,
        commitSha: getCommitSha(),
        branch: getBranch(),
        prNumber: prNumber,
        isPrFromFork: isPRFromFork(),
        workflowName: getWorkflowName(),
        serverUrl: ghaContext.serverUrl,
        runId: runId,
        workflowRunUrl: buildWorkflowRunUrl(ghaContext.serverUrl, ghaContext.repo.owner + '/' + ghaContext.repo.repo, runId, prNumber),
    };
}
export function getCommitSha() {
    if (isPullRequestEvent()) {
        return ghaEvent.pull_request.head.sha;
    }
    if (isPushEvent()) {
        return ghaEvent.after;
    }
    return ghaContext.sha;
}
export function getPrNumber() {
    return isPullRequestEvent() ? ghaEvent.number : undefined;
}
export function getWorkflowName() {
    return ghaContext.workflow;
}
export function getRunId() {
    return ghaContext.runId.toString();
}
export function getBranch() {
    if (isPullRequestEvent()) {
        return ghaEvent.pull_request.head.ref;
    }
    // In case ref is not a branch (e.g. a tag), fallback to repository default branch
    return ghaContext.ref.startsWith('refs/heads') ? ghaContext.ref.replace('refs/heads/', '') : ghaEvent.repository.default_branch;
}
export function isPRFromFork() {
    return isPullRequestEvent() && ghaEvent.pull_request.head.repo.id === ghaEvent.pull_request.base.repo.id;
}
//# sourceMappingURL=current-workflow-context.js.map