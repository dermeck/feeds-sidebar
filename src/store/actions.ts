import { createAction } from '@reduxjs/toolkit';

import { RootState } from './store';

type ExtensionLoadedPayload = {
    feeds: RootState['feeds'];
    // options may be from an older saved state and therefore miss recently added keys;
    // the options reducer merges the payload with the current defaults
    options: Partial<RootState['options']>;
};
export const extensionStateLoaded = createAction<ExtensionLoadedPayload>('global/extensionStateLoaded');
// export const log = createAction<string>('global/log'); // TODO
