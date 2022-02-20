const path = require('path');
var webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    entry: {
        'sidebar/sidebar': './src/sidebar/index.tsx',
        background: './src/background/background.ts',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
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
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: '**/*',
                    context: 'src',
                    globOptions: {
                        ignore: ['**/*.ts', '**/*.tsx'],
                    },
                },
            ],
        }),
        // TODO only add required polyfills
        new NodePolyfillPlugin(),
        new webpack.DefinePlugin({
            STAND_ALONE: JSON.stringify(false),
        }),
    ],
};
