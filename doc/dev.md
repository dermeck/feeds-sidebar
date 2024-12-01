# Build & Testing

## Prerequisites
- `Node.js` and `yarn` have to be installed

## Development Build & temporary installation
Build the extension with `yarn start`

Load the Extension
- in Firefox navigate to `about:debugging#/runtime/this-firefox` > `Load  Temporary Add-on...`
- select the `manifest.json` file from the `build` folder
- open the Firefox sidebar and select `Feeds`

## Debugging
- `about:debugging#/runtime/this-firefox` > `Inspect` will bring up the [Toolbox](https://extensionworkshop.com/documentation/develop/debugging/#developer-tools-toolbox) for the extension (DevTools)
  - to inspect the markup of the sidebar select the `sidebar.html` frame (iframe selector button next to the  `…` Button on the top right of the toolbox)
  - logs from the background script including Redux Actions will be logged to the console
- logs from the content-script can be viewed in:
  - **Browser Toolbox** / Debug the Browser `Ctrl+Shift+Alt+I` (needs to be enabled https://firefox-source-docs.mozilla.org/devtools-user/browser_toolbox/index.html)
  - **MultiProcess Browser Console** `Ctrl+Shif+J`

## Stand-Alone Mode
**this needs adjustments, styles are broken**

`start:stand-alone` will mount the sidebar component into stand alone web page reachable at `localhost:8080`. It is not fully functional since it lacks extension features.

It is intended for debugging with the React and Redux DevTools. 