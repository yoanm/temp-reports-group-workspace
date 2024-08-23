import type {Metadata} from "./interfaces";

export type Filters = {
    groups?: string[];
    formats?: string[];
    flags?: string[];
    paths?: string[];
};

export function filterMetadataList(list: Metadata[], excluded: Filters, included: Filters): Metadata[] {
    if (
        !excluded.groups?.length && !excluded.formats?.length && !excluded.flags?.length && !excluded.paths?.length
        && !included.groups?.length && !included.formats?.length && !included.flags?.length && !included.paths?.length
    ) {
        // Nothing to filter in or out
        return list;
    }

    const tmpList = [];
    for (const metadata of list) {
        // Forbidden before Allowed !
        if (
            // Forbidden
            (!!excluded.groups && excluded.groups.length > 0 && excluded.groups.includes(metadata.name))
            || (!!excluded.formats && excluded.formats.length > 0 && excluded.formats.includes(metadata.format))
            || (!!excluded.flags && excluded.flags.length > 0 && excluded.flags.filter(allowedFlag => metadata.flags.includes(allowedFlag)).length > 0)
            || (!!excluded.paths && excluded.paths.length > 0 && excluded.paths.filter(allowedPath => metadata.path.includes(allowedPath)).length > 0)
            // Allowed
            || (!!included.groups && included.groups.length > 0 && !included.groups.includes(metadata.name))
            || (!!included.formats && included.formats.length > 0 && !included.formats.includes(metadata.format))
            || (!!included.flags && included.flags.length > 0 && included.flags.filter(v => metadata.flags.includes(v)).length === 0)
            || (!!included.paths && included.paths.length > 0 && included.paths.filter(v => metadata.path.includes(v)).length === 0)
        ) {
            continue;
        }
        tmpList.push(metadata);
    }

    return tmpList;
}
