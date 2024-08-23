import * as core from '@actions/core';

import * as path from 'path';

import * as SDK from "node-sdk";

async function run() {
    /** INPUTS **/
    const PATHS_INPUT = core.getInput('json-paths-list', {required: true});
    const ARTIFACT_DWL_DIRECTORY_INPUT = core.getInput('from-artifact-directory', {required: true});
    const artifactDwlParentDirPath = path.resolve(ARTIFACT_DWL_DIRECTORY_INPUT, '..');
    let jobCnt = 0;

    const matrix = {
        include: JSON.parse(PATHS_INPUT).map((pathList: string[]) => {
            const artifactSet = new Set();

            pathList = pathList.map(p => {
                const absGroupPath = path.resolve(p);
                const trustedPathWithDwlDirectory = path.normalize(path.relative(artifactDwlParentDirPath, absGroupPath));
                const [/* dwlDirName */, artifactName] = trustedPathWithDwlDirectory.split(path.sep);

                artifactSet.add(artifactName);

                return trustedPathWithDwlDirectory;
            });
            const res: Record<string, string|number> = {
                job: ++jobCnt,
                'artifacts-dwl-pattern': '@(' + [...artifactSet].join('|') + ')',
                paths: pathList.join('\n'),
            };

            return res;
        })
    };
    SDK.outputs.bindFrom({
        matrix: JSON.stringify(matrix),
    });
}

run();
