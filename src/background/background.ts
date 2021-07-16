import { wrapStore } from 'webext-redux';

import { fetchAllFeedsCommand } from '../store/slices/feeds';
import store from '../store/store';

wrapStore(store);

browser.browserAction.onClicked.addListener((e) => {
    browser.sidebarAction.open();
});

store.dispatch(fetchAllFeedsCommand());

// TODO
// browser.alarms.create("fetchFeedsCycle", { periodInMinutes: 1 });
// browser.alarms.onAlarm.addListener(() => console.log("fetchFeedsCylce"));
