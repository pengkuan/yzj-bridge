import {includes} from '../libs/array';
import {extend} from '../libs/object'
import getTicket from './api/getTicket'

(function (doc, win, qing) {
  // 防止重复引用
  if (win.__hasQingMobile) return
  win.__hasQingMobile = true
  
  // 触发document事件
  const dispatchEvent = function (name, params) {
    var event = document.createEvent('HTMLEvents')
    extend(event, params)
    event.initEvent(name)
    document.dispatchEvent(event)
  }

  // 回调管理
  const callbacks = {
    // 集合
    map: {},
    // 序号（奇数）
    index: 1,
    indexStep: 2,
    // 注册一个 callback 并返回它的 id
    register: function (callback) {
      this.index += this.indexStep;
      var id = '' + this.index;

      if (typeof callback == 'function') {
        this.map[id] = function (message) {
          this.cb.call(null, message)
        }.bind({
          map: this.map,
          id: id,
          cb: callback
        });
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

  // 讯通桥（走xuntong://协议）
  const XTBridge = {
    // js 调用 native 方法
    call: function (method, message, callback) {
      var cid = callbacks.register(callback);
      var url;

      if (typeof message === 'undefined') {
        message = '';
      } else {
        message = encodeURIComponent(JSON.stringify(message));
      }

      url = 'xuntong:' + method + ':' + cid + ':' + message;

      var isAndroid = qing.isAndroid
      var clientVersion = (function () {
        var qingUA = navigator.userAgent.split(';')[0];
        var qingVersion = qingUA.slice(qingUA.indexOf('Qing/') + 5);
        return parseFloat(qingVersion.slice(2));
      }())

      // 如果是安卓且版本大于等于9.59，用 prompt 触发协议
      var isNewAndroidClient = isAndroid && clientVersion >= 9.59
      if (isNewAndroidClient) {
        window.prompt(url);
        return
      }

      // 如果是iOS或者小于9.59的安卓，用 iframe 触发协议
      var iframes = window.XTBridgeIframes = window.XTBridgeIframes || (function () {
        var fs = [],
          iframe, i;
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
    // loadUrl("javascript:CloudHubJSBridge.callback(port,resultData)");
    handleMessageFromXT: function (callbackid, message) {
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

  // ===============================================

  // 工作台api（走cloudhub://协议）
  const cloudofficeMethodList = [
    'cloudoffice.request',
    'cloudoffice.showCardNotify',
    'cloudoffice.clearCardNotify',
    'cloudoffice.getRoleType', // desktop不用实现
    'cloudoffice.checkAppAuth',
    'cloudoffice.shareText', // desktop不用实现
    'cloudoffice.downloadPic', // desktop不用实现
    'cloudoffice.checkWorkbenchUpdate', // desktop不用实现
    'ui.changeNavBarStyle', // desktop不用实现
    'ui.toast',
    'runtime.jsReady', // desktop不用实现
    'cloudoffice.textShareClosed', // desktop不用实现
    'cloudoffice.dataReport', // desktop不用实现
    'ui.webViewScrollTo', // desktop不用实现
    'runtime.auth'
  ]

  function ready(CHBridge) {
    // 复合 window.XuntongJSBridge 桥
    let bridge = {
      // 会根据method名来选择：走xuntong协议还cloudhub协议
      call: function (method) {
        if (includes(cloudofficeMethodList, method)) {
          CHBridge.invoke.apply(null, arguments);
        } else {
          XTBridge.call.apply(null, arguments);
        }
      },
      // 客户端调用CloudHubJSBridge.trigger触发的事件，包括appear等
      on: CHBridge.on,
      handleMessageFromXT: XTBridge.handleMessageFromXT
    };
    bridge.invoke = bridge.call
    win.XuntongJSBridge = bridge

    const eventPrefix = 'eventPrefix_'
    const rigistedEvent = {}

    const registerEvent = function (name) {
      if (!rigistedEvent[name]) {
        rigistedEvent[name] = true
        bridge.on(name, function (data) {
          dispatchEvent(eventPrefix + name, { eventData: data });
        })
      }
    }

    // window.qing 的 api
    qing._bridge = {
      call(name, params) {
        if (name === 'getTicket') {
          getTicket(qing, params)
        } else {
          // 其它api
          let success = params.success
          let complete = params.complete
          delete params.success
          delete params.error
          delete params.complete

          // 兼容toast桥
          if (name === 'toast') {
            name = 'ui.toast'
            params.message = params.msg
            delete params.msg
          }

          // 兼容request桥
          if (name === 'request') {
            name = 'cloudoffice.request'
          }

          bridge.call(name, params, function () {
            if (typeof success === 'function') {
              success.apply(null, arguments)
            }
            if (typeof complete === 'function') {
              complete.apply(null, arguments)
            }
          })
        }
      },
      // 因为CloudHubJSBridge上只有on没有off
      // 所次此处通过document来接收
      // 注：所以name只能是config({jsEventList})里声明了的事件
      on: function (name, handler) {
        registerEvent(name)
        document.addEventListener(eventPrefix + name, e => {
          handler(e.eventData)
        })
      },
      off: function (name, handler) {
        document.removeEventListener(eventPrefix + name, handler)
      },
      checkJsApi: function (name) {
        return true
        // return cloudofficeMethodList.includes(name)
      },
      config: function (cfg) {
      },
      trigger: function (name, params) {
        CHBridge.trigger(name, params)
      }
    }

    dispatchEvent('QingReady', qing._bridge)
  }

  // 如果Bridge已经就绪，直接调用ready方法
  // 否则等待Bridge就绪
  var CHBridge = window.CloudHubJSBridge;
  if (!CHBridge || !CHBridge.isReady) {
    window.__onJSBridgeReady = ready;
  } else {
    ready(CHBridge);
  }
})(document, window, window.qing || (window.qing = {}))