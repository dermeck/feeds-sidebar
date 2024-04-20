import { createAction } from '@reduxjs/toolkit';

import { RootState } from './store';

type ExtensionLoadedPayload = Pick<RootState, 'feeds' | 'options'>;
export const extensionStateLoaded = createAction<ExtensionLoadedPayload>('global/extensionStateLoaded');
// export const log = createAction<string>('global/log'); // TODO
