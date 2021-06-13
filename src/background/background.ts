import { browser } from "webextension-polyfill-ts";

import { wrapStore } from "webext-redux";
import store from "../store/store";

wrapStore(store);

browser.browserAction.onClicked.addListener((e: any) => {
  console.log(e);

  browser.sidebarAction.open();
});
