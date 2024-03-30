var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import * as glob from '@actions/glob';
export function lookup(pattern_1) {
    return __asyncGenerator(this, arguments, function* lookup_1(pattern, options = undefined) {
        var _a, _b, _c, _d;
        const finalOptions = {
            followSymbolicLinks: (_a = options === null || options === void 0 ? void 0 : options.followSymbolicLinks) !== null && _a !== void 0 ? _a : true,
            implicitDescendants: (_b = options === null || options === void 0 ? void 0 : options.implicitDescendants) !== null && _b !== void 0 ? _b : false, // False by default to avoid big results !
            matchDirectories: (_c = options === null || options === void 0 ? void 0 : options.implicitDescendants) !== null && _c !== void 0 ? _c : false, // False by default to avoid big results !
            omitBrokenSymbolicLinks: (_d = options === null || options === void 0 ? void 0 : options.omitBrokenSymbolicLinks) !== null && _d !== void 0 ? _d : false, // Avoid error related to broken files
        };
        const globber = yield __await(glob.create(pattern, finalOptions));
        yield __await(yield* __asyncDelegator(__asyncValues(globber.globGenerator())));
    });
}
//# sourceMappingURL=glob.js.map