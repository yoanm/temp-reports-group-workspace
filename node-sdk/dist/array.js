export const arrayUnique = (list) => ([...new Set(list)]);
export function itemsPropertyList(list, property) {
    return list.map(m => m[property]);
}
export const mergeStringList = (list) => arrayUnique(list);
export const mergeListOfList = (list) => arrayUnique(list.flat());
//# sourceMappingURL=array.js.map