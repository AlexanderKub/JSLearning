require("es6-promise").polyfill();
var webpack = require("webpack");

module.exports = {
  entry: "./frontend/lib/index",
  output: {
    path: "./build",
    filename: "build.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["es2015", "es2016"]
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css!"
      },
      {
        test: /\.ejs$/,
        loader: "underscore-template-loader"
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: "underscore"
    })
  ]
};