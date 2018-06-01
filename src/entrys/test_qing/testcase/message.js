/* global qing $ _ */


describe('qing.call("mergeMsgRecord")', '查看合并转发的历史消息界面', function(tc) {
  var $input = $('<div></div>')
  var $btn = $('<button>查看</button>')
  tc.append($input)
  tc.append($btn)

  var params = {
    'mergeId': '58f6dd8ee4b0d7de9e088fa1', 
    'title': '齐菲和郑伟彤的聊天记录'
  }
  $input.html('<p>输入：' + tc.code(params) + '</p>')

  $btn.click(function(evt) {
    qing.call('mergeMsgRecord', _.extend(params, {
      complete: function(data, res) {
        tc.updateStatus(res.code);
        tc.append('<p>输出：' + tc.code(data) + '</p>')
      }
    }))
  })
})