import * as core from '@actions/core';

import * as path from 'path';

import * as SDK from "node-sdk";

async function run() {
    /** INPUTS **/
    const PATHS_INPUT = core.getInput('json-paths-list', {required: true});
    const ARTIFACT_DWL_DIRECTORY_INPUT = core.getInput('from-artifact-directory', {required: false});
    const artifactDwlParentDirPath = ARTIFACT_DWL_DIRECTORY_INPUT.length > 0
        ? path.resolve(ARTIFACT_DWL_DIRECTORY_INPUT, '..')
        : undefined
    ;
    let jobCnt = 0;

    const matrix = {
        include: JSON.parse(PATHS_INPUT).map((pathList: string[]) => {
            const res: Record<string, string|number> = {job: ++jobCnt};
            if (undefined !== artifactDwlParentDirPath) {
                const artifactSet = new Set();

                pathList = pathList.map(p => {
                    const absGroupPath = path.resolve(p);
                    const trustedPathWithDwlDirectory = path.normalize(path.relative(artifactDwlParentDirPath, absGroupPath));
                    console.log('DEBUG');
                    console.log({p, absGroupPath, relPath: path.relative(artifactDwlParentDirPath, absGroupPath), trustedPathWithDwlDirectory});
                    const [/* dwlDirName */, artifactName] = trustedPathWithDwlDirectory.split(path.sep);

                    artifactSet.add(artifactName);

                    return trustedPathWithDwlDirectory;
                });
                res['artifacts-dwl-pattern'] = '@(' + [...artifactSet].join('|') + ')';
            }

            res.paths = pathList.join('\n');

            return res;
        })
    };
    SDK.outputs.bindFrom({
        matrix: JSON.stringify({include : matrix}),
    });
}

run();
