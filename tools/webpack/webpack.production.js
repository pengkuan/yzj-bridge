var webpack = require('webpack');

module.exports = {
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.NoEmitOnErrorsPlugin(),
  ]
}