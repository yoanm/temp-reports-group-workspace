var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as core from '@actions/core';
import * as path from 'path';
import * as find from './find';
/**
 * @param toTrustedPath A function ensuring path is valid before returning it
 */
export function loadMetadataListFrom(globPattern_1, trustedPathChecker_1) {
    return __awaiter(this, arguments, void 0, function* (globPattern, trustedPathChecker, globOptions = undefined) {
        const trustedMetadataPathList = yield find.trustedMetadataPaths(globPattern, trustedPathChecker.toWorkspaceRelative, globOptions);
        return trustedMetadataPathList.map((trustedMetadataPath) => {
            const trustedGroupPath = path.dirname(trustedMetadataPath);
            core.info('Load ' + trustedGroupPath);
            return trustedPathChecker.trustedMetadataUnder(trustedGroupPath);
        });
    });
}
//# sourceMappingURL=load.js.map