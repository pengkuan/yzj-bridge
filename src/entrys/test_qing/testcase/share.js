/* global qing $ _ */


describe('qing.call("share")', '内部分享', function(tc) {
  var $input = $('<div></div>')
  var $btn = $('<button>分享</button>')
  tc.append($input)
  tc.append($btn)

  var params = {
    'shareType': 4,
    'webpageUrl': 'https://yunzhijia.com/lightapp/c/redirect.json?viewName=detail&lappName=workreport&id=5a24e167e4b0f0710c74647f&share=1',
    'title': '周冠杰的日报',
    'callbackUrl': 'https://yunzhijia.com/workreport/rest/share?id=5a24e167e4b0f0710c74647f',
    'theme': '周冠杰的日报',
    'appName': '工作汇报',
    'appId': 'XT-d28c21a8-532b-480d-b890-f6c1b4a3ddc8',
    'lightAppId': '101091429',
    'content': '今日工作计划：\n\n\n\n昨日工作总结：\n\n\n\n\n',
    'cellContent': '今日工作计划：\n\n\n\n昨日工作总结：\n\n\n\n\n',
    'thumbUrl': 'https://yunzhijia.com/workreport/mobile/dist/static/menu_icon_dailylog.jpg',
    'thumbData': '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',
    'isShowExt': false,
    'sharedObject': 'all',
    'toChat':true
  }
  $input.html('<p>输入：' + tc.code(params) + '</p>')

  $btn.click(function(evt) {
    qing.call('share', _.extend(params, {
      complete: function(data, res) {
        tc.updateStatus(res.code);
        tc.append('<p>输出：' + tc.code(data) + '</p>')
      }
    }))
  })
})