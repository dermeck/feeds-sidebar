import { Feed } from '../../../model/feeds';
import { extensionStateLoaded } from '../../actions';
import feedsSlice, { FeedSliceState, selectTotalUnreadItems } from '../feeds';
import { initialState as initialOptionsState } from '../options';

const feed1Fixture: Feed = {
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
};

const feed2Fixture: Feed = {
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
};

const feed3Fixture: Feed = {
    id: 'feedId3',
    url: 'http://feedId3.url',
    items: [
        {
            id: 'itemId1',
            url: 'http://feedId3.url/item1',
            title: 'item1',
            isRead: false,
        },
        {
            id: 'itemId2',
            url: 'http://feedId3.url/item2',
            title: 'item2',
            isRead: false,
        },
    ],
};

const itemFixture = (id: string) => ({
    id: id,
    url: `http://feed.url/${id}`,
    title: `title-${id}`,
    isRead: false,
});

const feedsFixture = [feed1Fixture, feed2Fixture];

describe('global extensionStateLoaded action', () => {
    it('replaces previous state with payload', () => {
        const prevState: FeedSliceState = {
            folders: [],
            feeds: [feed1Fixture],
            selectedId: '1',
        };

        const action = extensionStateLoaded({
            feeds: { folders: [], feeds: [feed2Fixture], selectedId: '' },
            options: initialOptionsState,
        });

        expect(feedsSlice.reducer(prevState, action)).toStrictEqual({
            feeds: [feed2Fixture],
            selectedId: '',
        });
    });
});

describe('select action', () => {
    it('sets selectedId', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: feedsFixture,
        };

        const action = feedsSlice.actions.select('feedId2');

        expect(feedsSlice.reducer(prevState, action).selectedId).toBe('feedId2');
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

describe('markSelectedFeedAsRead action', () => {
    it('marks all items of selected feed as read', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: feedsFixture,
            selectedId: feed1Fixture.id,
        };

        const action = feedsSlice.actions.markSelectedFeedAsRead();

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

describe('updateFeeds action', () => {
    it('does not change existing feeds if feedId does not match', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture],
        };

        const action = feedsSlice.actions.updateFeeds([feed2Fixture]);

        expect(feedsSlice.reducer(prevState, action).feeds[0]).toStrictEqual(feed1Fixture);
    });

    it('does add a new feed if feedId does not match any existing feed', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture],
        };

        const action = feedsSlice.actions.updateFeeds([feed2Fixture]);

        const newState = feedsSlice.reducer(prevState, action);

        expect(newState.feeds).toHaveLength(2);
        expect(newState.feeds[1]).toStrictEqual(feed2Fixture);
    });

    describe('updates existing feed', () => {
        it('always updates id and link', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.updateFeeds([
                    {
                        ...feed1Fixture,
                        id: 'newId',
                        link: 'thenewlink',
                    },
                ]),
            );

            expect(newState.feeds[0].id).toBe('newId');
            expect(newState.feeds[0].link).toBe('thenewlink');
        });

        it('updates title if it was undefined', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [{ ...feed1Fixture, title: undefined }],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.updateFeeds([
                    {
                        ...feed1Fixture,
                        title: 'updatedTitle',
                    },
                ]),
            );

            expect(newState.feeds[0].title).toBe('updatedTitle');
        });

        it('keeps old title if it was already set (already fetched or manually renamed)', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [{ ...feed1Fixture, title: 'theOldTitle' }],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.updateFeeds([
                    {
                        ...feed1Fixture,
                        title: 'updatedTitle?',
                    },
                ]),
            );

            expect(newState.feeds[0].title).toBe('theOldTitle');
        });

        it('adds new items', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [{ ...feed1Fixture, items: [] }],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.updateFeeds([
                    {
                        ...feed1Fixture,
                        items: [itemFixture('id1'), itemFixture('id2')],
                    },
                ]),
            );

            expect(newState.feeds[0].items).toHaveLength(2);
            expect(newState.feeds[0].items[0].id).toBe('id1');
            expect(newState.feeds[0].items[1].id).toBe('id2');
        });

        it('does not update items that already existed', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [
                    {
                        ...feed1Fixture,
                        items: [
                            {
                                id: 'id1',
                                title: 'oldTitle',
                                url: 'old.url',
                                published: '2022-02-02',
                                lastModified: '2022-02-02',
                                isRead: true,
                            },
                        ],
                    },
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.updateFeeds([
                    {
                        ...feed1Fixture,
                        items: [
                            {
                                id: 'id1',
                                title: 'newTitle',
                                url: 'new.url',
                                published: '2022-03-03',
                                lastModified: '2022-03-03',
                                isRead: true,
                            },
                        ],
                    },
                ]),
            );

            expect(newState.feeds[0].items[0]).toStrictEqual({
                id: 'id1',
                title: 'oldTitle',
                url: 'old.url',
                published: '2022-02-02',
                lastModified: '2022-02-02',
                isRead: true,
            });
        });

        it('keeps old items that are not present in updated feed', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [{ ...feed1Fixture, items: [itemFixture('id1'), itemFixture('id2')] }],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.updateFeeds([
                    {
                        ...feed1Fixture,
                        items: [itemFixture('id3')],
                    },
                ]),
            );

            expect(newState.feeds[0].items).toHaveLength(3);
            expect(newState.feeds[0].items[0].id).toBe('id1');
            expect(newState.feeds[0].items[1].id).toBe('id2');
        });

        it('updates multiple feeds', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [
                    { ...feed1Fixture, items: [] },
                    { ...feed2Fixture, items: [] },
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.updateFeeds([
                    {
                        ...feed1Fixture,
                        items: [itemFixture('id1'), itemFixture('id2')],
                    },
                    {
                        ...feed2Fixture,
                        items: [itemFixture('id3'), itemFixture('id4')],
                    },
                ]),
            );

            expect(newState.feeds[0].items).toHaveLength(2);
            expect(newState.feeds[1].items).toHaveLength(2);
        });
    });
});

