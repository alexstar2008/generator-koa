const bodyParser = require('koa-body');


module.exports = bodyParser({
    multipart: true,
    strict: false
});
