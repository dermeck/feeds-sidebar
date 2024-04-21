# Creating a new Release

- increase the version number in `src/manifest.json` and `package.json`
- create a new tag with with the version number (eg `git tag v0.12`) and push it (`git push origin v0.12`.
- (in case it's need, tag can be remove with `git push --delete origin v0.12`)

## Self hosted xpi (permanent installation)
To create an installable `.xpi` file the extension must be [signed](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext_sign).

```
yarn run web-ext sign --use-submission-api --channel=unlisted  --source-dir=build --api-key=user:xxxxxxx:xxx --api-secret=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The credentials can be configured in the `.env` file. 

### `yarn build:xpi` 
will perform a prod build and call `web-ext sign` with the configured credentials.

This will create the `.xpi` file in the `/dist` folder.

### Release build
Change `--channel` to listed (to be tested) 

### Install the extension (xpi)
- in Firefox navigate to `about:addons` > `Tools for all add-ons` (gear icon) > `Install Add-on From File...`

## Create zip file

### `yarn build:zip`

will perform a prod build and bundle the output into a zip file in the `/dist` folder.

---

## Further information
- https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/
- https://extensionworkshop.com/documentation/publish/submitting-an-add-on/