import { RootState } from '../../store';
import feedsSlice from '../feeds';
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
    });
});
