var fs = require('fs')
var gulp = require('gulp')
var gutil = require('gulp-util');

gulp.task('default' , ['help'], function () {
});

gulp.task('help' , function () {

  var content = fs.readFileSync('./tasks/help.txt' , 'utf-8');
  gutil.log('\n' + content);

})
