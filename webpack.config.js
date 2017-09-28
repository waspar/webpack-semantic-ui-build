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
					// options: {presets: ['es2015', 'stage-0']} // off
				}
			},

			// css
			{
				test: /.css$/,
				use: ExtractTextPlugin.extract(
					{
						fallback: 'style-loader',
						use: 'css-loader',
						// publicPath: "/dist"
					}
				)
			},
			// less
			{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			},

			// images && fonts
			// https://webpack.js.org/loaders/file-loader/
			{
				test: /\.(gif|svg|jpe?g|png|webp)$/i,
				use: {
					loader: 'file-loader', // ?publicPath=img/!image-webpack-loader
					query: {
						name: 'images/[name].[ext]' // or name: 'images/[hash].[ext]'
						//,useRelativePath: isProduction
					}
				}
			},

			// files
			// https://webpack.js.org/loaders/url-loader/
			{
				test: /\.(otf|ttf|woff|woff2|etc|eot)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192 // bytes
							,name: 'fonts/[name].[ext]' // or name: 'fonts/[hash].[ext]'
							// ,fallback: 'responsive-loader'
						}
					}
				]
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
		// define global vars
		,new webpack.DefinePlugin(
			{
				PROJECT_PRODUCTION: JSON.stringify(isProduction),
				PROJECT_LANG: JSON.stringify('ru'),
			}
		),
		// provide jquery
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		// locales for moment.js
		new webpack.ContextReplacementPlugin(
			/moment[\/\\]locale$/,
			/en-gb|ru/
		)
	],

	// options
	bail: true, // NoEmitOnErrorsPlugin

	// dev
	devtool: isProduction ? "source-map" : false, // devtool: 'cheap-module-source-map',
	watch: isProduction,
	watchOptions: {
		aggregateTimeout: 300
		,ignored: '/node_modules/'
	},

	// dev server
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

};
// \ config

module.exports = config;