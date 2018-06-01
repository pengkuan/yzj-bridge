var production = require('./production');

production.debug = true;
production.NODE_ENV = 'development';
production.compresss = false;
production['dist.dir'] = null;

module.exports = production;

