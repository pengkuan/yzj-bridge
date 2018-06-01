const contextPath = `/public/js/qing/${require('../package.json').version}`;

module.exports = {
  'NODE_ENV': 'production',
  'debug' : false,
  'mock' : false,
  'contextPath': contextPath,
  'compresss' : true,
  // 'platform' : 'win',
  'build.dir' : './build/',
  'dist.dir' : './build/',
  'build.html' : [
    './src/pages/**/*.html'
  ],
  'webpack.context' : '',
  'webpack.entry' : [
    './src/entrys/**/app.js'
  ],
  'publish': [
    './build/**/*.*'
  ],
  'build.concat' : {
    
  },

  /**
   * 内置变量：
   * @__absloute@ 当前html文件绝对访问的目录路径
   * @__relative@ 当前html文件相对访问的目录路径
   * @__now@ 当前编译时间表示，如：20160622211954
   */
  'build.htmlreplace' : {
    'css' : {
      src : [['']],
      tpl : '<link rel="stylesheet" type="text/css" href="%f.css?@__now@"/>'
    },
    'js' : {
      src : [['']],
      tpl : '<script src="%f.js?@__now@"></script>'
    },
  },

  'webpack.public.path' : 'https://static.yunzhijia.com' + contextPath + '/'//必须以/结束
}