import { log } from './libs/log'
import args from './libs/args'

var dispatchEvent = function (name, params) {
  var event = document.createEvent('HTMLEvents')
  if (params) {
    for (let k in params) {
      event[k] = params[k]
    }
  }
  event.initEvent(name)
  document.dispatchEvent(event)
}



export function init (global) {
  const doc = document
  const hasListenJsEventList = []

  global.once = (name, callback) => {
    let fn = () => {
      global.off(name, fn)
      callback && callback()
    }
    global.on(name, fn)
  }

  const ready = global.ready = global._bridge ? (cb) => {
    cb && cb ()
  } : (callback) => {
    let fun = () => {
      callback()
      doc.removeEventListener('QingReady', fun)
    }
    doc.addEventListener('QingReady', fun)
  }

  global.config = (data) => {
    global.debug = !!data.debug

    ready(() => {
      // 调用_bridge.config执行
      global._bridge.config(data)
    })

    // 预定义的事件，自动绑定事件
    ;(data.jsEventList || []).forEach((name) => {
      // 防止重复监听
      if (hasListenJsEventList.indexOf(name) != -1) return

      hasListenJsEventList.push(name)
      global.on(name, (data) => {
        // 分发事件
        dispatchEvent(name, {
          data
        })
      })
    })
  }

  global.error = (cb) => {
    global.on('error', cb)
  }

  const apis = ['call', 'off', 'on', 'checkJsApi', 'trigger']
  apis.forEach((name) => {
    global[name] = function () {
      let _args = args(arguments)
      ready(() => {
        global[name].apply(global, _args)
        _args = null
      })
    }
  })


  ready(() => {
    log('Ready')
    global.isReady = true
    let _bridge = global._bridge

    // 映射为真正的api
    let mapApi = (name) => {
      global[name] = _bridge[name]
    }
    apis.forEach(mapApi)

    global.ready = (cb) => {
      cb && cb ()
    }
  })

  global.error = (cb) => {
    global.on('error', cb)
  }

  /**
   * 检查版本
   */
  global.checkVersion = (target) => {
    var source = global.nativeJsBridgeVersion
    if (source == target) return true
    var currVerArr = source.split('.');
    var promoteVerArr = target.split('.');
    var len = Math.max(currVerArr.length, promoteVerArr.length);
    for (var i = 0; i < len; i++) {
      var proVal = ~~promoteVerArr[i],
        curVal = ~~currVerArr[i];
      if (proVal < curVal) {
        return true;
      } else if (proVal > curVal) {
        return false;
      }
    }
  }
}