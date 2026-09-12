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

## Storybook
`yarn storybook` starts Storybook at `localhost:6006`, `yarn build:storybook` creates a static build in `storybook-static`.

Stories render the components without the extension APIs (like the stand-alone mode). Components that read from the store are wrapped in the `withStore` decorator which provides a store without sagas and extension middleware, preloaded with the state fixtures from `src/storybook`. Firefox specific system colors are not available in other browsers, `.storybook/storybook.css` provides fallback values for them.

## Stand-Alone Mode
`start:stand-alone` will mount the sidebar component into stand alone web page reachable at `localhost:8080`. It is not fully functional since it lacks extension features.

The stylesheets are served directly from `src` by the dev server, so they always match the current sources.

Since it runs on a regular web page, feeds can only be fetched from servers that send permissive CORS headers. Feeds without those headers will be displayed with an error.

It is intended for debugging with the React and Redux DevTools. 