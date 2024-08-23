import * as core from '@actions/core';

import * as SDK from "node-sdk";
import type {MergeField} from 'node-sdk';

async function run() {
    const trustedPathConverter = SDK.path.trustedPathHelpers();
    /** INPUTS **/
    const PATHS_INPUT = core.getMultilineInput('paths', {required: true});
    const GROUP_BY_INPUT = core.getInput('group-by');

    let trustedMetadataList = await core.group(
        'Load metadata list',
        async () => PATHS_INPUT.map((p) => {
            core.info('Load ' + p);

            return trustedPathConverter.trustedMetadataUnder(p);
        })
    );
    core.debug('Metadata list=' + JSON.stringify(trustedMetadataList));
    if (0 === trustedMetadataList.length) {
        core.setFailed('Unable to retrieve any metadata. Something wrong most likely happened !');
    }

    core.info('Merge metadata list');
    const trustedMetadataListOfList = SDK.merge.groupMetadataList(trustedMetadataList, GROUP_BY_INPUT.split(',') as MergeField[]);
    SDK.outputs.bindFrom({
        list: JSON.stringify(trustedMetadataListOfList.map(mdList => mdList.map(md => md.path))),
        count: trustedMetadataListOfList.length,
    });
}

run();
