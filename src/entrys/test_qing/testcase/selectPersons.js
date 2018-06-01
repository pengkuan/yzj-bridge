/* global qing $ _ */

describe('qing.call("selectPersons")', '选人桥', function(tc) {
  var $input = $('<div></div>')
  var $choice = $(`
    <div><label><input id="sp_isMulti" type="checkbox" checked/>isMulti：多选</label></div>
    <div><label><input id="sp_isShowMe" type="checkbox" checked/>isShowMe：是否显示自己</label></div>
    <div><label><input id="sp_ignore_c" type="checkbox"/>ignore：</label><input id="sp_ignore" type="text" placeholder="排除人员的openId"></div>
    <div><label><input id="sp_selected_c" type="checkbox"/>selected：</label><input id="sp_selected" type="text" placeholder="已选名单，包含人员的openId"></div>
    <div><label><input id="sp_range_c" type="checkbox"/>range：</label><input id="sp_range" type="text" placeholder="选人范围，指定选人范围，指定范围后，不能从通讯录中选择人员，忽略ignore参数"></div>
    <div><label><input id="sp_extra" type="checkbox"/>extra：只显示外部好友</label></div>
    <div><label><input id="sp_isShowExt" type="checkbox" checked/>isShowExt：是否显示外部好友</label></div>
    <div><input id="sp_title" type="text" placeholder="组件显示的标题，不传或者传递长度为0，显示默认值，否则显示传过来的值" style="width:500px;"></div>
    <div><input id="sp_buttonTitle" type="text" placeholder="组件按钮的标题 不传或者传递长度为0，显示默认值，否则显示传过来的值" style="width:500px;"></div>
    <div><input id="sp_minSelect" type="text" placeholder="最少选择的个数" style="width:500px;"></div>

  `)

  var $btn = $('<button>弹出</button>')
  tc.append($choice)
  tc.append($input)
  tc.append($btn)
  $btn.click(function(evt) {
    var params = {
      isMulti: $('#sp_isMulti')[0].checked,
      ignore: $('#sp_ignore_c')[0].checked ? $('#sp_ignore').val().split(',') : [],
      selected: $('#sp_selected_c')[0].checked ? $('#sp_selected').val().split(',') : [],
      range: $('#sp_range_c')[0].checked ? $('#sp_range').val().split(',') : [],
      extra: $('#sp_extra')[0].checked ? 'only' : '',
      isShowMe: $('#sp_isShowMe')[0].checked,
      isShowExt: $('#sp_isShowExt')[0].checked,
      title: $('#sp_title').val(),
      buttonTitle: $('#sp_buttonTitle').val(),
      minSelect: parseInt($('#sp_minSelect').val() || 0, 10),
    }
    $input.html('<p>输入：' + tc.code(params) + '</p>')
    qing.call('selectPersons', _.extend(params, {
      complete: function(data, res) {
        tc.updateStatus(res.code);
        tc.append('<p>输出：' + tc.code(data) + '</p>')
      }
    }))
  })
})

describe('qing.call("selectPersonsInGroup")', '群组选人', function(tc) {
  var $input = $('<div></div>')
  var $btn = $('<button>弹出</button>')

  var params = {
    'limitCount': 5,
    'groupId': '2dd59f05-abb1-4e81-b4bf-e9d41fe0287e',
    'selected': ['7704cd14-b8c3-11e3-8d13-e41f137ad9f4', '55949336e4b039a514f0bd07', '56d8ee8ae4b02b551e11d3be', '5743f4f0e4b03aaf6ad9a88d']
  }
  $input.html('<p>输入：' + tc.code(params) + '</p>')

  tc.append($input)
  tc.append($btn)
  $btn.click(function(evt) {
    qing.call('selectPersonsInGroup', _.extend(params, {
      complete: function(data, res) {
        tc.updateStatus(res.code);
        tc.append('<p>输出：' + tc.code(data) + '</p>')
      }
    }))
  })
})