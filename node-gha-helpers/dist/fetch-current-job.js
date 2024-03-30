var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { context as ghaContext } from '@actions/github';
import * as core from '@actions/core';
const { RUNNER_NAME } = process.env;
export function fetchCurrentJob(octokit) {
    return __awaiter(this, void 0, void 0, function* () {
        const jobList = yield getWorkflowJobsForRunId(octokit, ghaContext.repo.owner, ghaContext.repo.repo, ghaContext.runId);
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
            core.warning('Multiple running jobs rely on runners with the same name, unable to retrieve the current job !'
                + '\nCandidates: ' + Object.entries(candidateList).map(([k, v]) => v.name + '(' + k + ')').join(', '));
            return undefined;
        }
        return candidateList.shift();
    });
}
function getWorkflowJobsForRunId(octokit, owner, repo, runId) {
    return __awaiter(this, void 0, void 0, function* () {
        return octokit.paginate(octokit.rest.actions.listJobsForWorkflowRun, {
            filter: 'latest',
            // Url path parameters
            owner: owner,
            repo: repo,
            run_id: runId
        });
    });
}
//# sourceMappingURL=fetch-current-job.js.map