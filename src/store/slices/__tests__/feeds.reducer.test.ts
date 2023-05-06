import { Folder, NodeMeta, NodeType } from '../../../model/feeds';
import { extensionStateLoaded } from '../../actions';
import { RootState } from '../../store';
import feedsSlice from '../feeds';
import { initialState as initialOptionsState } from '../options';
import {
    feed1Fixture,
    feed2Fixture,
    feed3Fixture,
    feedsFixture,
    folder1Fixture,
    folder2Fixture,
    folder3Fixture,
} from './feeds.fixtures';

type FeedSliceState = RootState['feeds'];

jest.mock('../../../utils/uuid', () => {
    return {
        randomUUID: jest.fn().mockReturnValue('mocked-uuid'),
    };
});

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
            feedId: feed1Fixture.id,
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

describe('replaceFolders', () => {
    it('replaces existing folder structure', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            folders: [
                {
                    id: '_root_',
                    title: 'root',
                    feedIds: [],
                    subfolderIds: ['mocked-uuid'],
                },
                {
                    id: 'mocked-uuid',
                    title: 'moepFolder',
                    subfolderIds: [],
                    feedIds: [feed1Fixture.id, feed2Fixture.id],
                },
            ],
            feeds: [feed1Fixture, feed2Fixture],
        };

        const action = feedsSlice.actions.replaceFolders([
            {
                id: '_root_',
                title: 'root',
                feedIds: [feed1Fixture.id],
                subfolderIds: ['mocked-uuid2'],
            },
            {
                id: 'mocked-uuid2',
                title: 'moepFolder2',
                feedIds: [feed2Fixture.id],
                subfolderIds: [],
            },
        ]);

        const newState = feedsSlice.reducer(prevState, action);

        expect(newState.folders).toStrictEqual([
            {
                id: '_root_',
                title: 'root',
                feedIds: [feed1Fixture.id],
                subfolderIds: ['mocked-uuid2'],
            },
            {
                id: 'mocked-uuid2',
                title: 'moepFolder2',
                feedIds: [feed2Fixture.id],
                subfolderIds: [],
            },
        ]);
    });

    it('moves orphaned feeds into root folder (prev. existing folder is missing after import)', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            folders: [
                {
                    id: '_root_',
                    title: 'root',
                    feedIds: [],
                    subfolderIds: ['mocked-uuid'],
                },
                {
                    id: 'mocked-uuid',
                    title: 'moepFolder',
                    subfolderIds: [],
                    feedIds: [feed1Fixture.id, feed2Fixture.id],
                },
            ],
            feeds: [feed1Fixture, feed2Fixture],
        };

        const action = feedsSlice.actions.replaceFolders([
            {
                id: '_root_',
                title: 'root',
                feedIds: [],
                subfolderIds: ['mocked-uuid3'],
            },
            {
                id: 'mocked-uuid3',
                title: 'a new folder',
                subfolderIds: [],
                feedIds: [],
            },
        ]);

        const newState = feedsSlice.reducer(prevState, action);

        expect(newState.folders).toStrictEqual([
            {
                id: '_root_',
                title: 'root',
                feedIds: [feed1Fixture.id, feed2Fixture.id],
                subfolderIds: ['mocked-uuid3'],
            },
            {
                id: 'mocked-uuid3',
                title: 'a new folder',
                subfolderIds: [],
                feedIds: [],
            },
        ]);
    });
});
