module.exports = {
  root: true,
  env: {
    'browser': true,
    'commonjs': true,
    'es6': true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  // required to lint *.vue files
  plugins: [
      'html'
  ],
  globals: {
    'describe': false,
    'it': false,
    'expect': false,
    'before': false,
    'after': false,
    'beforeEach': false,
    'afterEach': false,
    'process': false
  },
  'rules': {
    //禁止对于分号
    'no-extra-semi' : 0,
    'no-console': 0,  
    //http://eslint.cn/docs/rules/no-fallthrough
    'no-fallthrough' : 0,

    'no-mixed-spaces-and-tabs': 1, 
    'no-extra-boolean-cast': 0,

    //指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格  
    'array-bracket-spacing' : [
      'warn',
      'never'
    ],

    'indent': [
      'warn',
      2,
      { 
        'SwitchCase': 1 //强制 switch 语句中的 case 子句的缩进水平
      }
    ],

    'linebreak-style': [
      'off',
      'unix'
    ],

    'quotes': [
      'warn',
      'single'
    ],

    //不对数组或对象末尾逗号做强制要求
    'comma-dangle' : [
      'off',
      'never'
    ],

    //未使用的变量
    'no-unused-vars': [
      'warn', 
      {'vars': 'local', 'args': 'none'}
    ],  
  }
};