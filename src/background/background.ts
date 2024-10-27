import { wrapStore } from '../store/reduxBridge';

import { extensionStateLoaded } from '../store/actions';
import store from '../store/store';
import { loadState, saveState } from '../services/persistence';
import { fetchAllFeedsCommand } from '../store/slices/feeds';
import sessionSlice from '../store/slices/session';
import { ContenScriptMessage, MessageType, addMessageListener } from '../store/reduxBridge/messaging';

const feedsAutoUpdateKey = 'feedsAutoUpdate';
const SECOND = 1000;
const MINUTE = 60 * SECOND;

let lastLoaded = 0;
let initialized = false;
const messageBuffer: ContenScriptMessage[] = [];

// immediatly provide receiving end for content-script messages
// waiting for store would take too long when background script re-initializes
addMessageListener((message: ContenScriptMessage) => {
    if (initialized) {
        return;
    }
    messageBuffer.push(message);
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

async function detectFeeds(tabId: number) {
    const options = await browser.storage.sync.get(['detectionEnabled']);

    if (!options?.detectionEnabled) {
        return;
    }

    const tab = await browser.tabs.get(tabId);
    if (tab.url === undefined) {
        return;
    }

    const alreadyDetectedFeeds = await browser.storage.session.get(tab.url);
    if (alreadyDetectedFeeds[tab.url] !== undefined) {
        // detection was already triggered once during this session
        store.dispatch(sessionSlice.actions.feedsDetected(alreadyDetectedFeeds[tab.url]));
    } else {
        browser.tabs
            .sendMessage(tabId, { type: MessageType.StartFeedDetection, payload: { url: tab.url } })
            .then(() => {
                return;
            })
            .catch((error) => {
                if (error === 'Error: Could not establish connection. Receiving end does not exist.') {
                    // active tab does not have content script (e.g. no page found on localhost)
                    return;
                }
            });
    }
}

function handleTabUpdated(tabId: number, changes: browser.tabs._OnUpdatedChangeInfo) {
    if (changes.status === 'complete') {
        // tab was reloaded
        detectFeeds(tabId);
    }
}

function handleTabAcivated(activeInfo: browser.tabs._OnActivatedActiveInfo) {
    // tab was selected
    detectFeeds(activeInfo.tabId);
}

browser.tabs.onUpdated.addListener(handleTabUpdated);
browser.tabs.onActivated.addListener(handleTabAcivated);

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
    const detectionEnabled = store.getState().options.feedDetectionEnabled;

    console.log('detectionEnabled', detectionEnabled);
    browser.storage.sync.set({ detectionEnabled: detectionEnabled });

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
