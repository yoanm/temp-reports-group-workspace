import * as core from '@actions/core';

import * as path from 'path';

import * as SDK from "node-sdk";

async function run() {
    const trustedPathConverter = SDK.path.trustedPathHelpers();
    /** INPUTS **/
    const PATH_INPUT = core.getInput('path', {required: true});
    const FOLLOW_SYMLINK_INPUT = core.getBooleanInput('follow-symbolic-links', {required: true});

    const pathList = await SDK.find.trustedMetadataPaths(
        PATH_INPUT,
        trustedPathConverter.toWorkspaceRelative,
        {followSymbolicLinks: FOLLOW_SYMLINK_INPUT}
    );
    SDK.outputs.bindFrom({
        paths: pathList.map(p => trustedPathConverter.trust(path.dirname(p))).join('\n'),
    });
}

run();
