/* global qing $ _ */

(function() {
  var win = window
  var doc = document

  var test_container_id = 'test_container_' + (+new Date)
  var wrap = $('#' + test_container_id)
  if (!wrap.length) {
    wrap = $('<div id="' + test_container_id + '">')
    $(doc.body).append(wrap)
  }

  var helper = {
    updateStatus: function(code) {
      var className = ''
      switch (code) {
        case 101:
        case 200:
          className = 'success'
          break
        default:
          className = 'fail'
          break;
      }
      this.mod.removeClass('mod-success mod-undefine mod-fail')
        .addClass('mod-' + className)
      return this
    },
    code: function(obj) {
      obj = _.isString(obj) ? obj : JSON.stringify(obj)
      return ['<code>', obj, '</code>'].join('')
    },
    append: function() {
      this.bd.append.apply(this.bd, _.toArray(arguments))
    }
  }

  var uid = 0;

  function createTestCase(title, subtitle) {
    var mod = $('<div class="mod">')
    var hd = $('<div class="hd">')
    var bd = $('<div class="bd">')
    var ft = $('<div class="ft">')

    uid++
    hd.html(
      '<span class="t0">' + uid + '</span>' +
      '<span class="t1">' + title + '</span>' +
      '<span class="t2">' + subtitle + '</span>')
    wrap.append(mod.append(hd, bd, ft))

    return _.extend({
      mod: mod,
      hd: hd,
      bd: bd,
      ft: ft,
      title: hd.find('span.t1'),
      subtitle: hd.find('span.t2')
    }, helper)
  }

  win.describe = function(title, subtitle, fn) {
    if (_.isFunction(subtitle)) {
      fn = subtitle
      subtitle = ''
    }

    var tc = createTestCase(title, subtitle)
    _.delay(function() {
      fn.call(null, tc)
    }, 10)
  }



})();