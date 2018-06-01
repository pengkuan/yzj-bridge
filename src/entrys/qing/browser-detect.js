/* eslint-disable no-unused-vars*/
/* global DocumentTouch */

export var init = (global) => {
  var ua = navigator.userAgent.toLowerCase() || '',
    vendor = navigator.vendor && navigator.vendor.toLowerCase() || '',
    appVersion = navigator.appVersion.toLowerCase() || ''
  var isWX = global.isWX = /micromessenger/i.test(ua);
  var isChrome = global.isChrome = /chrome|chromium/i.test(ua)
    && /google inc/.test(vendor);
  var isFirefox = global.isFirefox = /firefox/i.test(ua);
  var isOpera = global.isOpera = /^Opera\//.test(ua) || // Opera 12 and older
    /\x20OPR\//.test(ua); // Opera 15+
  var isSafari = global.isSafari = /safari/i.test(ua)
    && /apple computer/i.test(vendor);
  var isIe = global.isIe = function(version) {
    if(!version) {
      return /msie/i.test(ua) || 'ActiveXObject' in window;
    }
    if(version >= 11) {
      return 'ActiveXObject' in window;
    }
    return new RegExp('msie ' + version).test(ua);
  };
  var isIphone = global.isIphone = /iphone/i.test(ua);
  var isIpad = global.isIpad = /ipad/i.test(ua);
  var isIpod = global.isIpod = /ipod/i.test(ua);
  var isIos = global.isIos = isIphone || isIpad || isIpod;
  var isAndroid = global.isAndroid = /android/i.test(ua);
  var isAndroidPhone = global.isAndroidPhone = isAndroid && /mobile/i.test(ua);
  var isAndroidTablet = global.isAndroidTablet = isAndroid && !/mobile/i.test(ua);
  var isBlackberry = global.isBlackberry = /blackberry/i.test(ua);
  var isCoolpad = global.isCoolpad = /coolpad/i.test(ua);
  var isMac = global.isMac = /mac/i.test(appVersion);
  var isWindows = global.isWindows = /win/i.test(appVersion);
  var isWindowsPhone = global.isWindowsPhone = isWindows && /phone/i.test(ua);
  var isWindowsTablet = global.isWindowsTablet = isWindows && !isWindowsPhone
    && /touch/i.test(ua);
  var isMobile = global.isMobile = isIphone || isIpod || isAndroidPhone
    || isBlackberry || isWindowsPhone || isCoolpad;
  var isTablet = global.isTablet = isIpad || isAndroidTablet || isWindowsTablet;
  var isDesktop = global.isDesktop = !isMobile && !isTablet
  var isTouchDevice = global.isTouchDevice = 'ontouchstart' in window
    || 'DocumentTouch' in window && document instanceof DocumentTouch

}

