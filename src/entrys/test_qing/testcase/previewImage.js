/* global qing $ _ */

describe('qing.call("previewImage")', '预览图片', function(tc) {
  var $input = $('<div></div>')
  var $btn = $('<button>预览图片</button>')
  tc.append($input)
  tc.append($btn)

  var params = {
    current:'http://yunzhijia.com/microblog/filesvr/5954c1790bbc5813d50d85d9?original',
    urls:[
      'https://github.com/gdutkyle/ReviseForInterview/blob/master/picture/baidu.png',
      'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
      'http://yunzhijia.com/microblog/filesvr/5954c1790bbc5813d50d85d9?original',
      'http://f.hiphotos.baidu.com/image/h%3D200/sign=333f3ac494510fb367197097e932c893/a8014c086e061d95df89434571f40ad163d9ca84.jpg',
      'http://pic25.photophoto.cn/20121216/0010023956779853_b.jpg',
      'https://github.com/gdutkyle/ReviseForInterview/blob/master/picture/change.jpg?raw=true'
    ]
  }
  $input.html('<p>输入：' + tc.code(params) + '</p>')

  $btn.click(function(evt) {
    qing.call('previewImage', _.extend(params, {
      complete : function (data, res) {
        tc.updateStatus(res.code);
        tc.append('<p>输出：' + tc.code(data) + '</p>')
      }
    }))
  })
})