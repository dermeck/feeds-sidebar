# YTRSS
(**Y**et ano**T**her **RSS** Feed Reader)

A Firefox Extensions with a configurable UI (in the future) which lives in the Sidebar.

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
