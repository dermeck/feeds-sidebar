import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import optionsSlice, { FEED_UPDATE_MINUTES_MIN, initialState } from '../slices/options';
import { feedsAutoUpdateKey, watchOptionsSaga } from './optionsSaga';

const alarms = {
    clear: jest.fn(() => Promise.resolve(true)),
    create: jest.fn(),
};

beforeEach(() => {
    alarms.clear.mockClear();
    alarms.create.mockClear();
    (global as unknown as { browser: unknown }).browser = { alarms };
});

const setupStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const store = configureStore({
        reducer: { options: optionsSlice.reducer },
        middleware: (gdm) => gdm().concat(sagaMiddleware),
    });
    sagaMiddleware.run(watchOptionsSaga);

    return store;
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('update interval option', () => {
    it('recreates the alarm with the new period when the option changes', async () => {
        const store = setupStore();
        store.dispatch(optionsSlice.actions.changeFeedUpdatePeriodInMinutes(15));
        await flush();

        expect(alarms.clear).toHaveBeenCalledWith(feedsAutoUpdateKey);
        expect(alarms.create).toHaveBeenCalledWith(feedsAutoUpdateKey, { periodInMinutes: 15 });
    });

    it('does not recreate the alarm for unrelated option changes', async () => {
        const store = setupStore();
        store.dispatch(optionsSlice.actions.changeFetchThreadsCount(2));
        await flush();

        expect(alarms.clear).not.toHaveBeenCalled();
        expect(alarms.create).not.toHaveBeenCalled();
    });

    it('recreates the alarm with the period from the state, not the raw action payload', async () => {
        const store = setupStore();
        // the reducer clamps the value, the raw payload is below the allowed minimum
        store.dispatch(optionsSlice.actions.changeFeedUpdatePeriodInMinutes(FEED_UPDATE_MINUTES_MIN - 1));
        await flush();

        expect(alarms.create).toHaveBeenCalledWith(feedsAutoUpdateKey, {
            periodInMinutes: FEED_UPDATE_MINUTES_MIN,
        });
    });

    it('recreates the alarm when the options are reset to defaults', async () => {
        const store = setupStore();
        store.dispatch(optionsSlice.actions.changeFeedUpdatePeriodInMinutes(120));
        await flush();

        store.dispatch(optionsSlice.actions.resetOptions());
        await flush();

        expect(alarms.create).toHaveBeenCalledWith(feedsAutoUpdateKey, {
            periodInMinutes: initialState.feedUpdatePeriodInMinutes,
        });
    });
});
