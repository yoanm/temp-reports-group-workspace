import { context as ghaContext } from '@actions/github';
const { payload: ghaEvent } = ghaContext;
export const isWorkflowRunEvent = () => ghaEvent.workflow_run && 'workflow_run' === ghaEvent.workflow_run.event;
export const isPullRequestEvent = () => ghaEvent.workflow_run && 'pull_request' === ghaEvent.workflow_run.event;
export const isPushEvent = () => ghaEvent.workflow_run && 'push' === ghaEvent.workflow_run.event;
//# sourceMappingURL=workflow-run-event.js.map