var webpack = require("webpack");

module.exports = function(config) {
  config.set({
    plugins: [
      require("karma-webpack"),
      require("karma-qunit"),
      require("karma-coverage"),
      require("karma-phantomjs-launcher"),
      require("istanbul-instrumenter-loader"),
      require("karma-sinon")
    ],

    basePath: "",
    frameworks: [ "qunit","sinon" ],
    files: [
      "tests/js/*.js"
    ],

    preprocessors: {
      "frontend/**/*.js": ["coverage"],
      "tests/js/*.js": [ "webpack" ]
    },
    reporters: ["progress"],
    coverageReporter: {
      type : "html",
      dir : "tests/coverage/",
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },
    webpack: {
      node : {
        fs: "empty"
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
          }
        ],
        postLoaders: [{
          test: /\.js$/,
          exclude: /(test|node_modules)\//,
          loader: "istanbul-instrumenter"
        }]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    autoWatchDelay: 300,
    browsers: ["PhantomJS"],
    singleRun: false
  });
};
