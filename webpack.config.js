const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    sidebar: "./src//sidebar/sidebar.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "sidebar/[name].js",
  },

  devtool: "source-map",

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "**/*",
          context: "src",
          globOptions: {
            ignore: ["**/*.js"],
          },
        },
      ],
    }),
  ],
};
