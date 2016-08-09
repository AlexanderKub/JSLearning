module.exports = function(grunt) {

	grunt.loadNpmTasks("grunt-webpack");
	grunt.loadNpmTasks('grunt-contrib-uglify');
    var webpackConfig = require("./webpack.config.js");
    var webpack = require("webpack");
	
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
				src: './build.js',
				dest: './production.min.js'
			}
		}
	});
    grunt.registerTask("default", ["webpack:dev"]);
    grunt.registerTask("build", ["webpack:build","uglify"]);
};