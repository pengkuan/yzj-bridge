var requireDir = require('require-dir');
var gulp = require('gulp');
var clean = require('gulp-clean');
var moment = require('moment');

var props = require('./config');

var d = new Date();
/**
 * 由于在window下，cygwin获取的时间，时区不对，因此这里重置一下时间，其中-480，是标准东八区的分钟事件差
 */
global.__moment = moment(d.getTime()).add(d.getTimezoneOffset() - (-480) , 'minutes');


gulp.task('clean', function () {
  return gulp.src(['./coverage', props['build.dir'], props['dist.dir'], './test.log'], {
    read: false
  })
  .pipe(clean({
    force: true
  }))
});


requireDir('./tasks');



