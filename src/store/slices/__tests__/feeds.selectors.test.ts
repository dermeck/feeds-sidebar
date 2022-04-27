import { FeedNode, NodeType, FolderNode, TreeNode } from '../../../model/feeds';
import feedsSlice, { FeedSliceState, selectTopLevelNodes, selectTotalUnreadItems, selectTreeNode } from '../feeds';
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

describe('selectTopLevelNodes', () => {
    it('selects the subfolders and feeds of the root folder', () => {
        const rootFolderId = '_root_';

        const state: FeedSliceState = {
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
