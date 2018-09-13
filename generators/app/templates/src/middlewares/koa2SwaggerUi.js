const ui = require('koa2-swagger-ui');
const config = require('config');

module.exports = ui(config.docs);

