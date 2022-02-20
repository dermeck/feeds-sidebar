# Build & Testing

## Development Build & temporary installation
Build the extension with `yarn start`

Load the Extension
- in Firefox navigate to `about:debugging#/runtime/this-firefox` > `Load  Temporary Add-on...`
- select the `manifest.json` file from the dist folder
- open the Firefox sidebar and select `YTRSS`

Debugging
- `Inspect` will bring up the [Toolbox](https://extensionworkshop.com/documentation/develop/debugging/#developer-tools-toolbox) for the extension (DevTools)
- to inspect the markup of the sidebar select the `sidebar.html` frame (iframe selector button next to the `...` Button on the top right of the toolbox)
- Debug the Browser `Ctrl+Shift+Alt+I` 
- Redux Actions will be logged to the console

## Stand-Alone Mode
`start:stand-alone` will mount the sidebar component into stand alone web page reachable at `localhost:8080`. It is not fully functional since it lacks extension features.

It is intended for debugging with the React and Redux DevTools. 

## Self hosted xpi (permanent installation)
- increase the version number in `src/manifest.json`
- perform webpack prod build with `yarn build`
- (optional) remove the `*.js.map` files and the `stand-alone` folder to reduce size

To create an installable `.xpi` file the extension must be [signed](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext_sign).

`yarn run web-ext sign --source-dir=dist --api-key=user:xxxxxxx:xxx --api-secret=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

This will create the `.xpi` file in `/web-ext-artifacts`

Load the extension
- in Firefox navigate to `about:addons` > `Tools for all add-ons` (gear icon) > `Install Add-on From File...`
