import * as core from '@actions/core'; 

export function bindFrom(outputs: {[key: string]: string|number|boolean}): void {
    Object.entries(outputs).map(([outputName, outputValue]) => {
        core.debug('Output ' + outputName + '=' +JSON.stringify(outputValue));
        core.setOutput(outputName, outputValue);
    });
}
