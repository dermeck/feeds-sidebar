import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import feedsSlice, { fetchFeedsCommand } from '../slices/feeds';
import optionsSlice from '../slices/options';
import sessionSlice from '../slices/session';
import { watchfetchFeedsSaga } from './fetchFeedsSaga';
import { createWorker } from './worker/createWorker';
import { WorkerResponseAction } from './worker/workerApi';

jest.mock('./worker/createWorker', () => ({ createWorker: jest.fn() }));

type FakeWorker = {
    postMessage: (msg: { type: string; url: string }) => void;
    terminate: () => void;
    onmessage: ((e: { data: WorkerResponseAction }) => void) | null;
};

const stats = { created: 0, inFlight: 0, maxInFlight: 0, requested: [] as string[] };
const responseDelay = 5;

const makeFakeWorker = (): FakeWorker => {
    const worker: FakeWorker = {
        onmessage: null,
        postMessage: (msg) => {
            stats.requested.push(msg.url);
            stats.inFlight += 1;
            stats.maxInFlight = Math.max(stats.maxInFlight, stats.inFlight);

            setTimeout(() => {
                stats.inFlight -= 1;
                worker.onmessage?.({
                    data: {
                        type: 'success',
                        parsedFeed: { id: msg.url, title: 'title', link: '', items: [] },
                    },
                });
            }, responseDelay);
        },
        terminate: () => undefined,
    };

    return worker;
};

const setupStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const store = configureStore({
        reducer: {
            feeds: feedsSlice.reducer,
            options: optionsSlice.reducer,
            session: sessionSlice.reducer,
        },
        middleware: (gdm) => gdm().concat(sagaMiddleware),
    });
    sagaMiddleware.run(watchfetchFeedsSaga);

    return store;
};

const flush = () => new Promise((resolve) => setTimeout(resolve, responseDelay * 10 + 100));

describe('parallel fetches option', () => {
    beforeEach(() => {
        stats.created = 0;
        stats.inFlight = 0;
        stats.maxInFlight = 0;
        stats.requested = [];
        (createWorker as jest.Mock).mockImplementation(() => {
            stats.created += 1;
            return makeFakeWorker();
        });
    });

    it.each([
        [1, 6],
        [2, 6],
        [3, 6],
        [4, 6],
        [8, 6],
    ])('fetchThreadsCount=%i over %i urls fetches at most that many in parallel', async (threads, urlCount) => {
        const store = setupStore();
        store.dispatch(optionsSlice.actions.changeFetchThreadsCount(threads));

        const urls = Array.from({ length: urlCount }, (_, i) => `http://feed/${i}`);
        store.dispatch(fetchFeedsCommand(urls));
        await flush();

        const expectedThreads = Math.min(threads, urlCount);
        expect(stats.maxInFlight).toBe(expectedThreads);
        expect(stats.created).toBe(expectedThreads);
        expect([...stats.requested].sort()).toEqual(urls.sort());
    });

    it('marks all feeds as loaded and stores the results', async () => {
        const store = setupStore();
        store.dispatch(optionsSlice.actions.changeFetchThreadsCount(3));
        store.dispatch(fetchFeedsCommand(['http://a', 'http://b', 'http://c']));
        await flush();

        expect(
            store
                .getState()
                .session.feedStatus.map((s) => `${s.url}:${s.status}`)
                .sort(),
        ).toEqual(['http://a:loaded', 'http://b:loaded', 'http://c:loaded']);
        expect(
            store
                .getState()
                .feeds.feeds.map((f) => `${f.id}:${f.title}`)
                .sort(),
        ).toEqual(['http://a:title', 'http://b:title', 'http://c:title']);
    });

    it('terminates every worker it created', async () => {
        const terminate = jest.fn();
        (createWorker as jest.Mock).mockImplementation(() => {
            stats.created += 1;
            const w = makeFakeWorker();
            w.terminate = terminate;
            return w;
        });

        const store = setupStore();
        store.dispatch(optionsSlice.actions.changeFetchThreadsCount(2));
        store.dispatch(fetchFeedsCommand(['http://a', 'http://b', 'http://c', 'http://d']));
        await flush();

        expect(terminate).toHaveBeenCalledTimes(2);
    });
});
