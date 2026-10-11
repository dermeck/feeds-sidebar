import { InsertMode, NodeMeta, NodeType } from '../../../model/feeds';
import { folder1Fixture, folder2Fixture, folder3Fixture } from '../../../store/slices/__tests__/feeds.fixtures';
import { canDropNode, insertModeByDropPosition, TreeDropPosition } from './folderTreeDrop';

const folders = [
    { ...folder1Fixture, subfolderIds: [folder2Fixture.id] },
    { ...folder2Fixture, subfolderIds: [folder3Fixture.id] },
    { ...folder3Fixture },
];

const folder = (id: string): NodeMeta => ({ nodeId: id, nodeType: NodeType.Folder });
const feed = (id: string): NodeMeta => ({ nodeId: id, nodeType: NodeType.Feed });

const positions: TreeDropPosition[] = ['before', 'after', 'on'];

describe('canDropNode', () => {
    it('rejects dropping a node on itself', () => {
        positions.forEach((position) => {
            expect(canDropNode(folder(folder1Fixture.id), folder(folder1Fixture.id), position, folders)).toBe(false);
        });
    });

    it('rejects dropping a folder on any of its descendants', () => {
        positions.forEach((position) => {
            expect(canDropNode(folder(folder1Fixture.id), folder(folder3Fixture.id), position, folders)).toBe(false);
        });
    });

    it('rejects dropping a folder on a feed inside its own subtree', () => {
        const feedInSubtreeId = 'feed-in-subtree';
        const foldersWithFeed = [
            { ...folder1Fixture, subfolderIds: [folder2Fixture.id] },
            { ...folder2Fixture, subfolderIds: [folder3Fixture.id], feedIds: [feedInSubtreeId] },
            { ...folder3Fixture },
        ];

        positions.forEach((position) => {
            expect(canDropNode(folder(folder1Fixture.id), feed(feedInSubtreeId), position, foldersWithFeed)).toBe(
                false,
            );
        });
    });

    it('only allows a feed to be reordered relative to another feed', () => {
        expect(canDropNode(feed('feed1'), feed('feed2'), 'before', folders)).toBe(true);
        expect(canDropNode(feed('feed1'), feed('feed2'), 'after', folders)).toBe(true);
        expect(canDropNode(feed('feed1'), feed('feed2'), 'on', folders)).toBe(false);
    });

    it('rejects dropping a folder on a feed', () => {
        positions.forEach((position) => {
            expect(canDropNode(folder(folder1Fixture.id), feed('feed1'), position, folders)).toBe(false);
        });
    });

    it('only allows a feed into a folder', () => {
        expect(canDropNode(feed('feed1'), folder(folder1Fixture.id), 'on', folders)).toBe(true);
        expect(canDropNode(feed('feed1'), folder(folder1Fixture.id), 'before', folders)).toBe(false);
        expect(canDropNode(feed('feed1'), folder(folder1Fixture.id), 'after', folders)).toBe(false);
    });

    it('allows a folder before, after or into another folder', () => {
        positions.forEach((position) => {
            expect(canDropNode(folder(folder2Fixture.id), folder(folder1Fixture.id), position, folders)).toBe(true);
        });
    });
});

describe('insertModeByDropPosition', () => {
    it('maps the drop position to the insert mode', () => {
        expect(insertModeByDropPosition('before')).toBe(InsertMode.Before);
        expect(insertModeByDropPosition('after')).toBe(InsertMode.After);
        expect(insertModeByDropPosition('on')).toBe(InsertMode.Into);
    });
});
