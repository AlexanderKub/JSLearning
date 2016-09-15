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
          path: "./dist",
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

  grunt.registerTask("minifyCSSFiles", function(){
    grunt.config("cssmin", {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files:{
          "dist/style.min.css": ["frontend/css/style.css", "frontend/css/quill.snow.css"]
        }
      }
    });
    grunt.task.run("cssmin");
  });

  grunt.registerTask("minifyHTMLFiles", function(){
    var strData = grunt.file.read("frontend/index.html", {encoding: "utf8"});
    var objReg = /style.css/gi;
    var stl = grunt.file.read("dist/style.min.css")
    strData = strData.replace(objReg, "<style>"+stl+"</style>");
    objReg = /build.js/gi;
    var scr = grunt.file.read("dist/build.min.js");
    strData = strData.replace(objReg, "<script>"+scr+"</script>");
    grunt.file.write("dist/index.html" , strData );
    grunt.initConfig({
      htmlcompressor: {
        compile: {
          files: {
            "dist/index.html": "dist/index.html"
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

  grunt.registerTask("copyToPublicServer", function(){
    grunt.config("copy", {
      main: {
        src: "dist/index.html",
        dest: "backend/client/index.html",
        options: {
          process: function (content) {
            return content.replace(/!host/g, "https://forum-js.herokuapp.com");
          }
        }
      }
    });
    grunt.task.run("copy");
  });

  grunt.registerTask("copyToLocalServer", function(){
    grunt.config("copy", {
      main: {
        src: "dist/index.html",
        dest: "backend/client/index.html",
        options: {
          process: function (content) {
            return content.replace(/!host/g, "http://127.0.0.1:3000");
          }
        }
      }
    });
    grunt.task.run("copy");
  });

  grunt.registerTask("copyDev", function() {
    var strData = grunt.file.read("frontend/index.html", {encoding: "utf8"});
    var objReg = /style.css/gi;
    strData = strData.replace(objReg,"<link href='http://127.0.0.1:3000/quill.snow.css' rel='stylesheet'>");
    objReg = /build.js/gi;
    strData = strData.replace(objReg, "<script src='http://127.0.0.1:3000/build.js'></script>");
    grunt.file.write("backend/client/index.html" , strData );
    grunt.config("copy", {
      main: {
        src: "dist/build.js",
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

  grunt.registerTask("copyDevCss", function() {
    grunt.config("copy", {
      main: {
        src: "frontend/css/quill.snow.css",
        dest: "backend/client/quill.snow.css"
      }
    });
    grunt.task.run("copy");
  });

  grunt.registerTask("removeExtendContents", function(){
    grunt.config("clean", {
      contents: ["dist/style.min.css","dist/build.min.js","dist/build.js"]
    });
    grunt.task.run("clean");
  });
  
  grunt.registerTask("removeAllContents", function(){
    grunt.config("clean", {
      contents: ["backend/client/*"]
    });
    grunt.task.run("clean");
  });

  grunt.registerTask("default", ["removeAllContents", "webpack:build-dev", "copyDev",
    "copyDevCss", "removeExtendContents"]);
  grunt.registerTask("build-local", ["webpack:build", "minifyCSSFiles", "minifyHTMLFiles",
    "removeAllContents", "copyToLocalServer", "removeExtendContents"]);
  grunt.registerTask("build-public", ["webpack:build", "minifyCSSFiles", "minifyHTMLFiles",
    "removeAllContents", "copyToPublicServer", "removeExtendContents"]);
  
  grunt.loadNpmTasks("grunt-htmlcompressor");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
};