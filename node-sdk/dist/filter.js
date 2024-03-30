export function filterMetadataList(list, excluded, included) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!((_a = excluded.groups) === null || _a === void 0 ? void 0 : _a.length) && !((_b = excluded.formats) === null || _b === void 0 ? void 0 : _b.length) && !((_c = excluded.flags) === null || _c === void 0 ? void 0 : _c.length) && !((_d = excluded.paths) === null || _d === void 0 ? void 0 : _d.length)
        && !((_e = included.groups) === null || _e === void 0 ? void 0 : _e.length) && !((_f = included.formats) === null || _f === void 0 ? void 0 : _f.length) && !((_g = included.flags) === null || _g === void 0 ? void 0 : _g.length) && !((_h = included.paths) === null || _h === void 0 ? void 0 : _h.length)) {
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
            || (!!included.paths && included.paths.length > 0 && included.paths.filter(v => metadata.path.includes(v)).length === 0)) {
            continue;
        }
        tmpList.push(metadata);
    }
    return tmpList;
}
//# sourceMappingURL=filter.js.map