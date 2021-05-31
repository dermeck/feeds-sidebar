import { browser } from "webextension-polyfill-ts"; 

browser.browserAction.onClicked.addListener((e:any) => {
    console.log(e);

    browser.sidebarAction.open();
});