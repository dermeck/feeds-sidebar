# YTRSS
(**Y**et ano**T**her **RSS** Feed Reader)

A Firefox Extensions with a configurable UI (in the future) which lives in the Sidebar.

## Next Tasks
- [ ] Setup TypeScript, React Toolchain
- [ ] ESLint
- [ ] Configure web-ext [Browser Extension Development Tools](https://extensionworkshop.com/documentation/develop/browser-extension-development-tools/)
- [ ] Add RSS Feed via Button
- [ ] Show Feed in Sidebar
- [ ] Fetch Feed content (and show it) on manual trigger
- [ ] Open item
- [ ] Remove Item
- [ ] Fetch feed cyclic
- [ ] Commit hook
## Link Dump
Things that might be useful during development.

### Documentation
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
- https://extensionworkshop.com/documentation/develop/
- [WebExtension Examples](https://developer.mozilla.org/de/docs/Mozilla/Add-ons/WebExtensions/Examples)


Sidebar: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Sidebars#specifying_sidebars

### Design
- [Photon Design System](https://design.firefox.com/photon/) (Proton comeing...)

[Redux + TS Recommendations](https://youtu.be/oDqg53iOub4?t=2470)

---
## How to test manually

Load the Extension
- in Firefox navigate to `about:debugging` > `This Firefox` > `Load  Temporary Add-on...`
- select the `manifest.json` file
- `Inspect` will bring up the [Toolbox](https://extensionworkshop.com/documentation/develop/debugging/#developer-tools-toolbox) for the extension (DevTools)
- open the sidebar and selct `YTRSS`