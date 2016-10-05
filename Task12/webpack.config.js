require("es6-promise").polyfill();
var webpack = require("webpack");

module.exports = {
  entry: "./frontend/js/main",
  output: {
    path: "./backend/client",
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
      },
      {
        test: /\.js$/,
        loader: "string-replace",
        query: {
          search: "!host",
          replace: "http://127.0.0.1:4000"
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: "underscore"
    }),
    new webpack.DefinePlugin({
      "NODE_ENV": JSON.stringify("development"),
      "NODE_URL": JSON.stringify("http://127.0.0.1:4000")
    })
  ]
};