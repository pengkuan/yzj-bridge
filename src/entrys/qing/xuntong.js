/**
 * 兼容xuntong调用方式
 * @type {[type]}
 */
let win = window

export function init (global) {

  var call = (name, params = {}, cb) => {
    cb && (params.complete = cb)
    global.call(name, params)
  }

  win.XuntongJSBridge = {
    call
  }
}