import * as core from '@actions/core'; 

import * as SDK from 'node-sdk';  

async function run() {
    const trustedPathConverter = SDK.path.trustedPathHelpers();
    /** INPUTS **/
    const PATH_INPUT = core.getInput('path', {required: true});
    // Following inputs are not marked as required by the action but a default value must be there, so using `required` works
    const FORMAT_INPUT = core.getInput('format', {required: true});
    const GLUE_STRING_INPUT = core.getInput('glue-string', {required: true, trimWhitespace: false});
    const FOLLOW_SYMLINK_INPUT = core.getBooleanInput('follow-symbolic-links', {required: true});

    let trustedMetadataList = await core.group(
        'Build metadata list',
        async () => SDK.load.loadMetadataListFrom(PATH_INPUT, trustedPathConverter, {followSymbolicLinks: FOLLOW_SYMLINK_INPUT})
    );
    core.debug('Metadata list=' + JSON.stringify(trustedMetadataList));
    if (0 === trustedMetadataList.length) {
        core.setFailed('Unable to retrieve any metadata. Something wrong most likely happened !');
    }

    core.info('Build action outputs');
    const isGlobString = 'glob-string' === FORMAT_INPUT;
    const pathList: string[] = SDK.array.itemsPropertyList(trustedMetadataList, 'path');
    const flagList: string[][] = SDK.array.itemsPropertyList(trustedMetadataList, 'flags');
    const reportList: string[][] = SDK.array.itemsPropertyList(trustedMetadataList, 'reports');
    const reportCount = reportList.reduce((acc, list) => acc + list.length, 0);
    if (0 === pathList.length) {
        core.setFailed('Unable to retrieve any group. Something wrong most likely happened !');
    } else if (0 === reportCount) {
        core.setFailed('Unable to retrieve any report to upload. Something wrong most likely happened !');
    }

    SDK.outputs.bindFrom({
        names: SDK.array.mergeStringList(SDK.array.itemsPropertyList(trustedMetadataList, 'name')).join(GLUE_STRING_INPUT),
        formats: SDK.array.mergeStringList(SDK.array.itemsPropertyList(trustedMetadataList, 'format')).join(GLUE_STRING_INPUT),
        reports: SDK.array.mergeListOfList(SDK.array.itemsPropertyList(trustedMetadataList, 'reports')).join(isGlobString ? '\n' : GLUE_STRING_INPUT),
        flags: (flagList.length > 0) ? SDK.array.mergeListOfList(flagList).join(GLUE_STRING_INPUT) : null,
        paths: SDK.array.mergeStringList(pathList).join(isGlobString ? '\n' : GLUE_STRING_INPUT),
        'group-count': pathList.length,
        'report-count': reportCount,
        json: JSON.stringify(trustedMetadataList),
    });
}

run();
