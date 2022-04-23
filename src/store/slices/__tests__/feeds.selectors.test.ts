import { FeedNode, NodeType, FolderNode } from '../../../model/feeds';
import feedsSlice, { FeedSliceState, selectTotalUnreadItems, selectTreeNode } from '../feeds';
import {
    feed1Fixture,
    itemFixture,
    feed2Fixture,
    folder1Fixture,
    folder2Fixture,
    folder3Fixture,
    feed3Fixture,
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
    it.todo('selectes the subfolders and feeds of the root folder');
});
