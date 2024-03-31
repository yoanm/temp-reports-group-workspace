import * as github from '@actions/github'; 
import * as core from '@actions/core';

// @TODO Find a way to retrieve current job (add the jobId as state to re-use it here !) and forward the annotations as Check run `details_text`

async function run() {
    if (core.getState('check-run-already-concluded').length > 0) {
        core.info('Check run already concluded, skipping check run update');
    }
    if (core.getState('check-run-id').length === 0) {
        throw new Error('Unable to retrieve check run id !');
    }
    const checkRunId = parseInt(core.getState('check-run-id'));

    /** INPUTS **/
    const jobStatus = core.getInput('job-status', {required: true}) as "action_required" | "cancelled" | "failure" | "neutral" | "success" | "skipped" | "stale" | "timed_out";
    const githubToken = core.getInput('github-token', {required: true});

    core.info('Build API params');
    const requestParams = {
        conclusion: jobStatus,
        // Url path parameters
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        check_run_id: checkRunId
    };
    core.debug('API params=' + JSON.stringify(requestParams));

    core.info('Conclude check-run');
    const octokit = github.getOctokit(githubToken);

    // @TODO Move back to `octokit.rest.checks.update()`
    const apiResponse = await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', requestParams);
    core.debug('API call to ' +apiResponse.url + ' => HTTP ' + apiResponse.status);
}

run().catch(e => {
    core.warning('Error caught and ignored: ' + e.message);
    core.debug('Error=' + JSON.stringify(e));
});
