import { Feed, NodeType } from '../../../model/feeds';
import { RootState } from '../../store';
import feedsSlice, { selectTotalUnreadItems } from '../feeds';
import { MAX_ITEMS_PER_FEED_DEFAULT } from '../options';
import {
    feed1Fixture,
    feed2Fixture,
    feed3Fixture,
    folder1Fixture,
    folder2Fixture,
    folder3Fixture,
    folder4Fixture,
} from './feeds.fixtures';

type FeedSliceState = RootState['feeds'];

const update = (feeds: ReadonlyArray<Feed>) =>
    feedsSlice.actions.updateFeeds({ feeds, maxItemsPerFeed: MAX_ITEMS_PER_FEED_DEFAULT });

describe('deleteFeed action', () => {
    it('deletes the selected feed', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture, feed2Fixture],
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteFeed({ url: feed1Fixture.id }));

        expect(newState.feeds).toHaveLength(1);
        expect(newState.feeds[0]).toStrictEqual(feed2Fixture);
    });

    it('deletes the relation in the parent folder', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture],
            folders: [{ ...folder1Fixture, feedIds: [feed1Fixture.id] }],
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteFeed({ url: feed1Fixture.id }));

        expect(newState.folders).toHaveLength(1);
    });

    it('drops the read keys of the deleted feed', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture, feed2Fixture],
            readItemIds: [`${feed1Fixture.id}::itemId1`, `${feed1Fixture.id}::itemId2`, `${feed2Fixture.id}::itemId1`],
        };

        const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteFeed({ url: feed1Fixture.id }));

        expect(newState.readItemIds).toStrictEqual([`${feed2Fixture.id}::itemId1`]);
    });

    it('brings a re-added feed back with unread items', () => {
        const readState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [feed1Fixture],
            readItemIds: feed1Fixture.items.map((item) => `${feed1Fixture.id}::${item.id}`),
        };

        const deletedState = feedsSlice.reducer(readState, feedsSlice.actions.deleteFeed({ url: feed1Fixture.id }));

        const readdedState = feedsSlice.reducer(deletedState, update([feed1Fixture]));

        expect(selectTotalUnreadItems(readdedState)).toBe(feed1Fixture.items.length);
    });
});

describe('deleteNode action', () => {
    describe('when the node is a feed', () => {
        it('deletes the feed', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture, feed2Fixture],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.deleteNode({ nodeType: NodeType.Feed, nodeId: feed1Fixture.id }),
            );

            expect(newState.feeds).toHaveLength(1);
            expect(newState.feeds[0]).toStrictEqual(feed2Fixture);
        });

        it('deletes the relation in the parent folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture],
                folders: [{ ...folder1Fixture, feedIds: [feed1Fixture.id] }],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.deleteNode({ nodeType: NodeType.Feed, nodeId: feed1Fixture.id }),
            );

            expect(newState.folders).toHaveLength(1);
        });

        it('deletes the only feed', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.deleteNode({ nodeType: NodeType.Feed, nodeId: feed1Fixture.id }),
            );

            expect(newState.feeds).toHaveLength(0);
        });
    });

    describe('when the node is a folder', () => {
        it('deletes the folder and its content (subfolders and feeds)', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, subfolderIds: [folder2Fixture.id], feedIds: [feed1Fixture.id] },
                    { ...folder2Fixture, subfolderIds: [folder3Fixture.id] },
                    { ...folder3Fixture, feedIds: [feed2Fixture.id] },
                    { ...folder4Fixture, feedIds: [feed3Fixture.id] },
                ],
                feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.deleteNode({ nodeType: NodeType.Folder, nodeId: folder1Fixture.id }),
            );

            expect(newState.folders).toHaveLength(1);
            expect(newState.feeds).toHaveLength(1);
            expect(newState.folders[0]).toStrictEqual({ ...folder4Fixture, feedIds: [feed3Fixture.id] });
            expect(newState.feeds[0]).toStrictEqual(feed3Fixture);
        });

        it('drops the read keys of the deleted feeds only', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, subfolderIds: [folder2Fixture.id], feedIds: [feed1Fixture.id] },
                    { ...folder2Fixture, feedIds: [feed2Fixture.id] },
                    folder3Fixture,
                ],
                feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
                readItemIds: [
                    `${feed1Fixture.id}::itemId1`,
                    `${feed2Fixture.id}::itemId2`,
                    `${feed3Fixture.id}::itemId1`,
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.deleteNode({ nodeType: NodeType.Folder, nodeId: folder1Fixture.id }),
            );

            expect(newState.readItemIds).toStrictEqual([`${feed3Fixture.id}::itemId1`]);
        });

        it('deletes the relation to the parent folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    {
                        ...folder1Fixture,
                        subfolderIds: [folder2Fixture.id, folder3Fixture.id],
                    },
                    folder2Fixture,
                    folder3Fixture,
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.deleteNode({ nodeType: NodeType.Folder, nodeId: folder2Fixture.id }),
            );

            expect(newState.folders).toHaveLength(2);
            expect(newState.folders[0]).toStrictEqual({
                ...folder1Fixture,
                subfolderIds: [folder3Fixture.id],
            });
        });
    });
});
