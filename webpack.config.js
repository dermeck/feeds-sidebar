const path = require('path');
var webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

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
