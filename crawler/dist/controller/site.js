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
const validator_1 = require("validator");
const lodash_1 = require("lodash");
const common_1 = require("./common");
const constant_1 = require("../core/constant");
const user_agent_1 = require("../service/user-agent");
const dependency_injection_1 = require("../core/dependency-injection");
const site_account_1 = require("../model/site-account");
const site_1 = require("../model/site");
const log4js_1 = require("log4js");
const util_1 = require("util");
const redis_1 = require("../core/adapther/redis");
const dbLog = log4js_1.getLogger('db');
class SiteController {
    static async account(ctx, next) {
        const post = ctx.request.body;
        let username = lodash_1.toString(post.username);
        let password = lodash_1.toString(post.password);
        let slug = lodash_1.toString(post.site);
        let type = lodash_1.toString(post.type).toLowerCase();
        let enable = validator_1.toBoolean(lodash_1.toString(post.enable));
        let ua = lodash_1.toString(post.ua);
        let ip = lodash_1.toString(post.server_ip);
        let id = lodash_1.toInteger(post.id);
        if (!username || !password) {
            return common_1.response(ctx, constant_1.RET_CODE_LACK_PARAM, {
                msg: '缺少参数',
                error: `缺少用户名或者密码字段`
            });
        }
        if (type !== 'qq' && type !== 'sina') {
            return common_1.response(ctx, constant_1.RET_CODE_PARAM_ERROR, '不支持的账号类型');
        }
        if (!ua) {
            const userAgent = dependency_injection_1.getService(user_agent_1.default);
            ua = userAgent.oneRandomUserAgent();
        }
        const site = await site_1.default.findBySlug(slug);
        if (!site) {
            return common_1.response(ctx, constant_1.RET_CODE_NO_EXISTSED, `站点"${slug}"不存在`);
        }
        let account = null;
        if (id > 0) {
            account = await site_account_1.default.findByPrimary(id);
        }
        else {
            account = await site_account_1.default.findOne({
                where: {
                    site_id: site.id,
                    username: username,
                    type: type
                }
            });
        }
        if (!account) {
            account = site_account_1.default.build({
                site_id: site.id
            });
        }
        else {
            // 修改 ip 后删除老的数据
            if (account.server !== ip) {
                const key = util_1.format(constant_1.REDIS_KEY_SITE_ACCOUNT, site.id, account.server);
                await redis_1.redis.zrem(key, account.id);
            }
        }
        account.username = username;
        account.password = password;
        account.type = type;
        account.enable = enable;
        account.server = ip;
        account.user_agent = ua;
        try {
            await account.save();
        }
        catch (e) {
            dbLog.error(e);
            return common_1.response(ctx, constant_1.RET_CODE_DB_ERROR, {
                msg: '账号保存遇到错误',
                error: e.toString()
            });
        }
        const key = util_1.format(constant_1.REDIS_KEY_SITE_ACCOUNT, site.id, dependency_injection_1.getParameter('workip'));
        if (account.enable) {
            await redis_1.redis.zadd(key, 'NX', lodash_1.toString(account.counter), lodash_1.toString(account.id));
        }
        else {
            await redis_1.redis.zrem(key, account.id);
        }
        return common_1.response(ctx, constant_1.RET_CODE_SUCCESS, {
            msg: '操作成功',
            data: {
                id: account.id
            }
        });
    }
}
__decorate([
    router_1.Route('/api/site/account', {
        name: 'site.account',
        methods: ['POST']
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Promise]),
    __metadata("design:returntype", Promise)
], SiteController, "account", null);
//# sourceMappingURL=site.js.map