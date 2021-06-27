import { wrapStore } from "webext-redux";
import store from "../store/store";

wrapStore(store);

browser.browserAction.onClicked.addListener((e) => {
  console.log(e);

  browser.sidebarAction.open();
});

// TODO
// browser.alarms.create("fetchFeedsCycle", { periodInMinutes: 1 });
// browser.alarms.onAlarm.addListener(() => console.log("fetchFeedsCylce"));
