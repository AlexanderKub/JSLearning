module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-webpack");
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config.js");

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    webpack: {
      options: webpackConfig,
      build: {
        output:{
          filename: "build.min.js"
        },
        plugins: webpackConfig.plugins.concat(
          new webpack.DefinePlugin({
            "process.env": {
              "NODE_ENV": JSON.stringify("production")
            }
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin({sourceMap: false})
        )
      },
      "build-dev": {
        devtool: "#inline-source-map",
        debug: true
      }
    }
  });

  grunt.registerTask("default", ["webpack:build-dev"]);
  grunt.registerTask("build", ["webpack:build"]);
};