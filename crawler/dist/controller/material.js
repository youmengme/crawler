"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../core/router");
const common_1 = require("./common");
const constant_1 = require("../core/constant");
const urllib = require("url");
const log4js_1 = require("log4js");
const site_1 = require("../model/site");
const material_1 = require("../model/material");
const redis_1 = require("../core/adapther/redis");
const util_1 = require("util");
const dependency_injection_1 = require("../core/dependency-injection");
const _ = require("lodash");
const site_alias_1 = require("../model/site-alias");
const log = log4js_1.getLogger();
class MaterialController {
    static async submit(ctx, next) {
        const url = ctx.request.body ? ctx.request.body.url : null;
        if (!url) {
            common_1.response(ctx, constant_1.RET_CODE_LACK_PARAM, '缺少参数');
            return;
        }
        let parse;
        try {
            parse = urllib.parse(url);
        }
        catch (e) {
            log.error('url 参数错误', e);
            return common_1.response(ctx, constant_1.RET_CODE_PARAM_ERROR, '参数错误');
        }
        let host = parse.host;
        if (!host) {
            return common_1.response(ctx, constant_1.RET_CODE_PARAM_ERROR, '不是有效的 url');
        }
        host = host.toLocaleLowerCase();
        const siteAlias = await site_alias_1.default.findByHost(host);
        const site = siteAlias && siteAlias.enable ? (await siteAlias.$get('site')) : await site_1.default.findByHost(host);
        if (site === null) {
            return common_1.response(ctx, constant_1.RET_CODE_NO_EXISTSED, '暂时不支持这个站点');
        }
        else if (!site.enable) {
            return common_1.response(ctx, constant_1.RET_CODE_NO_ENABLED, '没有开放对此站点的支持');
        }
        log.debug(`on submit: host=${site.host}, url=${url}`);
        const itemId = site.parseId(url);
        if (itemId === null) {
            return common_1.response(ctx, constant_1.RET_CODE_PARSE_FAILURE, '解析失败');
        }
        let material = await material_1.default.findOneBySiteAndItemId(site.id, itemId);
        if (material === null) {
            material = material_1.default.build({
                site_id: site.id,
                item_id: itemId,
                source: url,
                status: material_1.STATUS_WAIT
            });
        }
        else {
            material.submit_count = (material.submit_count) + 1;
            // 失败的任务重启
            if (material.status === material_1.STATUS_FAILED) {
                material.status = material_1.STATUS_WAIT;
            }
        }
        let accountId = 0, redisKey = '';
        const workip = dependency_injection_1.getParameter('workip');
        const account = await material.$get('account');
        if (!account || !account.enable || (material.status === material_1.STATUS_WAIT && !material.account_lock)) {
            if (account) {
                log.info(`移除被禁用的账号 id=${account.id}, username=${account.username}, site=${site.slug}`);
                redisKey = util_1.format(constant_1.REDIS_KEY_SITE_ACCOUNT, site.id, workip);
                await redis_1.redis.zrem(redisKey, account.id);
            }
            redisKey = util_1.format(constant_1.REDIS_KEY_SITE_ACCOUNT, site.id, workip);
            const results = await redis_1.redis.multi()
                .zrange(redisKey, 0, 0)
                .zremrangebyrank(redisKey, 0, 0)
                .exec();
            if (_.has(results, '0.1.0')) {
                accountId = _.toInteger(_.get(results, '0.1.0'));
                // 取出账号信息后，重新设置新的分数再放回去
                await redis_1.redis.zadd(redisKey, _.toInteger(+new Date / 1000) + '', accountId + '');
                if (accountId === 0) {
                    return common_1.response(ctx, constant_1.RET_CODE_LACK_ACCOUNT, '缺少账号');
                }
                material.account_id = accountId;
                material.account_lock = true;
            }
        }
        try {
            await material.save();
        }
        catch (e) {
            if (accountId > 0) {
                await redis_1.redis.zadd(redisKey, _.toInteger(+new Date / 1000) + '', accountId + '');
            }
            log.error(e, JSON.stringify(material.output()));
            return common_1.response(ctx, constant_1.RET_CODE_DB_ERROR, '素材创建失败');
        }
        const key = util_1.format(constant_1.REDIS_KEY_MATERIAL_QUEUE, site.id, workip);
        await redis_1.redis.zadd(key, 'NX', _.toString(+new Date / 1000).substr(0, 10), _.toString(material.id));
        log.debug(`任务提交成功：taskId=${material.id}`);
        common_1.response(ctx, constant_1.RET_CODE_SUCCESS, {
            data: await material.output()
        });
    }
}
__decorate([
    router_1.Route('/api/material/submit', {
        name: 'material.submit',
        methods: ['POST']
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], MaterialController, "submit", null);
//# sourceMappingURL=material.js.map