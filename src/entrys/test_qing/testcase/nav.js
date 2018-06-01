/* global qing $ _ */


describe('qing.call("defback")', '定义后退事件', function(tc) {
  var $input = $('<div></div>')
  var $btn = $('<button>定义后退事件</button>')
  tc.append($input)
  tc.append($btn)

  var params = {}
  $input.html('<p>输入：' + tc.code(params) + '</p>')

  $btn.click(function(evt) {
    qing.call('defback', _.extend(params, {
      complete: function(data, res) {
        tc.updateStatus(res.code);
        tc.append('<p>输出：' + tc.code(data) + '</p>')
      }
    }))
  })
})