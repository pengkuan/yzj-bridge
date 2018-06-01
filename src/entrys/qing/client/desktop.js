import getTicket from './api/getTicket'

;(function (doc, win, qing) {
  // 防止重复引用
  if (win.__hasQingDesktop) return
  win.__hasQingDesktop = true

  let _CloudHubJSBridge = win._CloudHubJSBridge

  function call (name, data) {
    if (name === 'getTicket') {
      getTicket(qing, data)
      return
    }

    _CloudHubJSBridge.emit(name, data)
  }

  qing._bridge = {
    call,
    on: _CloudHubJSBridge.on,
    off: _CloudHubJSBridge.off,
    checkJsApi: _CloudHubJSBridge.checkJsApi,
    trigger: _CloudHubJSBridge.trigger,
    config: () => {

    }
  }
  doc.dispatchEvent(new Event('QingReady'))
})(document, window, window.qing || (window.qing = {}))

