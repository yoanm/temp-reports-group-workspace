import type { Metadata } from "./interfaces";
export type Filters = {
    groups?: string[];
    formats?: string[];
    flags?: string[];
    paths?: string[];
};
export declare function filterMetadataList(list: Metadata[], excluded: Filters, included: Filters): Metadata[];
