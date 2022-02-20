import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { STAND_ALONE } from '../../globals';
import { RootState } from '../store';

export const loggerMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    ThunkDispatch<RootState, undefined, AnyAction>
> = (storeApi) => (next) => (action) => {
    return next(action);
    if (STAND_ALONE) {
        // skip logging since redux devtools are avaiable in that mode
        return next(action);
    }

    console.groupCollapsed(typeof action !== 'function' ? `action type: ${action.type}` : 'thunk');
    const result = next(action);
    console.log('action', action);
    console.log('next state', storeApi.getState());
    console.groupEnd();

    return result;
};
