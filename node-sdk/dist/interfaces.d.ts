export type Metadata = {
    name: string;
    format: string;
    path: string;
    reports: string[];
    flags: string[];
    artifact?: string;
};
export type MetadataProperty<K extends keyof Metadata> = K;
export type MetadataString = {
    name: string;
    format: string;
    path: string;
    reports: string;
    flags: string;
    artifact?: string;
    'artifacts-dwl-pattern'?: string;
};
export type MetadataJson = {
    name: string[];
    format: string[];
    path: string[];
    reports: string[][];
    flags: string[][];
    artifact?: string[];
};
export type ActionOutputData = {
    count: number;
    paths: string;
    artifacts?: string;
    list: (MetadataString | MetadataJson)[];
};
export type MultiGroupOutput<MType extends MetadataString | MetadataJson = MetadataString | MetadataJson> = {
    count: number;
    paths: string;
    list: MType[];
};
export type MergeField = 'name' | 'flags' | 'format' | 'artifact';
