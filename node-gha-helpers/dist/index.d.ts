/** @type {GHAEventHelpers} */
import * as currentWorkflowEventHelpers from './current-workflow-event';
/** @type {GHAContextHelpers} */
import * as currentWorkflowContextHelpers from './current-workflow-context';
/** @type {GHAContextHelpers} */
import * as workflowRunContextHelpers from './workflow-run-context';
/**
 * @type {GHAContextGetter}
 */
export declare const getContext: typeof currentWorkflowContextHelpers.getContext;
/**
 * @type {GHAEventHelpers}
 */
export declare const eventHelpers: typeof currentWorkflowEventHelpers;
/**
 * @type {GHAContextHelpers}
 */
export declare const contextHelpers: typeof currentWorkflowContextHelpers;
/**
 * @type {ContextHelperSet}
 */
export declare const triggeringWorkflow: {
    getContext: () => import("./interfaces").GHAContext;
    eventHelpers: typeof currentWorkflowEventHelpers;
    contextHelpers: typeof workflowRunContextHelpers;
};
export * from './fetch-current-job';
export * from './common';
export * from './interfaces';
