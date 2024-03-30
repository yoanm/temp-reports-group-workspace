import type { WorkflowJob } from "./common-types";
import type { GHOctokit } from "./octokit-types";
export declare function fetchCurrentJob(octokit: GHOctokit): Promise<WorkflowJob | undefined>;
