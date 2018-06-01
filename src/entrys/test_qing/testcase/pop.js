/* global qing $ _ */

describe('qing.call("createPop")', '自定义右上角弹出菜单', function(tc) {
  var $input = $('<div></div>')
  var $btn = $('<button>设置</button>')
  tc.append($input)
  tc.append($btn)
  $btn.click(function(evt) {
    var params = {
      'popTitle': '测试标题' + Date.now(),
      'popTitleCallBackId': '弹出菜单的ID',
      'items': [{
        'text': '测试',
        'callBackId': '测试项的单项ID'
      }],
      'menuList': ['refresh', 'share', 'openWithBrowser']
    }
    $input.html('<p>输入：' + tc.code(params) + '</p>')
    qing.call('createPop', _.extend(params, {
      complete : function (data, res) {
        tc.updateStatus(res.code);
        tc.append('<p>输出：' + tc.code(data) + '</p>')
      }
    }))
  })
})


describe('qing.call("closePop")', '关闭右上角弹出菜单', function(tc) {
  var $input = $('<div><p>输入：无</p></div>')
  var $btn = $('<button>closePop</button>')
  tc.append($input)
  tc.append($btn)
  $btn.click(function(evt) {
    qing.call('closePop')
  })
})

