"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
process.chdir(path_1.dirname(__dirname));
require("./core/bootstrap");
const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const router_1 = require("./core/router");
const log4js_1 = require("log4js");
const dependency_injection_1 = require("./core/dependency-injection");
const initialize_1 = require("./core/initialize");
const log = log4js_1.getLogger();
const app = new Koa();
app.on('error', (err, ctx) => {
    log.error('server error', err, ctx);
});
// 处理 404
router_1.router.all('*', (ctx, next) => {
    ctx.body = {
        code: 404,
        msg: 'Not Found'
    };
    return next();
});
app
    .use(async (ctx, next) => {
    ctx.set('Content-Type', 'application/json; charset=utf-8');
    await next();
})
    .use(BodyParser()) // 必须要先加载，否则不能正常解析
    .use(router_1.router.routes())
    .use(router_1.router.allowedMethods());
initialize_1.default.then(() => {
    const httpCfg = dependency_injection_1.getParameter('http', {});
    app.listen(httpCfg.port, httpCfg.hostname);
    log.info(`listen ${httpCfg.hostname}:${httpCfg.port}`);
    log.info('started successfully');
});
//# sourceMappingURL=main.js.map