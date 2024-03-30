import { Metadata } from "./interfaces";
export declare const arrayUnique: (list: string[]) => string[];
export declare function itemsPropertyList<K extends keyof Metadata>(list: Metadata[], property: K): (Metadata[K])[];
export declare const mergeStringList: (list: string[]) => string[];
export declare const mergeListOfList: (list: string[][]) => string[];
