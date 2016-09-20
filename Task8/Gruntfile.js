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
              "NODE_ENV": JSON.stringify("production"),
              "NODE_URL": JSON.stringify("https://forum-js.herokuapp.com")
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
        debug: true,
        plugins: [new webpack.DefinePlugin({
          "NODE_ENV": JSON.stringify("development"),
          "NODE_URL": JSON.stringify("http://127.0.0.1:3000")
        })]
      }
    }
  });

  grunt.registerTask("minifyHTMLFiles", function(){
    var strData = grunt.file.read("frontend/index.html", {encoding: "utf8"});
    var objReg = /!buildJS/g;
    var scr = grunt.file.read("build/build.min.js");
    strData = strData.replace(objReg, "<script>"+scr+"</script>");
    if (arguments.length === 0) {
      grunt.file.write("build/info.txt" , "build-сборка с локальными url.");
    }else{
      grunt.file.write("build/info.txt" , "production-сборка с публичными url.");
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

  grunt.registerTask("copyIndexToBuild", function() {
    grunt.file.write("build/info.txt" , "dev-сборка");
    grunt.config("copy", {
      main: {
        src: "frontend/index.html",
        dest: "build/index.html",
        options: {
          process: function (content) {
            var str = "<script src='http://127.0.0.1:3000/build.js'></script>";
            return content.replace(/!buildJS/g, str);
          }
        }
      }
    });
    grunt.task.run("copy");
  });


  grunt.registerTask("copyToDevServer", function() {
    grunt.file.write("build/info.txt" , "dev-сборка");
    grunt.config("copy", {
      main: {
        files:[
          {expand: true, cwd:"build/" ,src:"**", dest: "backend/client/"}
        ],

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

  grunt.registerTask("default", ["removeAllContents", "webpack:build-dev","copyIndexToBuild","copyToDevServer"]);
  grunt.registerTask("build", ["removeAllContents", "webpack:build", "minifyHTMLFiles", "copyToServer"]);
  grunt.registerTask("build-public", ["removeAllContents", "webpack:build", "minifyHTMLFiles:public", "copyToServer"]);
  
  grunt.loadNpmTasks("grunt-htmlcompressor");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
};