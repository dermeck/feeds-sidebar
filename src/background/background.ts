import { wrapStore } from '../store/reduxBridge';

import { extensionStateLoaded } from '../store/actions';
import store from '../store/store';
import { loadState, saveState } from '../services/persistence';
import { fetchAllFeedsCommand } from '../store/slices/feeds';
import { ContenScriptMessage, MessageType, addMessageListener } from '../store/reduxBridge/messaging';

const feedsAutoUpdateKey = 'feedsAutoUpdate';
const SECOND = 1000;
const MINUTE = 60 * SECOND;

let lastLoaded = 0;
let initialized = false;
const messageBuffer: ContenScriptMessage[] = [];

// immediatly provide receiving end for content-script messages
// waiting for store would take too long when background script re-initializes
addMessageListener((request: ContenScriptMessage) => {
    console.log('received', request, initialized);
    if (initialized) {
        return;
    }
    messageBuffer.push(request);
});

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === feedsAutoUpdateKey) {
        // trigger restart of background-script if needed
        browser.runtime.getPlatformInfo();
    }
});

browser.runtime.onSuspend.addListener(() => {
    // unsubscribe from Redux store changes
    initResultPromise.then((result) => result()).catch((reason) => console.error(reason));
});

browser.browserAction.onClicked.addListener(() => {
    browser.sidebarAction.open();
});

async function detectFeeds(tabId: number, changes: browser.tabs._OnUpdatedChangeInfo) {
    if (changes.status === 'complete') {
        const options = await browser.storage.sync.get(['detectionEnabled']);

        if (!options?.detectionEnabled) {
            return;
        }
        // tab reloaded
        browser.tabs.sendMessage(tabId, { type: MessageType.StartFeedDetection });
    }
}

browser.tabs.onUpdated.addListener(detectFeeds);

async function init() {
    const loadedState = await loadState();
    if (loadedState !== undefined) {
        store.dispatch(extensionStateLoaded(loadedState));
        lastLoaded = loadedState.timestamp;
    }

    // setup persistence
    store.subscribe(async () => {
        await saveState(store.getState());
    });

    const unsubscribe = wrapStore(store, messageBuffer);

    const updateIntervall = store.getState().options.feedUpdatePeriodInMinutes;

    browser.storage.sync.set({ detectionEnabled: true }); // TODO mr set this based on options

    // setup cyclic update of all feeds
    browser.alarms.create(feedsAutoUpdateKey, { periodInMinutes: updateIntervall });

    initialized = true;

    return unsubscribe;
}

const initResultPromise = init();

initResultPromise.then(() => {
    // don't fetch if extension was running and non-persistent background-script just re-started
    const updateIntervall = store.getState().options.feedUpdatePeriodInMinutes;
    if (Date.now() - lastLoaded > updateIntervall * MINUTE - 15 * SECOND) {
        store.dispatch(fetchAllFeedsCommand());
    }
});
