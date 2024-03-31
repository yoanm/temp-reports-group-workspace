import * as currentWorkflowEventHelpers from './current-workflow-event';
import * as currentWorkflowContextHelpers from './current-workflow-context';
import * as workflowRunEventHelpers from './workflow-run-event';
import * as workflowRunContextHelpers from './workflow-run-context';

const isWorkflowRunEvent = currentWorkflowEventHelpers.isWorkflowRunEvent();
export const getContext = currentWorkflowContextHelpers.getContext;
export const eventHelpers = currentWorkflowEventHelpers;
export const contextHelpers = currentWorkflowContextHelpers;
export const triggeringWorkflow = {
    getContext: isWorkflowRunEvent ? workflowRunContextHelpers.getContext : currentWorkflowContextHelpers.getContext,
    eventHelpers: isWorkflowRunEvent ? workflowRunEventHelpers : currentWorkflowEventHelpers,
    contextHelpers: isWorkflowRunEvent ? workflowRunContextHelpers : currentWorkflowContextHelpers,
}

export * from './fetch-current-job';
export * from './common';
export * from './interfaces';
