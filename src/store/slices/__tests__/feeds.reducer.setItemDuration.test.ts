import { RootState } from '../../store';
import feedsSlice, { DURATION_FETCH_RETRY_WINDOW_MS, selectYoutubeItemsMissingDuration } from '../feeds';

const stateWithItems = (): RootState =>
    ({
        feeds: {
            folders: [],
            feeds: [
                {
                    id: 'feed1',
                    items: [
                        { id: 'youtubeItem', url: 'https://www.youtube.com/watch?v=OU6HZ-PTOPI', title: 'video' },
                        { id: 'plainItem', url: 'https://example.com/post', title: 'post' },
                        { id: 'knownItem', url: 'https://youtu.be/JXgV1rJzwd4', title: 'known', durationSeconds: 31 },
                    ],
                },
                {
                    id: 'feed2',
                    items: [{ id: 'shortItem', url: 'https://www.youtube.com/shorts/JXgV1rJzwd4', title: 'short' }],
                },
            ],
            selectedNode: undefined,
            readItemIds: [],
            durationFetchFailures: {},
        },
        options: { youtubeVideoDurationEnabled: false },
        session: {},
    }) as unknown as RootState;

describe('setItemDuration action', () => {

    it('sets the duration on the target item', () => {
        const state = feedsSlice.reducer(stateWithItems().feeds, feedsSlice.actions.setItemDuration({
            feedId: 'feed1',
            itemId: 'youtubeItem',
            durationSeconds: 754,
        }));

        expect(state.feeds[0].items[0].durationSeconds).toBe(754);
    });

    it('leaves all other items untouched', () => {
        const prev = stateWithItems().feeds;
        const state = feedsSlice.reducer(prev, feedsSlice.actions.setItemDuration({
            feedId: 'feed1',
            itemId: 'youtubeItem',
            durationSeconds: 754,
        }));

        expect(state.feeds[0].items[1].durationSeconds).toBeUndefined();
        expect(state.feeds[0].items[2].durationSeconds).toBe(31);
        expect(state.feeds[1].items[0].durationSeconds).toBeUndefined();
    });

    it('does nothing when the duration is already set to the same value', () => {
        const prev = stateWithItems().feeds;
        const state = feedsSlice.reducer(prev, feedsSlice.actions.setItemDuration({
            feedId: 'feed1',
            itemId: 'knownItem',
            durationSeconds: 31,
        }));

        expect(state).toStrictEqual(prev);
    });

    it('does nothing for an unknown item', () => {
        const prev = stateWithItems().feeds;
        const state = feedsSlice.reducer(prev, feedsSlice.actions.setItemDuration({
            feedId: 'feed1',
            itemId: 'doesNotExist',
            durationSeconds: 100,
        }));

        expect(state).toStrictEqual(prev);
    });
});

