module.exports = {
  module: {
    rules: [
    /**
     * 不输出debug信息，比较干扰
     */
    {
    test: /\.js$/,
    enforce: "pre",
    exclude : [
      /(node_modules|bower_components|test|testcase)/
    ],
    loader: StringReplacePlugin.replace({
      replacements: [
        {
          pattern: /console.log/ig,
          replacement: function (match, p1, offset, string) {
              return 'void';
          }
        },
        {
          pattern: /console.debug/ig,
          replacement: function (match, p1, offset, string) {
              return 'void';
          }
        }
      ]
    })
  },
  /**
   * 当为自动化测试时候，用于统计覆盖率
   */
  {
    test: /\.js$/,
    enforce: "pre",
    exclude : [
      path.resolve(__dirname, "src/conf"),
      path.resolve(__dirname, "src/commons"),
      path.resolve(__dirname, "src/libs"),
      // path.resolve(__dirname, "src/modules/mock"),
      path.resolve(__dirname, "src/modules/global"),
      /mock/,
      /(node_modules|bower_components|test|testcase)/,
      /mock\.js$/
    ],
    loader: 'istanbul-instrumenter',
    options: {
      esModules: true,
      produceSourceMap : true,
      thresholds : {
        statements: 70,
        branches: 80,
        lines: 70,
        functions: -10
      },
    }
  }]
}
