# qing
> qingjs是为了方便前端人员在云之家环境调用native代码的工具类，兼容新版桌面端、老版桌面端、移动端、微信

桥测试页面：http://192.168.22.144/public/js/qing/latest/test_qing.html

## 如何使用

### 常规使用案例

* NPM版本
```
  npm install qing
```

* 常规版本

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
<title>usecase</title>
</head>
<body>
<!-- 引入qing -->
<script src="//static.yunzhijia.com/public/js/qing/latest/qing.js"></script>
<script>
// 在 qing.config 执行前，所有其它的 ydk api 都不会真正被调用
// 这里是一个简单的配置，其它 API list 请参考详细文档
qing.config({
  debug : false,
  jsApiList : ['checkJsApi', 'share'],
  jsEventList: ['appear', 'disappear'] // 自动绑定事件，会通过document.dispatchEvent分发
});
// 获取个人信息
qing.call('getPersonInfo', {
  success : function(res){}
});

qing.on('appear', {
  complete: function (res) {},
  error: function (res) {},
  success : function(res){}
});
</script>
</body>
</html>
```

### 接口调用说明

所有接口的调用形式为 `qing.call('xxx', {...})`，参数必须是一个对象。

每个接口除了自身必须的参数外，还支持以下通用参数：

1. `success`：接口调用成功时执行的回调函数。
1. `error`：接口调用失败时执行的回调函数。
1. `complete`：接口调用完成时执行的回调函数，无论成功或失败都会执行。

以上所述的回调函数的参数说明，如 `success : function (res) { ... }`，这里的 `res` 为对象，除了每个接口自身返回的数据之外，还有两个通用属性 `code` 和 `errMsg`，其值格式如下：

1. 调用成功(`success`)：`{code: 200, errMsg: "", data: {}}`
1. 调用失败(`error`)：`{code: 500, errMsg: "不合法的图片文件大小", data: {}}`

> **注：** code 类型为数字，非字符串。

## 接口说明

### 基础接口

#### qing.config 获取app信息

在 qing.config 未成功执行前，其他 api 将无法正常使用（在调用队列里安静的等着，不会被执行）

```javascript
qing.config({
  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
  jsApiList: ['api-1', 'api-2', '...'] //必填，需要使用的JS接口列表
});
```

> 只有在 jsApiList 中明确指定的 API，当前 webview 中才可用。因为某些 API 的初始化需要额外的开销，从而导致资源浪费。

#### qing.checkJsApi 判断当前客户端版本是否支持指定 API 接口

这个 API 目前咋看起来都没啥用，但随着 qing api 的丰富，客户端中可能出现不同的分支，此时将非常有用

```javascript
qing.checkJsApi({
  jsApiList: [
    "getComments",
    "record",
    "audio"
  ],
  success: function(res){
    console.log(res);
  }
});

// 参数 res 的说明
res = {
    code: 200
    errMsg: "",
    getComments: true | false,
    record: true | false,
    audio: true | false
}
```

### 通过应用后端返回的签名信息获取ticket

在活动页或者混合应用中， 可以通过 `qing.call('getTicket')` 取得ticket。

```javascript
// 获取应用Ticket
qing.call('getTicket', {
    // 获取签名的接口，这个接口会接收到一个名为url参数
    // 注意：不要直接复制示例中的接口地址，每个轻应用需要提供自己的接口来返回签名
    /* 返回结果格式
      {
        "success": true,
        "data": {
            appId: "",
            timeStamp: "",
            nonceStr: "",
            signature: ""
        }
      }
    */
    signUrl: '/cloudwork/jsapi/generatesignature.json',
    // 获取ticket成功
    success (e) {
        alert(e.data.ticket)
    },
    // 获取ticket失败
    error (error) {
        alert(error)
    }
})
```


## 附录1：所有 API 列表

#### - 与 native 相关的 API

##### 以下为 base api，也就是对第三方开放的无限制的部分

1. qing.config
1. qing.checkApi

#### - qing 中还包含了一些为了便于编码便利而存在的一些辅助性 api
1. qing.version，qing版本号
1. qing.isSupportNativeJsBridge，当前 webview 支持桥
1. qing.nativeJsBridgeVersion，当前客户端桥版本
1. qing.hasOwn，见 `Object.hasOwnProperty`
1. qing.isFunction，是否函数
1. qing.isString，是否字符串
1. qing.isNumber，是否数字
1. qing.isObject，是否对象
1. qing.isArray，是否数组
1. qing.forEach，见 `Array.prototype.forEach`
1. qing.keys，见`Object.keys`
1. qing.ns，把字符串转换为命名空间，`"a.b.c"` 1.> `{a:{b:{c:{}}}}`
1. qing.isWX，是否微信客户端
1. qing.isChrome，是否 chrome
1. qing.isFirefox，是否 firefox
1. qing.isOpera，是否 opera
1. qing.isSafari，是否 safari
1. qing.isIe，是否 IE 浏览器，这个用法稍微不一样，如 `qing.isIe() or qing.isIe(6)`
1. qing.isIphone，是否 iphone
1. qing.isIpad，是否 ipad
1. qing.isIpod，是否 ipod
1. qing.isIos，是否 ios 平台
1. qing.isAndroid，是否 Android 平台
1. qing.isAndroidPhone，是否 Android 手机
1. qing.isAndroidTable，是否 Android 平板
1. qing.isBlackberry，是否黑莓
1. qing.isMac，是否 mac 本
1. qing.isWindows，是否 win 系统
1. qing.isWindowsPhone，是否 win 手机
1. qing.isWindowsTable，是否 win 平板
1. qing.isMobile，是否手机
1. qing.isDesktop，是否 PC 机
1. qing.isTouchDevice，是否触屏设备

## 附录2：全局返回码说明
> **注：** code类型为数字，非字符串。

|  返回码  |      说明      |
|  :--------  |  :--------|
|   100|  调用成功，并且有多次返回|
|   200|  调用成功|
|   404|  接口不存在|
|   500|  全局调用失败code|
