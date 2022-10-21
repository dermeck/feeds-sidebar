const path = require('path');
var webpack = require('webpack');
const ExtReloader = require('webpack-ext-reloader');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => ({
    entry: {
        sidebar: './src/sidebar/index.tsx',
        background: './src/background/background.ts',
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
        // node polyfills
        fallback: { stream: require.resolve('stream-browserify'), buffer: require.resolve('buffer-browserify') },
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

        new ExtReloader({
            manifest: path.resolve('./build', 'manifest.json'),
            entries: {
                // The entries used for the content/background scripts or extension pages
                sidebar: 'sidebar',
                background: 'background',
            },
        }),

        // node polyfills
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),

        new webpack.DefinePlugin({
            STAND_ALONE: JSON.stringify(false),
            'process.env.ENABLE_LOGGER_MIDDLEWARE': JSON.stringify(env.enableLoggerMiddleware),
        }),
    ],
});
