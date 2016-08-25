var webpack = require("webpack");
module.exports={
	entry: "./Lib/Main",
	output:{
		filename: "build.js",
		library:"Main"
	},
	
	module: {
		loaders: [
	        {
	            test: /\.css$/,
	            loader: "style!css"
	        }, {
	            test: /\.ejs$/,
	            loader: 'ejs-loader?variable=data'
	        },

        ]
	},
	plugins: [
    new webpack.ProvidePlugin({
        _: "lodash"
    })
]

};