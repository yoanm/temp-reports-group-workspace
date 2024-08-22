import type {GetWorkflowJobsResponse} from './octokit-types';

export type WorkflowJob = GetWorkflowJobsResponse['data']['jobs'][number];