describe('selectYoutubeItemsMissingDuration', () => {
    it('returns the items whose duration is not yet known', () => {
        const state = stateWithItems();

        expect(selectYoutubeItemsMissingDuration(state)).toEqual([
            { feedId: 'feed1', itemId: 'youtubeItem', videoId: 'OU6HZ-PTOPI' },
            { feedId: 'feed2', itemId: 'shortItem', videoId: 'JXgV1rJzwd4' },
        ]);
    });

    it('prefers the video id from the url over the one from the item id', () => {
        const state = stateWithItems();

        const feedsSliceState = state.feeds;
        feedsSliceState.feeds[0].items[0].id = 'yt:video:JXgV1rJzwd4';

        const result = selectYoutubeItemsMissingDuration(state);

        expect(result[0]?.videoId).toBe('OU6HZ-PTOPI');
    });

    it('falls back to the video id from the item id', () => {
        const state = stateWithItems();
        state.feeds.feeds[0].items[0].url = 'https://example.com/redirect';
        state.feeds.feeds[0].items[0].id = 'yt:video:JXgV1rJzwd4';

        const result = selectYoutubeItemsMissingDuration(state);

        expect(result[0]).toEqual({ feedId: 'feed1', itemId: 'yt:video:JXgV1rJzwd4', videoId: 'JXgV1rJzwd4' });
    });

    it('returns an empty array when every youtube item already has a duration', () => {
        const state = stateWithItems();
        state.feeds.feeds[0].items[0].durationSeconds = 754;
        state.feeds.feeds[1].items[0].durationSeconds = 59;

        expect(selectYoutubeItemsMissingDuration(state)).toHaveLength(0);
    });

    it('skips items that are already read', () => {
        const state = stateWithItems();
        state.feeds.feeds[0].items[0].isRead = true;

        const result = selectYoutubeItemsMissingDuration(state);

        expect(result).toEqual([{ feedId: 'feed2', itemId: 'shortItem', videoId: 'JXgV1rJzwd4' }]);
    });

    it('skips items whose read key is tracked separately', () => {
        const state = stateWithItems();
        state.feeds.readItemIds = ['feed1::youtubeItem'];

        expect(selectYoutubeItemsMissingDuration(state).map((x) => x.itemId)).toEqual(['shortItem']);
    });

    it('includes read items when the scope is set to all', () => {
        const state = stateWithItems();
        state.options.youtubeVideoDurationScope = 'all';
        state.feeds.feeds[0].items[0].isRead = true;

        expect(selectYoutubeItemsMissingDuration(state).map((x) => x.itemId)).toEqual(['youtubeItem', 'shortItem']);
    });
});

describe('recordDurationFetchFailure', () => {
    it('records the failure timestamp for the video', () => {
        const state = stateWithItems();

        const next = feedsSlice.reducer(
            state.feeds,
            feedsSlice.actions.recordDurationFetchFailure({ videoId: 'OU6HZ-PTOPI', failedAt: 1000 }),
        );

        expect(next.durationFetchFailures).toEqual({ 'OU6HZ-PTOPI': 1000 });
    });

    it('keeps older failures that are still inside the retry window', () => {
        const state = stateWithItems();
        state.feeds.durationFetchFailures = { old: 1000 };

        const next = feedsSlice.reducer(
            state.feeds,
            feedsSlice.actions.recordDurationFetchFailure({
                videoId: 'new',
                failedAt: 1000 + DURATION_FETCH_RETRY_WINDOW_MS - 1,
            }),
        );

        expect(next.durationFetchFailures).toEqual({ old: 1000, new: 1000 + DURATION_FETCH_RETRY_WINDOW_MS - 1 });
    });

    it('drops failures that are past the retry window', () => {
        const state = stateWithItems();
        state.feeds.durationFetchFailures = { stale: 1000 };

        const next = feedsSlice.reducer(
            state.feeds,
            feedsSlice.actions.recordDurationFetchFailure({
                videoId: 'fresh',
                failedAt: 1000 + DURATION_FETCH_RETRY_WINDOW_MS,
            }),
        );

        expect(next.durationFetchFailures).toEqual({ fresh: 1000 + DURATION_FETCH_RETRY_WINDOW_MS });
    });
});

describe('clearDurationFetchFailure', () => {
    it('removes the failure entry for the video', () => {
        const state = stateWithItems();
        state.feeds.durationFetchFailures = { 'OU6HZ-PTOPI': 1000, other: 2000 };

        const next = feedsSlice.reducer(state.feeds, feedsSlice.actions.clearDurationFetchFailure('OU6HZ-PTOPI'));

        expect(next.durationFetchFailures).toEqual({ other: 2000 });
    });

    it('returns the same state when there is nothing to clear', () => {
        const state = stateWithItems();

        const next = feedsSlice.reducer(state.feeds, feedsSlice.actions.clearDurationFetchFailure('OU6HZ-PTOPI'));

        expect(next).toBe(state.feeds);
    });
});