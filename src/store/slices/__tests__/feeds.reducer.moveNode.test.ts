import { InsertMode, NodeType } from '../../../model/feeds';
import { RootState } from '../../store';
import feedsSlice from '../feeds';
import {
    feed1Fixture,
    feed2Fixture,
    feed3Fixture,
    folder1Fixture,
    folder2Fixture,
    folder3Fixture,
    folder4Fixture,
} from './feeds.fixtures';

const defaultState = {
    ...feedsSlice.getInitialState(),
    feeds: [feed1Fixture, feed2Fixture, feed3Fixture],
};

type FeedSliceState = RootState['feeds'];

describe('moveNode action', () => {
    it('throws if moved node if a folder and target node is a feed', () => {
        const prevState: FeedSliceState = {
            ...defaultState,
            folders: [
                { ...folder1Fixture, feedIds: [feed3Fixture.id], subfolderIds: [folder2Fixture.id] },
                { ...folder2Fixture, feedIds: [feed1Fixture.id] },
            ],
        };

        expect(() =>
            feedsSlice.reducer(
                prevState,
                feedsSlice.actions.moveNode({
                    movedNode: {
                        nodeId: folder2Fixture.id,
                        nodeType: NodeType.Folder,
                    },
                    targetNodeId: feed1Fixture.id,
                    mode: InsertMode.Into,
                }),
            ),
        ).toThrow("Folder can not be moved because the target folder with id 'http://feedId1.url' does not exist");
    });

    describe('when moving folder nodes (InsertMode.Into)', () => {
        it('does not change anything if target is already the parent', () => {
            const prevState: FeedSliceState = {
                ...defaultState,
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
                    ...defaultState,
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
                    ...defaultState,
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
                ...defaultState,
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
                    ...defaultState,
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
                    ...defaultState,
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
                    ...defaultState,
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
                ...defaultState,
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
                    ...defaultState,
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
                    ...defaultState,
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
                    ...defaultState,
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
                ...defaultState,
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
            ).toThrowError("Feed can not be moved into node with id: 'http://feedId2.url' because it is not a folder.");
        });

        it('adds moved feed to feedIds of target folder', () => {
            const prevState: FeedSliceState = {
                ...defaultState,
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
                ...defaultState,
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
                ...defaultState,
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
        it('throws if target is a folder node', () => {
            const prevState: FeedSliceState = {
                ...defaultState,
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
                        targetNodeId: folder1Fixture.id,
                        mode: InsertMode.Before,
                    }),
                ),
            ).toThrowError("Feed can not be moved before or after node with id: 'folder1' because it is not a feed.");
        });

        it('adds moved feed before target feed', () => {
            const prevState: FeedSliceState = {
                ...defaultState,
                folders: [{ ...folder2Fixture, feedIds: [feed1Fixture.id, feed2Fixture.id, feed3Fixture.id] }],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.moveNode({
                    movedNode: {
                        nodeId: feed1Fixture.id,
                        nodeType: NodeType.Feed,
                    },
                    targetNodeId: feed3Fixture.id,
                    mode: InsertMode.Before,
                }),
            );

            expect(newState.folders[0].feedIds).toStrictEqual([feed2Fixture.id, feed1Fixture.id, feed3Fixture.id]);
        });

        describe('with taget feed having different parent', () => {
            it('adds moved feed to feedIds of new parent (parent of target feed)', () => {
                const prevState: FeedSliceState = {
                    ...defaultState,
                    folders: [
                        { ...folder1Fixture, feedIds: [feed1Fixture.id] },
                        { ...folder2Fixture, feedIds: [feed2Fixture.id] },
                    ],
                };

                const newState = feedsSlice.reducer(
                    prevState,
                    feedsSlice.actions.moveNode({
                        movedNode: {
                            nodeId: feed1Fixture.id,
                            nodeType: NodeType.Feed,
                        },
                        targetNodeId: feed2Fixture.id,
                        mode: InsertMode.Before,
                    }),
                );

                expect(newState.folders[1].feedIds).toContain(feed1Fixture.id);
            });

            it('adds moved feed before target feed', () => {
                const prevState: FeedSliceState = {
                    ...defaultState,
                    folders: [
                        { ...folder1Fixture, feedIds: [feed1Fixture.id] },
                        { ...folder2Fixture, feedIds: [feed2Fixture.id] },
                    ],
                };

                const newState = feedsSlice.reducer(
                    prevState,
                    feedsSlice.actions.moveNode({
                        movedNode: {
                            nodeId: feed1Fixture.id,
                            nodeType: NodeType.Feed,
                        },
                        targetNodeId: feed2Fixture.id,
                        mode: InsertMode.Before,
                    }),
                );

                expect(newState.folders[1].feedIds).toStrictEqual([feed1Fixture.id, feed2Fixture.id]);
            });

            it('removes moved feed from feedIds of old parent)', () => {
                const prevState: FeedSliceState = {
                    ...defaultState,
                    folders: [
                        { ...folder1Fixture, feedIds: [feed1Fixture.id] },
                        { ...folder2Fixture, feedIds: [feed2Fixture.id] },
                    ],
                };

                const newState = feedsSlice.reducer(
                    prevState,
                    feedsSlice.actions.moveNode({
                        movedNode: {
                            nodeId: feed1Fixture.id,
                            nodeType: NodeType.Feed,
                        },
                        targetNodeId: feed2Fixture.id,
                        mode: InsertMode.Before,
                    }),
                );

                expect(newState.folders[0].feedIds).toStrictEqual([]);
            });
        });
    });

    describe('when moving feed nodes (IsertMode.After)', () => {
        it('throws if target is a folder node', () => {
            const prevState: FeedSliceState = {
                ...defaultState,
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
                        targetNodeId: folder1Fixture.id,
                        mode: InsertMode.After,
                    }),
                ),
            ).toThrowError("Feed can not be moved before or after node with id: 'folder1' because it is not a feed.");
        });

        it('adds moved feed after target feed', () => {
            const prevState: FeedSliceState = {
                ...defaultState,
                folders: [{ ...folder1Fixture, feedIds: [feed1Fixture.id, feed2Fixture.id, feed3Fixture.id] }],
            };

            const newState = feedsSlice.reducer(
                prevState,
                feedsSlice.actions.moveNode({
                    movedNode: {
                        nodeId: feed1Fixture.id,
                        nodeType: NodeType.Feed,
                    },
                    targetNodeId: feed3Fixture.id,
                    mode: InsertMode.After,
                }),
            );

            expect(newState.folders[0].feedIds).toStrictEqual([feed2Fixture.id, feed3Fixture.id, feed1Fixture.id]);
        });

        describe('with taget feed having different parent', () => {
            it('adds moved feed to feedIds of new parent (parent of target feed)', () => {
                const prevState: FeedSliceState = {
                    ...defaultState,
                    folders: [
                        { ...folder1Fixture, feedIds: [feed1Fixture.id] },
                        { ...folder2Fixture, feedIds: [feed2Fixture.id] },
                    ],
                };

                const newState = feedsSlice.reducer(
                    prevState,
                    feedsSlice.actions.moveNode({
                        movedNode: {
                            nodeId: feed1Fixture.id,
                            nodeType: NodeType.Feed,
                        },
                        targetNodeId: feed2Fixture.id,
                        mode: InsertMode.After,
                    }),
                );

                expect(newState.folders[1].feedIds).toContain(feed1Fixture.id);
            });

            it('adds moved feed after target feed', () => {
                const prevState: FeedSliceState = {
                    ...defaultState,
                    folders: [
                        { ...folder1Fixture, feedIds: [feed1Fixture.id], subfolderIds: [folder2Fixture.id] },
                        { ...folder2Fixture, feedIds: [feed2Fixture.id, feed3Fixture.id] },
                    ],
                };

                const newState = feedsSlice.reducer(
                    prevState,
                    feedsSlice.actions.moveNode({
                        movedNode: {
                            nodeId: feed1Fixture.id,
                            nodeType: NodeType.Feed,
                        },
                        targetNodeId: feed3Fixture.id,
                        mode: InsertMode.After,
                    }),
                );

                expect(newState.folders[1].feedIds).toStrictEqual([feed2Fixture.id, feed3Fixture.id, feed1Fixture.id]);
            });

            it('removes moved feed from feedIds of old parent)', () => {
                const prevState: FeedSliceState = {
                    ...defaultState,
                    folders: [
                        { ...folder1Fixture, feedIds: [feed1Fixture.id] },
                        { ...folder2Fixture, feedIds: [feed2Fixture.id] },
                    ],
                };

                const newState = feedsSlice.reducer(
                    prevState,
                    feedsSlice.actions.moveNode({
                        movedNode: {
                            nodeId: feed1Fixture.id,
                            nodeType: NodeType.Feed,
                        },
                        targetNodeId: feed2Fixture.id,
                        mode: InsertMode.Before,
                    }),
                );

                expect(newState.folders[0].feedIds).toStrictEqual([]);
            });
        });
    });
});
