const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const PATHS = {
	  src: path.join(__dirname, 'src')
	}

module.exports = {
  entry: {
	main: './src/index.js',
	app: './src/app/app.js',
  },
  output: {
	filename: '[name].[contenthash:8].js',
	path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
	runtimeChunk: 'single',
	splitChunks: {
	  chunks: 'all',
	  maxInitialRequests: Infinity,
	  minSize: 0,
	  cacheGroups: {
		  styles: {
				name: 'styles',
				test: /\.css$/,
				chunks: 'all',
				enforce: true
			  },
		vendor: {
		  test: /[\\/]node_modules[\\/]/,
		  name(module) {
			const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
			return `npm.${packageName.replace('@', '')}`;
		  },
		},
	  },
	},
  },
  plugins: [
	new MiniCssExtractPlugin({
	  filename: 'style.[contenthash:8].css',
	  chunkFilename: '[id].css',
	}),
	new CleanWebpackPlugin(),
	new HtmlWebpackPlugin({
	  template: './src/app/index.html',
	}),
	new webpack.ProvidePlugin({
	  jQuery: 'jquery',
	  $: 'jquery',
	  jquery: 'jquery',
	}),
	new GoogleFontsPlugin({
	  fonts: [{
		  family: "Roboto",
		  variants: ["300", "400", "500", "700"]
		},
		{
		  family: "Roboto Slab",
		  variants: ["400", "700"]
		},
	  ],
	  path: 'fonts/'
	}),
	new CopyPlugin({
	  patterns: [{
		  from: 'src/manifest.json',
		  to: 'manifest.json'
		},
		{
		  from: '*',
		  to: 'templates/',
		  context: './src/app/templates/'
		},
		{
		  from: '*',
		  to: 'assets/img/',
		  context: './src/assets/img/'
		},
		{
		  from: '**',
		  to: 'assets/sounds/',
		  context: './src/assets/sounds/'
		},
	  ],
	}),
	new PurgecssPlugin({
		  paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
		  safelist: {
			  greedy: ['playingcard', 'face']
		}
		}),
  ],
  module: {
	rules: [{
		test: /\.css$/,
		use: [{
			loader: MiniCssExtractPlugin.loader,
			options: {
			  publicPath: '/',
			},
		  },
		  'css-loader',
		],
	  },
	  {
		test: /\.(png|jpg|gif)$/i,
		use: [{
		  loader: 'url-loader',
		  options: {
			outputPath: 'assets/img/',
			limit: 8192,
		  },
		}, ],
	  },
	  {
		test: /\.svg$/i,
		use: [{
		  loader: 'svg-url-loader',
		  options: {
			outputPath: 'assets/img/',
			limit: 10000,
		  },
		}, ],
	  },
	  {
		test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
		use: [{
		  loader: 'file-loader',
		  options: {
			name: '[name].[ext]',
			outputPath: 'fonts/'
		  }
		}]
	  }
	],
  },
};