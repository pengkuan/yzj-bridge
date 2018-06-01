var props = require('../config');
var buildDir = props['build.dir'];
var distDir = props['dist.dir'];
var gulp = require('gulp');
var minify = require('gulp-babel-minify');
var header = require('gulp-header');
var gutil = require('gulp-util');
var relativeReplace = require('gulp-relative-replace');
var minifyCss     = require('gulp-minify-css');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');


var tasks = require('../tools/tasks.js');


var publish = props['publish'] || [];

var now = new Date().toLocaleString();



gulp.task('resource.compresss', ['webpack'] , function (cb) {
  if(!props.compresss){
    cb();
    return;
  }
  
  gutil.log('[BUILD] 压缩代码ing...');

  //压缩js
  var task1 = gulp.src(buildDir + '/**/*.js')
      .pipe(minify({
        removeConsole: false
      }))
      .pipe(header('/* generated @ <%= time %>*/\n', { 
        time : now
      }))
      .pipe(gulp.dest(buildDir));

  var task2 = gulp.src(buildDir + '/**/*.css')
    .pipe(postcss([autoprefixer({browsers:[
      '> 1%', 'Firefox > 10', 'ie > 9', 'Chrome > 40'
    ]})]))
    .pipe(minifyCss({compatibility: 'ie9'}))
    .pipe(header('/* generated @ <%= time %>*/\n', { 
        time : now
    }))
    .pipe(gulp.dest(buildDir));

  return tasks([task1 , task2]);
});

gulp.task('replace', ['resource.compresss' , 'build.html'] , function () {
  return gulp.src(buildDir + '/**/*.*')
    .pipe(relativeReplace({
      placeholder : '@__relative@',
      to : buildDir
    }))
    .pipe(relativeReplace({
      placeholder : '@__absloute@',
      from : buildDir
    }))
    .pipe(gulp.dest(buildDir))
});

gulp.task('build', ['replace'] , function () {
  var array = [];
  if (publish.length > 0 ){
    array.push(gulp.src(publish)
      .pipe(gulp.dest(distDir)));
  }

  return tasks(array);
});