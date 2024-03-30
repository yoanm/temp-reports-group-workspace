import type { ActionOutputData, Metadata, MetadataJson, MetadataString } from "./interfaces";
export declare function convertMetadataListToMetadataJson(mdList: Metadata[]): MetadataJson;
export declare function convertMetadataJsonToMetadataString(metadataJson: MetadataJson, format: string, glueString: string): MetadataString;
export declare function convertMetadataListToFindActionOutput(trustedMetadataListOfList: Metadata[][], format: string, glueString: string): ActionOutputData;
