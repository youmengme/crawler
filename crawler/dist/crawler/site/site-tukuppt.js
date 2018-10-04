"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const errors_1 = require("../errors");
const dependency_injection_1 = require("../../core/dependency-injection");
const log = log4js_1.getLogger('16tukupptpic');
module.exports = class SiteTukuppt extends site_base_1.default {
    constructor(a, url) {
        super();
        this.account = a;
        this.url = url.replace('https://', 'http://');
        this.log = log;
    }
    getSiteSlug() {
        return 'tukuppt';
    }
    async canDownload() {
        try {
            await this.loadUrl();
        }
        catch (e) {
            this.log.error('加载url错误', e);
        }
        this.log.debug('pre get title');
        await this.getTitle();
        return {
            ok: true
        };
    }
    async getTitle() {
        if (!this.title) {
            this.title = await this.page.evaluate(() => {
                return $.trim($('h1').text());
            });
        }
        return this.title || undefined;
    }
    async isLogin() {
        return await this.page.evaluate(function () {
            // @ts-ignore
            return isLogin;
        });
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/www\.tukuppt\.com\/login\/callback\?/;
    }
    async qqLogin() {
        const qqLoginPageUrl = 'http://www.tukuppt.com/login/qq';
        await this.startQQLogin(qqLoginPageUrl, {
            referer: this.page.url()
        });
        await this.page.reload();
    }
    async sinaLogin() {
    }
    async start() {
        try {
            await this.login();
        }
        catch (e) {
            this.log.error('登陆错误', e);
        }
        // 获取 meta 信息
        const baseMeta = await this.page.evaluate(function () {
            const meta = {
                extra: {}
            };
            let pid = $('.d-down').attr('pid');
            if (!pid) {
                pid = $('#tjyzm').attr('pid');
            }
            if (pid) {
                meta.pid = pid;
            }
            const $nodes = $('.mould2 ul li').toArray();
            if ($nodes.length === 0) {
                return meta;
            }
            for (const node of $nodes) {
                const label = $.trim($(node).find('div:eq(0)').text());
                const value = $.trim($(node).find('div:eq(1)').text());
                if (!label || !value) {
                    continue;
                }
                switch (label) {
                    case '大小：':
                        meta.size = value;
                        break;
                    case '格式：':
                        meta.format = value;
                        break;
                    case '页数：':
                        meta.extra.pages = value;
                        break;
                    case '软件：':
                        meta.app = value;
                        break;
                    case '比例：':
                        meta.scale = value;
                        break;
                    case '提供者：':
                        meta.extra.provider = value;
                        break;
                    case '像素：':
                        meta.dpi = value;
                        break;
                    case '肖像权：':
                        meta.extra.portrait = value;
                        break;
                }
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        let json = await this.page.evaluate(async function () {
            const $btn = $('.d-down');
            let pid = $btn.attr('pid');
            if (!pid) {
                pid = $('#tjyzm').attr('pid');
            }
            const code = $('.c-code').val();
            const url = "/index/down";
            return await $.ajax({
                type: "GET",
                url: url,
                data: {
                    pid: pid,
                    code: code,
                    _: +new Date()
                },
                jsonp: "callback",
                dataType: "jsonp"
            });
        }).catch(e => {
            this.log.error('获取下载地址错误：', e);
        });
        if (json && json.whyinfo == 5) {
            const getDownLinkByCode = async (retries) => {
                if (retries <= 0) {
                    return null;
                }
                this.log.debug('输入验证码中');
                retries--;
                this.page.evaluate(() => {
                    $("#yanzhengma").attr('src', '/index/down/code?' + (+new Date));
                    $('.code').show();
                });
                let verifyCodeResponse;
                try {
                    this.log.debug('监听验证码');
                    verifyCodeResponse = await this.page.waitForResponse((request) => {
                        return /https?:\/\/[^/]+\/index\/down\/code(?:\?\d+)$/.test(request.url());
                    });
                }
                catch (e) {
                    this.log.error(e);
                    return null;
                }
                this.log.debug('开始打码');
                const jsdati = dependency_injection_1.getService('verify.jsdati');
                let verifyCode = await jsdati.verify(await verifyCodeResponse.buffer(), 1038);
                if (!verifyCode) {
                    return await getDownLinkByCode(retries);
                }
                this.log.debug('识别出验证码：', verifyCode.toLowerCase());
                let ret = await this.page.evaluate(async (code) => {
                    const $btn = $('.d-down');
                    const pid = $btn.attr('pid');
                    return await $.ajax({
                        type: "GET",
                        url: '/index/down',
                        data: {
                            pid: pid,
                            code: code,
                            _: +new Date()
                        },
                        jsonp: "callback",
                        dataType: "jsonp"
                    });
                }, verifyCode).catch(e => {
                    this.log.error(e);
                });
                if (ret && ret.status == 1) {
                    return ret;
                }
                return await getDownLinkByCode(retries);
            };
            json = await getDownLinkByCode(3);
        }
        if (json) {
            this.log.debug('获取到下载地址请求：', JSON.stringify(json));
        }
        if (!json || json.status !== 1 || !json.downurl) {
            throw new errors_1.CrawlerError('获取下载地址失败，可能页面已经修改规则');
        }
        const downloadUrl = json.downurl;
        this.log.info('获取到下载地址：', downloadUrl);
        const results = [];
        const meta = _.cloneDeep(baseMeta);
        const result = await this.getResult(downloadUrl, meta);
        if (!result.result) {
            this.log.error('没有 result ', result);
            throw new errors_1.CrawlerError('没有 result');
        }
        result.result.hash = `${meta.pid}`;
        results.push(result);
        return results;
    }
};
//# sourceMappingURL=site-tukuppt.js.map