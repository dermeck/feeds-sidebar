import { RootState } from '../../store';
import feedsSlice, { DURATION_FETCH_RETRY_WINDOW_MS, selectYoutubeItemsMissingShortStatus } from '../feeds';

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
                        { id: 'knownItem', url: 'https://youtu.be/JXgV1rJzwd4', title: 'known', isShort: true },
                    ],
                },
                {
                    id: 'feed2',
                    items: [
                        {
                            id: 'shortItem',
                            url: 'https://www.youtube.com/shorts/JXgV1rJzwd4',
                            title: 'short',
                            durationSeconds: 42,
                        },
                    ],
                },
            ],
            readItemIds: [],
            durationFetchFailures: {},
            shortsFetchFailures: {},
        },
        options: { youtubeVideoDurationEnabled: false },
        session: {},
    }) as unknown as RootState;

describe('setItemsShortStatus action', () => {
    it('sets the status on the target items in a single pass', () => {
        const state = feedsSlice.reducer(
            stateWithItems().feeds,
            feedsSlice.actions.setItemsShortStatus([
                { feedId: 'feed1', itemId: 'youtubeItem', isShort: true },
                { feedId: 'feed2', itemId: 'shortItem', isShort: false },
            ]),
        );

        expect(state.feeds[0].items[0].isShort).toBe(true);
        expect(state.feeds[1].items[0].isShort).toBe(false);
    });

    it('leaves all other items untouched', () => {
        const state = feedsSlice.reducer(
            stateWithItems().feeds,
            feedsSlice.actions.setItemsShortStatus([{ feedId: 'feed1', itemId: 'youtubeItem', isShort: true }]),
        );

        expect(state.feeds[0].items[1].isShort).toBeUndefined();
        expect(state.feeds[0].items[2].isShort).toBe(true);
        expect(state.feeds[1].items[0].isShort).toBeUndefined();
    });

    it('does nothing when every status is already set to the same value', () => {
        const prev = stateWithItems().feeds;
        const state = feedsSlice.reducer(
            prev,
            feedsSlice.actions.setItemsShortStatus([
                { feedId: 'feed1', itemId: 'knownItem', isShort: true },
                { feedId: 'feed1', itemId: 'missingItem', isShort: false },
            ]),
        );

        expect(state).toStrictEqual(prev);
    });

    it('does nothing for an empty update list', () => {
        const prev = stateWithItems().feeds;
        const state = feedsSlice.reducer(prev, feedsSlice.actions.setItemsShortStatus([]));

        expect(state).toBe(prev);
    });
});

describe('selectYoutubeItemsMissingShortStatus', () => {
    it('returns unread youtube items whose status is not yet known', () => {
        expect(selectYoutubeItemsMissingShortStatus(stateWithItems())).toEqual([
            { feedId: 'feed1', itemId: 'youtubeItem', videoId: 'OU6HZ-PTOPI', durationSeconds: undefined },
            { feedId: 'feed2', itemId: 'shortItem', videoId: 'JXgV1rJzwd4', durationSeconds: 42 },
        ]);
    });

    it('skips items that already have a status', () => {
        const state = stateWithItems();
        state.feeds.feeds[0].items[0].isShort = false;

        expect(selectYoutubeItemsMissingShortStatus(state).map((x) => x.itemId)).toEqual(['shortItem']);
    });

    it('skips items that are already read', () => {
        const state = stateWithItems();
        state.feeds.feeds[0].items[0].isRead = true;

        expect(selectYoutubeItemsMissingShortStatus(state)).toEqual([
            { feedId: 'feed2', itemId: 'shortItem', videoId: 'JXgV1rJzwd4', durationSeconds: 42 },
        ]);
    });
});

describe('recordShortsFetchFailure', () => {
    it('records the failure timestamp for the video', () => {
        const state = stateWithItems();

        const next = feedsSlice.reducer(
            state.feeds,
            feedsSlice.actions.recordShortsFetchFailure({ videoId: 'OU6HZ-PTOPI', failedAt: 1000 }),
        );

        expect(next.shortsFetchFailures).toEqual({ 'OU6HZ-PTOPI': 1000 });
    });

    it('drops failures that are past the retry window', () => {
        const state = stateWithItems();
        state.feeds.shortsFetchFailures = { stale: 1000 };

        const next = feedsSlice.reducer(
            state.feeds,
            feedsSlice.actions.recordShortsFetchFailure({
                videoId: 'fresh',
                failedAt: 1000 + DURATION_FETCH_RETRY_WINDOW_MS,
            }),
        );

        expect(next.shortsFetchFailures).toEqual({ fresh: 1000 + DURATION_FETCH_RETRY_WINDOW_MS });
    });
});

describe('clearShortsFetchFailure', () => {
    it('removes the failure entry for the video', () => {
        const state = stateWithItems();
        state.feeds.shortsFetchFailures = { 'OU6HZ-PTOPI': 1000, other: 2000 };

        const next = feedsSlice.reducer(state.feeds, feedsSlice.actions.clearShortsFetchFailure('OU6HZ-PTOPI'));

        expect(next.shortsFetchFailures).toEqual({ other: 2000 });
    });

    it('returns the same state when there is nothing to clear', () => {
        const state = stateWithItems();

        const next = feedsSlice.reducer(state.feeds, feedsSlice.actions.clearShortsFetchFailure('OU6HZ-PTOPI'));

        expect(next).toBe(state.feeds);
    });
});
