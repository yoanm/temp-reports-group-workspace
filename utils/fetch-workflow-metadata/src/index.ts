import * as core from '@actions/core'; 

import {getContext, triggeringWorkflow} from 'gha-sdk';

async function run() {
    const context = core.getBooleanInput('from-triggering-workflow', {required: true}) ? triggeringWorkflow.getContext() : getContext();

    core.setOutput('repository-owner', context.repositoryOwner);
    core.setOutput('repository-name', context.repositoryName);
    core.setOutput('commit-sha', context.commitSha);
    core.setOutput('branch', context.branch);
    core.setOutput('pull-request', context.prNumber ?? null); // Ensure `null` rather than `undefined` (better/easier for end-user)!
    core.setOutput('is-pr-from-fork', context.isPrFromFork);
    core.setOutput('workflow-name', context.workflowName);
    core.setOutput('run-id', context.runId);
    core.setOutput('server-url', context.serverUrl);
    core.setOutput('workflow-run-url', context.workflowRunUrl);
}

run();
