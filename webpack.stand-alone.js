const path = require('path');
var webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = (env) => ({
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
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        // node polyfills
        fallback: {
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer-browserify'),
            'process/browser': require.resolve('process/browser'),
        },
    },

    plugins: [
        // node polyfills
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),

        new webpack.DefinePlugin({
            'process.env.STAND_ALONE': JSON.stringify(true),
            'process.env.ENABLE_LOGGER_MIDDLEWARE': JSON.stringify(env.enableLoggerMiddleware),
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
});
