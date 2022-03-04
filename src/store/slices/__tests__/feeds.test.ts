import feedsSlice, { FeedSliceState } from '../feeds';

const feedsFixture = [
    {
        id: 'feedId1',
        url: 'http://feedId1.url',
        items: [
            {
                id: 'itemId1',
                url: 'http://feedId1.url/item1',
                title: 'item1',
                isRead: false,
            },
            {
                id: 'itemId2',
                url: 'http://feedId1.url/item2',
                title: 'item2',
                isRead: false,
            },
        ],
    },
    {
        id: 'feedId2',
        url: 'http://feedId2.url',
        items: [
            {
                id: 'itemId1',
                url: 'http://feedId2.url/item1',
                title: 'item1',
                isRead: false,
            },
            {
                id: 'itemId2',
                url: 'http://feedId2.url/item2',
                title: 'item2',
                isRead: false,
            },
        ],
    },
];

describe('addFeed action', () => {
    it('adds the feed', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [],
        };

        const action = feedsSlice.actions.addFeed({
            id: 'feedId1',
            url: 'http://feedId1.url',
            items: [
                {
                    id: 'http://feedId1.url/item1',
                    url: 'http://feedId1.url/item1',
                    title: 'item1',
                },
            ],
        });

        expect(feedsSlice.reducer(prevState, action).feeds).toEqual([
            {
                id: 'feedId1',
                url: 'http://feedId1.url',
                items: [
                    {
                        id: 'http://feedId1.url/item1',
                        url: 'http://feedId1.url/item1',
                        title: 'item1',
                    },
                ],
            },
        ]);
    });
});

describe('selectFeed action', () => {
    it('sets selectedFeedId if feed exists', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: feedsFixture,
        };

        const action = feedsSlice.actions.selectFeed('feedId2');

        expect(feedsSlice.reducer(prevState, action).selectedFeedId).toBe('feedId2');
    });

    it('throws if selected feed does not exist', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [],
        };

        const action = feedsSlice.actions.selectFeed('feedId2');

        expect(() => feedsSlice.reducer(prevState, action).selectedFeedId).toThrowError(
            'feed with id: feedId2 does not exist',
        );
    });
});

describe('markItemAsRead action', () => {
    it('marks specified item as read', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: feedsFixture,
        };

        const action = feedsSlice.actions.markItemAsRead({
            feedId: 'feedId1',
            itemId: 'itemId2',
        });

        expect(feedsSlice.reducer(prevState, action).feeds[0].items[1].isRead).toBe(true);
    });
});

describe('markFeedAsRead action', () => {
    it('marks all items of specified feed as read', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: feedsFixture,
        };

        const action = feedsSlice.actions.markFeedAsRead('feedId1');

        expect(feedsSlice.reducer(prevState, action).feeds[0].items[0].isRead).toBe(true);
        expect(feedsSlice.reducer(prevState, action).feeds[0].items[1].isRead).toBe(true);
        expect(feedsSlice.reducer(prevState, action).feeds[1].items[0].isRead).toBe(false);
    });
});

describe('markAllAsRead action', () => {
    it('marks all items of all feeds as read', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: feedsFixture,
        };

        const action = feedsSlice.actions.markAllAsRead();

        expect(feedsSlice.reducer(prevState, action).feeds[0].items[0].isRead).toBe(true);
        expect(feedsSlice.reducer(prevState, action).feeds[0].items[1].isRead).toBe(true);
        expect(feedsSlice.reducer(prevState, action).feeds[1].items[0].isRead).toBe(true);
    });
});
