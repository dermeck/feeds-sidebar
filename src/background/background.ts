import { wrapStore } from '../store/reduxBridge';

import { extensionStateLoaded } from '../store/actions';
import { updateBadge } from '../store/middleware/feedMiddleware';
import store from '../store/store';
import { loadState, saveState } from '../services/persistence';
import { fetchAllFeedsCommand } from '../store/slices/feeds';
import sessionSlice from '../store/slices/session';
import { ContentScriptMessage, MessageType, addMessageListener } from '../store/reduxBridge/messaging';
import { feedsAutoUpdateKey } from '../store/sagas/optionsSaga';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

let lastLoaded = 0;
let initialized = false;
const messageBuffer: ContentScriptMessage[] = [];

// saves are chained so that a slow write cannot finish after a newer one and persist stale state
let pendingSave: Promise<void> = Promise.resolve();
let saveErrorReported = false;

const scheduleSave = () => {
    pendingSave = pendingSave
        .then(async () => {
            await saveState(store.getState());

            if (saveErrorReported) {
                saveErrorReported = false;
                store.dispatch(sessionSlice.actions.changePersistenceError(undefined));
            }
        })
        .catch((error: unknown) => {
            console.error('Could not persist state', error);

            // reporting the error changes the state, which triggers another save that would fail again
            if (!saveErrorReported) {
                saveErrorReported = true;
                store.dispatch(
                    sessionSlice.actions.changePersistenceError(
                        'Changes cannot be saved right now and will be lost when the sidebar is reloaded.',
                    ),
                );
            }
        });
};

// immediatly provide receiving end for content-script messages
// waiting for store would take too long when background script re-initializes
addMessageListener((message: ContentScriptMessage) => {
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

browser.action.onClicked.addListener(() => {
    browser.sidebarAction.open();
});

async function detectFeeds(tabId: number) {
    if (!store.getState().options.feedDetectionEnabled) {
        store.dispatch(sessionSlice.actions.feedsDetected([]));
        return;
    }

    const tab = await browser.tabs.get(tabId);
    if (tab.url === undefined) {
        // pages like about:debugging
        store.dispatch(sessionSlice.actions.feedsDetected([]));
        return;
    }

    browser.tabs
        .sendMessage(tabId, { type: MessageType.StartFeedDetection, payload: { url: tab.url } })
        .then(() => {
            return;
        })
        .catch((error: { message: string }) => {
            store.dispatch(sessionSlice.actions.feedsDetected([]));
            if (error.message !== 'Could not establish connection. Receiving end does not exist.') {
                console.error(error);
                return;
            }

            // active tab does not have content script (e.g. no page found on localhost)
            // OR pageAction is not loaded yet => retry once
            setTimeout(() => {
                browser.tabs
                    .sendMessage(tabId, { type: MessageType.StartFeedDetection, payload: { url: tab.url } })
                    .then(() => {
                        return;
                    })
                    .catch((error: { message: string }) => {
                        if (error.message === 'Could not establish connection. Receiving end does not exist.') {
                            return;
                        }
                    });
            }, 2500);
            return;
        });
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

    // the badge outlives the background script, so it has to be reconciled with the loaded state
    updateBadge(store.getState());

    // setup persistence
    store.subscribe(scheduleSave);

    const unsubscribe = wrapStore(store, messageBuffer);

    const updateIntervall = store.getState().options.feedUpdatePeriodInMinutes;

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
