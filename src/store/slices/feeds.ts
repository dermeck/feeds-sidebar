import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
    Feed,
    FeedNode,
    Folder,
    FolderNode,
    InsertMode,
    NodeMeta,
    NodeType,
    rootFolderId,
    TreeNode,
} from '../../model/feeds';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import { moveOrInsertElementBefore, moveOrInsertElementAfter } from '../../utils/arrayUtils';
import { randomUUID } from '../../utils/uuid';
import { extensionStateLoaded } from '../actions';

type FeedSliceState = {
    folders: ReadonlyArray<Folder>;
    feeds: ReadonlyArray<Feed>;
    selectedNode: NodeMeta | undefined;
};

export const fetchAllFeedsCommand = createAction('feeds/fetchAllFeedsCommand');
export const fetchFeedsCommand = createAction<ReadonlyArray<string>>('feeds/fetchFeedsCommand');

const sampleDataFolders: ReadonlyArray<Folder> = [
    {
        id: rootFolderId,
        title: 'root',
        feedIds: [
            'https://ourworldindata.org/atom.xml',
            'https://stackoverflow.blog/feed/',
            'https://www.quarks.de/feed/',
        ],
        subfolderIds: ['_news_', '_abc_'],
    },
    {
        id: '_news_',
        title: 'News',
        feedIds: ['https://www.tagesschau.de/xml/rss2/'],
        subfolderIds: ['_yt_'],
    },
    {
        id: '_yt_',
        title: 'YouTube',
        feedIds: ['https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA'],
        subfolderIds: ['_yt-sub_'],
    },
    {
        id: '_yt-sub_',
        title: 'YT-SUB',
        feedIds: [],
        subfolderIds: [],
    },
    {
        id: '_abc_',
        title: 'ABC',
        feedIds: ['https://www.dragonball-multiverse.com/flux.rss.php?lang=en'],
        subfolderIds: [],
    },
];

const sampleDataFeeds: ReadonlyArray<Feed> = [
    {
        // sample Atom Feed
        id: 'https://ourworldindata.org/atom.xml',
        items: [],
    },

    {
        // sample RSS 1.0 / RDF Feed
        // https://www.w3schools.com/xml/xml_rdf.asp
        id: 'https://www.dragonball-multiverse.com/flux.rss.php?lang=en',
        items: [],
    },

    {
        // sample RSS 2.0 Feed
        id: 'https://www.tagesschau.de/xml/rss2/',
        items: [],
    },
    {
        // sample Youtube Feed (Atom)
        id: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA',
        items: [],
    },
    {
        id: 'https://stackoverflow.blog/feed/',
        items: [],
    },
    {
        id: 'https://www.quarks.de/feed/',
        items: [],
    },
];

const initialState: FeedSliceState = {
    folders:
        process.env.NODE_ENV === 'development'
            ? sampleDataFolders
            : [
                  {
                      id: rootFolderId, // top level node
                      title: 'root',
                      feedIds: [],
                      subfolderIds: [],
                  },
              ],
    feeds: process.env.NODE_ENV === 'development' ? sampleDataFeeds : [],
    selectedNode: undefined,
};

export const selectFeeds = (state: FeedSliceState) => state.feeds;
export const selectFolders = (state: FeedSliceState) => state.folders;

export const selectTotalUnreadItems = (state: FeedSliceState) =>
    state.feeds
        .map((feed) => feed.items.filter((i) => !i.isRead).length)
        .reduce((totalUnreadReadItems, unReadItemsNexFeed) => totalUnreadReadItems + unReadItemsNexFeed, 0);

/* factory function for creating memoized selector for each component instance (use nodeId from props) */
export const makeSelectTreeNode = () =>
    createSelector(
        selectFeeds,
        selectFolders,
        (_: FeedSliceState, nodeId: string) => nodeId,
        (feeds, folders, nodeId): TreeNode | undefined => {
            const folder = folders.find((f) => f.id === nodeId);

            if (folder !== undefined) {
                return {
                    nodeType: NodeType.Folder,
                    data: folder,
                };
            }

            const feed = feeds.find((f) => f.id === nodeId);

            if (feed !== undefined) {
                return {
                    nodeType: NodeType.Feed,
                    data: feed,
                };
            }

            // TODO something triggers selectTreeNode with ids that were just deleted
            // occurs if folders with subfolders are deleted
            // fix this workaround and throw error again
            // throw new Error(`Node with id: "${nodeId}" not found.`);

            return undefined;
        },
    );

