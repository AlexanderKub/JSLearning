require("es6-promise").polyfill();
var webpack = require("webpack");
module.exports={
  entry: "./Lib/Main",
  output:{
    path: "./AppsManager/client",
    filename: "build.js",
    library:"Main"
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
        loader: "ejs-loader?variable=data"
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: "lodash"
    })
  ]

};