import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { Feed, FeedNode, Folder, FolderNode, NodeType, TreeNode } from '../../model/feeds';
import { extensionStateLoaded } from '../actions';
import { RootState } from '../store';

export type FeedSliceState = {
    folders: ReadonlyArray<Folder>;
    feeds: ReadonlyArray<Feed>;
    selectedNodeId: string;
};

export const fetchAllFeedsCommand = createAction('feeds/fetchAllFeedsCommand');
export const fetchFeedsCommand = createAction<ReadonlyArray<string>>('feeds/fetchFeedsCommand');

const rootFolderId = '_root_';

const sampleDataFolders: ReadonlyArray<Folder> = [
    {
        id: rootFolderId,
        title: 'root',
        feedIds: [
            'https://ourworldindata.org/atom.xml',
            'https://stackoverflow.blog/feed/',
            'https://www.quarks.de/feed/',
        ],
        subfolders: ['_news_', '_abc_'],
    },
    {
        id: '_news_',
        title: 'News',
        feedIds: ['https://www.tagesschau.de/xml/rss2/'],
        subfolders: ['_yt_'],
    },
    {
        id: '_yt_',
        title: 'YouTube',
        feedIds: ['https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA'],
        subfolders: ['_yt-sub_'],
    },
    {
        id: '_yt-sub_',
        title: 'YT-SUB',
        feedIds: [],
        subfolders: [],
    },
    {
        id: '_abc_',
        title: 'ABC',
        feedIds: ['https://www.dragonball-multiverse.com/flux.rss.php?lang=en'],
        subfolders: [],
    },
];

const sampleDataFeeds: ReadonlyArray<Feed> = [
    {
        // sample Atom Feed
        id: 'https://ourworldindata.org/atom.xml',
        url: 'https://ourworldindata.org/atom.xml',
        items: [],
    },

    {
        // sample RSS 1.0 / RDF Feed
        // https://www.w3schools.com/xml/xml_rdf.asp
        id: 'https://www.dragonball-multiverse.com/flux.rss.php?lang=en',
        url: 'https://www.dragonball-multiverse.com/flux.rss.php?lang=en',
        items: [],
    },

    {
        // sample RSS 2.0 Feed
        id: 'https://www.tagesschau.de/xml/rss2/',
        url: 'https://www.tagesschau.de/xml/rss2/',
        items: [],
    },
    {
        // sample Youtube Feed (Atom)
        id: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA',
        url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA',
        items: [],
    },
    {
        id: 'https://stackoverflow.blog/feed/',
        url: 'https://stackoverflow.blog/feed/',
        items: [],
    },
    {
        id: 'https://www.quarks.de/feed/',
        url: 'https://www.quarks.de/feed/',
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
                      subfolders: [],
                  },
              ],
    feeds: process.env.NODE_ENV === 'development' ? sampleDataFeeds : [],
    selectedNodeId: '',
};

export const selectTotalUnreadItems = (state: FeedSliceState) =>
    state.feeds
        .map((feed) => feed.items.filter((i) => !i.isRead).length)
        .reduce((totalUnreadReadItems, unReadItemsNexFeed) => totalUnreadReadItems + unReadItemsNexFeed, 0);

export const selectFeeds = (state: RootState) => state.feeds.feeds;

export const selectTreeNode = (state: FeedSliceState, nodeId: string): FolderNode | FeedNode | undefined => {
    const folder = state.folders.find((f) => f.id === nodeId);

    if (folder !== undefined) {
        return {
            nodeType: NodeType.Folder,
            data: folder,
        };
    }

    const feed = state.feeds.find((f) => f.id === nodeId);

    if (feed !== undefined) {
        return {
            nodeType: NodeType.Feed,
            data: feed,
        };
    }

    // TODO something triggers selectTreeNode with ids that were just deleted
    // occurs if folders with subfolders are deleted
    // fix this workaround and throw error again
    // console.log('selectTreeNode error', state, nodeId);
    // throw new Error(`Node with id: "${nodeId}" not found.`);

    return undefined;
};

const folderById = (state: FeedSliceState, id: string) => {
    const folder = state.folders.find((x) => x.id === id);

    if (folder === undefined) {
        throw new Error(`Folder with id: "${id}" not found.`);
    }

    return folder;
};

const feedById = (state: RootState, id: string) => {
    const feed = state.feeds.feeds.find((x) => x.id === id);

    if (feed === undefined) {
        throw new Error(`Feed with id: "${id}" not found.`);
    }

    return feed;
};

const selectChildNodes = (state: RootState, parentId: string): ReadonlyArray<TreeNode> => {
    const parentFolder = folderById(state.feeds, parentId);

    const folderNodes: ReadonlyArray<FolderNode> = parentFolder.subfolders.map((subFolderId) => ({
        nodeType: NodeType.Folder,
        data: folderById(state.feeds, subFolderId),
    }));

    const feedNodes: ReadonlyArray<FeedNode> = parentFolder.feedIds.map((feedId) => ({
        nodeType: NodeType.Feed,
        data: feedById(state, feedId),
    }));

    return [...folderNodes, ...feedNodes];
};

export const selectTopLevelNodes = (state: RootState): ReadonlyArray<TreeNode> => selectChildNodes(state, rootFolderId);

