import * as core from '@actions/core';
import cleanup from './cleanup'
import main from './main'

const fn = !!core.getState('has-been-triggered') ? main : cleanup;

fn().catch(e => {
    core.warning('Error caught and ignored ' + e.message);
    core.debug('Error=' + JSON.stringify(e));
})
