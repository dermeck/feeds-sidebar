import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { Feed } from '../../model/feeds';
import { fetchYoutubeDurationSeconds } from '../../services/youtube/fetchVideoDuration';
import feedsSlice from '../slices/feeds';
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