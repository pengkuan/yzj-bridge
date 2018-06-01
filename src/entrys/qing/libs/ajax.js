var ERR_JSON_PARSE = 'JSON解析失败'

export default function (opt) {
  var xhr = new XMLHttpRequest();
  var reg = /^(2\d{2}|304)$/;
  var encode = function (data) {
    var e = encodeURIComponent;
    if (typeof data === 'string' || !data) return data;
    return Object.keys(data).map(function (k) {
      return e(k) + '=' + e(data[k]);
    }).join('&');
  }

  opt.method || (opt.method = 'GET');
  opt.error || (opt.error = function () { });
  opt.success || (opt.success = function () { });

  xhr.open(opt.method, opt.url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (reg.test(xhr.status)) {
        try {
          opt.success(JSON.parse(xhr.responseText), xhr);
        } catch (e) {
          opt.error(ERR_JSON_PARSE);
        }
      } else {
        opt.error(xhr.responseText);
      }
    }
  };
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(encode(opt.data));
}