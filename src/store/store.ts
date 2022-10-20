import { combineReducers, configureStore } from '@reduxjs/toolkit';

import createSagaMiddleware from 'redux-saga';

import { feedMiddleware } from './middleware/feedMiddleware';
import { initMiddleware } from './middleware/initMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { rootSaga } from './sagas';
import feedsSlice from './slices/feeds';
import optionsSlice from './slices/options';
import sessionSlice from './slices/session';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    feeds: feedsSlice.reducer,
    options: optionsSlice.reducer,
    session: sessionSlice.reducer,
});

const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(loggerMiddleware).concat([initMiddleware, sagaMiddleware, feedMiddleware]),
    reducer: rootReducer,
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export default store;
