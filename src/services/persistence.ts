import { initialState as initialSessionSliceState } from '../store/slices/session';
import { RootState } from '../store/store';
import { hashCode } from '../utils/stringUtils';

const storageKeys = {
    feeds: 'feedsKey',
    options: 'optionsKey',
};

export const saveState = (state: RootState): Promise<void> => {
    const localStorageData = {
        [storageKeys.feeds]: state.feeds,
        [storageKeys.options]: state.options,
    };

    const json = JSON.stringify(localStorageData);
    triggerDownload(new Blob([json], { type: 'application/json' }), 'export-full.json');

    // no items, no folders

    const localStorageDataMinifiedKeysNoItemsNoFolders = {
        [storageKeys.feeds]: {
            feeds: state.feeds.feeds.map((f) => {
                return {
                    u: f.url,
                    // TODO add isRead Info
                };
            }),
        },
        [storageKeys.options]: state.options,
    };

    const jsonMinifiedKeysNoItemsNoFolders = JSON.stringify(localStorageDataMinifiedKeysNoItemsNoFolders);
    const blob = new Blob([jsonMinifiedKeysNoItemsNoFolders], { type: 'application/json' });
    console.log('blobSize', blob.size); // n bytes
    console.log('strlen', jsonMinifiedKeysNoItemsNoFolders.length); // TODO chunk https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/sync
    // meta: {date, chunkNo}, chunk1, chunk2
    triggerDownload(blob, 'export-minified-keys-no-items-no-folders.json');

    console.log(
        'https://ourworldindata.org/plastic-waste-trade',
        hashCode('https://ourworldindata.org/plastic-waste-trade'),
    );

    return browser.storage.local.set(localStorageData);
};

const triggerDownload = (content: Blob, fileName: string) => {
    return; // TODO
    const link = document.createElement('a');

    link.href = URL.createObjectURL(content);
    link.download = fileName;
    link.click();
};

export const loadState = async (): Promise<RootState | undefined> => {
    const feeds = await browser.storage.local.get(storageKeys.feeds);
    const options = await browser.storage.local.get(storageKeys.options);

    if (Object.keys(feeds).length === 0 || Object.keys(options).length === 0) {
        return undefined;
    }

    return {
        feeds: feeds.feedsKey as RootState['feeds'],
        options: options.optionsKey as RootState['options'],
        session: initialSessionSliceState,
    };
};
