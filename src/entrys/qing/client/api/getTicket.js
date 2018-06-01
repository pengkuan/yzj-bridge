import ajax from '../../libs/ajax'

var ERR_GET_TICKET = '鉴权失败'
var ERR_GET_SIGN = '鉴权失败（无法获取签名信息）'

// 获取ticket
export default function (global, opt) {
  if (!opt) return opt.error(ERR_GET_TICKET);
  if (!opt.signUrl) return opt.error(ERR_GET_TICKET + '：缺少参数 signUrl');

  if (typeof opt.success !== 'function') return;

  let currentUrl = encodeURIComponent(location.href.split('#')[0])
  let signUrl = opt.signUrl.replace(/\?|$/, '?url=' + currentUrl + '&').replace(/\&$/, '')
  
  // 先获取签名
  ajax({
    url: signUrl,
    method: 'post',
    success: function (res) {
      var data = res.data;

      // 用自定义函数对参数进行解析
      if (typeof opt.signFormat === 'function') {
        data = opt.signFormat(data)
      }

      // 判断参数有没有缺少
      if (!data) return opt.error({
        success: false,
        error: ERR_GET_SIGN
      });
      if (!data.appId) return opt.error({
        success: false,
        error: ERR_GET_SIGN + '：缺少 appId'
      });
      if (!data.timeStamp) return opt.error({
        success: false,
        error: ERR_GET_SIGN + '：缺少 timeStamp'
      });
      if (!data.nonceStr) return opt.error({
        success: false,
        error: ERR_GET_SIGN + '：缺少 nonceStr'
      });
      if (!data.signature) return opt.error({
        success: false,
        error: ERR_GET_SIGN + '：缺少 signature'
      });
      
      // 调用客户端的桥拿ticket
      global.call('runtime.auth', {
        ...data,
        success (res) {
          opt.success(res)
        },
        error () {
          opt.error({
            success: false,
            error: ERR_GET_TICKET
          })
        }
      })
    },
    error: function (error) {
      if (typeof opt.error === 'function') {
        opt.error(ERR_GET_TICKET + '：' + error)
      }
    }
  })
}