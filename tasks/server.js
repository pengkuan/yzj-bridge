var gulp          = require('gulp');
var path          = require('path');
var webpack       = require('webpack');
var express = require('express');
var webpackDevMiddleware = require('webpack-dev-middleware');
var proxyMiddleware = require('http-proxy-middleware');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var Q = require('q');
var getConfig = require('../tools/webpack');
var props          = require('../config');
var buildDir = props['build.dir'];
var distDir = props['dist.dir'];

function Promise(fun){
  var deferred = Q.defer();
  fun(deferred.resolve);
  return deferred.promise;
}

gulp.task('server', function() {
  process.env.WebpackDevServer = true;

  var build = function(cb){
    gulp
    .start('build.resource' , 'build.html'  , function(){
      //清除dist目录，防止误发布
      gulp.src([distDir], {read: false})
          .pipe(clean());
      cb();
    })
  };
  gulp.watch(props['build.html'] , build);

  var task1 = Promise(build);

  var task2 = Promise(function(cb){
    getConfig(function(webpackConfig){
      var app = express();
      var compiler = webpack(webpackConfig);

      app.use(webpackDevMiddleware(compiler, {
        hot: true,
        publicPath: props.contextPath || '/',
        quiet: true,
        stats: {
          colors: true,
        },
      }));
      app.use(require('webpack-hot-middleware')(compiler, {
      }));

      app.use(props.contextPath || '/', express.static(buildDir));

      Object.keys(props.proxyTable || {}).forEach(function (context) {
        var options = props.proxyTable[context]
        if (typeof options === 'string') {
          options = { 
            target: options,
            changeOrigin:true
          }
        }
        app.use(proxyMiddleware(options.filter || context, options))
      });



      app.listen(8080, function (err) {
        if (err) {
          gutil.log(err);
          return;
        }
        cb();
      });
      // config.plugins.push(new webpack.HotModuleReplacementPlugin());
      // //生成的路径
      // config.output.path = path.resolve(props['build.dir']);
      // //build.dir = ./build，去除前面多余的“.”，否则无法访问
      // config.output.publicPath = props['build.dir'].replace(/^\./ , '');

      // var compiler = webpack(config , cb);
      // var server = new WebpackDevServer(compiler, {
      //   publicPath: config.output.publicPath,
      //   hot: true,
      //   noInfo: true,
      //   stats: { 
      //     assets: false,
      //     chunks : false,
      //     colors: true 
      //   },
      // });
      // server.listen(8080 , '0.0.0.0');
    });
  })
  
  Q.all([task1 , task2]).then(function(){
    gutil.log('[SERVER] 开发服务启动完成：http://localhost:8080' + props.contextPath);
  });
  

  
});