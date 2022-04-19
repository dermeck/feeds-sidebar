import { Feed, FeedItem, FeedNode, Folder, FolderNode, NodeType } from '../../../model/feeds';
import { extensionStateLoaded } from '../../actions';
import feedsSlice, { FeedSliceState, selectTotalUnreadItems, selectTreeNode } from '../feeds';
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

const itemFixture: (id: string) => FeedItem = (id: string) => ({
    id: id,
    url: `http://feed.url/${id}`,
    title: `title-${id}`,
    isRead: false,
});

const folderFixture: (id: string) => Folder = (id: string) => ({ id, title: id, feedIds: [], subfolders: [] });

const folder1Fixture = folderFixture('folder1');
const folder2Fixture = folderFixture('folder2');
const folder3Fixture = folderFixture('folder3');
const folder4Fixture = folderFixture('folder4');

const feedsFixture = [feed1Fixture, feed2Fixture];

describe('global extensionStateLoaded action', () => {
    it('replaces previous state with payload', () => {
        const prevState: FeedSliceState = {
            folders: [folder1Fixture],
            feeds: [feed1Fixture],
            selectedNodeId: '1',
        };

        const action = extensionStateLoaded({
            feeds: { folders: [folder2Fixture], feeds: [feed2Fixture], selectedNodeId: '' },
            options: initialOptionsState,
        });

        const expectation: FeedSliceState = {
            folders: [folder2Fixture],
            feeds: [feed2Fixture],
            selectedNodeId: '',
        };

        expect(feedsSlice.reducer(prevState, action)).toStrictEqual(expectation);
    });
});

describe('select action', () => {
    it('sets selectedId', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: feedsFixture,
        };

        const action = feedsSlice.actions.select('feedId2');

        expect(feedsSlice.reducer(prevState, action).selectedNodeId).toBe('feedId2');
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
    it('marks all items of feed as read if selectedNode is a feed', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: feedsFixture,
            selectedNodeId: feed1Fixture.id,
        };

        const action = feedsSlice.actions.markSelectedFeedAsRead();

        expect(feedsSlice.reducer(prevState, action).feeds[0].items[0].isRead).toBe(true);
        expect(feedsSlice.reducer(prevState, action).feeds[0].items[1].isRead).toBe(true);
        expect(feedsSlice.reducer(prevState, action).feeds[1].items[0].isRead).toBe(false);
    });

    it.todo('marks all items within folder as read if selectedNode is a folder');
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

    it.todo('adds relation to root folder');

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

describe('deleteSelectedNode action', () => {
    describe('when selected node is a feed', () => {
        it('deletes the selected feed', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture, feed2Fixture],
                selectedNodeId: feed1Fixture.id,
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.feeds).toHaveLength(1);
            expect(newState.feeds[0]).toStrictEqual(feed2Fixture);
        });

        it.todo('deletes the relation in the parent folder');

        // TODO select parent
        it('clears selectedNodeId if it was the only existing feed', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture],
                selectedNodeId: feed1Fixture.id,
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.feeds).toHaveLength(0);
            expect(newState.selectedNodeId).toBe('');
        });

        // TODO
        it.skip('selects the previuous feed if the deleted feed was the last one', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
                selectedNodeId: feed3Fixture.id,
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.feeds).toHaveLength(2);
            expect(newState.selectedNodeId).toBe(feed2Fixture.id);
        });

        // TODO
        it.skip('selects the subsequent feed if the deleted feed was not the last one', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
                selectedNodeId: feed2Fixture.id,
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.feeds).toHaveLength(2);
            expect(newState.selectedNodeId).toBe(feed3Fixture.id);
        });
    });

    describe('when selected node is a folder', () => {
        it('deletes the selected folder and its content (subfolders and feeds)', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, subfolders: [folder2Fixture.id], feedIds: [feed1Fixture.id] },
                    { ...folder2Fixture, subfolders: [folder3Fixture.id] },
                    { ...folder3Fixture, feedIds: [feed2Fixture.id] },
                    { ...folder4Fixture, feedIds: [feed3Fixture.id] },
                ],
                feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
                selectedNodeId: folder1Fixture.id,
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
                        subfolders: [folder2Fixture.id, folder3Fixture.id],
                    },
                    folder2Fixture,
                    folder3Fixture,
                ],
                selectedNodeId: folder2Fixture.id,
            };

            const newState = feedsSlice.reducer(prevState, feedsSlice.actions.deleteSelectedNode());

            expect(newState.folders).toHaveLength(2);
            expect(newState.folders[0]).toStrictEqual({
                ...folder1Fixture,
                subfolders: [folder3Fixture.id],
            });
        });

        it.todo('it selects the parent folder if it was the only subfolder');

        it.todo('selects the previous subfolder of the parent if it was the last subfolder');

        it.todo('selects the subsequent subfolder of the parent if it was not the last subfolder');
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

describe('selectTreeNode', () => {
    const state: FeedSliceState = {
        ...feedsSlice.getInitialState(),
        folders: [folder1Fixture, folder2Fixture, folder3Fixture],
        feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
    };

    it('returns a feedNode if id matches a feed', () => {
        const expectation: FeedNode = {
            nodeType: NodeType.Feed,
            data: feed2Fixture,
        };

        expect(selectTreeNode(state, feed2Fixture.id)).toStrictEqual(expectation);
    });

    it('returns a folderNode if id matches a folder', () => {
        const expectation: FolderNode = {
            nodeType: NodeType.Folder,
            data: folder2Fixture,
        };

        expect(selectTreeNode(state, folder2Fixture.id)).toStrictEqual(expectation);
    });

    it('returns undefined if the id does not match a feed or folder', () => {
        expect(selectTreeNode(state, 'moep')).toBeUndefined();
    });
});
