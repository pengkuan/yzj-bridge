/* global qing $ _ */

describe('当前环境：', function(tc) {
  tc.subtitle.html(qing.isSupportNativeJsBridge ? 'Native' : 'Web')
  tc.append('<p>' + navigator.userAgent + '</p>')
  tc.updateStatus(200)
});

describe('qing.config', '配置', function(tc) {
  var params = {
    debug: true,
    auth: false,
    jsApiList: [
      'checkJsApi',
      'getPersonInfo',
      'toast',
    ]
  }

  tc.append('<p>输入：' + tc.code(params) + '</p>')

  qing.config(_.extend(params, {
    complete: function(res) {
      tc.updateStatus(res.code)
      tc.append('<p>输出：' + tc.code(res) + '</p>')
    }
  }))
});

describe('qing.checkJsApi', '判断是否支持相应接口', function(tc) {
  var params = {
    jsApiList: [
      'ajax',
      'playVoice',
      'startRecord',
      'chooseImage',
      'getPersonInfo',
      'isLogin'
    ],
  }

  tc.append('<p>输入：' + tc.code(params) + '</p>')

  qing.checkJsApi(_.extend(params, {
    complete: function(data, res) {
      tc.updateStatus(res.code)
      tc.append('<p>输出：' + tc.code(data) + '</p>')
    }
  }))
});

