/* global qing $ _ */

describe('qing.call("selectOrgs")', '部门桥', function(tc) {
  var $input = $('<div></div>')
  var $choice = $(`
    <div><label><input id="sp_isMulti" type="checkbox" checked/>isMulti：多选</label></div>
  `)

  var $btn = $('<button>弹出</button>')
  tc.append($choice)
  tc.append($input)
  tc.append($btn)
  $btn.click(function(evt) {
    var params = {
      isMulti: $('#sp_isMulti')[0].checked,
    }
    $input.html('<p>输入：' + tc.code(params) + '</p>')
    qing.call('selectOrgs', _.extend(params, {
      complete : function (data, res) {
        tc.updateStatus(res.code);
        tc.append('<p>输出：' + tc.code(data) + '</p>')
      }
    }))
  })
})