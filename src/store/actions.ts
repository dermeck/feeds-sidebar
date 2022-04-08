import { createAction } from '@reduxjs/toolkit';

import { RootState } from './store';

export const initCommand = createAction('global/init');

type ExtensionLoadedPayload = Pick<RootState, 'feeds' | 'options'>;
export const extensionStateLoaded = createAction<ExtensionLoadedPayload>('global/extensionStateLoaded');
