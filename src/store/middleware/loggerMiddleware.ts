import { Dispatch, Middleware } from '@reduxjs/toolkit';

import { RootState } from '../store';

export const loggerMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    Dispatch
> = (storeApi) => (next) => (action) => {
    if (!process.env.ENABLE_LOGGER_MIDDLEWARE || process.env.STAND_ALONE || process.env.NODE_ENV !== 'development') {
        return next(action);
    }

    const result = next(action);
    console.log('action', action.type, action.payload, storeApi.getState());

    return result;
};
