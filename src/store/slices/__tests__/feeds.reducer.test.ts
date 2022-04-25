import { Folder, NodeMeta, NodeType } from '../../../model/feeds';
import { extensionStateLoaded } from '../../actions';
import feedsSlice, { FeedSliceState } from '../feeds';
import { initialState as initialOptionsState } from '../options';
import {
    feed1Fixture,
    feed2Fixture,
    feed3Fixture,
    feedsFixture,
    folder1Fixture,
    folder2Fixture,
    folder3Fixture,
    folder4Fixture,
    itemFixture,
} from './feeds.fixtures';

describe('global extensionStateLoaded action', () => {
    it('replaces previous state with payload', () => {
        const prevState: FeedSliceState = {
            folders: [folder1Fixture],
            feeds: [feed1Fixture],
            selectedNode: { nodeType: NodeType.FeedItem, nodeId: '1' },
        };

        const action = extensionStateLoaded({
            feeds: { folders: [folder2Fixture], feeds: [feed2Fixture], selectedNode: undefined },
            options: initialOptionsState,
        });

        const expectation: FeedSliceState = {
            folders: [folder2Fixture],
            feeds: [feed2Fixture],
            selectedNode: undefined,
        };

        expect(feedsSlice.reducer(prevState, action)).toStrictEqual(expectation);
    });
});

describe('select action', () => {
    it('sets selectedNode', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: feedsFixture,
        };

        const action = feedsSlice.actions.select({ nodeType: NodeType.Feed, nodeId: 'feedId2' });

        const expected: NodeMeta = { nodeType: NodeType.Feed, nodeId: 'feedId2' };

        expect(feedsSlice.reducer(prevState, action).selectedNode).toStrictEqual(expected);
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

describe('markSelectedNodeAsRead action', () => {
    it('marks all items of feed as read if selectedNode is a feed', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: feedsFixture,
            selectedNode: { nodeType: NodeType.Feed, nodeId: feed1Fixture.id },
        };

        const action = feedsSlice.actions.markSelectedNodeAsRead();
        const newState = feedsSlice.reducer(prevState, action);

        expect(newState.feeds[0].items[0].isRead).toBe(true);
        expect(newState.feeds[0].items[1].isRead).toBe(true);
        expect(newState.feeds[1].items[0].isRead).toBe(false);
        expect(newState.feeds[2].items[0].isRead).toBe(false);
    });

    it('marks all items within folder as read if selectedNode is a folder', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            folders: [
                { ...folder1Fixture, subfolderIds: [folder2Fixture.id], feedIds: [feed1Fixture.id] },
                { ...folder2Fixture, subfolderIds: [folder3Fixture.id], feedIds: [feed2Fixture.id] },
                { ...folder3Fixture, feedIds: [feed3Fixture.id] },
            ],
            feeds: feedsFixture,
            selectedNode: { nodeType: NodeType.Folder, nodeId: folder2Fixture.id },
        };

        const action = feedsSlice.actions.markSelectedNodeAsRead();
        const newState = feedsSlice.reducer(prevState, action);

        expect(newState.feeds[0].items[0].isRead).toBe(false);
        expect(newState.feeds[0].items[1].isRead).toBe(false);
        expect(newState.feeds[1].items[0].isRead).toBe(true);
        expect(newState.feeds[1].items[1].isRead).toBe(true);
        expect(newState.feeds[2].items[0].isRead).toBe(true);
        expect(newState.feeds[2].items[1].isRead).toBe(true);
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

jest.mock('uuid', () => {
    const original = jest.requireActual('uuid');

    return {
        ...original,
        v4: jest.fn().mockReturnValue('mocked-uuid'),
    };
});

describe('addFolder', () => {
    it('does add a new folder with uuid', () => {
        const prevState: FeedSliceState = feedsSlice.getInitialState();

        const action = feedsSlice.actions.addFolder('moepFolder');
        const newState = feedsSlice.reducer(prevState, action);

        const expectation: Folder = {
            id: 'mocked-uuid',
            title: 'moepFolder',
            subfolderIds: [],
            feedIds: [],
        };

        expect(newState.folders).toHaveLength(2);
        expect(newState.folders[1]).toStrictEqual(expectation);
    });

    it('does add relation to root folder', () => {
        const prevState: FeedSliceState = feedsSlice.getInitialState();

        const action = feedsSlice.actions.addFolder('miepFolder');
        const newState = feedsSlice.reducer(prevState, action);

        expect(newState.folders[0]).toStrictEqual({
            id: '_root_',
            title: 'root',
            feedIds: [],
            subfolderIds: ['mocked-uuid'],
        });
    });
});

describe('moveNode action', () => {
    describe('when moving folder nodes', () => {
        it('adds dragged folder to subfolderIds of target folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, subfolderIds: [folder2Fixture.id] },
                    { ...folder2Fixture, subfolderIds: [folder3Fixture.id] },
                    { ...folder3Fixture },
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.moveNode({
                    movedNode: {
                        nodeId: folder3Fixture.id,
                        nodeType: NodeType.Folder,
                    },
                    targetFolderNodeId: folder1Fixture.id,
                }),
            );

            expect(newState.folders[0].subfolderIds).toContain(folder3Fixture.id);
        });

        it('removes dragged folder from subfolderIds of previous parent folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, subfolderIds: [folder2Fixture.id] },
                    { ...folder2Fixture, subfolderIds: [folder3Fixture.id] },
                    { ...folder3Fixture },
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.moveNode({
                    movedNode: {
                        nodeId: folder3Fixture.id,
                        nodeType: NodeType.Folder,
                    },
                    targetFolderNodeId: folder1Fixture.id,
                }),
            );

            expect(newState.folders[1].subfolderIds).not.toContain(folder3Fixture.id);
        });

        it('does not change anything if previous parent is the target', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, subfolderIds: [folder2Fixture.id] },
                    { ...folder2Fixture, subfolderIds: [folder3Fixture.id] },
                    { ...folder3Fixture },
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.moveNode({
                    movedNode: {
                        nodeId: folder3Fixture.id,
                        nodeType: NodeType.Folder,
                    },
                    targetFolderNodeId: folder2Fixture.id,
                }),
            );

            expect(newState.folders).toStrictEqual([
                { ...folder1Fixture, subfolderIds: [folder2Fixture.id] },
                { ...folder2Fixture, subfolderIds: [folder3Fixture.id] },
                { ...folder3Fixture },
            ]);
        });
    });

    describe('when moving feed nodes', () => {
        it('adds dragged feed to feedIds of target folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, feedIds: [feed3Fixture.id], subfolderIds: [folder2Fixture.id] },
                    { ...folder2Fixture, feedIds: [feed1Fixture.id] },
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.moveNode({
                    movedNode: {
                        nodeId: feed1Fixture.id,
                        nodeType: NodeType.Feed,
                    },
                    targetFolderNodeId: folder1Fixture.id,
                }),
            );

            expect(newState.folders[0].feedIds).toStrictEqual([feed3Fixture.id, feed1Fixture.id]);
        });

        it('removes dragged feed from feedIds of previous parent folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, feedIds: [], subfolderIds: [folder2Fixture.id] },
                    { ...folder2Fixture, feedIds: [feed1Fixture.id, feed2Fixture.id] },
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.moveNode({
                    movedNode: {
                        nodeId: feed1Fixture.id,
                        nodeType: NodeType.Feed,
                    },
                    targetFolderNodeId: folder1Fixture.id,
                }),
            );

            expect(newState.folders[1].feedIds).not.toContain(feed1Fixture.id);
            expect(newState.folders[1].feedIds).toStrictEqual([feed2Fixture.id]);
        });

        it('does not change anything if previous parent is the target', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, feedIds: [], subfolderIds: [folder2Fixture.id] },
                    { ...folder2Fixture, feedIds: [feed1Fixture.id, feed2Fixture.id] },
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.moveNode({
                    movedNode: {
                        nodeId: feed1Fixture.id,
                        nodeType: NodeType.Feed,
                    },
                    targetFolderNodeId: folder2Fixture.id,
                }),
            );

            expect(newState.folders[1].feedIds).toStrictEqual([feed1Fixture.id, feed2Fixture.id]);
        });
    });
});

