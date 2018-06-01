/*eslint-disable */
var webpack = require('webpack');
var gutil = require('gulp-util');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var path = require('path');
var fs = require('fs');
var StringReplacePlugin = require("string-replace-webpack-plugin");
var cssLoaderUtils = require('./loader/css-loader.utils')
var props = require('../../config');
var buildDir = props['build.dir'];

function resolve (dir) {
    return path.join(__dirname, '../../', dir)
}


module.exports = {
  context: process.cwd(),
  output: {
    path: path.resolve(buildDir),
    publicPath: props['webpack.public.path'],
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js',
    pathinfo: true,
    jsonpFunction: 'qingJsonpFunction'
  },
  module: {
    rules: [
      ...cssLoaderUtils.styleLoaders({
        extract: process.env.NODE_ENV != 'development'
      }),
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
            formatter: require('eslint-friendly-formatter')
        }
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'imgs/[sha512:hash:base64:6]_[name].[ext]'
        }
      }, {
        test: /\.html$/, 
        loader: 'ejs-loader'
      },{
        test: /\.dot/, 
        loader: 'js-beautify'
      },{
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        include: [resolve('src'), resolve('test')],
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env.PROJECT_VERSION': JSON.stringify(require('../../package.json').version),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.BUILD_HOST': props['publish.host']
    }),
    new StringReplacePlugin(),
    new FriendlyErrorsPlugin(),

  ],
  externals: {
  },
  resolve : {
    extensions: ['.js', '.json'],
    // modules: [
    //   resolve('src'), 
    //   resolve('test')
    // ],
    alias : {
      '@': resolve('src')
    }
  }
}