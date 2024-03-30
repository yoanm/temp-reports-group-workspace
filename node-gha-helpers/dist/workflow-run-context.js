import { context as ghaContext } from '@actions/github';
const { payload: ghaEvent } = ghaContext;
const { isPullRequestEvent } = require('./workflow-run-event');
import { buildWorkflowRunUrl } from "./common";
export const getContext = () => {
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
};
export const getPrNumber = () => { var _a; return isPullRequestEvent() ? (_a = ghaEvent.workflow_run.pull_requests[0]) === null || _a === void 0 ? void 0 : _a.number : undefined; };
export const getCommitSha = () => ghaEvent.workflow_run.head_sha;
export const getWorkflowName = () => ghaEvent.workflow.name;
export const getRunId = () => ghaEvent.workflow_run.id.toString();
export const getBranch = () => ghaEvent.workflow_run.head_branch;
export const isPRFromFork = () => isPullRequestEvent() && ghaEvent.workflow_run.head_repository.id === ghaEvent.workflow_run.repository.id;
//# sourceMappingURL=workflow-run-context.js.map