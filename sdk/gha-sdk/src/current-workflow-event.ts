import {context as ghaContext} from '@actions/github';

export const isWorkflowRunEvent = (): boolean => 'workflow_run' === ghaContext.eventName;

export const isPullRequestEvent = (): boolean => 'pull_request' === ghaContext.eventName;

export const isPushEvent = (): boolean => 'push' === ghaContext.eventName;
