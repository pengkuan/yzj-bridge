var PROFILE = process.env.PROFILE;
var config = require('./' + PROFILE + '.js');
process.env.NODE_ENV = config.NODE_ENV;

module.exports = config;