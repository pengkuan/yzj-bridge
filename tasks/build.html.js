var gulp = require('gulp');
var path = require('path');
var gutil = require('gulp-util');
var htmlreplace = require('gulp-html-replace');
var relativeReplace = require('gulp-relative-replace');
var _ = require('lodash');
var find = require('../tools/find.js');
var tasks = require('../tools/tasks.js');
var props = require('../config');

var buildDir = props['build.dir'];

/**
 * 替换属性
 *
 * 将@xxx@，替换为对应的值
 */
var replaceProps = function(src ,ext){
  if(!src)return src;

  ext = _.extend(ext , props);

  src = JSON.stringify(src);
  for (var k in ext){
    src = src.replace(new RegExp('@' + k.replace(/\./g , '\\.') + '@' , 'g') , ext[k] || '');
    // console.log(src);
  }
  src = JSON.parse(src);
  return src;
};

function now(){ 
    return __moment.format('YYYYMMDDHHmmss'); 
}

var builder = function(){
  var files = [];
  var map = [];

  var isWebpackServerMode = process.env.WebpackDevServer;
  //htmlreplace 默认配置
  var defaultMap = {
    'css' : {
      src : null,
      tpl : '<link rel="stylesheet" type="text/css" href="@__absloute@%f.css"/>'
    },
    'js' : {
      src : null,
      tpl : '<script src="@__absloute@%f.js"></script>' + (isWebpackServerMode ? '<script src="/webpack-dev-server.js"></script>' : '')
    }
  };
  //将项目配置与默认配置合并
  var replaceMap = _.extend(defaultMap , props['build.htmlreplace'] || {});

  this.push = function(file){
    var filepath = file.path;

    
    var rmap = replaceProps(replaceMap , {
      '__now' : now()
    });


    files.push(file);
    map.push(rmap);
  };

  var processOne = function(file , index){
    var filepath = file.path;
    //文件相对于工程的路径
    var relativePath = path.relative(file.cwd , filepath);
    
    //目标生成的文件夹的路径
    var targetDir = path.join(buildDir , path.relative(file.base , path.dirname(filepath))) + '/';

    gutil.log('[BUILD] 生成' + path.relative(file.base , relativePath));


    return gulp
        .src(filepath)
        .pipe(htmlreplace(map[index] , {
          keepUnassigned: isWebpackServerMode,
          keepBlockTags: isWebpackServerMode
        }))
        .pipe(relativeReplace({
          placeholder : '@__relative@',
          from : targetDir,
          to : buildDir
        }))
        //set @__absloute@ to empty
        .pipe(relativeReplace({
          placeholder : '@__absloute@'
        }))
        .pipe(
          gulp.dest(targetDir)
        )
  }

  this.process = function(cb){
    var taskArray = []
    files.forEach(function(file , index){
      taskArray.push(processOne(file , index))
    })

    tasks(taskArray , cb)
  }
}


gulp.task('build.html' ,['clean'] , function (cb) {
  var instance = new builder();
  if (!props['build.html'] || props['build.html'].length == 0) {
    cb()
    return
  }
  gulp.src(props['build.html'])
    .pipe(find(function(filepath , file){
      instance.push(file)
    }))
    .on('end' , function(){
      instance.process(cb)
    })
})