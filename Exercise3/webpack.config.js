var webpack = require("webpack");
module.exports={
	entry: "./Lib/Main",
	output:{
		filename: "build.js",
		library:"Main"
	},
	
	module: {
		loaders: [
				{ test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
				{ test: /\.css$/, loader: 'css' },
				{ test: /\.html?$/, loader: 'dom?tag=section!html' }
		]
	},
	
	plugins: [
	]

};