const folderById = (folders: FeedSliceState['folders'], id: string) => {
    const folder = folders.find((x) => x.id === id);

    if (folder === undefined) {
        throw new Error(`Folder with id: "${id}" not found.`);
    }

    return folder;
};

const feedById = (feeds: FeedSliceState['feeds'], id: string) => {
    const feed = feeds.find((x) => x.id === id);

    if (feed === undefined) {
        throw new Error(`Feed with id: "${id}" not found.`);
    }

    return feed;
};

const selectChildNodes = (
    feeds: FeedSliceState['feeds'],
    folders: FeedSliceState['folders'],
    parentId: string,
): ReadonlyArray<TreeNode> => {
    const parentFolder = folderById(folders, parentId);

    const folderNodes: ReadonlyArray<FolderNode> = parentFolder.subfolderIds.map((subFolderId) => ({
        nodeType: NodeType.Folder,
        data: folderById(folders, subFolderId),
    }));

    const feedNodes: ReadonlyArray<FeedNode> = parentFolder.feedIds.map((feedId) => ({
        nodeType: NodeType.Feed,
        data: feedById(feeds, feedId),
    }));

    return [...folderNodes, ...feedNodes];
};

const selectDescendentNodeIds = (
    feeds: FeedSliceState['feeds'],
    folders: FeedSliceState['folders'],
    parentId: string,
): ReadonlyArray<string> => {
    if (folders.find((x) => x.id === parentId) === undefined) {
        return [];
    }

    const parentFolder = folderById(folders, parentId);

    return [
        ...parentFolder.subfolderIds,
        ...parentFolder.feedIds,
        ...parentFolder.subfolderIds.flatMap((sid) => selectDescendentNodeIds(feeds, folders, sid)),
    ];
};

/* factory function for creating memoized selector (parentId is a parameter) */
export const makeselectDescendentNodeIds = () =>
    createSelector(
        selectFeeds,
        selectFolders,
        (_: FeedSliceState, parentId: string | undefined) => parentId,
        (feeds, folders, parentId): ReadonlyArray<string> => {
            if (parentId === undefined) {
                return [];
            }

            if (folders.find((x) => x.id === parentId) === undefined) {
                return [];
            }

            const parentFolder = folderById(folders, parentId);

            return [
                ...parentFolder.subfolderIds,
                ...parentFolder.feedIds,
                ...parentFolder.subfolderIds.flatMap((sid) => selectDescendentNodeIds(feeds, folders, sid)),
            ];
        },
    );

export const selectHasVisibleChildren = (state: FeedSliceState, nodeMeta: NodeMeta): boolean => {
    const { nodeId, nodeType } = nodeMeta;

    switch (nodeType) {
        case NodeType.FeedItem:
            return false;

        case NodeType.Feed:
            return hasFeedUnreadItem(state, nodeId);

        case NodeType.Folder: {
            return hasFolderChildren(state, nodeId);
        }

        default:
            throw new UnreachableCaseError(nodeType);
    }
};

const hasFeedUnreadItem = (state: FeedSliceState, feedId: string): boolean => {
    return !!state.feeds.find((f) => f.id === feedId)?.items.find((item) => !item.isRead);
};

const hasFolderChildren = (state: FeedSliceState, folderId: string): boolean => {
    const folder = state.folders.find((f) => f.id === folderId);
    if (!folder) {
        return false;
    }

    return folder.subfolderIds.length > 0 || folder.feedIds.length > 0;
};

export const selectTopLevelNodes = createSelector(selectFeeds, selectFolders, (feeds, folders) =>
    selectChildNodes(feeds, folders, rootFolderId),
);

