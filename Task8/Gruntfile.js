module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-webpack");
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config.js");

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    webpack: {
      options: webpackConfig,
      build: {
        output: {
          path: "./build",
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
        output: {
          path: "./build",
          filename: "build.js"
        },
        devtool: "#inline-source-map",
        debug: true
      }
    }
  });

  grunt.registerTask("minifyHTMLFiles", function(n){
    var strData = grunt.file.read("frontend/index.html", {encoding: "utf8"});
    var objReg = /build.js/gi;
    var scr = grunt.file.read("build/build.min.js");
    strData = strData.replace(objReg, "<script>"+scr+"</script>");
    if (arguments.length === 0) {
      grunt.file.write("build/info.txt" , "build-сборка с локальными url.");
      strData = strData.replace(/!host/g, "127.0.0.1:3000");
    }else{
      grunt.file.write("build/info.txt" , "production-сборка с публичными url.");
      strData = strData.replace(/!host/g, "https://forum-js.herokuapp.com");
    }
    grunt.file.write("build/index.html" , strData );
    grunt.initConfig({
      htmlcompressor: {
        compile: {
          files: {
            "build/index.html": "build/index.html"
          },
          options: {
            type: "html",
            preserveServerScript: true
          }
        }
      }
    });
    grunt.task.run("htmlcompressor");
  });

  grunt.registerTask("copyToServer", function(){
    grunt.config("copy", {
      main: {
        src: "build/index.html",
        dest: "backend/client/index.html"
      }
    });
    grunt.task.run("copy");
  });

  grunt.registerTask("copyToDevServer", function() {
    var strData = grunt.file.read("frontend/index.html", {encoding: "utf8"});
    var objReg = /build.js/gi;
    strData = strData.replace(objReg, "<script src='http://127.0.0.1:3000/build.js'></script>");
    grunt.file.write("backend/client/index.html" , strData );
    grunt.file.write("build/index.html" , strData );
    grunt.file.write("build/info.txt" , "dev-сборка");
    grunt.config("copy", {
      main: {
        src: "build/build.js",
        dest: "backend/client/build.js",
        options: {
          process: function (content) {
            return content.replace(/!host/g, "http://127.0.0.1:3000");
          }
        }
      }
    });
    grunt.task.run("copy");
  });

  grunt.registerTask("removeAllContents", function(){
    grunt.config("clean", {
      contents: ["backend/client/*", "build/*"]
    });
    grunt.task.run("clean");
  });

  grunt.registerTask("default", ["removeAllContents", "webpack:build-dev", "copyToDevServer"]);

  grunt.registerTask("build", ["webpack:build", "minifyHTMLFiles", "removeAllContents", "copyToServer"]);

  grunt.registerTask("build-public", ["webpack:build", "minifyHTMLFiles:public", "removeAllContents", "copyToServer"]);
  
  grunt.loadNpmTasks("grunt-htmlcompressor");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
};