var gulp = require('gulp')
var gutil = require('gulp-util');
var props          = require('../config');
var buildDir = props['build.dir'];

gulp.task('build.assets' , ['clean'], function () {


  gutil.log('[BUILD] 复制资源');

  return gulp.src(['./src/static/**/*.*'])
    .pipe(gulp.dest(buildDir))
})
