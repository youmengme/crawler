"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./adapther/db");
const site_account_1 = require("../model/site-account");
const util_1 = require("util");
const constant_1 = require("./constant");
const redis_1 = require("./adapther/redis");
const log4js_1 = require("log4js");
const _ = require("lodash");
const dependency_injection_1 = require("./dependency-injection");
const os_1 = require("os");
const log = log4js_1.getLogger();
exports.default = site_account_1.default
    .all()
    .then(async (rows) => {
    const coroutines = [];
    const ips = new Map();
    for (let a of rows) {
        const key = util_1.format(constant_1.REDIS_KEY_SITE_ACCOUNT, a.site_id, a.server);
        if (!a.enable) {
            await redis_1.redis.zrem(key, a.id);
            continue;
        }
        const site = await a.$get('site');
        log.debug(`load ${site.host} account id: ${a.id}, username: ${a.username}, type: ${a.type}`);
        coroutines.push(redis_1.redis.zadd(key, 'NX', _.toString(a.counter), _.toString(a.id)));
        ips.set(a.server || '', a);
    }
    // setParameter('ip2account', ips);
    await Promise.all(coroutines).then(() => {
        log.debug('所有账号加载完毕');
    });
    if (!dependency_injection_1.getParameter('workip')) {
        log.info('没有设置 IP 规则，准备从网卡获取机器 IP');
        _.each(os_1.networkInterfaces(), (arr) => {
            for (const eth of arr) {
                if (/^127\./.test(eth.address)) {
                    continue;
                }
                if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(eth.address)) {
                    if (ips.has(eth.address)) {
                        dependency_injection_1.setParameter('workip', eth.address);
                        return false;
                    }
                }
            }
        });
        log.info('IP 获取完毕：', ips);
    }
    return rows;
});
//# sourceMappingURL=initialize.js.map