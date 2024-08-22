import {context as ghaContext} from '@actions/github';
const {payload: ghaEvent} = ghaContext;


export const isWorkflowRunEvent = (): boolean => ghaEvent.workflow_run && 'workflow_run' === ghaEvent.workflow_run.event;

export const isPullRequestEvent = (): boolean => ghaEvent.workflow_run && 'pull_request' === ghaEvent.workflow_run.event;

export const isPushEvent = (): boolean => ghaEvent.workflow_run && 'push' === ghaEvent.workflow_run.event;
