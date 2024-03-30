import * as core from '@actions/core';
import * as arrayHelper from './array';
export const ALLOWED_MERGED_VALUES = ['name', 'flags', 'format', 'artifact'];
function groupByFieldValue(list, mergeField) {
    const fieldValueToItemsMap = {};
    for (const metadata of list) {
        const dataToMerge = metadata[mergeField];
        if (!!dataToMerge) {
            const key = Array.isArray(dataToMerge)
                ? arrayHelper.mergeStringList(dataToMerge).sort().join('#')
                : dataToMerge;
            if (!fieldValueToItemsMap[key]) {
                fieldValueToItemsMap[key] = [];
            }
            fieldValueToItemsMap[key].push(metadata);
        }
    }
    return Object.values(fieldValueToItemsMap);
}
export function groupMetadataList(list, mergeByFieldList) {
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
    const newList = [];
    for (const metadataList of groupByFieldValue(list, mergeField)) {
        groupMetadataList(metadataList, mergeByFieldListCopy).forEach(metadataList => newList.push(metadataList));
    }
    return newList;
}
//# sourceMappingURL=merge.js.map