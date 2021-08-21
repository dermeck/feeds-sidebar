const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    entry: {
        'stand-alone/sidebar': './src/stand-alone/index.tsx',
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
    ],
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
        port: 8090,
    },
};
