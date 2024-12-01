# Dependency Overview

| Name                                  | Note                                                               |
| ------------------------------------- | ------------------------------------------------------------------ |
| @phosphor-icons/react                 |                                                                    |
| @reduxjs/toolkit                      |                                                                    |
| @total-typescript/ts-reset            |                                                                    |
| @trivago/prettier-plugin-sort-imports |                                                                    |
| @types/firefox-webext-browser         | typings for firefox webextions (browser)                           |
| @types/react, @types/react-dom        |                                                                    |
| @typescript-eslint/eslint-plugin      |                                                                    |
| @typescript-eslint/parser             | **check if all the eslint deps are needed**                        |
| @welldone-software/why-did-you-render | **not compatible with React 19 yet**                               |
| clsx                                  | utility for className                                              |
| copy-webpack-plugin                   | copy files (manifest, icon, css to build folder), 3rd party plugin |
| cross-var                             | provide variables to npm script (system independent)               |
| dotenv-cli                            | load .env file for for npm scrip (sign)                            |
| eslint                                |                                                                    |
| eslint-plugin-react                   |                                                                    |
| eslint-plugin-react-hooks             |                                                                    |
| fast-deep-equal                       |                                                                    |
| fast-xml-parser                       | used to parse opml files                                           |
| feedparser, @types/feedparser         | parse feed content                                                 |
| html-entities                         | used in opml export to encode title                                |
| jest                                  |                                                                    |
| jest-environment-jsdom,               |                                                                    |
| @types/jest                           |                                                                    |
| node-polyfill-webpack-plugin          | provide polyfills (see list below)                                 |
| prettier                              |                                                                    |
| react                                 |                                                                    |
| react-dom                             |                                                                    |
| react-redux                           |                                                                    |
| redux-saga                            |                                                                    |
| rimraf                                | clear build folder before build                                    |
| ts-jest                               |                                                                    |
| ts-loader                             |                                                                    |
| ts-node                               |                                                                    |
| ts-prune                              | **deprecated**, replace                                            |
| typescript                            |                                                                    |
| web-ext                               |                                                                    |
| webpack                               |                                                                    |
| webpack-cli                           |                                                                    |
| webpack-dev-server                    |                                                                    |

## Polyfills / Resolve
- `process` needed for process.env.MODE
- `stream` needed for `sax` (feedParser)
- `util` needed for feedParser 
                            
