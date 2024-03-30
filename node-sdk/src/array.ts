import {Metadata} from "./interfaces";

export const arrayUnique = (list: string[]): string[] => ([...new Set(list)]);

export function itemsPropertyList<K extends keyof Metadata>(
    list: Metadata[],
    property: K
): (Metadata[K])[] {
    return list.map(m => m[property]);
}

export const mergeStringList = (list: string[]): string[] => arrayUnique(list);

export const mergeListOfList = (list: string[][]): string[] => arrayUnique(list.flat());
