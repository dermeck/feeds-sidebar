import { FeedItem } from '../../../model/feeds';
import { RootState } from '../../store';
import feedsSlice from '../feeds';
import optionsSlice from '../options';
import { feed1Fixture, feed2Fixture, itemFixture } from './feeds.fixtures';

type FeedSliceState = RootState['feeds'];

describe('updateFeeds action', () => {
    it('does not change existing feeds if feedId does not match', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture],
        };

        const action = feedsSlice.actions.updateFeeds([feed2Fixture]);

        expect(feedsSlice.reducer(prevState, action).feeds[0]).toStrictEqual(feed1Fixture);
    });

    describe('new feed (feedId does not match any existing feed)', () => {
        it('does add a new feed ', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture],
            };

            const action = feedsSlice.actions.updateFeeds([feed2Fixture]);

            const newState = feedsSlice.reducer(prevState, action);

            expect(newState.feeds).toHaveLength(2);
            expect(newState.feeds[1]).toStrictEqual(feed2Fixture);
        });

        it('does add relation to root folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
            };

            const action = feedsSlice.actions.updateFeeds([feed1Fixture]);

            const newState = feedsSlice.reducer(prevState, action);

            expect(newState.folders[0]).toStrictEqual({
                id: '_root_',
                title: 'root',
                feedIds: [feed1Fixture.id],
                subfolderIds: [],
            });
        });
    });

    describe('updates existing feed', () => {
        it('always updates link', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.updateFeeds([
                    {
                        ...feed1Fixture,
                        link: 'thenewlink',
                    },
                ]),
            );

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

        it('orders merged items by age, newest first', () => {
            // new items used to be appended, so they ended up below older ones
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [
                    {
                        ...feed1Fixture,
                        items: [
                            { ...itemFixture('older'), published: '2022-01-01' },
                            { ...itemFixture('newer'), published: '2022-12-12' },
                        ],
                    },
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.updateFeeds([
                    {
                        ...feed1Fixture,
                        items: [{ ...itemFixture('newest'), published: '2023-03-03' }],
                    },
                ]),
            );

            expect(newState.feeds[0].items.map((item) => item.id)).toStrictEqual(['newest', 'newer', 'older']);
        });

        it('orders items of a newly added feed by age', () => {
            const newState = feedsSlice.reducer(
                feedsSlice.getInitialState(),
                feedsSlice.actions.updateFeeds([
                    {
                        ...feed2Fixture,
                        items: [
                            { ...itemFixture('older'), published: '2022-01-01' },
                            { ...itemFixture('newer'), published: '2022-12-12' },
                        ],
                    },
                ]),
            );

            expect(newState.feeds[0].items.map((item) => item.id)).toStrictEqual(['newer', 'older']);
        });
    });
});

describe('trimOverflowingFeedItems action', () => {
    it('keeps the newest items by date when a feed exceeds the limit', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [
                {
                    ...feed1Fixture,
                    items: [
                        { ...itemFixture('old'), published: '2022-01-01' },
                        { ...itemFixture('newer'), published: '2022-06-06' },
                        { ...itemFixture('newest'), published: '2022-12-12' },
                    ],
                },
            ],
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.trimOverflowingFeedItems(2));

        expect(newState.feeds[0].items.map((item) => item.id)).toStrictEqual(['newest', 'newer']);
    });

    it('keeps the newest items even if they appear at the end of the array', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [
                {
                    ...feed1Fixture,
                    // newest-first feed order (as feedparser emits typical feeds)
                    items: [
                        { ...itemFixture('newest'), published: '2022-12-12' },
                        { ...itemFixture('newer'), published: '2022-06-06' },
                        { ...itemFixture('old'), published: '2022-01-01' },
                    ],
                },
            ],
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.trimOverflowingFeedItems(2));

        expect(newState.feeds[0].items.map((item) => item.id)).toStrictEqual(['newest', 'newer']);
    });

    it('keeps the items at the beginning when no dates are available', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [
                {
                    ...feed1Fixture,
                    items: [itemFixture('id1'), itemFixture('id2'), itemFixture('id3'), itemFixture('id4')],
                },
            ],
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.trimOverflowingFeedItems(2));

        expect(newState.feeds[0].items.map((item) => item.id)).toStrictEqual(['id1', 'id2']);
    });

    it('does not change feeds that are within the limit', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [{ ...feed1Fixture, items: [itemFixture('id1'), itemFixture('id2')] }],
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.trimOverflowingFeedItems(5));

        expect(newState.feeds[0].items.map((item) => item.id)).toStrictEqual(['id1', 'id2']);
        // same state, so subscribers are not notified and nothing is persisted
        expect(newState).toBe(prevState);
    });

    it.each([0, -1])('keeps all items when the limit is %s', (limit) => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [{ ...feed1Fixture, items: [itemFixture('id1'), itemFixture('id2')] }],
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.trimOverflowingFeedItems(limit));

        expect(newState.feeds[0].items.map((item) => item.id)).toStrictEqual(['id1', 'id2']);
        expect(newState).toBe(prevState);
    });
});

describe('changeMaxItemsPerFeed action', () => {
    const datedItems: ReadonlyArray<FeedItem> = [
        { ...itemFixture('oldest'), published: '2022-01-01' },
        { ...itemFixture('older'), published: '2022-03-03' },
        { ...itemFixture('newer'), published: '2022-06-06' },
        { ...itemFixture('newest'), published: '2022-12-12' },
    ];

    const stateWithItems = (items: ReadonlyArray<FeedItem>): FeedSliceState => ({
        ...feedsSlice.getInitialState(),
        feeds: [{ ...feed1Fixture, items }],
    });

    const itemIds = (state: FeedSliceState) => state.feeds[0].items.map((item) => item.id);

    it('trims already loaded items when the limit is lowered', () => {
        const newState = feedsSlice.reducer(stateWithItems(datedItems), optionsSlice.actions.changeMaxItemsPerFeed(2));

        expect(itemIds(newState)).toStrictEqual(['newest', 'newer']);
    });

    it('keeps all items when the limit is raised', () => {
        const newState = feedsSlice.reducer(
            stateWithItems(datedItems.slice(0, 2)),
            optionsSlice.actions.changeMaxItemsPerFeed(4),
        );

        expect(newState.feeds[0].items).toHaveLength(2);
    });

    it('keeps all items when the limit is set to 0', () => {
        const newState = feedsSlice.reducer(stateWithItems(datedItems), optionsSlice.actions.changeMaxItemsPerFeed(0));

        expect(newState.feeds[0].items).toHaveLength(4);
    });

    it('leaves feeds that are within the limit untouched', () => {
        const prevState = stateWithItems(datedItems);

        const newState = feedsSlice.reducer(prevState, optionsSlice.actions.changeMaxItemsPerFeed(10));

        // same reference, so subscribers do not re-render feeds that did not change
        expect(newState.feeds[0]).toBe(prevState.feeds[0]);
        expect(newState).toBe(prevState);
    });
});
