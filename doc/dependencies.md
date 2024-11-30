# Dependency Overview

| Name                                  | Note                                                                              |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| @phosphor-icons/react                 |                                                                                   |
| @reduxjs/toolkit                      |                                                                                   |
| @total-typescript/ts-reset            |                                                                                   |
| @trivago/prettier-plugin-sort-imports |                                                                                   |
| @types/firefox-webext-browser         | typings for firefox webextions (browser)                                          |
| @types/react, @types/react-dom        |                                                                                   |
| @typescript-eslint/eslint-plugin      |                                                                                   |
| @typescript-eslint/parser             | **check if all the eslint deps are needed**                                       |
| @welldone-software/why-did-you-render | not compatible with React 19 yet                                                  |
| buffer-browserify                     | **check if polyfill is needed**                                                   |
| clsx                                  | utility for className                                                             |
| copy-webpack-plugin                   | copy files (manifest, icon, css to build folder), 3rd party plugin                |
| cross-var                             | for env variables in npm scrips (sign command), **check if this is still needed** |
| css-loader                            |                                                                                   |
| dotenv-cli                            | for env variables, **check if it is still needed** (ENABLE_LOGGER_MIDDLEWARE)     |
| eslint                                |                                                                                   |
| eslint-plugin-react                   |                                                                                   |
| eslint-plugin-react-hooks             |                                                                                   |
| fast-deep-equal                       |                                                                                   |
| fast-xml-parser                       | used to parse opml files                                                          |
| feedparser, @types/feedparser         | parse feed content                                                                |
| html-entities                         | used in opml export to encode title                                               |
| jest                                  |                                                                                   |
| jest-environment-jsdom,               |                                                                                   |
| @types/jest                           |                                                                                   |
| node-polyfill-webpack-plugin          | provide polyfills, **check which ones are needed** (and why)                      |
| prettier                              |                                                                                   |
| react                                 |                                                                                   |
| react-dom                             |                                                                                   |
| react-redux                           |                                                                                   |
| redux-saga                            |                                                                                   |
| rimraf                                | clear build folder before build                                                   |
| stream-browserify                     | polyfill, **check if needed**                                                     |
| style-loader                          |                                                                                   |
| ts-jest                               |                                                                                   |
| ts-loader                             |                                                                                   |
| ts-node                               |                                                                                   |
| ts-prune                              | **deprecated**, replace                                                           |
| typescript                            |                                                                                   |
| web-ext                               |                                                                                   |
| web-ext-types                         | **check if still needed**                                                         |
| webextension-polyfill-ts              |                                                                                   |
| webpack                               |                                                                                   |
| webpack-cli                           |                                                                                   |
| webpack-dev-server                    |                                                                                   |