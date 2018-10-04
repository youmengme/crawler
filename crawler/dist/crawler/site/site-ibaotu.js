"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const requestlib = require("request");
const cookielib = require("cookie");
const moment = require("moment");
const errors_1 = require("../errors");
const log = log4js_1.getLogger('ibaotu');
module.exports = class SiteIbaotu extends site_base_1.default {
    constructor(a, url) {
        super();
        this.account = a;
        this.url = url;
        this.log = log;
    }
    getSiteSlug() {
        return 'ibaotu';
    }
    async canDownload() {
        return {
            ok: true
        };
    }
    async getTitle() {
        if (!this.title) {
            this.title = await this.page.evaluate(() => {
                const $el = document.querySelector('h1');
                return $el ? $el.innerText : undefined;
            });
        }
        return this.title || undefined;
    }
    async isLogin() {
        return this.page.evaluate(function () {
            // @ts-ignore
            if (!isLogin) {
                return false;
            }
            const $node = $('.download-wrap a.down-btn');
            const att = $node.attr('onclick');
            return att && att.indexOf('_reg') >= 0;
        });
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/888pic\.com\/login\/callback\?/;
    }
    async qqLogin() {
        await this.startQQLogin('https://ibaotu.com/?m=login&a=snsLogin&type=qq', {
            referer: this.page.url()
        });
        await this.page.reload({
            waitUntil: 'networkidle2'
        });
    }
    async sinaLogin() {
    }
    async start() {
        try {
            await this.loadUrl();
        }
        catch (e) {
            this.log.error('加载url错误', e);
        }
        try {
            await this.login();
        }
        catch (e) {
            this.log.error('登陆错误', e);
        }
        const results = [];
        // 获取 meta 信息
        const baseMeta = await this.page.evaluate(function () {
            var $list = document.querySelectorAll('.details-wrap li');
            if ($list.length === 0) {
                return {};
            }
            var meta = {
                extra: {}
            };
            for (var $node of $list) {
                var $span = $node.querySelectorAll('span');
                if ($span.length < 2) {
                    continue;
                }
                var label = $span[0].innerText.trim();
                var value = $span[1].innerText.trim();
                switch (label) {
                    case '图片编号':
                        meta.pid = value;
                        break;
                    case '颜色模式':
                        meta.mode = value;
                        break;
                    case '图片尺寸':
                        meta.measure = value;
                        break;
                    case '文件大小':
                        meta.size = value;
                        break;
                    case '文件格式':
                        meta.format = value;
                        break;
                    case '推荐软件':
                        meta.app = value;
                        break;
                }
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        if (!baseMeta.extra) {
            baseMeta.extra = {};
        }
        let downloadPageUrl = await this.page.evaluate(() => {
            const $node = document.querySelector('.download-wrap a.down-btn');
            if (!$node) {
                return null;
            }
            // @ts-ignore
            return $node.href;
        }).catch(this.log.error);
        if (!downloadPageUrl) {
            throw new errors_1.CrawlerError('没有获取到下载页面按钮');
        }
        // 从当前页面加载 title 到变量
        // 因为要准备切换页面了
        baseMeta.title = await this.getTitle();
        this.log.debug('获取到标题：', baseMeta.title);
        // 打开下载内页
        this.log.debug(`打开新页面：${downloadPageUrl}`);
        await this.page.goto(downloadPageUrl, {
            referer: this.page.url()
        }).catch((err) => {
            this.log.error(err);
        });
        const downloadRequestUrl = await this.page.evaluate(function () {
            const $a = $('#downvip');
            if ($a.is('a')) {
                // @ts-ignore
                return $a[0].href;
            }
            return null;
        });
        if (!downloadRequestUrl) {
            throw new errors_1.CrawlerError('没有获取到下载地址');
        }
        let cookies = await this.page.cookies();
        let j = requestlib.jar();
        for (const v of cookies) {
            let s = cookielib.serialize(v.name, v.value, {
                domain: v.domain,
                expires: v.expires >= 0 ? moment.unix(v.expires).toDate() : undefined,
                httpOnly: v.httpOnly,
                path: v.path,
                secure: v.secure,
                encode: s => s
            });
            j.setCookie(requestlib.cookie(s), 'https://ibaotu.com/');
        }
        let downloadUrl;
        try {
            downloadUrl = await new Promise((resolve, reject) => {
                this.log.info('从跳转获取下载地址：', downloadRequestUrl);
                try {
                    requestlib({
                        url: downloadRequestUrl,
                        jar: j,
                        strictSSL: false,
                        followRedirect: false,
                        headers: {
                            'User-Agent': this.account.user_agent || this.defaultUserAgent
                        }
                    }, (res, rep) => {
                        resolve(rep.headers.location);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        catch (e) {
            this.log.error(e);
            throw new errors_1.CrawlerError('请求下载地址错误');
        }
        this.log.info('下载地址为：', downloadUrl);
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
//# sourceMappingURL=site-ibaotu.js.map