var gulp = require('gulp');
var path = require('path');
var find = require('../tools/find.js');
var tasks = require('../tools/tasks.js');
var relativeReplace = require('gulp-relative-replace');
var rename = require('gulp-rename');
var istanbulReport = require('gulp-istanbul-report');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var props = require('../config');

var buildDir = props['build.dir'];
var coverageFile = './coverage/coverage.json';

var testFile = [];

/**
 * 生成需要测试的文件清单
 */
gulp.task('filter-test-file' , function() {
  testFile.length = 0;

  return gulp
      .src(buildDir + '/**/*.test.js', {read: false})
      .pipe(find(function(filepath){
        testFile.push(filepath.replace(/\.test\.js$/ , '.js'));
      }));
});

/**
 * 生成测试的html
 */
gulp.task('build-test-html' , ['filter-test-file'], function() {

  var files = [];
  testFile.forEach(function(f){
    files.push(f.replace(/.js$/ , '.html'));
  });

  var head = [];
  head.push('<link rel="stylesheet" type="text/css" href="@__relative@testcss.css"/>');
  head.push('<script src="@__relative@../node_modules/mocha/mocha.js"></script>');
  head.push('<script src="@__relative@../node_modules/chai/chai.js"></script>');
  head.push('<script>window.__now = '+Date.now()+';</script>');
  head.push('<script src="@__relative@../test/libs/coverage-support.js"></script>');

  var body = [];
  body.push('<script src="@__relative@testlibs.js"></script>');

  return gulp
    .src(files , {
      base : buildDir
    })
    .pipe(find(function(filepath , file){
      var filename = path.basename(filepath , '.html');
      var append = '<script src="'+filename+'.test.js"></script>';

      file.contents = new Buffer(
        String(file.contents)
          // .replace(filename + '.js' , filename+'.coverage.js')
          .replace('</head>' , head.join('\n') + '\n</head>')
          .replace('</body>' , body.join('\n') + append + '\n</body>')
      );
    }))
    .pipe(rename(function(path){
      path.basename += '.test';
    }))
    .pipe(relativeReplace({
      placeholder : '@__relative@',
      to : buildDir
    }))
    .pipe(gulp.dest(buildDir))
})



gulp.task('test' , ['build-test-html'] , function() {
  return gulp
    .src(buildDir + '/**/*.test.html', {read: false})
    .pipe(mochaPhantomJS({
      //http://mochajs.org/#reporters
      reporter: 'list',
      //https://mochajs.org/#usage
      mocha: {
        bail : true
      },
      // dump:'test.log',
      phantomjs: {
        //http://phantomjs.org/api/command-line.html
        settings : {
          ignoreSslErrors : true,
          localToRemoteUrlAccessEnabled : true,
          webSecurityEnabled : false,
          printDebugMessages : true,
        },
        ignoreResourceErrors : true,
        useColors: true,
        viewportSize : {
          width: 800,
          height: 600
        },
        hooks: 'mocha-phantomjs-istanbul',
        coverageFile: coverageFile
      }
    }))
    .on('finish', function() {
      gulp.src(coverageFile)
        .pipe(istanbulReport({
          reporterOpts: {
            dir: './coverage'
          },
          reporters: ['html']
        }))
    });

});