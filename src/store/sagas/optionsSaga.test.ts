import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import optionsSlice from '../slices/options';
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

    it.todo('recreates the alarm with the period from the state, not the raw action payload');
    it.todo('recreates the alarm when the options are reset to defaults');
});
