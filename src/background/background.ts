import { wrapStore } from 'webext-redux';

import { initCommand } from '../store/actions';
import store from '../store/store';

wrapStore(store);

browser.browserAction.onClicked.addListener(() => {
    browser.sidebarAction.open();
});

store.dispatch(initCommand());
