/* global qing $ _ */

describe('qing.call("getPersonInfo")', '读取用户信息', function(tc) {
  qing.call('getPersonInfo', {
    complete: function(data, res) {
      tc.updateStatus(res.code)
      tc.append('<p>输出：' + tc.code(data) + '</p>')
    }
  })
})

describe('qing.call("getPersonDepartment")', '获取当前用户部门名称与部门ID', function(tc) {
  qing.call('getPersonDepartment', {
    complete: function(data, res) {
      tc.updateStatus(res.code)
      tc.append('<p>输出：' + tc.code(data) + '</p>')
    }
  })
})

describe('qing.call("chat")', '聊天', function(tc) {
  var $input = $('<div></div>')
  var params = {
    openId: '76d2f712-b8c3-11e3-8d13-e41f137ad9f4'
  }
  $input.html('<p>输入：' + tc.code(params) + '</p>')
  var $btn = $('<button>聊天</button>')
  tc.append($input)
  tc.append($btn)
  $btn.click(function(evt) {
    qing.call('chat', params)
  })
})

describe('qing.call("personInfo")', '显示人员卡片', function(tc) {
  var $input = $('<div></div>')
  var params = {
    openId: '76d2f712-b8c3-11e3-8d13-e41f137ad9f4'
  }
  $input.html('<p>输入：' + tc.code(params) + '</p>')
  var $btn = $('<button>显示人员卡片</button>')
  tc.append($input)
  tc.append($btn)
  $btn.click(function(evt) {
    qing.call('personInfo', params)
  })
})

describe('qing.call("toast")', 'toast', function(tc) {
  var $input = $('<div></div>')
  var params = {
    openId: '76d2f712-b8c3-11e3-8d13-e41f137ad9f4'
  }
  $input.html('<p>输入：' + tc.code(params) + '</p>')
  var $success = $('<button>success</button>')
  var $error = $('<button>error</button>')
  var $warning = $('<button>warning</button>')
  var $info = $('<button>info</button>')
  
  tc.append($success)
  tc.append($error)
  tc.append($warning)
  tc.append($info)

  $success.click(function(evt) {
    var params = {
      type: 'success',
      msg: '这是成功消息',
      duration: 3,
      position: 'top'
    }
    $input.html('<p>输入：' + tc.code(params) + '</p>')
    qing.call('toast', params)
  })

  $error.click(function(evt) {
    var params = {
      type: 'error',
      msg: '这是失败消息',
      position: 'bottom',
      duration: 2
    }
    $input.html('<p>输入：' + tc.code(params) + '</p>')
    qing.call('toast', params)
  })

  $warning.click(function(evt) {
    var params = {
      type: 'warning',
      msg: '这是警告消息',
      position: 'middle',
      duration: 1
    }
    $input.html('<p>输入：' + tc.code(params) + '</p>')
    qing.call('toast', params)
  })

  $info.click(function(evt) {
    var params = {
      type: 'info',
      msg: '这是消息',
      position: 'bottom'
    }
    $input.html('<p>输入：' + tc.code(params) + '</p>')
    qing.call('toast', params)
  })
})