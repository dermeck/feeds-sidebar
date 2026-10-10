import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { Feed } from '../../model/feeds';
import { fetchYoutubeDurationSeconds } from '../../services/youtube/fetchVideoDuration';
import feedsSlice, { DURATION_FETCH_RETRY_WINDOW_MS } from '../slices/feeds';
import optionsSlice from '../slices/options';
import { watchVideoDurationSaga } from './videoDurationSaga';

jest.mock('../../services/youtube/fetchVideoDuration');

const mockedFetch = jest.mocked(fetchYoutubeDurationSeconds);

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
    sagaMiddleware.run(watchVideoDurationSaga);

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

describe('video duration queue', () => {
    it('fetches and stores the duration of pending youtube items when the option is enabled', async () => {
        mockedFetch.mockResolvedValueOnce(754).mockResolvedValueOnce(31);

        const store = setupStore();
        addFeed(store, youtubeFeed('feed1', [
            { id: 'videoItem1', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
            { id: 'videoItem2', url: 'https://youtu.be/BBBBBBBBBBB', title: 'two' },
        ]));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(2);
        const itemDurations = store.getState().feeds.feeds.flatMap((feed) => feed.items.map((i) => i.durationSeconds));
        expect(itemDurations).toEqual([754, 31]);
    });

    it('does not fetch read items by default', async () => {
        mockedFetch.mockResolvedValue(100);

        const store = setupStore();
        addFeed(store, youtubeFeed('feed1', [
            { id: 'unreadItem', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'unread' },
            { id: 'readItem', url: 'https://www.youtube.com/watch?v=BBBBBBBBBBB', title: 'read', isRead: true },
        ]));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(mockedFetch).toHaveBeenCalledWith('AAAAAAAAAAA');
    });

    it('fetches read items when the scope is set to all', async () => {
        mockedFetch.mockResolvedValue(100);

        const store = setupStore();
        addFeed(store, youtubeFeed('feed1', [
            { id: 'unreadItem', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'unread' },
            { id: 'readItem', url: 'https://www.youtube.com/watch?v=BBBBBBBBBBB', title: 'read', isRead: true },
        ]));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationScope('all'));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(2);
    });

    it('fetches at most the configured number of videos per run', async () => {
        mockedFetch.mockResolvedValue(100);

        const store = setupStore();
        addFeed(store, youtubeFeed('feed1', [
            { id: 'videoItem1', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
            { id: 'videoItem2', url: 'https://youtu.be/BBBBBBBBBBB', title: 'two' },
            { id: 'videoItem3', url: 'https://youtu.be/CCCCCCCCCCC', title: 'three' },
        ]));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationMaxPerRun(2));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(2);
        const itemDurations = store.getState().feeds.feeds[0].items.map((i) => i.durationSeconds);
        expect(itemDurations).toEqual([100, 100, undefined]);
    });

    it('fetches every video per run when the limit is 0', async () => {
        mockedFetch.mockResolvedValue(100);

        const store = setupStore();
        addFeed(store, youtubeFeed('feed1', [
            { id: 'videoItem1', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
            { id: 'videoItem2', url: 'https://youtu.be/BBBBBBBBBBB', title: 'two' },
            { id: 'videoItem3', url: 'https://youtu.be/CCCCCCCCCCC', title: 'three' },
        ]));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationMaxPerRun(0));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(3);
    });

    it('fetches a video shared by two feeds only once per run', async () => {
        mockedFetch.mockResolvedValue(100);

        const store = setupStore();
        addFeed(store, youtubeFeed('feed1', [
            { id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
        ]));
        addFeed(store, youtubeFeed('feed2', [
            { id: 'itemB', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'same video' },
        ]));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(1);
        const durations = store.getState().feeds.feeds.flatMap((feed) => feed.items.map((i) => i.durationSeconds));
        expect(durations).toEqual([100, 100]);
    });

    it('leaves failed videos unset and does not retry them in the same run', async () => {
        mockedFetch.mockResolvedValueOnce(undefined).mockResolvedValueOnce(50);

        const store = setupStore();
        addFeed(store, youtubeFeed('feed1', [
            { id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
            { id: 'itemB', url: 'https://www.youtube.com/watch?v=BBBBBBBBBBB', title: 'two' },
        ]));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(2);
        const itemDurations = store.getState().feeds.feeds.flatMap((feed) => feed.items.map((i) => i.durationSeconds));
        expect(itemDurations).toEqual([undefined, 50]);
    });

    it('does not retry a failed video until the retry window passes', async () => {
        mockedFetch.mockResolvedValueOnce(undefined).mockResolvedValueOnce(50);

        const store = setupStore();
        addFeed(store, youtubeFeed('feed1', [
            { id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
        ]));
        store.dispatch(optionsSlice.actions.changeYoutubeVideoDurationEnabled(true));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(store.getState().feeds.durationFetchFailures).toEqual({ AAAAAAAAAAA: expect.any(Number) });

        addFeed(store, youtubeFeed('feed1', [
            { id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
        ]));
        await jest.advanceTimersByTimeAsync(1_000);

        expect(mockedFetch).toHaveBeenCalledTimes(1);

        await jest.advanceTimersByTimeAsync(DURATION_FETCH_RETRY_WINDOW_MS);
        addFeed(store, youtubeFeed('feed1', [
            { id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
        ]));
        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).toHaveBeenCalledTimes(2);
        expect(store.getState().feeds.feeds[0].items[0].durationSeconds).toBe(50);
        expect(store.getState().feeds.durationFetchFailures).toEqual({});
    });

    it('does not fetch anything when the option is disabled', async () => {
        const store = setupStore();
        addFeed(store, youtubeFeed('feed1', [
            { id: 'itemA', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'one' },
        ]));

        await jest.advanceTimersByTimeAsync(10_000);

        expect(mockedFetch).not.toHaveBeenCalled();
        expect(store.getState().feeds.feeds[0].items[0].durationSeconds).toBeUndefined();
    });
});