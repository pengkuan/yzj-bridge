import { log } from './libs/log'

;(function (global, undefined) {

  // 防止重复注册
  if (global.qing && global.qing.version) {
    return
  }

  var qing = global.qing || (global.qing = {})

  qing.version = process.env.PROJECT_VERSION
  qing.isReady = false
  qing.debug = false

  var ua = navigator.userAgent.toLowerCase()


  /**
   * 检测是否支持桥
   */
  var dmatcher = 
    ua.match(/Qing\/(\d+(?:\.\d+)*)/i) 
    // 老版桌面端判断规则
    || ua.match(/App\/cloudhub \d+\/(\d+(?:\.\d+)*)/i)

  var isSupportNativeJsBridge = dmatcher

  if (isSupportNativeJsBridge) {
    qing.nativeJsBridgeVersion = dmatcher[1]
  }

  qing.isSupportNativeJsBridge = !!isSupportNativeJsBridge
  
  require('./api').init(qing)
  require('./browser-detect').init(qing)
  require('./xuntong').init(qing)

  if (isSupportNativeJsBridge) {
    if (qing.isDesktop) {
      // 新版桌面端
      if (parseInt(qing.nativeJsBridgeVersion.replace(/\./g, '')) > 3) {
        if (!global.__hasQingDesktop) {
          require.ensure(['./client/desktop'], (exports) => {
            log('Load Desktop')
            require('./client/desktop')
          }, 'desktop')
        }
      } else {
        if (!global.__hasQingDesktopLE3) {
          require.ensure(['./client/desktop-le-0.0.3'], () => {
            log('Load Desktop LE 0.0.3')
            require('./client/desktop-le-0.0.3')
          }, 'desktop-le-0.0.3')
        }
      }
    } else if (qing.checkVersion('0.9.50')) {
      // 新版（V9及以上）移动端
      if (!global.__hasQingMobile) {
        require.ensure(['./client/mobile'], () => {
          log('Load Mobile')
          require('./client/mobile')
        }, 'mobile')
      }
    } else {
      // 旧版移动端
      if (!global.__hasQingMobile) {
        require.ensure(['./client/mobile-early'], () => {
          log('Load Mobile Early')
          require('./client/mobile-early')
        }, 'mobile-early')
      }
    }
  } else if (qing.isWX) {
    // qing.emit = qing.call
  } else {
    // web
    // qing.emit = qing.call
  }

})(window)