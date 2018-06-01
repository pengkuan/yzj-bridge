/**
 * 老版桌面端
 *
 * jsbridge版本为0.0.3
 */
import { warn } from '../libs/log'

;(function(doc, win, qing) {
  // 防止重复引用
  if (win.__hasQingDesktopLE3) return
  win.__hasQingDesktopLE3 = true
  
  
  const callbacks = {}
  var _callbackIndex = 0

  var call = (name, params = {}) => {
    var { success, complete } = params
    delete params.success
    delete params.error
    delete params.complete


    var callback = (data) => {
      if (data.success === 'true') {
        data.success = true
      } else if (data.success === 'false') {
        data.success = false
      }
      success && success(data, {
        code: 200,
        data
      })
      complete && complete(data, {
        code: 200,
        data
      })
    }

    // 绑定回调方法
    var callbackId = ++_callbackIndex
    callbacks[callbackId] = callback


    var iframe = document.createElement('IFRAME')
    iframe.setAttribute('src', 'xuntong:' + name + ':' + callbackId + ':' + encodeURIComponent(JSON.stringify(params)))
    // For some reason we need to set a non-empty size for the iOS6 simulator...
    iframe.setAttribute('height', '1px')
    iframe.setAttribute('width', '1px')
    document.documentElement.appendChild(iframe)
    iframe.parentNode.removeChild(iframe)
    iframe = null
  }


  var handleMessageFromXT = (callbackId, message) => {
    try {
      var callback = callbacks[callbackId];
      if (!callback) return;
      callback.apply(null, [JSON.parse(message)]);
    } catch (e) {
      alert(e)
    }
  }

  const registJsApi = {
    'share': true,
    'chat': true,
    'personInfo': true,
    'getPersonInfo': true, 
    'gotoLightApp': true, 
    'selectPersons': true, 
    'setWebViewTitle': true, 
    'closeWebView': true, 
    'close': true,
    'hideWebViewTitle': true,
    'defback': true,
    'showOptionMenu': true,
    'hideOptionMenu': true,
    'selectOrgs': true,
    'closePop': true,
    'createPop': true
  }
  var checkJsApi = ({
    jsApiList,
    success,
    complete
  }) => {
    let map = {}
    ;(jsApiList || []).forEach((name) => {
      map[name] = !!registJsApi[name]
    })

    let ret = {
      success: true,
      data: map
    }
    success && success(ret)
    complete && complete(ret)
  }

  win.XuntongJSBridge.handleMessageFromXT = handleMessageFromXT

  // 空方法
  const noop = function (name) {
    return function () {
      warn('method [' + name + '] not support')
    }
  }

  qing._bridge = {
    call,
    on: noop,
    off: noop,
    checkJsApi,
    config: noop,
    trigger: noop
  }


  doc.dispatchEvent(new Event('QingReady'))

})(document, window, window.qing || (window.qing = {}))