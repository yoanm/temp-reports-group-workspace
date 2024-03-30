import type { MergeField, Metadata } from "./interfaces";
export declare const ALLOWED_MERGED_VALUES: MergeField[];
export declare function groupMetadataList(list: Metadata[], mergeByFieldList: MergeField[]): Metadata[][];
