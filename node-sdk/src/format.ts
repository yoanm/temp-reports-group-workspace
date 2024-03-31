import path from 'path';

import * as arrayHelpers from './array';
import type {ActionOutputData, Metadata, MetadataJson, MetadataString, MultiGroupOutput} from "./interfaces";

export function convertMetadataListToMetadataJson(mdList: Metadata[]): MetadataJson {
    return {
        name: arrayHelpers.itemsPropertyList(mdList, 'name'),
        format: arrayHelpers.itemsPropertyList(mdList, 'format'),
        reports: arrayHelpers.itemsPropertyList(mdList, 'reports'),
        flags: arrayHelpers.itemsPropertyList(mdList, 'flags'),
        path: arrayHelpers.itemsPropertyList(mdList, 'path'),
        artifact: undefined !== mdList[0].artifact ? arrayHelpers.itemsPropertyList(mdList, 'artifact') as string[] : undefined,
    }
}

export function convertMetadataJsonToMetadataString(metadataJson: MetadataJson, format: string, glueString: string): MetadataString {
    const isGlobStringFormat = 'glob-string' === format;

    const res: MetadataString = {
        name: arrayHelpers.mergeStringList(metadataJson.name).join(glueString),
        format: arrayHelpers.mergeStringList(metadataJson.format).join(glueString),
        reports: arrayHelpers.mergeListOfList(metadataJson.reports).join(isGlobStringFormat ? '\n' : glueString),
        flags: arrayHelpers.mergeListOfList(metadataJson.flags).join(glueString),
        path: arrayHelpers.mergeStringList(metadataJson.path).join(isGlobStringFormat ? '\n' : glueString),

    };

    if (metadataJson.artifact) {
        const artifactList = arrayHelpers.mergeStringList(metadataJson.artifact);
        res.artifact = artifactList.join('\n');
        res['artifacts-dwl-pattern'] = artifactList.length > 1 ? '@(' + artifactList.join('|') + ')' : artifactList.join('');
    }

    return res;
}

export function convertMetadataListToFindActionOutput(
    trustedMetadataListOfList: Metadata[][],
    format: string,
    glueString: string,
): ActionOutputData {
    const metadataJsonList = trustedMetadataListOfList.map(trustedMetadataList => convertMetadataListToMetadataJson(trustedMetadataList));

    const reportPathList: string[] = [];
    for (const metadataJson of metadataJsonList) {
        [...metadataJson.reports.entries()].forEach(
            ([key, pList]) => pList.forEach(
                p => reportPathList.push(metadataJson.artifact ? path.join(metadataJson.artifact[key], p) : p)
            )
        );
    }

    const paths: string = arrayHelpers.mergeStringList(reportPathList).join('\n');

    const res: MultiGroupOutput<MetadataJson> = {
        count: reportPathList.length,
        paths: paths,
        list: metadataJsonList
    };
    if ('json' !== format) {
        /** `string` or `glob-string` format **/
        return {
            ...res,
            list: res.list.map(jsonItem => convertMetadataJsonToMetadataString(jsonItem, format, glueString))
        };
    }

    /** `json` format **/
    return res;
}