describe('deleteSelectedNode action', () => {
    describe('when selected node is a feed', () => {
        it('deletes the selected feed', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture, feed2Fixture],
                selectedNode: { nodeType: NodeType.Feed, nodeId: feed1Fixture.id },
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.feeds).toHaveLength(1);
            expect(newState.feeds[0]).toStrictEqual(feed2Fixture);
        });

        it('deletes the relation in the parent folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture],
                folders: [{ ...folder1Fixture, feedIds: [feed1Fixture.id] }],
                selectedNode: { nodeType: NodeType.Feed, nodeId: feed1Fixture.id },
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.folders).toHaveLength(1);
        });

        // TODO select parent
        it('clears selectedNode if it was the only existing feed', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture],
                selectedNode: { nodeType: NodeType.Feed, nodeId: feed1Fixture.id },
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.feeds).toHaveLength(0);
            expect(newState.selectedNode).toBe(undefined);
        });

        // TODO
        it.skip('selects the previuous feed if the deleted feed was the last one', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
                selectedNode: { nodeType: NodeType.Feed, nodeId: feed3Fixture.id },
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.feeds).toHaveLength(2);
            expect(newState.selectedNode).toBe(feed2Fixture.id);
        });

        // TODO
        it.skip('selects the subsequent feed if the deleted feed was not the last one', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
                selectedNode: { nodeType: NodeType.Feed, nodeId: feed2Fixture.id },
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.feeds).toHaveLength(2);
            expect(newState.selectedNode).toBe(feed3Fixture.id);
        });
    });

    describe('when selected node is a folder', () => {
        it('deletes the selected folder and its content (subfolders and feeds)', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, subfolderIds: [folder2Fixture.id], feedIds: [feed1Fixture.id] },
                    { ...folder2Fixture, subfolderIds: [folder3Fixture.id] },
                    { ...folder3Fixture, feedIds: [feed2Fixture.id] },
                    { ...folder4Fixture, feedIds: [feed3Fixture.id] },
                ],
                feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
                selectedNode: { nodeType: NodeType.Folder, nodeId: folder1Fixture.id },
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.folders).toHaveLength(1);
            expect(newState.feeds).toHaveLength(1);
            expect(newState.folders[0]).toStrictEqual({ ...folder4Fixture, feedIds: [feed3Fixture.id] });
            expect(newState.feeds[0]).toStrictEqual(feed3Fixture);
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
                selectedNode: { nodeType: NodeType.Folder, nodeId: folder2Fixture.id },
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.folders).toHaveLength(2);
            expect(newState.folders[0]).toStrictEqual({
                ...folder1Fixture,
                subfolderIds: [folder3Fixture.id],
            });
        });

        it.todo('it selects the parent folder if it was the only subfolder');

        it.todo('selects the previous subfolder of the parent if it was the last subfolder');

        it.todo('selects the subsequent subfolder of the parent if it was not the last subfolder');
    });
});
