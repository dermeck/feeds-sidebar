import { Dispatch, Middleware, PayloadAction, UnknownAction, isAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

function isPayloadAction<T extends UnknownAction & Partial<PayloadAction<unknown>>>(obj: T): obj is T & PayloadAction {
    return !!obj.payload;
}

export const loggerMiddleware: Middleware<object, RootState, Dispatch> = (storeApi) => (next) => (action) => {
    if (!process.env.ENABLE_LOGGER_MIDDLEWARE || process.env.STAND_ALONE || process.env.NODE_ENV !== 'development') {
        return next(action);
    }

    const result = next(action);
    if (isAction(action)) {
        if (isPayloadAction(action)) {
            console.log('action', action.type, action.payload, storeApi.getState());
        } else {
            console.log('payloadaction', action.type, storeApi.getState());
        }
    }

    return result;
};