describe('deleteSelectedFeed action', () => {
    it('deletes the selected feed', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture, feed2Fixture],
            selectedId: feed1Fixture.id,
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedFeed());

        expect(newState.feeds).toHaveLength(1);
        expect(newState.feeds[0]).toStrictEqual(feed2Fixture);
    });

    it('clears selectedFeedId if it was the only existing feed', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture],
            selectedId: feed1Fixture.id,
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedFeed());

        expect(newState.feeds).toHaveLength(0);
        expect(newState.selectedId).toBe('');
    });

    it('selects the previuous feed if the deleted feed was the last one', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
            selectedId: feed3Fixture.id,
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedFeed());

        expect(newState.feeds).toHaveLength(2);
        expect(newState.selectedId).toBe(feed2Fixture.id);
    });

    it('selects the subsequent feed if the deleted feed was not the last one', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
            selectedId: feed2Fixture.id,
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedFeed());

        expect(newState.feeds).toHaveLength(2);
        expect(newState.selectedId).toBe(feed3Fixture.id);
    });
});

describe('selectTotalUnreadItems', () => {
    it('returns sum of all unread items for all feeds', () => {
        const state: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [
                {
                    ...feed1Fixture,
                    items: [
                        {
                            ...itemFixture('1'),
                            isRead: false,
                        },
                    ],
                },
                {
                    ...feed1Fixture,
                    items: [
                        {
                            ...itemFixture('2'),
                            isRead: true,
                        },
                    ],
                },
                {
                    ...feed2Fixture,
                    items: [
                        {
                            ...itemFixture('1'),
                            isRead: false,
                        },
                    ],
                },
                {
                    ...feed1Fixture,
                    items: [
                        {
                            ...itemFixture('2'),
                            isRead: false,
                        },
                    ],
                },
            ],
        };

        expect(selectTotalUnreadItems(state)).toBe(3);
    });
});
