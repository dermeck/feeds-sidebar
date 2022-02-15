import { wrapStore } from 'webext-redux';

import { initCommand } from '../store/actions';
import store from '../store/store';

wrapStore(store);

browser.browserAction.onClicked.addListener(() => {
    browser.sidebarAction.open();
});

browser.browserAction.setBadgeBackgroundColor({ color: '#dd2e44' });
browser.browserAction.setBadgeTextColor({ color: '#ffffff' });

store.dispatch(initCommand());
