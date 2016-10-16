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
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          "file?hash=sha512&digest=hex&name=[hash].[ext]",
          "image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false"
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      _: "underscore"
    }),
    new webpack.DefinePlugin({
      "NODE_ENV": JSON.stringify("development"),
      "NODE_URL": JSON.stringify("http://127.0.0.1:4000")
    })
  ]
};