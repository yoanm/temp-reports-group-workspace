import * as core from '@actions/core';
export function bindFrom(outputs) {
    Object.entries(outputs).map(([outputName, outputValue]) => {
        core.debug('Output ' + outputName + '=' + JSON.stringify(outputValue));
        core.setOutput(outputName, outputValue);
    });
}
//# sourceMappingURL=outputs.js.map