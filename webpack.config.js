const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    "sidebar/sidebar": "./src/sidebar/index.tsx",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js" /* [name] is the key specified in "entry" */,
  },

  devtool: "source-map",

  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "**/*",
          context: "src",
          globOptions: {
            ignore: ["**/*.ts", "**/*.tsx"],
          },
        },
      ],
    }),
  ],
};
