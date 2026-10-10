import { configureStore, Middleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { Feed } from '../../model/feeds';
import { RootState } from '../store';
import feedsSlice, { fetchFeedsCommand } from '../slices/feeds';
import optionsSlice from '../slices/options';
import sessionSlice from '../slices/session';
import { watchfetchFeedsSaga } from './fetchFeedsSaga';
import { createWorker } from './worker/createWorker';
import { WorkerResponseAction } from './worker/workerApi';

jest.mock('./worker/createWorker', () => ({ createWorker: jest.fn() }));

(global as unknown as { browser: unknown }).browser = { action: { setBadgeText: jest.fn() } };

const responseDelay = 5;

const LIMIT = 5;

// each item is a day newer than the one before it, so i39 is the newest
const datedItems = (count: number): Feed['items'] =>
    Array.from({ length: count }, (_, i) => ({
        id: `i${i}`,
        title: `item ${i}`,
        url: `https://example.com/i${i}`,
        published: new Date(Date.UTC(2024, 0, 1 + i)).toISOString(),
    }));

const makeFakeWorker = (itemCount: number) => {
    const worker: {
        onmessage: ((e: { data: WorkerResponseAction }) => void) | null;
        postMessage: (msg: { type: string; url: string }) => void;
        terminate: () => void;
    } = {
        onmessage: null,
        postMessage: (msg) => {
            setTimeout(() => {
                worker.onmessage?.({
                    data: {
                        type: 'success',
                        parsedFeed: { id: msg.url, title: 'title', link: '', items: datedItems(itemCount) },
                    },
                });
            }, responseDelay);
        },
        terminate: () => undefined,
    };

    return worker;
};

const recordStatesOverLimit = (trace: string[]) =>
    ((api: { getState: () => RootState }) => (next: (a: unknown) => unknown) => (action: { type: string }) => {
        const result = next(action);

        api.getState().feeds.feeds.forEach((feed) => {
            if (feed.items.length > LIMIT) {
                trace.push(`${action.type}: ${feed.id} holds ${feed.items.length} items`);
            }
        });

        return result;
    }) as Middleware;

const setupStore = (trace: string[]) => {
    const sagaMiddleware = createSagaMiddleware();
    const store = configureStore({
        reducer: {
            feeds: feedsSlice.reducer,
            options: optionsSlice.reducer,
            session: sessionSlice.reducer,
        },
        middleware: (gdm) => gdm().concat(recordStatesOverLimit(trace), sagaMiddleware),
    });
    sagaMiddleware.run(watchfetchFeedsSaga);

    store.dispatch(optionsSlice.actions.changeMaxItemsPerFeed(LIMIT));

    return store;
};

const flush = () => new Promise((resolve) => setTimeout(resolve, responseDelay * 10 + 100));

describe('maxItemsPerFeed during a fetch', () => {
    beforeEach(() => {
        (createWorker as jest.Mock).mockImplementation(() => makeFakeWorker(40));
    });

    it('never publishes a feed with more items than the limit', async () => {
        const trace: string[] = [];
        const store = setupStore(trace);

        store.dispatch(fetchFeedsCommand(['https://example.com/feed']));
        await flush();

        expect(trace).toStrictEqual([]);
        expect(store.getState().feeds.feeds[0].items).toHaveLength(LIMIT);
    });

    it('keeps the newest items when trimming a newly added feed', async () => {
        const store = setupStore([]);

        store.dispatch(fetchFeedsCommand(['https://example.com/feed']));
        await flush();

        expect(store.getState().feeds.feeds[0].items.map((item) => item.id)).toStrictEqual([
            'i39',
            'i38',
            'i37',
            'i36',
            'i35',
        ]);
    });
});
