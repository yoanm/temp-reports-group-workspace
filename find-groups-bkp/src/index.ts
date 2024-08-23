import {statSync} from 'fs';
import path from 'path'; 

import * as core from '@actions/core'; 

import * as SDK from 'node-sdk'; 
import type {Metadata, MergeField} from 'node-sdk'; 

async function run() {
    const trustedPathConverter = SDK.path.trustedPathHelpers();
    /** INPUTS **/
    const PATH_INPUT = core.getInput('path', {required: true});
    // Following inputs are not marked as required by the action but a default value must be there, so using `required` works
    const FORMAT_INPUT = core.getInput('format', {required: true});
    const GLUE_STRING_INPUT = core.getInput('glue-string', {required: 'json' !== FORMAT_INPUT, trimWhitespace: false});
    const FOLLOW_SYMLINK_INPUT = core.getBooleanInput('follow-symbolic-links', {required: true});
    const ENABLE_PATH_ONLY_MODE = core.getBooleanInput('paths-only-mode', {required: true});
    const ENABLE_ARTIFACT_MODE = core.getBooleanInput('artifacts-mode', {required: true});
    const ENABLE_MATRIX_MODE = core.getBooleanInput('matrix-mode', {required: true});
    // Following inputs are optionals !
    const GROUP_BY_INPUT = core.getInput('group-by');
    const trustedPathInput = trustedPathConverter.trust(PATH_INPUT);

    let trustedMetadataList = await core.group(
        'Build metadata list',
        async () => SDK.load.loadMetadataListFrom(trustedPathInput, trustedPathConverter, {followSymbolicLinks: FOLLOW_SYMLINK_INPUT})
    );
    core.debug('Metadata list=' + JSON.stringify(trustedMetadataList));
    if (0 === trustedMetadataList.length) {
        core.setFailed('Unable to retrieve any metadata. Something wrong most likely happened !');
    }

    // "Filtering" phase
    core.debug('Filter metadata list');
    trustedMetadataList = SDK.filter.filterMetadataList(
        trustedMetadataList,
        {
            groups: core.getMultilineInput('exclude-groups'),
            formats: core.getMultilineInput('exclude-formats'),
            flags: core.getMultilineInput('exclude-flags'),
            paths: core.getMultilineInput('exclude-paths'),
        },
        {
            groups: core.getMultilineInput('only-include-groups'),
            formats: core.getMultilineInput('only-include-formats'),
            flags: core.getMultilineInput('only-include-flags'),
            paths: core.getMultilineInput('only-include-paths')
        }
    )
    core.debug('New metadata list=' + JSON.stringify(trustedMetadataList));
    // Apply `artifacts` mode if needed
    if (ENABLE_ARTIFACT_MODE) {
        core.debug('Apply artifact mode');
        if (!statSync(trustedPathInput).isDirectory()) {
            core.setFailed('Provided path is not a valid directory. You must provide a single valid path when `artifacts-mode` is enabled !')
        }
        const trustedArtifactDwlParentDirPath = SDK.path.withTrailingSeparator(trustedPathConverter.trust(path.resolve(trustedPathInput, '..')));
        const artifactSet = new Set();

        trustedMetadataList = trustedMetadataList.map(metadata => {
            const absGroupPath = path.resolve(metadata.path);
            const trustedPathWithDwlDirectory = path.normalize(absGroupPath.replace(trustedArtifactDwlParentDirPath, ''));
            const [/* dwlDirName */, artifactName] = trustedPathWithDwlDirectory.split(path.sep);

            metadata.artifact = artifactName;
            artifactSet.add(metadata.artifact);
            metadata.path = SDK.path.withTrailingSeparator(trustedPathWithDwlDirectory);
            metadata.reports = metadata.reports.map(v => trustedPathConverter.trust(path.relative(trustedArtifactDwlParentDirPath, v)));

            return metadata;
        });
        core.debug('New metadata list=' + JSON.stringify(trustedMetadataList));
        const artifactList = [...artifactSet];
        SDK.outputs.bindFrom({
            artifacts: artifactList.join('\n'),
            'artifacts-dwl-pattern': '@(' + artifactList.join('|') + ')',
        });
        core.debug('Artifact mode applied');
    }
    // Apply `path-only` mode ?
    if (ENABLE_PATH_ONLY_MODE) { // @TODO most likely useless => to remove
        core.info('Apply paths-only mode');
        SDK.outputs.bindFrom({
            count: trustedMetadataList.length,
            paths: trustedMetadataList.map(({reports}) => reports).flat().join('\n'),
        });
        core.debug('paths-only mode applied, stopping there');

        return;
    }
    // "Grouping" phase
    let trustedMetadataListOfList: Metadata[][] = [trustedMetadataList];
    const groupByItemList: MergeField[] = GROUP_BY_INPUT.length > 0 ? GROUP_BY_INPUT.split(',') as MergeField[] : [];
    if (groupByItemList.length > 0) {
        core.info('Merge metadata list');
        trustedMetadataListOfList = SDK.merge.groupMetadataList(trustedMetadataList, groupByItemList);
        core.debug('New metadata list=' + JSON.stringify(trustedMetadataListOfList));
    }
    // "Merging" phase
    core.info('Build action outputs');
    const outputs = SDK.format.convertMetadataListToFindActionOutput(trustedMetadataListOfList, FORMAT_INPUT, GLUE_STRING_INPUT)

    // Apply `matrix-mode`
    if (ENABLE_MATRIX_MODE) { // @TODO remove from the action (do it inside the workflow with JS code)
        core.info('Apply matrix mode');
        let cnt = 0;

        SDK.outputs.bindFrom({
            ...outputs,
            // @ts-expect-error: undefined is not an allowed property value
            list: undefined,
            matrix: JSON.stringify({
                include: outputs.list.map(md => Array.isArray(md.name) ? JSON.stringify({...md, job: ++cnt}) : {...md, job: ++cnt})
            }),
        });
        core.debug('Matrix mode applied');
    } else {
        SDK.outputs.bindFrom({
            ...outputs,
            list: JSON.stringify(outputs.list)
        });
    }
}

run();
