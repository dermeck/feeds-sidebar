import { browser } from "webextension-polyfill-ts";

import { wrapStore } from "webext-redux";
import { createStore } from "redux";

function rootReducer(state = { feeds: [] }, action: any) {
  switch (action.type) {
    case "feed/added":
      console.log("+");
      return { feeds: [] };

    default:
      return state;
  }
}

const store = createStore(rootReducer); // a normal Redux store

wrapStore(store);

browser.browserAction.onClicked.addListener((e: any) => {
  console.log(e);

  browser.sidebarAction.open();
});
