import { warn } from '../libs/log'

; (function (doc, win, qing) {
  // 防止重复引用
  if (win.__hasQingMobile) return
  win.__hasQingMobile = true

  // 空方法
  const noop = function (name) {
    return function () {
      warn('method [' + name + '] not support')
    }
  }
  
  // 回调管理
  var callbacks = {
    // 序号
    index: 1,
    // 集合
    map: {},
    // 注册一个 callback 并返回它的 id（所有id为奇数）
    register: function (callback) {
      this.index += 2;
      var id = '' + this.index;

      if (typeof callback == 'function') {
        this.map[id] = function (message) {
          this.cb.call(null, message)
        }.bind({ map: this.map, id: id, cb: callback });
      };

      return id;
    },
    // 根据 id 触发 callback
    invoke: function (id, message) {
      var cb = this.map[id + ''];

      if (typeof cb === 'function') {
        cb(message);
      }
    }
  };

  // js桥，用于 jssdk 和 native 之间的通信
  var XTBridge = {
    // js 调用 native 方法
    invoke: function (method, message, callback) {
      var cid = callbacks.register(callback);
      var url;

      if (typeof message === 'undefined') {
        message = '';
      } else {
        message = encodeURIComponent(JSON.stringify(message));
      }

      url = 'xuntong:' + method + ':' + cid + ':' + message;

      // 如果是iOS或者小于9.59的安卓，用 iframe 触发协议
      var iframes = window.XTBridgeIframes = window.XTBridgeIframes || (function () {
        var fs = [], iframe, i;
        for (i = 0; i < 9; i++) {
          iframe = document.createElement('IFRAME');
          iframe.setAttribute('height', '1px');
          iframe.setAttribute('width', '1px');
          iframe.style.display = 'none';
          document.documentElement.appendChild(iframe);
          fs.push(iframe)
        }
        return fs;
      }());

      XTBridge.callbackIndex = XTBridge.callbackIndex || 0;
      var index = XTBridge.callbackIndex;
      XTBridge.callbackIndex += 1;
      var iframeIndex = index % 9;
      var iframe = iframes[iframeIndex];
      iframe.setAttribute('src', url);
    },
    // native 回调 js
    // loadUrl('javascript:CloudHubJSBridge.callback(port,resultData)');
    callback: function (callbackid, message) {
      if (typeof message === 'string' && message.match(/^\s*\{/)) {
        try {
          message = JSON.parse(message);

          // 把"true"或者"false"转成布尔值
          if (message && typeof message.success === 'string') {
            message.success = message.success === 'true';
          }
        } catch (e) {
          console.error(e)
        }
      };
      callbacks.invoke(callbackid, message)
    }
  };

  window.XuntongJSBridge = window.XuntongJSBridge || {
    invoke: XTBridge.invoke,
    call: XTBridge.invoke,
    handleMessageFromXT: XTBridge.callback
  };
  
  // window.qing 的 api
  qing._bridge = {
    call(name, params) {
      let success = params.success
      let complete = params.complete
      delete params.success
      delete params.error
      delete params.complete

      XTBridge.invoke(name, params, function () {
        if (typeof success === 'function') {
          success.apply(null, arguments)
        }
        if (typeof complete === 'function') {
          complete.apply(null, arguments)
        }
      })
    },
    on: noop,
    off: noop,
    checkJsApi: noop,
    config: noop,
    trigger: noop
  }

  doc.dispatchEvent(new Event('QingReady'))
})(document, window, window.qing || (window.qing = {}))

