import { FeedNode, NodeType, FolderNode, rootFolderId, TreeNode } from '../../../model/feeds';
import { RootState } from '../../store';
import feedsSlice, {
    makeselectDescendentNodeIds,
    nodeMetaById,
    selectFolderIds,
    selectSelectedNodeFeedItems,
    selectTopLevelNodes,
    selectTotalUnreadItems,
    selectTreeItems,
    makeSelectTreeNode,
} from '../feeds';
import {
    feed1Fixture,
    itemFixture,
    feed2Fixture,
    folder1Fixture,
    folder2Fixture,
    folder3Fixture,
    feed3Fixture,
    folder4Fixture,
} from './feeds.fixtures';

describe('selectTotalUnreadItems', () => {
    it('returns sum of all unread items for all feeds', () => {
        const state: RootState['feeds'] = {
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

describe('makeSelectTreeNode', () => {
    const state: RootState['feeds'] = {
        ...feedsSlice.getInitialState(),
        folders: [folder1Fixture, folder2Fixture, folder3Fixture],
        feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
    };

    const selectTreeNode = makeSelectTreeNode();

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

describe('selectTopLevelNodes', () => {
    it('selects the subfolders and feeds of the root folder', () => {
        const rootFolderId = '_root_';

        const state: RootState['feeds'] = {
            ...feedsSlice.getInitialState(),
            folders: [
                {
                    ...folder1Fixture,
                    id: rootFolderId,
                    subfolderIds: [folder2Fixture.id, folder4Fixture.id],
                    feedIds: [feed1Fixture.id, feed2Fixture.id],
                },
                { ...folder2Fixture, subfolderIds: [folder3Fixture.id] },
                { ...folder3Fixture },
                { ...folder4Fixture },
            ],
            feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
        };

        const expectation: ReadonlyArray<TreeNode> = [
            { nodeType: NodeType.Folder, data: { ...folder2Fixture, subfolderIds: [folder3Fixture.id] } },
            { nodeType: NodeType.Folder, data: folder4Fixture },
            { nodeType: NodeType.Feed, data: feed1Fixture },
            { nodeType: NodeType.Feed, data: feed2Fixture },
        ];

        expect(selectTopLevelNodes(state)).toStrictEqual(expectation);
    });
});

describe('selectDescendentNodeIds', () => {
    const state: RootState['feeds'] = {
        ...feedsSlice.getInitialState(),
        folders: [
            {
                ...folder1Fixture,
                subfolderIds: [folder2Fixture.id, folder3Fixture.id],
                feedIds: [feed1Fixture.id, feed2Fixture.id],
            },

            { ...folder2Fixture },
            { ...folder3Fixture, subfolderIds: [folder4Fixture.id] },
            { ...folder4Fixture, feedIds: [feed3Fixture.id] },
        ],
        feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
    };

    const selectDescendentNodeIds = makeselectDescendentNodeIds();

    it('returns ids of all descendents', () => {
        const expectation = [
            folder2Fixture.id,
            folder3Fixture.id,
            feed1Fixture.id,
            feed2Fixture.id,
            folder4Fixture.id,
            feed3Fixture.id,
        ];

        expect(selectDescendentNodeIds(state, folder1Fixture.id)).toStrictEqual(expectation);
    });

    it('returns an empty array of parent is not a folder', () => {
        expect(selectDescendentNodeIds(state, feed1Fixture.id)).toStrictEqual([]);
    });
});

describe('selectTreeItems', () => {
    it('nests subfolders before feeds and drops empty children', () => {
        const state: RootState['feeds'] = {
            ...feedsSlice.getInitialState(),
            folders: [
                { ...folder1Fixture, id: rootFolderId, subfolderIds: [folder2Fixture.id], feedIds: [feed1Fixture.id] },
                { ...folder2Fixture, subfolderIds: [folder3Fixture.id], feedIds: [feed2Fixture.id] },
                { ...folder3Fixture },
            ],
            feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
        };

        expect(selectTreeItems(state)).toStrictEqual([
            {
                id: folder2Fixture.id,
                nodeType: NodeType.Folder,
                title: folder2Fixture.title,
                children: [
                    { id: folder3Fixture.id, nodeType: NodeType.Folder, title: folder3Fixture.title },
                    { id: feed2Fixture.id, nodeType: NodeType.Feed, title: feed2Fixture.id },
                ],
            },
            { id: feed1Fixture.id, nodeType: NodeType.Feed, title: feed1Fixture.id },
        ]);
    });
});

describe('selectFolderIds', () => {
    it('returns every folder id except the root', () => {
        const state: RootState['feeds'] = {
            ...feedsSlice.getInitialState(),
            folders: [{ ...folder1Fixture, id: rootFolderId }, folder2Fixture, folder3Fixture],
        };

        expect(selectFolderIds(state)).toStrictEqual([folder2Fixture.id, folder3Fixture.id]);
    });
});

describe('nodeMetaById', () => {
    const folders = [folder1Fixture];
    const feeds = [feed1Fixture];

    it('returns a folder meta for a folder id', () => {
        expect(nodeMetaById(folders, feeds, folder1Fixture.id)).toStrictEqual({
            nodeId: folder1Fixture.id,
            nodeType: NodeType.Folder,
        });
    });

    it('returns a feed meta for a feed id', () => {
        expect(nodeMetaById(folders, feeds, feed1Fixture.id)).toStrictEqual({
            nodeId: feed1Fixture.id,
            nodeType: NodeType.Feed,
        });
    });

    it('returns undefined for an unknown id', () => {
        expect(nodeMetaById(folders, feeds, 'moep')).toBeUndefined();
    });
});

describe('selectSelectedNodeFeedItems', () => {
    const state: RootState['feeds'] = {
        ...feedsSlice.getInitialState(),
        folders: [
            { ...folder1Fixture, id: rootFolderId, subfolderIds: [folder2Fixture.id], feedIds: [feed1Fixture.id] },
            { ...folder2Fixture, feedIds: [feed2Fixture.id] },
        ],
        feeds: [feed1Fixture, feed2Fixture],
    };

    const withParent = (feed: typeof feed1Fixture) =>
        feed.items.map((item) => ({ ...item, parentId: feed.id, parentTitle: feed.title }));

    it('returns an empty array when nothing is selected', () => {
        expect(selectSelectedNodeFeedItems({ ...state, selectedNode: undefined })).toStrictEqual([]);
    });

    it('returns the items of the selected feed with their parent', () => {
        const selection = { nodeId: feed1Fixture.id, nodeType: NodeType.Feed } as const;

        expect(selectSelectedNodeFeedItems({ ...state, selectedNode: selection })).toStrictEqual(
            withParent(feed1Fixture),
        );
    });

    it('returns the items of every feed under the selected folder', () => {
        const selection = { nodeId: rootFolderId, nodeType: NodeType.Folder } as const;

        expect(selectSelectedNodeFeedItems({ ...state, selectedNode: selection })).toStrictEqual([
            ...withParent(feed2Fixture),
            ...withParent(feed1Fixture),
        ]);
    });
});
