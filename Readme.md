# YTRSS
(**Y**et ano**T**her **RSS** Feed Reader)

A Firefox Extensions with a configurable UI (in the future) which lives in the Sidebar.

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

Colors & Theme
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/theme/getCurrent

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme#colors

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme_experiment

icons firefox-89.0/browser/themes/shared/places 

### Tests
https://lusito.github.io/mockzilla-webextension/

---
## How to test manually (temporary installation)

Load the Extension
- in Firefox navigate to `about:debugging` > `This Firefox` > `Load  Temporary Add-on...`
- select the `manifest.json` file
- `Inspect` will bring up the [Toolbox](https://extensionworkshop.com/documentation/develop/debugging/#developer-tools-toolbox) for the extension (DevTools)
- open the sidebar and select `YTRSS`

## Self hosted xpi (permanent installation)

- perform webpack prod build with
`yarn build`
- (optional) remove the `*.js.map` files to reduce size

To create an installable `.xpi` file the extension must be [signed](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext_sign).

`web-ext sign --source-dir=dist --api-key=user:xxxxxxx:xxx --api-secret=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

This will create the `.xpi` file in `/web-ext-artifacts`

Load the extension
- in Firefox navigate to `about:addons` > `Tools for all add-ons` (gear icon) > `Install Add-on From File...`
