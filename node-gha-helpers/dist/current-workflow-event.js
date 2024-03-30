import { context as ghaContext } from '@actions/github';
export const isWorkflowRunEvent = () => 'workflow_run' === ghaContext.eventName;
export const isPullRequestEvent = () => 'pull_request' === ghaContext.eventName;
export const isPushEvent = () => 'push' === ghaContext.eventName;
//# sourceMappingURL=current-workflow-event.js.map