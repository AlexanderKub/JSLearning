module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  var webpackConfig = require("./webpack.config.js");
  var webpack = require("webpack");
	
  grunt.initConfig({
    webpack: {
      options: webpackConfig,
      build: {
        output: {
          path: "./AppsManager/client",
          filename: "build.min.js"
        },
        plugins: webpackConfig.plugins.concat(
          new webpack.DefinePlugin({
            "NODE_ENV": JSON.stringify("production")
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin({sourceMap: false})
        )
      },
      dev: {
        output: {
          path: "./AppsManager/client",
          filename: "build.js"
        },
        devtool: "#inline-source-map",
        plugins: [new webpack.DefinePlugin({
          "NODE_ENV": JSON.stringify("development")
        })]
      }
    }
  });

  grunt.registerTask("copyToServer", function(){
    grunt.config("copy", {
      main: {
        src: "index.html",
        dest: "AppsManager/client/index.html"
      }
    });
    grunt.task.run("copy");

  });

  grunt.registerTask("copyToServerMin", function() {
    grunt.config("copy", {
      main: {
        src: "index.html",
        dest: "AppsManager/client/index.html",
        options: {
          process: function (content) {
            var str = "build.min";
            return content.replace(/build/g, str);
          }
        }
      }
    });
    grunt.task.run("copy");
  });

  grunt.registerTask("removeAllContents", function(){
    grunt.config("clean", {
      contents: ["AppsManager/client/*"]
    });
    grunt.task.run("clean");
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");

  grunt.registerTask("default", ["removeAllContents", "webpack:dev", "copyToServer"]);
  grunt.registerTask("build", ["removeAllContents", "webpack:build", "copyToServerMin"]);
};