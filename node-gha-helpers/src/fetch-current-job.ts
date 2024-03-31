import {context as ghaContext} from '@actions/github';
import * as core from '@actions/core';
import type {WorkflowJob} from "./common-types";
import type {GHOctokit} from "./octokit-types";

const {RUNNER_NAME} = process.env;

export async function fetchCurrentJob(octokit: GHOctokit): Promise<WorkflowJob|undefined> {
    const jobList = await getWorkflowJobsForRunId(octokit, ghaContext.repo.owner, ghaContext.repo.repo, ghaContext.runId);
    const candidateList = [];
    for (const job of jobList) {
        if (RUNNER_NAME === job.runner_name && 'in_progress' === job.status) {
            candidateList.push(job);
        }
    }
    if (candidateList.length === 0) {
        core.info('Unable to retrieve the current job !');
        core.info('DEBUG TMP ' + JSON.stringify(jobList));
        return undefined;
    }
    if (candidateList.length > 1) {
        core.warning(
            'Multiple running jobs rely on runners with the same name, unable to retrieve the current job !'
            + '\nCandidates: ' + Object.entries(candidateList).map(([k, v]) => v.name + '(' + k + ')').join(', ')
        );
        return undefined;
    }

    return candidateList.shift();
}

async function getWorkflowJobsForRunId(
    octokit: GHOctokit,
    owner: string,
    repo: string,
    runId: number
): Promise<WorkflowJob[]> {
    return octokit.paginate(
        octokit.rest.actions.listJobsForWorkflowRun,
        {
            filter: 'latest',
            // Url path parameters
            owner: owner,
            repo: repo,
            run_id: runId
        }
    );
}
