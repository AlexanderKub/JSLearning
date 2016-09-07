var webpack = require("webpack");
module.exports={
  entry: "./index.js",
  output:{
    filename: "build.js"
  },
	
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.ejs$/,
        loader: "ejs-loader?variable=data"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [ "babel-loader?{presets: ['es2015', 'stage-0']}", "eslint-loader"]
      }
    ]
  },
	
  eslint: {
    configFile: "./.eslintrc.json"
  },
    
  plugins: [
    new webpack.ProvidePlugin({
      _: "lodash"
    })
  ]

};