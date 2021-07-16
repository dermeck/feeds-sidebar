import { wrapStore } from 'webext-redux';

import { initCommand } from '../store/slices/global';
import store from '../store/store';

wrapStore(store);

browser.browserAction.onClicked.addListener((e) => {
    browser.sidebarAction.open();
});

store.dispatch(initCommand());

// TODO
// browser.alarms.create("fetchFeedsCycle", { periodInMinutes: 1 });
// browser.alarms.onAlarm.addListener(() => console.log("fetchFeedsCylce"));
