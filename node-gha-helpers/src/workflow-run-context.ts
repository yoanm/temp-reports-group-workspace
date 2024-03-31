import {context as ghaContext} from '@actions/github';
const {payload: ghaEvent} = ghaContext;

import {isPullRequestEvent} from './workflow-run-event';
import {buildWorkflowRunUrl} from "./common";
import type {GHAContext} from "./interfaces";


export const getContext = (): GHAContext => {
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
    }
};

export const getPrNumber = ():number|undefined => isPullRequestEvent() ? ghaEvent.workflow_run.pull_requests[0]?.number : undefined;

export const getCommitSha = ():string => ghaEvent.workflow_run.head_sha;

export const getWorkflowName = ():string => ghaEvent.workflow.name;

export const getRunId = ():string => ghaEvent.workflow_run.id.toString();

export const getBranch = (): string => ghaEvent.workflow_run.head_branch;

export const isPRFromFork = (): boolean => isPullRequestEvent() && ghaEvent.workflow_run.head_repository.id === ghaEvent.workflow_run.repository.id;