const feedsSlice = createSlice({
    name: 'feeds',
    initialState,
    reducers: {
        addFolder(state, action: PayloadAction<string>) {
            const newFolderId = uuidv4();

            const folders = state.folders.map((f) =>
                f.id === rootFolderId
                    ? {
                          ...f,
                          subfolders: [newFolderId, ...f.subfolders],
                      }
                    : f,
            );

            folders.push({
                id: newFolderId,
                title: action.payload,
                feedIds: [],
                subfolders: [],
            });

            state.folders = folders;
        },
        select(state, action: PayloadAction<string>) {
            state.selectedNodeId = action.payload;
        },
        markItemAsRead(state, action: PayloadAction<{ feedId: string; itemId: string }>) {
            return {
                ...state,
                feeds: [...markItemAsRead(state.feeds, action.payload.feedId, action.payload.itemId)],
            };
        },
        markSelectedFeedAsRead(state) {
            // TODO also handle folders
            return {
                ...state,
                feeds: [...markFeedAsRead(state.feeds, state.selectedNodeId)],
            };
        },
        markAllAsRead(state) {
            return {
                ...state,
                feeds: state.feeds.map((feed) => markAllItemsOfFeedRead(feed)),
            };
        },
        updateFeeds(state, action: PayloadAction<ReadonlyArray<Feed>>) {
            const newFeeds = action.payload.filter(
                (updatedFeed) => !state.feeds.some((x) => x.url === updatedFeed.url),
            );

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
            const isFeed = state.feeds.some((x) => x.id === state.selectedNodeId);

            if (isFeed) {
                // index of the feed that gets deleted
                const selectedFeedId = state.selectedNodeId;
                // const selectedIndex = state.feeds.findIndex((f) => f.id === selectedFeedId); // TODO

                // delete relation in parent
                state.folders = state.folders.map((folder) =>
                    folder.feedIds.some((feedId) => feedId === selectedFeedId)
                        ? {
                              ...folder,
                              feedIds: folder.feedIds.filter((feedId) => feedId !== selectedFeedId),
                          }
                        : folder,
                );

                // delete feed
                state.feeds = state.feeds.filter((f) => f.id !== selectedFeedId);

                // if possible select the the next feed
                // TODO consider changed selection
                state.selectedNodeId = '';
                /*state.selectedNodeId =
                    state.feeds.length === 0
                        ? ''
                        : state.feeds.length > selectedIndex
                        ? state.feeds[selectedIndex].id
                        : state.feeds[selectedIndex - 1].id;
                        */
            }

            const isFolder = state.folders.some((x) => x.id === state.selectedNodeId);

            if (isFolder) {
                const selectedFolderId = state.selectedNodeId;

                // delete relation in parent
                state.folders = state.folders.map((folder) =>
                    folder.subfolders.some((subfolderId) => subfolderId === selectedFolderId)
                        ? {
                              ...folder,
                              subfolders: folder.subfolders.filter((subfolderId) => subfolderId !== selectedFolderId),
                          }
                        : folder,
                );

                // delete feeds in selected folder and its subfolders (all levels)
                const feedIdsToDelete = feedIdsByFolderId(state, selectedFolderId);
                state.feeds = state.feeds.filter((feed) => !feedIdsToDelete.some((id) => feed.id === id));

                // delete folder and subfolders (all levels)
                const subfolderIdsToDelete = subfolderIdsByFolderId(state, selectedFolderId);
                state.folders = state.folders.filter(
                    (folder) => ![selectedFolderId, ...subfolderIdsToDelete].some((id) => folder.id === id),
                );

                // TODO consider changed selection
                state.selectedNodeId = '';
            }
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

const feedIdsByFolderId = (state: FeedSliceState, folderId: string): ReadonlyArray<string> => {
    const folder = folderById(state, folderId);

    return [...folder.feedIds, ...folder.subfolders.flatMap((subfolder) => [...feedIdsByFolderId(state, subfolder)])];
};

const subfolderIdsByFolderId = (state: FeedSliceState, folderId: string): ReadonlyArray<string> => {
    const folder = folderById(state, folderId);

    return [
        ...folder.subfolders,
        ...folder.subfolders.flatMap((subfolder) => [...subfolderIdsByFolderId(state, subfolder)]),
    ];
};

const updateFeeds = (feeds: ReadonlyArray<Feed>, updatedFeeds: ReadonlyArray<Feed>): ReadonlyArray<Feed> => {
    updatedFeeds = feeds.map((feed) => {
        const updatedFeed = updatedFeeds.find((x) => x.url === feed.url);
        if (updatedFeed === undefined) {
            return feed;
        }

        return {
            ...mergeFeed(feed, updatedFeed),
        };
    });

    return updatedFeeds;
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
        id: updatedFeed.id,
        url: previous.url,
        title: previous.title !== undefined ? previous.title : updatedFeed.title,
        link: updatedFeed.link,
        items: [...previous.items, ...newItems],
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

const markFeedAsRead = (feeds: ReadonlyArray<Feed>, readFeedId: string): ReadonlyArray<Feed> =>
    feeds.map((feed) => {
        if (feed.id !== readFeedId) {
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
