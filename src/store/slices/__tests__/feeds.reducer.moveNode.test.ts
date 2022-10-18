import { InsertMode, NodeType } from '../../../model/feeds';
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

describe('moveNode action', () => {
    // TODO maybe throw since this should never happen
    it('does not change anything if moved node if a folder and target node is a feed', () => {
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
                    nodeId: folder2Fixture.id,
                    nodeType: NodeType.Folder,
                },
                targetNodeId: feed1Fixture.id,
                mode: InsertMode.Into,
            }),
        );

        expect(newState.folders).toStrictEqual([
            { ...folder1Fixture, feedIds: [feed3Fixture.id], subfolderIds: [folder2Fixture.id] },
            { ...folder2Fixture, feedIds: [feed1Fixture.id] },
        ]);
    });

    describe('when moving folder nodes (InsertMode.Into)', () => {
        it('does not change anything if target is already the parent', () => {
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
                    targetNodeId: folder2Fixture.id,
                    mode: InsertMode.Into,
                }),
            );

            expect(newState.folders).toStrictEqual([
                { ...folder1Fixture, subfolderIds: [folder2Fixture.id] },
                { ...folder2Fixture, subfolderIds: [folder3Fixture.id] },
                { ...folder3Fixture },
            ]);
        });

        describe('with target folder having different parent', () => {
            it('adds moved folder to subfolderIds of target folder', () => {
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
                        targetNodeId: folder1Fixture.id,
                        mode: InsertMode.Into,
                    }),
                );

                expect(newState.folders[0].subfolderIds).toContain(folder3Fixture.id);
            });

            it('removes moved folder from subfolderIds of previous parent folder', () => {
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
                        targetNodeId: folder1Fixture.id,
                        mode: InsertMode.Into,
                    }),
                );

                expect(newState.folders[1].subfolderIds).not.toContain(folder3Fixture.id);
            });
        });
    });

    describe('when moving folder (InsertMode.Before)', () => {
        it('adds moved folder before target folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, subfolderIds: [folder2Fixture.id, folder3Fixture.id] },
                    { ...folder2Fixture, subfolderIds: [] },
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
                    targetNodeId: folder2Fixture.id,
                    mode: InsertMode.Before,
                }),
            );

            expect(newState.folders).toStrictEqual([
                { ...folder1Fixture, subfolderIds: [folder3Fixture.id, folder2Fixture.id] },
                { ...folder2Fixture, subfolderIds: [] },
                { ...folder3Fixture },
            ]);
        });

        describe('with target folder having different parent', () => {
            it('adds moved folder to subfolderIds of target folders parent', () => {
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
                        targetNodeId: folder2Fixture.id,
                        mode: InsertMode.Before,
                    }),
                );

                expect(newState.folders[0].subfolderIds.includes(folder3Fixture.id)).toBe(true);
            });

            it('removes moved folder from subfolderIds of previous parent folder', () => {
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
                        targetNodeId: folder2Fixture.id,
                        mode: InsertMode.Before,
                    }),
                );

                expect(newState.folders[1].subfolderIds).toEqual([]);
            });

            it('adds moved folder before target folder', () => {
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
                        targetNodeId: folder2Fixture.id,
                        mode: InsertMode.Before,
                    }),
                );

                expect(newState.folders[0].subfolderIds).toEqual([folder3Fixture.id, folder2Fixture.id]);
            });
        });
    });

    describe('when moving folder (InsertMode.After)', () => {
        it('adds moved folder after target folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, subfolderIds: [folder2Fixture.id, folder3Fixture.id] },
                    { ...folder2Fixture, subfolderIds: [] },
                    { ...folder3Fixture },
                ],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.moveNode({
                    movedNode: {
                        nodeId: folder2Fixture.id,
                        nodeType: NodeType.Folder,
                    },
                    targetNodeId: folder3Fixture.id,
                    mode: InsertMode.After,
                }),
            );

            expect(newState.folders).toStrictEqual([
                { ...folder1Fixture, subfolderIds: [folder3Fixture.id, folder2Fixture.id] },
                { ...folder2Fixture, subfolderIds: [] },
                { ...folder3Fixture },
            ]);
        });

        describe('with target folder having different parent', () => {
            it('adds moved folder to subfolderIds of target folders parent', () => {
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
                        targetNodeId: folder2Fixture.id,
                        mode: InsertMode.After,
                    }),
                );

                expect(newState.folders[0].subfolderIds.includes(folder3Fixture.id)).toBe(true);
            });

            it('removes moved folder from subfolderIds of previous parent folder', () => {
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
                        targetNodeId: folder2Fixture.id,
                        mode: InsertMode.After,
                    }),
                );

                expect(newState.folders[1].subfolderIds).toEqual([]);
            });

            it('adds moved folder after target folder', () => {
                const prevState: FeedSliceState = {
                    ...feedsSlice.getInitialState(),
                    folders: [
                        { ...folder1Fixture, subfolderIds: [folder2Fixture.id, folder4Fixture.id] },
                        { ...folder2Fixture, subfolderIds: [folder3Fixture.id] },
                        { ...folder3Fixture },
                        { ...folder4Fixture },
                    ],
                };

                const newState = feedsSlice.reducer(
                    prevState,
                    feedsSlice.actions.moveNode({
                        movedNode: {
                            nodeId: folder3Fixture.id,
                            nodeType: NodeType.Folder,
                        },
                        targetNodeId: folder2Fixture.id,
                        mode: InsertMode.After,
                    }),
                );

                expect(newState.folders[0].subfolderIds).toEqual([
                    folder2Fixture.id,
                    folder3Fixture.id,
                    folder4Fixture.id,
                ]);
            });
        });
    });

    describe('when moving feed nodes (InsertMode.Into)', () => {
        it('throws an error if the target node is not a folder', () => {
            const prevState: FeedSliceState = {
                ...feedsSlice.getInitialState(),
                folders: [
                    { ...folder1Fixture, feedIds: [], subfolderIds: [folder2Fixture.id] },
                    { ...folder2Fixture, feedIds: [feed1Fixture.id, feed2Fixture.id] },
                ],
            };

            expect(() =>
                feedsSlice.reducer(
                    prevState,
                    feedsSlice.actions.moveNode({
                        movedNode: {
                            nodeId: feed1Fixture.id,
                            nodeType: NodeType.Feed,
                        },
                        targetNodeId: feed2Fixture.id,
                        mode: InsertMode.Into,
                    }),
                ),
            ).toThrowError('Feed can not be moved into node with id: feedId2 because it is not a folder.');
        });

        it('adds moved feed to feedIds of target folder', () => {
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
                    targetNodeId: folder1Fixture.id,
                    mode: InsertMode.Into,
                }),
            );

            expect(newState.folders[0].feedIds).toStrictEqual([feed3Fixture.id, feed1Fixture.id]);
        });

        it('removes moved feed from feedIds of previous parent folder', () => {
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
                    targetNodeId: folder1Fixture.id,
                    mode: InsertMode.Into,
                }),
            );

            expect(newState.folders[1].feedIds).not.toContain(feed1Fixture.id);
            expect(newState.folders[1].feedIds).toStrictEqual([feed2Fixture.id]);
        });

        it('does not change anything if target is already the parent', () => {
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
                    targetNodeId: folder2Fixture.id,
                    mode: InsertMode.Into,
                }),
            );

            expect(newState.folders[1].feedIds).toStrictEqual([feed1Fixture.id, feed2Fixture.id]);
        });
    });

    describe('when moving feed nodes (IsertMode.Before)', () => {
        // TODO maybe throw instead
        it.todo('does not change anything if target is a folder node');

        it.todo('adds moved feed before target feed');

        describe('with taget feed having different parent', () => {
            it.todo('adds moved feed to feedIds of new parent (parent of target feed)');
            it.todo('adds moved feed before target feed');
            it.todo('removes moved feed from feedIds of old parent)');
        });
    });

    describe('when moving feed nodes (IsertMode.After)', () => {
        // TODO maybe throw instead
        it.todo('does not change anything if target is a folder node');

        it.todo('adds moved feed after target feed');

        describe('with taget feed having different parent', () => {
            it.todo('adds moved feed to feedIds of new parent (parent of target feed)');
            it.todo('adds moved feed after target feed');
            it.todo('removes moved feed from feedIds of old parent)');
        });
    });
});
