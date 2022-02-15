import { wrapStore } from 'webext-redux';

import { colors } from '../base-components/styled/colors';
import { initCommand } from '../store/actions';
import store from '../store/store';

wrapStore(store);

browser.browserAction.onClicked.addListener(() => {
    browser.sidebarAction.open();
});

browser.browserAction.setBadgeBackgroundColor({ color: colors.badgeBackgroundColor });
browser.browserAction.setBadgeTextColor({ color: colors.badgeTextColor });

store.dispatch(initCommand());
