import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { RootState } from '../store';

export const loggerMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    ThunkDispatch<RootState, undefined, AnyAction>
> = (storeApi) => (next) => (action) => {
    if (
        !import.meta.env.ENABLE_LOGGER_MIDDLEWARE ||
        import.meta.env.STAND_ALONE ||
        import.meta.env.NODE_ENV !== 'development'
    ) {
        const moep: string = 1;
        return next(action);
    }

    const result = next(action);
    console.log('action', action.type, action.payload, storeApi.getState());

    return result;
};
