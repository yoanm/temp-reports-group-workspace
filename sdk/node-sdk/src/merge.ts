import * as core from '@actions/core'; 

import * as arrayHelper from './array';
import type {MergeField, Metadata} from "./interfaces";
import {MetadataProperty} from "./interfaces";

export const ALLOWED_MERGED_VALUES: MergeField[] = ['name', 'flags', 'format', 'artifact'];

function groupByFieldValue(list: Metadata[], mergeField: MergeField): Metadata[][] {
    const fieldValueToItemsMap: Record<string, Metadata[]> = {};
    for (const metadata of list) {
        const dataToMerge: Metadata[MergeField] = metadata[mergeField]!;
        if (!!dataToMerge) {
            const key: string = Array.isArray(dataToMerge)
                ? arrayHelper.mergeStringList(dataToMerge).sort().join('#')
                : dataToMerge as string
            ;
            if (!fieldValueToItemsMap[key]) {
                fieldValueToItemsMap[key] = [];
            }
            fieldValueToItemsMap[key].push(metadata)
        }
    }

    return Object.values(fieldValueToItemsMap);
}

export function groupMetadataList(list: Metadata[], mergeByFieldList: MergeField[]): Metadata[][] {
    const mergeByFieldListCopy = [...mergeByFieldList];
    const mergeField = mergeByFieldListCopy.shift();
    if (undefined === mergeField || list.length === 0) {
        return [list];
    }

    if (!ALLOWED_MERGED_VALUES.includes(mergeField)) {
        core.warning('"' + mergeField + '" is not allowed as merge field, ignored ! Allowed ' + ALLOWED_MERGED_VALUES.join(','));

        return groupMetadataList(list, mergeByFieldListCopy);
    }
    if ('artifact' === mergeField && !list[0].hasOwnProperty('artifact')) {
        core.warning('Merge on "artifact" field while undefined, ignored !');

        return groupMetadataList(list, mergeByFieldListCopy);
    }
    core.info('Merge by ' + mergeField);
    const newList: Metadata[][] = [];
    for (const metadataList of groupByFieldValue(list, mergeField)) {
        groupMetadataList(metadataList, mergeByFieldListCopy).forEach(metadataList => newList.push(metadataList));
    }

    return newList;
}
