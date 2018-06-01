/**
 * 用于本地开发时候，代理远程服务器接口
 */
var exports = {};

var onBody = function (proxyRes, req, res, callback) {
  let _writeHeadArgs;
  var 
    _end = res.end,
    chunks,
    _write = res.write,
    _writeHead = res.writeHead;

  res.writeHead = ( ...writeHeadArgs ) => {
    _writeHeadArgs = writeHeadArgs;
  };

  res.write = function( data ) {
    if (callback) {
      var str = data.toString();
      str = callback(str);
      data = new Buffer(str);
    }
    if( chunks ) {
      chunks += data;
    } else {
      chunks = data;
    }
  };

  res.end = function(...endArgs) {
    if (chunks) {
      res.setHeader( 'content-length', chunks.length );
    }
    _writeHead.apply( res, _writeHeadArgs );
    if (chunks) {
      _write.call(this, chunks);
    }
    _end.apply(this, endArgs );
  };
}

var disableEncoding = function (proxyReq) {
  proxyReq.setHeader('Accept-Encoding', '');
}


exports.getImProxyTable = function (host) {
  const srcHost = host.replace(/http[s]?:\/\//, '');
  const cookieDomainRewrite = {
    '*': 'localhost',
  };

  const router = {};
  router[srcHost] = 'localhost:8080';

  const tables = {};

  [
    '/',
    '/home',
    '/image/',
    '/pubacc/',
    '/space/',
    '/dores/',
    '/im/',
    '/openaccess/',
    '/appmanage/',
    '/custom-web/',
    '/microblog/'
  ].forEach((path) => {
    tables[path] = ({
      target: host,
      autoRewrite: true,
      changeOrigin:true,
      protocolRewrite: 'http',
      cookieDomainRewrite: cookieDomainRewrite
    });
  });
  return tables;
}



module.exports = exports;