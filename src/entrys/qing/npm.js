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
          require('./client/desktop')
        }
      } else {
        if (!global.__hasQingDesktopLE3) {
          require('./client/desktop-le-0.0.3')
        }
      }
    } else if (qing.checkVersion('0.9.50')) {
      if (!global.__hasQingMobile) {
        require('./client/mobile')
      }
    } else {
      if (!global.__hasQingMobile) {
        require('./client/mobile-early')
      }
    }
  } else if (qing.isWX) {
    // qing.emit = qing.call
  } else {
    // web
    // qing.emit = qing.call
  }

})(window)