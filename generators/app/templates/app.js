const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
require('./app/libs/mongoose');


const app = new Koa();
const router = new Router({ prefix: '/api' });

const middlewares = fs.readdirSync(path.join(__dirname, 'src/middlewares')).sort();
middlewares.forEach(middleware => app.use(require('./src/middlewares/' + middleware)));

router.get('/healthz', ctx => {
    ctx.body = 'Combinvest API - OK';
});

app.use(router.routes());

module.exports = app.listen(onfig.PORT, () => {
    console.log(`SERVER is listening on port:${config.PORT}`);
});


