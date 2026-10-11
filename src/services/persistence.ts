import { NodeType } from '../model/feeds';
import { initialState as initialSessionSliceState } from '../store/slices/session';
import { RootState } from '../store/store';

const storageKeys = {
    feeds: 'feedsKey',
    options: 'optionsKey',
    timestamp: 'timestampKey',
    readItemIds: 'readItemIdsKey',
};

export const saveState = (state: RootState): Promise<void> => {
    const localStorageData = {
        [storageKeys.feeds]: state.feeds,
        [storageKeys.options]: state.options,
        [storageKeys.timestamp]: Date.now(),
        [storageKeys.readItemIds]: state.feeds.readItemIds,
    };

    return browser.storage.local.set(localStorageData);
};

// older versions selected the article itself, which the tree no longer holds
const normalizeLegacySelection = (feeds: RootState['feeds']): RootState['feeds'] => {
    const { selectedNode } = feeds;

    if (selectedNode?.nodeType !== NodeType.FeedItem) {
        return feeds;
    }

    const feed = feeds.feeds.find((f) => f.items?.some((item) => item.id === selectedNode.nodeId));

    return feed
        ? {
              ...feeds,
              selectedNode: { nodeId: feed.id, nodeType: NodeType.Feed },
              selectedFeedItemId: selectedNode.nodeId,
          }
        : { ...feeds, selectedNode: undefined, selectedFeedItemId: undefined };
};

export const loadState = async (): Promise<(RootState & { timestamp: number }) | undefined> => {
    const feeds = await browser.storage.local.get(storageKeys.feeds);
    const options = await browser.storage.local.get(storageKeys.options);
    const timestamp = await browser.storage.local.get(storageKeys.timestamp);
    const readItemIds = await browser.storage.local.get(storageKeys.readItemIds);

    const loadedFeeds = feeds[storageKeys.feeds];
    const loadedOptions = options[storageKeys.options];
    const loadedReadItemIds = readItemIds[storageKeys.readItemIds];

    if (
        typeof loadedFeeds !== 'object' ||
        loadedFeeds === null ||
        !Array.isArray(loadedFeeds.feeds) ||
        !Array.isArray(loadedFeeds.folders)
    ) {
        return undefined;
    }

    if (typeof loadedOptions !== 'object' || loadedOptions === null) {
        return undefined;
    }

    return {
        feeds: normalizeLegacySelection({
            ...loadedFeeds,
            readItemIds: Array.isArray(loadedReadItemIds) ? loadedReadItemIds : [],
            durationFetchFailures:
                typeof loadedFeeds.durationFetchFailures === 'object' && loadedFeeds.durationFetchFailures !== null
                    ? loadedFeeds.durationFetchFailures
                    : {},
        } as RootState['feeds']),
        options: loadedOptions as RootState['options'],
        session: initialSessionSliceState,
        timestamp: Number(timestamp.timestampKey) || Date.now(),
    };
};
