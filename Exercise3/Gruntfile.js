module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  var webpackConfig = require("./webpack.config.js");
  require("webpack");
	
  grunt.initConfig({
    webpack: {
      options: webpackConfig,
      build: {
      },
      dev: {
        devtool: "sourcemap"
      }
    },
    uglify: {
      build: {
        src: "./AppsManager/client/build.js",
        dest: "./AppsManager/client/production.min.js"
      }
    }
  });
  grunt.registerTask("default", ["webpack:dev"]);
  grunt.registerTask("build", ["webpack:build","uglify"]);
};