var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.js');
var envWebpackconfig = require('./webpack.' + process.env.NODE_ENV + '.js');
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var props = require('../../config');
var find = require('../find.js');

var webpackConfig = merge(baseWebpackConfig, envWebpackconfig);

function getWebpackEntry(callback){

  var entrys = props['webpack.entry'];
  var _entrys = {};
  var context = props['webpack.context'] ? path.resolve(props['webpack.context']) : '';

  gulp.src(entrys)
    .pipe(find(function(filepath , file){
      var ename = path.relative(context || file.base , filepath);
      var files = [];
      /**
       * mock测试JS
       */
      if(props.mock){
        var mockFile = filepath.substring(0 , filepath.lastIndexOf(path.sep) + 1) + 'mock.js';

        if(fs.existsSync(mockFile)){
          files.push(mockFile);
        }
      }

      if (process.env.WebpackDevServer) {
        files.push('webpack-hot-middleware/client?reload=true');
      }
      
      files.push(filepath);

      _entrys[path.dirname(ename)] = files;
    }))
    .on('end' , function(){
      webpackConfig.entry = _entrys;
      callback(webpackConfig);
    });
}


module.exports = getWebpackEntry;