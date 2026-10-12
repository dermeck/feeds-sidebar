import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { Feed } from '../../model/feeds';
import { fetchYoutubeShortStatus } from '../../services/youtube/fetchVideoShortStatus';
import feedsSlice, { DURATION_FETCH_RETRY_WINDOW_MS } from '../slices/feeds';
import optionsSlice from '../slices/options';
import { watchYoutubeShortsSaga } from './youtubeShortsSaga';

jest.mock('../../services/youtube/fetchVideoShortStatus');

const mockedFetch = jest.mocked(fetchYoutubeShortStatus);

const youtubeFeed = (feedId: string, items: Feed['items']): Feed => ({
    id: feedId,
    items,
});

const setupStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const store = configureStore({
        reducer: { feeds: feedsSlice.reducer, options: optionsSlice.reducer },
        middleware: (gdm) => gdm().concat(sagaMiddleware),
    });
    sagaMiddleware.run(watchYoutubeShortsSaga);

    return store;
};

const addFeed = (store: ReturnType<typeof setupStore>, feed: Feed) => {
    store.dispatch(feedsSlice.actions.updateFeeds({ feeds: [feed], maxItemsPerFeed: 200 }));
};

beforeEach(() => {
    jest.useFakeTimers();
    mockedFetch.mockReset();
});

afterEach(() => {
    jest.useRealTimers();
});

describe('youtube shorts queue', () => {
    it('probes and stores the status of pending youtube items when the option is enabled', async () => {
        mockedFetch.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

        const store = setupStore();
        addFeed(
            store,
            youtubeFeed('feed1', [
                { id: 'videoItem1', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
                { id: 'videoItem2', url: 'https://youtu.be/BBBBBBBBBBB', title: 'two' },
            ]),
        );
        store.dispatch(optionsSlice.actions.changeYoutubeShortsFilterEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(2);
        const statuses = store.getState().feeds.feeds.flatMap((feed) => feed.items.map((i) => i.isShort));
        expect(statuses).toEqual([true, false]);
    });

    it('does not probe a video whose known duration exceeds the shorts ceiling', async () => {
        const store = setupStore();
        addFeed(
            store,
            youtubeFeed('feed1', [
                {
                    id: 'longItem',
                    url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA',
                    title: 'long',
                    durationSeconds: 200,
                },
            ]),
        );
        store.dispatch(optionsSlice.actions.changeYoutubeShortsFilterEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).not.toHaveBeenCalled();
        expect(store.getState().feeds.feeds[0].items[0].isShort).toBe(false);
    });

    it('probes a video whose known duration is within the shorts ceiling', async () => {
        mockedFetch.mockResolvedValueOnce(true);

        const store = setupStore();
        addFeed(
            store,
            youtubeFeed('feed1', [
                {
                    id: 'shortItem',
                    url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA',
                    title: 'maybe short',
                    durationSeconds: 120,
                },
            ]),
        );
        store.dispatch(optionsSlice.actions.changeYoutubeShortsFilterEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(store.getState().feeds.feeds[0].items[0].isShort).toBe(true);
    });

    it('does not probe read items', async () => {
        mockedFetch.mockResolvedValue(true);

        const store = setupStore();
        addFeed(
            store,
            youtubeFeed('feed1', [
                { id: 'unreadItem', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'unread' },
                { id: 'readItem', url: 'https://www.youtube.com/watch?v=BBBBBBBBBBB', title: 'read', isRead: true },
            ]),
        );
        store.dispatch(optionsSlice.actions.changeYoutubeShortsFilterEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(mockedFetch).toHaveBeenCalledWith('AAAAAAAAAAA');
    });

    it('probes at most the configured number of videos per run', async () => {
        mockedFetch.mockResolvedValue(true);

        const store = setupStore();
        addFeed(
            store,
            youtubeFeed('feed1', [
                { id: 'videoItem1', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
                { id: 'videoItem2', url: 'https://youtu.be/BBBBBBBBBBB', title: 'two' },
                { id: 'videoItem3', url: 'https://youtu.be/CCCCCCCCCCC', title: 'three' },
            ]),
        );
        store.dispatch(optionsSlice.actions.changeYoutubeShortsMaxPerRun(2));
        store.dispatch(optionsSlice.actions.changeYoutubeShortsFilterEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(2);
        const statuses = store.getState().feeds.feeds[0].items.map((i) => i.isShort);
        expect(statuses).toEqual([true, true, undefined]);
    });

    it('probes a video shared by two feeds only once per run', async () => {
        mockedFetch.mockResolvedValue(true);

        const store = setupStore();
        addFeed(
            store,
            youtubeFeed('feed1', [{ id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' }]),
        );
        addFeed(
            store,
            youtubeFeed('feed2', [
                { id: 'itemB', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'same video' },
            ]),
        );
        store.dispatch(optionsSlice.actions.changeYoutubeShortsFilterEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(1);
        const statuses = store.getState().feeds.feeds.flatMap((feed) => feed.items.map((i) => i.isShort));
        expect(statuses).toEqual([true, true]);
    });

    it('leaves an undecidable video unset and does not retry it until the retry window passes', async () => {
        mockedFetch.mockResolvedValueOnce(undefined).mockResolvedValueOnce(true);

        const store = setupStore();
        addFeed(
            store,
            youtubeFeed('feed1', [
                { id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
            ]),
        );
        store.dispatch(optionsSlice.actions.changeYoutubeShortsFilterEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(store.getState().feeds.feeds[0].items[0].isShort).toBeUndefined();
        expect(store.getState().feeds.shortsFetchFailures).toEqual({ AAAAAAAAAAA: expect.any(Number) });

        addFeed(
            store,
            youtubeFeed('feed1', [
                { id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
            ]),
        );
        await jest.advanceTimersByTimeAsync(1_000);

        expect(mockedFetch).toHaveBeenCalledTimes(1);

        await jest.advanceTimersByTimeAsync(DURATION_FETCH_RETRY_WINDOW_MS);
        addFeed(
            store,
            youtubeFeed('feed1', [
                { id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
            ]),
        );
        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(2);
        expect(store.getState().feeds.feeds[0].items[0].isShort).toBe(true);
        expect(store.getState().feeds.shortsFetchFailures).toEqual({});
    });

    it('does not probe anything when the option is disabled', async () => {
        const store = setupStore();
        addFeed(
            store,
            youtubeFeed('feed1', [{ id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' }]),
        );

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).not.toHaveBeenCalled();
        expect(store.getState().feeds.feeds[0].items[0].isShort).toBeUndefined();
    });
});
