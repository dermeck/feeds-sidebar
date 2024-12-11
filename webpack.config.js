const path = require('path');
var webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = (env) => ({
    entry: {
        'sidebar/sidebar': './src/sidebar/index.tsx',
        background: './src/background/background.ts',
        page: './src/page-action/pageAction.ts',
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js', // [name] is the key specified in "entry"
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        /*alias: {
            'moz-button': path.resolve('chrome://global/content/elements/moz-button.mjs'),
        },
        */
    },

    // externalsType: 'import',
    externals: {
        'moz-button': 'chrome://global/content/elements/moz-button.mjs',
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: '**/*',
                    context: 'src',
                    globOptions: {
                        ignore: ['**/*.ts', '**/*.tsx', '**/*/stand-alone/*'],
                    },
                },
            ],
        }),

        // node polyfills
        new NodePolyfillPlugin({
            onlyAliases: ['process', 'stream'],
        }),

        new webpack.DefinePlugin({
            STAND_ALONE: JSON.stringify(false),
            'process.env.ENABLE_LOGGER_MIDDLEWARE': JSON.stringify(env.enableLoggerMiddleware),
        }),
    ],
});
