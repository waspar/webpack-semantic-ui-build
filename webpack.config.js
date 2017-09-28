// require
const webpack = require('webpack'),
	path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin');

//  production build flag
const isProduction = process.env.NODE_ENV === 'production';

// css settings
let cssDev = ['style-loader', 'css-loader', 'sass-loader?sourceMap=true'],
	cssProd = ExtractTextPlugin.extract(
		{
			fallback: 'style-loader',
			use: ['css-loader', 'sass-loader']
		}
	),
	cssConf = isProduction ? cssProd : cssDev;

// config
const config = {
	entry:{
		index: path.resolve(__dirname, 'src/index.js')
		,second: path.resolve(__dirname, 'src/second.js')
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		publicPath: '/',
		filename: '[name].js',
		library: '[name]'
	},
	resolve: {
		modules: ['node_modules', 'src'],
		alias: {
			'semantic-ui': path.join(__dirname, "semantic", "dist", "semantic.min.js"),
		},
		//extensions: ['', '.js', '.mjs', '.jsx']
	},
	module: {
		rules: [

			// js
			{
				test: /\.js$/,
				include: /src/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					//options: {
					//	presets: ['es2015', 'stage-0']
					//}
				}
			},

			// css
			{
				test: /\.s?css$/,
				use: cssConf
			},

			// images
			{
				test: /\.(gif|svg|jpe?g|png|webp)$/i,
				use: {
					loader: 'file-loader?name=[hash].[ext]&publicPath=img/!image-webpack-loader',
					query: {
						useRelativePath: isProduction
					}
				}
			}

		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'css/styles.css',
			disable: !isProduction,
			allChunks: true
		})
		//,new webpack.HotModuleReplacementPlugin()
		//,new webpack.NamedModulesPlugin()
		,new webpack.optimize.CommonsChunkPlugin(
			{
				name: 'common'
				//,names: ['index', 'second'] // chunk of entries [...]
				,minChunks: 2 // Infinity
			}
		)
		,new webpack.DefinePlugin(
			{
				PROJECT_PRODUCTION: JSON.stringify(isProduction),
				PROJECT_LANG: JSON.stringify('ru'),
			}
		)
	],

	// options
	bail: true, // NoEmitOnErrorsPlugin


	// dev
	devServer: {
		open: true,
		hot: true,
		stats: 'errors-only',
		historyApiFallback: true,
		contentBase: 'public',
		//contentBase: path.join(__dirname, 'public'),
		//contentBase: path.resolve(__dirname),
		port: '9000',
		host: '0.0.0.0'
	},
	devtool: isProduction ? "source-map" : false, // devtool: 'cheap-module-source-map',
	watch: isProduction,
	watchOptions: {
		aggregateTimeout: 300
		,ignored: '/node_modules/'
	}

};
// \ config

module.exports = config;