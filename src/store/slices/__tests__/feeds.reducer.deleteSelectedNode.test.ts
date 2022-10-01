import { NodeType } from '../../../model/feeds';
import feedsSlice, { FeedSliceState } from '../feeds';
import {
    feed1Fixture,
    feed2Fixture,
    feed3Fixture,
    folder1Fixture,
    folder2Fixture,
    folder3Fixture,
    folder4Fixture,
} from './feeds.fixtures';

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
