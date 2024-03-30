import { getOctokit } from '@actions/github';
import type { Endpoints } from '@octokit/types';
export type GHOctokit = ReturnType<typeof getOctokit>;
export type GetWorkflowJobsParameters = Endpoints["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"]["parameters"];
export type GetWorkflowJobsResponse = Endpoints["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"]["response"];
