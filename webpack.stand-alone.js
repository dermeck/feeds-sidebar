const path = require('path');
var webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    entry: {
        'stand-alone/sidebar': './src/stand-alone/index.tsx',
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
        // TODO only add required polyfills
        new NodePolyfillPlugin(),
        new webpack.DefinePlugin({
            STAND_ALONE: JSON.stringify(true),
        }),
    ],
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
        static: {
            directory: path.join(__dirname, 'src/stand-alone'),
        },
    },
};
