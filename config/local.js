const contextPath = '';

module.exports = {
  'NODE_ENV': 'development',
  'debug' : true,
  'mock' : true,
  'contextPath': contextPath,
  // 'compresss' : false,
  // 'platform' : 'win',
  'build.dir' : './build/',
  'dist.dir': './build',
  'build.html' : [
    './src/pages/**/*.html'
  ],
  'webpack.context' : '',
  'webpack.entry' : [
    './src/entrys/**/app.js'
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
    'js' : {
      src : [['']],
      tpl : '<script src="%f.js"></script>'
    },
  },
  'webpack.public.path': contextPath + '/',
  'publish.host': 'http://localhost:8080'
}