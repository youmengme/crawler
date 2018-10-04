"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const errors_1 = require("../errors");
const log = log4js_1.getLogger('16pic');
module.exports = class Site16pic extends site_base_1.default {
    constructor(a, url) {
        super();
        this.account = a;
        this.url = url;
        this.log = log;
    }
    getSiteSlug() {
        return '16pic';
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
                return $('h1').text().trim();
            });
        }
        return this.title || undefined;
    }
    async isLogin() {
        return await this.page.evaluate(function () {
            return $('#login').length === 0;
        });
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/www\.16pic\.com\/login\/qq_auth\?/;
    }
    async qqLogin() {
        const qqLoginPageUrl = 'https://www.16pic.com/login/qq_login';
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
            const $nodes = $('.detail_info ul li').toArray();
            if ($nodes.length === 0) {
                return meta;
            }
            for (const node of $nodes) {
                const parse = $(node).text().trim().split('：');
                if (parse.length < 2) {
                    continue;
                }
                const label = parse[0];
                const value = parse[1];
                switch (label) {
                    case '编号':
                        meta.pid = value;
                        break;
                    case '大小':
                        meta.size = value;
                        break;
                    case '格式':
                        meta.format = value;
                        break;
                    case '颜色':
                        meta.mode = value;
                        break;
                    case '尺寸':
                        meta.mode = value;
                        break;
                }
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        const downloadPageUrl = await this.page.evaluate(function () {
            const $a = $('a.download_sta');
            if (!$a.is('a')) {
                return null;
            }
            // @ts-ignore
            return $a[0].href;
        });
        if (!downloadPageUrl) {
            this.log.error('获取下载页面地址错误，页面已经修改');
            throw new errors_1.CrawlerError('获取下载页面地址错误');
        }
        await this.page.goto(downloadPageUrl, {
            referer: this.page.url()
        });
        const pattern = /secure_down\('(\d+)',\s*(\d+)\)/g;
        const html = await this.page.content();
        let downloadUrl;
        while (true) {
            const v = pattern.exec(html);
            if (!v) {
                this.log.error('没有匹配到id数据');
                await this.page.waitFor(99999999);
                throw new errors_1.CrawlerError('没有匹配到id数据');
            }
            const pid = v[1];
            const type = v[2];
            downloadUrl = await this.page.evaluate(async function (pid, type) {
                const data = await $.getJSON('/down/down?id=' + pid + '&from=' + type);
                if (data.res_code === 'SUCCESS') {
                    return data.res_data;
                }
                return null;
            }, pid, type);
            if (downloadUrl) {
                this.log.info('获取到下载地址：', downloadUrl);
                break;
            }
        }
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
//# sourceMappingURL=site-16pic.js.map