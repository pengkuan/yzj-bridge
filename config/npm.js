const contextPath = '';

module.exports = {
  'NODE_ENV': 'production',
  'debug' : false,
  'mock' : false,
  'contextPath': contextPath,
  'compresss' : true,
  'build.dir' : './build/',
  'dist.dir' : './dist/',
  'build.html' : [],
  'webpack.context' : '',
  'webpack.entry' : [
    './src/entrys/**/npm.js'
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
  'build.htmlreplace' : {},

  'webpack.public.path' : '/'//必须以/结束
}