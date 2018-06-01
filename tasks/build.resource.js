var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

var getConfig = require('../tools/webpack');
var tasks = require('../tools/tasks.js');
var props = require('../config');
var buildDir = props['build.dir'];


var now = __moment.format('YYYY-MM-DD HH:mm:ss');


gulp.task('build.js', ['build.resource'], function (cb) {

  getConfig(function(webpackConfig){
    webpack(webpackConfig, function (err, stats) {
      if (err) throw new gutil.PluginError('webpack', '打包失败')

      if (stats.hasErrors()) {
        throw new gutil.PluginError('webpack', '打包失败')
      }
      gutil.log('[WEBPACK] Pack finished')
      cb();
    });
  })
});

gulp.task('build.css', ['build.js'], function (cb) {
  cb();
});

gulp.task('webpack', ['build.css'], function (cb) {
  cb();
});

gulp.task('build.config', ['clean'], function (cb) {
  if(!fs.existsSync('./src/conf/config.template.js')){
    cb();
    return;
  }
  gutil.log('[BUILD] 生成配置');

  var stream = gulp.src('./src/conf/config.template.js')
      .pipe(rename('config.js'))
      .pipe(replace('@now@' , new Date().getTime()));

  for (var k in props){
    stream = stream.pipe(replace('@' + k + '@' , props[k]));
  }

  return stream.pipe(gulp.dest('./src/conf/'));
});


gulp.task('build.resource', ['build.config' , 'build.assets'], function () {
  var concats = props['build.concat'];
  var array = [];
  for(var file in concats){
    var name = path.basename(file);

    gutil.log('[BUILD] 合并代码'+file+'');
    array.push(gulp.src(concats[file])
      .pipe(concat(name))
      .pipe(gulp.dest(buildDir + path.dirname(file)))
    );
  }

  return tasks(array);

});