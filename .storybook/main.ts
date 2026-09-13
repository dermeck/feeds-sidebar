import type { StorybookConfig } from '@storybook/react-webpack5';

import webpack from 'webpack';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|tsx)'],

    addons: ['@storybook/addon-docs'],

    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },

    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },

    webpackFinal: (webpackConfig) => {
        webpackConfig.module = {
            ...webpackConfig.module,
            rules: [
                ...(webpackConfig.module?.rules ?? []),

                // same loader as the webpack builds, storybook does not ship a typescript compiler
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [{ loader: require.resolve('ts-loader') }],
                },
            ],
        };

        webpackConfig.plugins = [
            ...(webpackConfig.plugins ?? []),

            // node polyfills (feedparser is part of the module graph via the fetch saga)
            new NodePolyfillPlugin({
                onlyAliases: ['process', 'stream'],
            }),

            // stories render the ui without the extension apis, same as the stand-alone build
            new webpack.DefinePlugin({
                'process.env.STAND_ALONE': JSON.stringify(true),
            }),
        ];

        return webpackConfig;
    },
};

export default config;
