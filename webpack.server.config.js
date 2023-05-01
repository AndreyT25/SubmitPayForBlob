const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: 'development',
  target: "node",
  externals: [nodeExternals()],
  entry: {
    server: "./src/app.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