const feedsSlice = createSlice({
    name: 'feeds',
    initialState,
    reducers: {
        replaceFolders(state, action: PayloadAction<ReadonlyArray<Folder>>) {
            // ensure that every feed has a parent
            const feedsWithParent = action.payload.flatMap((f) => f.feedIds);
            const orphanedFeedIds = state.feeds.filter((f) => !feedsWithParent.includes(f.id)).map((f) => f.id);

            return {
                ...state,
                folders: action.payload.map((f) =>
                    f.id === rootFolderId
                        ? {
                              ...f,
                              feedIds: [...f.feedIds, ...orphanedFeedIds],
                          }
                        : f,
                ),
            };
        },
        addFolder(state, action: PayloadAction<string>) {
            const newFolderId = randomUUID();

            const folders = state.folders.map((f) =>
                f.id === rootFolderId
                    ? {
                          ...f,
                          subfolderIds: [newFolderId, ...f.subfolderIds],
                      }
                    : f,
            );

            folders.push({
                id: newFolderId,
                title: action.payload,
                feedIds: [],
                subfolderIds: [],
            });

            state.folders = folders;
        },
        moveNode(state, action: PayloadAction<{ movedNode: NodeMeta; targetNodeId: string; mode: InsertMode }>) {
            const { movedNode, targetNodeId, mode } = action.payload;

            switch (movedNode.nodeType) {
                case NodeType.FeedItem:
                    throw new Error('Cannot move feed item.');

                case NodeType.Feed:
                    if (mode === InsertMode.Into && !state.folders.find((f) => f.id === targetNodeId)) {
                        throw new Error(
                            `Feed can not be moved into node with id: '${targetNodeId}' because it is not a folder.`,
                        );
                    }

                    if (mode !== InsertMode.Into && !state.feeds.find((f) => f.id === targetNodeId)) {
                        throw new Error(
                            `Feed can not be moved before or after node with id: '${targetNodeId}' because it is not a feed.`,
                        );
                    }

                    return {
                        ...state,
                        folders: moveFeedNode(state.folders, targetNodeId, movedNode.nodeId, mode),
                    };

                case NodeType.Folder:
                    if (!state.folders.find((f) => f.id === targetNodeId)) {
                        throw new Error(
                            `Folder can not be moved because the target folder with id '${targetNodeId}' does not exist`,
                        );
                    }

                    return {
                        ...state,
                        folders: moveFolderNode(state.folders, targetNodeId, movedNode.nodeId, mode),
                    };

                default:
                    throw new UnreachableCaseError(movedNode.nodeType);
            }
        },
        select(state, action: PayloadAction<NodeMeta>) {
            state.selectedNode = action.payload;
        },
        markItemAsRead(state, action: PayloadAction<{ feedId: string; itemId: string }>) {
            return {
                ...state,
                feeds: [...markItemAsRead(state.feeds, action.payload.feedId, action.payload.itemId)],
            };
        },
        markSelectedNodeAsRead(state) {
            if (state.selectedNode === undefined) {
                throw new Error('Cannot mark node as read because selection is undefined.');
            }

            switch (state.selectedNode.nodeType) {
                case NodeType.FeedItem:
                    // always handled via markItemAsRead action
                    return state;

                case NodeType.Feed:
                    return {
                        ...state,
                        feeds: [...markFeedsAsRead(state.feeds, [state.selectedNode.nodeId])],
                    };

                case NodeType.Folder:
                    return {
                        ...state,
                        feeds: [
                            ...markFeedsAsRead(
                                state.feeds,
                                feedIdsByFolderId(state.folders, state.selectedNode.nodeId),
                            ),
                        ],
                    };

                default:
                    throw new UnreachableCaseError(state.selectedNode.nodeType);
            }
        },
        markAllAsRead(state) {
            return {
                ...state,
                feeds: state.feeds.map((feed) => markAllItemsOfFeedRead(feed)),
            };
        },
        updateFeeds(state, action: PayloadAction<ReadonlyArray<Feed>>) {
            const newFeeds = action.payload.filter((updatedFeed) => !state.feeds.some((x) => x.id === updatedFeed.id));

            const folders = state.folders.map((folder) =>
                folder.id === rootFolderId
                    ? {
                          ...folder,
                          feedIds: [...folder.feedIds, ...newFeeds.map((feed) => feed.id)],
                      }
                    : folder,
            );

            return {
                ...state,
                folders: folders,
                feeds: [...updateFeeds(state.feeds, action.payload), ...newFeeds],
            };
        },

        deleteSelectedNode(state) {
            if (state.selectedNode === undefined) {
                throw new Error('Cannot delete node because selection is undefined.');
            }

            switch (state.selectedNode.nodeType) {
                case NodeType.FeedItem:
                    throw new Error('Cannot delete feed item.');

                case NodeType.Feed:
                    {
                        // index of the feed that gets deleted
                        const selectedFeedId = state.selectedNode.nodeId;
                        // const selectedIndex = state.feeds.findIndex((f) => f.id === selectedFeedId); // TODO

                        const newState = deleteFeed(state, selectedFeedId);
                        return {
                            ...newState,
                            selectedNode: undefined,
                        };

                        // if possible select the the next feed
                        // TODO consider changed selection
                        /*state.selectedNodeId =
                    state.feeds.length === 0
                    ? ''
                    : state.feeds.length > selectedIndex
                                ? state.feeds[selectedIndex].id
                                : state.feeds[selectedIndex - 1].id;
                                */
                    }
                    break;

                case NodeType.Folder:
                    {
                        const selectedFolderId = state.selectedNode.nodeId;

                        // delete relation in parent
                        state.folders = state.folders.map((folder) =>
                            folder.subfolderIds.some((subfolderId) => subfolderId === selectedFolderId)
                                ? {
                                      ...folder,
                                      subfolderIds: folder.subfolderIds.filter(
                                          (subfolderId) => subfolderId !== selectedFolderId,
                                      ),
                                  }
                                : folder,
                        );

                        // delete feeds in selected folder and its subfolders (all levels)
                        const feedIdsToDelete = feedIdsByFolderId(state.folders, selectedFolderId);
                        state.feeds = state.feeds.filter((feed) => !feedIdsToDelete.some((id) => feed.id === id));

                        // delete folder and subfolders (all levels)
                        const subfolderIdsToDelete = subfolderIdsByFolderId(state.folders, selectedFolderId);
                        state.folders = state.folders.filter(
                            (folder) => ![selectedFolderId, ...subfolderIdsToDelete].some((id) => folder.id === id),
                        );

                        // TODO consider changed selection
                        state.selectedNode = undefined;
                    }
                    break;

                default:
                    throw new UnreachableCaseError(state.selectedNode.nodeType);
            }
        },
        deleteFeed(state, action: PayloadAction<{ url: string }>) {
            return deleteFeed(state, action.payload.url);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(extensionStateLoaded, (_, action) => {
            return {
                ...action.payload.feeds,
            };
        });
    },
});

const feedIdsByFolderId = (folders: FeedSliceState['folders'], folderId: string): ReadonlyArray<string> => {
    const folder = folderById(folders, folderId);

    return [
        ...folder.feedIds,
        ...folder.subfolderIds.flatMap((subfolder) => [...feedIdsByFolderId(folders, subfolder)]),
    ];
};

const subfolderIdsByFolderId = (folders: FeedSliceState['folders'], folderId: string): ReadonlyArray<string> => {
    const folder = folderById(folders, folderId);

    return [
        ...folder.subfolderIds,
        ...folder.subfolderIds.flatMap((subfolder) => [...subfolderIdsByFolderId(folders, subfolder)]),
    ];
};

const moveFolderNode = (
    folders: ReadonlyArray<Folder>,
    targetNodeId: string,
    movedNodeId: string,
    mode: InsertMode,
) => {
    switch (mode) {
        case InsertMode.Into:
            return changeParentFolderForFolder(folders, targetNodeId, movedNodeId);

        case InsertMode.Before: {
            const targetParent = folders.find((x) => x.subfolderIds.includes(targetNodeId));

            if (targetParent === undefined) {
                throw new Error('Cannot find parent of drop target.');
            }

            const foldersWithCorrectParents =
                targetParent.subfolderIds.includes(targetNodeId) && targetParent.subfolderIds.includes(movedNodeId)
                    ? folders
                    : changeParentFolderForFolder(folders, targetParent.id, movedNodeId);

            return foldersWithCorrectParents.map((f) => {
                if (f.subfolderIds.includes(targetNodeId) && f.subfolderIds.includes(movedNodeId)) {
                    return {
                        ...f,
                        subfolderIds: moveOrInsertElementBefore(f.subfolderIds, targetNodeId, movedNodeId),
                    };
                } else {
                    return f;
                }
            });
        }

        case InsertMode.After: {
            const targetParent = folders.find((x) => x.subfolderIds.includes(targetNodeId));

            if (targetParent === undefined) {
                throw new Error('Cannot find parent of drop target.');
            }

            const foldersWithCorrectParents =
                targetParent.subfolderIds.includes(targetNodeId) && targetParent.subfolderIds.includes(movedNodeId)
                    ? folders
                    : changeParentFolderForFolder(folders, targetParent.id, movedNodeId);

            return foldersWithCorrectParents.map((f) => {
                if (f.subfolderIds.includes(targetNodeId) && f.subfolderIds.includes(movedNodeId)) {
                    return {
                        ...f,
                        subfolderIds: moveOrInsertElementAfter(f.subfolderIds, targetNodeId, movedNodeId),
                    };
                } else {
                    return f;
                }
            });
        }

        default:
            throw new UnreachableCaseError(mode);
    }
};

const changeParentFolderForFolder = (
    folders: readonly Folder[],
    targetNodeId: string,
    movedNodeId: string,
): ReadonlyArray<Folder> =>
    folders.map((f) => {
        if (f.id === targetNodeId) {
            const newParent: Folder = {
                ...f,
                subfolderIds: [...new Set([...f.subfolderIds, movedNodeId])], // prevent duplicates
            };

            return newParent;
        } else {
            if (f.subfolderIds.some((id) => id === movedNodeId)) {
                const oldParent: Folder = {
                    ...f,
                    subfolderIds: f.subfolderIds.filter((id) => id !== movedNodeId),
                };

                return oldParent;
            }
        }

        return f;
    });

const moveFeedNode = (folders: ReadonlyArray<Folder>, targetNodeId: string, movedNodeId: string, mode: InsertMode) => {
    switch (mode) {
        case InsertMode.Into:
            return changeParentFolderForFeed(folders, targetNodeId, movedNodeId);

        case InsertMode.Before:
            return moveFeed(folders, targetNodeId, movedNodeId, moveOrInsertElementBefore);

        case InsertMode.After:
            return moveFeed(folders, targetNodeId, movedNodeId, moveOrInsertElementAfter);

        default:
            throw new UnreachableCaseError(mode);
    }
};

const changeParentFolderForFeed = (folders: readonly Folder[], targetNodeId: string, movedNodeId: string) =>
    folders.map((f) => {
        if (f.id === targetNodeId) {
            const newParent: Folder = {
                ...f,
                feedIds: [...new Set([...f.feedIds, movedNodeId])], // prevent duplicates
            };

            return newParent;
        } else {
            if (f.feedIds.some((id) => id === movedNodeId)) {
                const oldParent: Folder = {
                    ...f,
                    feedIds: f.feedIds.filter((id) => id !== movedNodeId),
                };

                return oldParent;
            }
        }

        return f;
    });

const moveFeed = (
    folders: readonly Folder[],
    targetNodeId: string,
    movedNodeId: string,
    moveFn: (arr: readonly string[], target: string, moved: string) => readonly string[],
) =>
    folders.map((f) => {
        if (f.feedIds.includes(targetNodeId)) {
            const newParent: Folder = {
                ...f,
                feedIds: moveFn(f.feedIds, targetNodeId, movedNodeId),
            };

            return newParent;
        } else {
            if (f.feedIds.some((id) => id === movedNodeId)) {
                const oldParent: Folder = {
                    ...f,
                    feedIds: f.feedIds.filter((id) => id !== movedNodeId),
                };

                return oldParent;
            }
        }

        return f;
    });

const updateFeeds = (feeds: ReadonlyArray<Feed>, updatedFeeds: ReadonlyArray<Feed>): ReadonlyArray<Feed> => {
    updatedFeeds = feeds.map((feed) => {
        const updatedFeed = updatedFeeds.find((x) => x.id === feed.id);
        if (updatedFeed === undefined) {
            return feed;
        }

        return {
            ...mergeFeed(feed, updatedFeed),
        };
    });

    return updatedFeeds;
};

const deleteFeed = (prevState: FeedSliceState, feedUrl: string) => {
    // delete relation in parent
    const folders = prevState.folders.map((folder) =>
        folder.feedIds.some((feedId) => feedId === feedUrl)
            ? {
                  ...folder,
                  feedIds: folder.feedIds.filter((feedId) => feedId !== feedUrl),
              }
            : folder,
    );

    // delete feed
    const feeds = prevState.feeds.filter((f) => f.id !== feedUrl);
    return {
        ...prevState,
        folders: folders,
        feeds: feeds,
    };
};

// keep old items, update existing items, add new items
const mergeFeed = (previous: Feed, updatedFeed: Feed): Feed => {
    const newItems = updatedFeed.items.filter((item) => {
        if (previous.items.some((x) => x.id === item.id)) {
            return;
        } else {
            return item;
        }
    });

    return {
        id: previous.id,
        title: previous.title !== undefined ? previous.title : updatedFeed.title,
        link: updatedFeed.link,
        items: [...previous.items, ...newItems],
        lastFetched: updatedFeed.lastFetched ?? previous.lastFetched,
    };
};

const markItemAsRead = (feeds: ReadonlyArray<Feed>, feedId: string, itemId: string) =>
    feeds.map((feed) => {
        if (feed.id !== feedId) {
            return feed;
        }

        return {
            ...feed,
            items: feed.items.map((item) => (item.id !== itemId ? item : { ...item, isRead: true })),
        };
    });

const markFeedsAsRead = (feeds: ReadonlyArray<Feed>, readFeedIds: ReadonlyArray<string>): ReadonlyArray<Feed> =>
    feeds.map((feed) => {
        if (!readFeedIds.includes(feed.id)) {
            return feed;
        }

        return markAllItemsOfFeedRead(feed);
    });

const markAllItemsOfFeedRead = (feed: Feed): Feed => {
    return {
        ...feed,
        items: feed.items.map((item) => ({ ...item, isRead: true })),
    };
};

export default feedsSlice;
