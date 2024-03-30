var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import * as path from 'path';
import * as core from '@actions/core';
import { METADATA_FILENAME } from './constants';
import * as glob from './glob';
/**
 * @param toTrustedPath A function ensuring path is valid before returning it
 *
 * @returns Trusted metadata path list
 */
export function trustedMetadataPaths(globPattern_1, toTrustedPath_1) {
    return __awaiter(this, arguments, void 0, function* (globPattern, toTrustedPath, globOptions = undefined) {
        var _a, e_1, _b, _c;
        const finalPattern = globPattern.split('\n').map(item => toTrustedPath(path.join(item.trim(), '**', METADATA_FILENAME))).join('\n');
        core.debug('Find metadata paths with ' + globPattern);
        const list = [];
        try {
            for (var _d = true, _e = __asyncValues(glob.lookup(finalPattern, globOptions)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const fp = _c;
                list.push(fp);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return list;
    });
}
//# sourceMappingURL=find.js.map