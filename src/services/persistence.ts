import { initialState as initialSessionSliceState } from '../store/slices/session';
import { RootState } from '../store/store';

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

    // process
    // minify Keys
    const localStorageDataMinifiedKeys = {
        [storageKeys.feeds]: {
            ...state.feeds,
            feeds: state.feeds.feeds.map((f) => {
                return {
                    i: f.id,
                    u: f.url,
                    t: f.title,
                    l: f.link, // TODO is this needed?
                    s: f.items.map((item) => {
                        return {
                            i: item.id,
                            u: item.url,
                            t: item.title,
                            p: item.published,
                            l: item.lastModified,
                        };
                    }),
                };
            }),
        },
        [storageKeys.options]: state.options,
    };

    const jsonMinifiedKeys = JSON.stringify(localStorageDataMinifiedKeys);
    triggerDownload(new Blob([jsonMinifiedKeys], { type: 'application/json' }), 'export-minified-keys.json');

    // minified keys and only feeds
    const localStorageDataMinifiedKeysNoFolders = {
        [storageKeys.feeds]: {
            feeds: state.feeds.feeds.map((f) => {
                return {
                    i: f.id,
                    u: f.url,
                    t: f.title,
                    l: f.link, // TODO is this needed?
                    s: f.items.map((item) => {
                        return {
                            i: item.id,
                            u: item.url,
                            t: item.title,
                            p: item.published,
                            l: item.lastModified,
                        };
                    }),
                };
            }),
        },
        [storageKeys.options]: state.options,
    };

    const jsonMinifiedKeysNoFolders = JSON.stringify(localStorageDataMinifiedKeysNoFolders);

    triggerDownload(
        new Blob([jsonMinifiedKeysNoFolders], { type: 'application/json' }),
        'export-minified-keys-no-folders.json',
    );

    return browser.storage.local.set(localStorageData);
};

const triggerDownload = (content: Blob, fileName: string) => {
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
