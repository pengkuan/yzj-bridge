/* global qing $ _ */

describe('qing.call("shareFile")', '分享文件', function(tc) {
  var $input = $('<div></div>')
  var $btn = $('<button>分享文件</button>')
  tc.append($input)
  tc.append($btn)

  var params = {
    'filesList': [{
      'fileId': '58a6b73ce4b09877c172aac1',
      'fileName': '机器人五子棋大赛.pdf',
      'fileExt': 'pdf',
      'fileSize': '79001',
      'fileTime': '2017-02-21 10:00:00',
    }, {
      'fileId': '58a6b73ce4b09877c172aac1',
      'fileName': '机器人五子棋大赛.pdf',
      'fileExt': 'pdf',
      'fileSize': '79001',
      'fileTime': '2017-02-21 10:00:00',
    }]
  }
  $input.html('<p>输入：' + tc.code(params) + '</p>')

  $btn.click(function(evt) {
    qing.call('shareFile', _.extend(params, {
      complete: function(data, res) {
        tc.updateStatus(res.code);
        tc.append('<p>输出：' + tc.code(data) + '</p>')
      }
    }))
  })
})

