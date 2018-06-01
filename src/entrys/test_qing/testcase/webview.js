/* global qing $ _ */

describe('qing.call("setWebViewTitle")', '设置webview标题', function(tc) {
  var $input = $('<div></div>')
  var $btn = $('<button>设置标题</button>')
  tc.append($input)
  tc.append($btn)
  $btn.click(function(evt) {
    var params = {
      title: 'setWebViewTitle: ' + Date.now()
    }
    $input.html('<p>输入：' + tc.code(params) + '</p>')
    qing.call('setWebViewTitle', params)
  })
})


describe('qing.call("hideWebViewTitle")', '隐藏webview标题', function(tc) {
  var $input = $('<div><p>输入：无</p></div>')
  var $btn = $('<button>隐藏标题</button>')
  tc.append($input)
  tc.append($btn)
  $btn.click(function(evt) {
    qing.call('hideWebViewTitle')
  })
})

describe('qing.call("closeWebView")', '关闭当前窗口', function(tc) {
  var $input = $('<div><p>输入：无</p></div>')
  var $btn = $('<button>关闭窗口</button>')
  tc.append($input)
  tc.append($btn)
  $btn.click(function(evt) {
    qing.call('closeWebView')
  })
})