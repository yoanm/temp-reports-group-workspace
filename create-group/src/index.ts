import path from 'path'; 
import fs from 'fs'; 

import * as core from '@actions/core'; 
import * as io from '@actions/io'; 

import * as SDK from 'node-sdk'; 

async function run() {
    const trustedPathHelper = SDK.path.trustedPathHelpers();
    /** INPUTS **/
    const NAME_INPUT = core.getInput('name', {required: true});
    const FORMAT_INPUT = core.getInput('format', {required: true});
    const REPORTS_INPUT = core.getInput('files', {required: true});
    // Following inputs are not marked as required by the action but a default value must be there, so using `required` works
    const PATH_INPUT = core.getInput('path', {required: true});
    const FOLLOW_SYMLINK_INPUT = core.getBooleanInput('follow-symbolic-links', {required: true});
    // Following inputs are not required at all !
    const FLAG_LIST_INPUT = core.getMultilineInput('flags');

    const trustedGroupDirectory = await core.group(
        'Resolve group directory path',
        async () => {
            const res = trustedPathHelper.trust(path.join(PATH_INPUT, NAME_INPUT));
            core.info('group directory=' + res);

            return res;
        }
    );

    const trustedOriginalReportPaths = await core.group(
        'Resolve reports',
        async () => {
            const result = [];
            for await (const fp of SDK.glob.lookup(REPORTS_INPUT, {followSymbolicLinks: FOLLOW_SYMLINK_INPUT})) {
                const normalizedFp = trustedPathHelper.toWorkspaceRelative(fp);
                core.info('Found ' + normalizedFp);
                result.push(normalizedFp);
            }
            return result;
        }
    );
    core.debug('reports to copy=' + JSON.stringify(trustedOriginalReportPaths));

    if (0 === trustedOriginalReportPaths.length) {
        core.setFailed('You must provide at least one report !');
    }

    const trustedReportsMap = await core.group(
        'Build reports map',
        async () => {
            let counter = 0;
            return trustedOriginalReportPaths.map(trustedSource => {
                // Ensure report files uniqueness while keeping a bit of clarity regarding the mapping with original files !
                const trustedFilename = path.basename(trustedSource) + '-report-' + (++counter); // Only trusted content !
                const trustedDestination = path.join(trustedGroupDirectory, trustedFilename); // Only trusted content !
                core.info(trustedSource + ' => ' + trustedDestination);

                return {source: trustedSource, filename: trustedFilename, dest: trustedDestination};
            });
        }
    );
    core.debug('reports map=' + JSON.stringify(trustedReportsMap));

    const trustedMetadata = await core.group(
        'Build group metadata',
        async () => {
            const res = {
                name: NAME_INPUT,
                format: FORMAT_INPUT,
                reports: trustedReportsMap.map(v => v.filename),
                flags: FLAG_LIST_INPUT
            };
            core.info('metadata=' + JSON.stringify(res));

            return res;
        }
    );

    await core.group('Create group directory', () => {
        core.info('Create group directory at ' + trustedGroupDirectory);

        return io.mkdirP(trustedGroupDirectory)
    });

    await core.group(
        'Copy reports',
        async () => trustedReportsMap.map(async (trustedMap) => {
            core.info(trustedMap.source + ' => ' + trustedMap.dest);

            return io.cp(trustedMap.source, trustedMap.dest);
        })
    );

    await core.group(
        'Create metadata file',
        async () => {
            const trustedFp = trustedPathHelper.trust(path.resolve(trustedGroupDirectory, SDK.METADATA_FILENAME));
            core.info('Create metadata file at ' + trustedFp);

            fs.writeFileSync(trustedFp, JSON.stringify(trustedMetadata));
    });

    await core.group(
        'Build action outputs and summary',
        async () => {
            SDK.outputs.bindFrom({
                path: trustedGroupDirectory,
                reports: trustedMetadata.reports.join('\n'),
                files: trustedReportsMap.map(v => v.source).join('\n'),
            });
            /*
            await core.summary
                .addHeading('🧰 ' + trustedMetadata.name + ' report group')
                .addTable([
                    [{data: 'Source', header: true}, {data: 'Target', header: true}],
                    ...trustedReportsMap.map(v => [v.source, v.filename])
                ])
                .addDetails(
                    'Details',
                    'Format 🗜:️ <b>' + trustedMetadata.format + '</b><br/>Flags 🚩: <b>' + trustedMetadata.flags.join('</b> / <b>') + '</b>'
                )
                .write()
            ;
            */
        }
    );
}

run();
