import { RootState } from '../../store';
import feedsSlice, { selectYoutubeItemMissingDuration } from '../feeds';

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

describe('selectYoutubeItemMissingDuration', () => {
    it('returns the first item whose duration is not yet known', () => {
        const state = stateWithItems();

        expect(selectYoutubeItemMissingDuration(state)).toEqual({
            feedId: 'feed1',
            itemId: 'youtubeItem',
            videoId: 'OU6HZ-PTOPI',
        });
    });

    it('prefers the video id from the url over the one from the item id', () => {
        const state = stateWithItems();

        const feedsSliceState = state.feeds;
        feedsSliceState.feeds[0].items[0].id = 'yt:video:JXgV1rJzwd4';

        const result = selectYoutubeItemMissingDuration({ ...state, feeds: feedsSliceState });

        expect(result?.videoId).toBe('OU6HZ-PTOPI');
    });

    it('falls back to the video id from the item id', () => {
        const state = stateWithItems();
        state.feeds.feeds[0].items[0].url = 'https://example.com/redirect';
        state.feeds.feeds[0].items[0].id = 'yt:video:JXgV1rJzwd4';

        const result = selectYoutubeItemMissingDuration(state);

        expect(result).toEqual({ feedId: 'feed1', itemId: 'yt:video:JXgV1rJzwd4', videoId: 'JXgV1rJzwd4' });
    });

    it('returns undefined when every youtube item already has a duration', () => {
        const state = stateWithItems();
        state.feeds.feeds[0].items[0].durationSeconds = 754;
        state.feeds.feeds[1].items[0].durationSeconds = 59;

        expect(selectYoutubeItemMissingDuration(state)).toBeUndefined();
    });
});