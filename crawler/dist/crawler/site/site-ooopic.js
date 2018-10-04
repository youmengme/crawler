"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const errors_1 = require("../errors");
const log = log4js_1.getLogger('ooopic');
module.exports = class SiteOoopic extends site_base_1.default {
    constructor(a, url) {
        super();
        this.account = a;
        this.url = url.replace('https://', 'http://');
        this.log = log;
    }
    getSiteSlug() {
        return 'ooopic';
    }
    async canDownload() {
        try {
            await this.loadUrl();
        }
        catch (e) {
            this.log.error('加载url错误', e);
        }
        await this.getTitle();
        return {
            ok: true
        };
    }
    async getTitle() {
        if (!this.title) {
            this.title = await this.page.evaluate(() => {
                return $.trim($('h2:first').text());
            });
        }
        return this.title || undefined;
    }
    async isLogin() {
        return this.page.evaluate(function () {
            // @ts-ignore
            return obj && obj.userid > 0;
        });
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/account\.ooopic\.com\/user\/loginAction\.php\?/;
    }
    async qqLogin() {
        const qqLoginPageUrl = 'http://account.ooopic.com/user/loginAction.php?type=qq&action=thirdParty&from=vip_down';
        await this.startQQLogin(qqLoginPageUrl, {
            referer: 'http://account.ooopic.com/user/login.php?from=vip_down'
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
            const $nodes = $('.infor-pic p').toArray();
            if ($nodes.length === 0) {
                return meta;
            }
            for (const node of $nodes) {
                const $span = $(node).find('span');
                if ($span.length < 2) {
                    continue;
                }
                const label = $span.eq(0).text().trim();
                const value = $span.eq(1).text().trim();
                switch (label) {
                    case '图片编号：':
                        meta.pid = value;
                        break;
                    case '体积：':
                        meta.size = value;
                        break;
                    case '软件名称：':
                        meta.app = value;
                        break;
                    case '文件格式：':
                        meta.format = value;
                        break;
                    case '颜色模式：':
                        meta.mode = value;
                        break;
                    case '图像类型：':
                        meta.type = value;
                        break;
                    case '分辨率：':
                        meta.dpi = value;
                        break;
                    case '印刷尺寸：':
                        meta.measure = value;
                        break;
                }
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        const downloadPageUrl = await this.page.evaluate(function () {
            const $a = $('.download-btn:first a');
            if (!$a.is('a')) {
                return null;
            }
            // @ts-ignore
            return $a[0].href;
        });
        if (!downloadPageUrl) {
            this.log.error('没有获取到下载按钮，页面规则已经修改');
            throw new errors_1.CrawlerError('没有获取到下载按钮，页面规则已经修改');
        }
        this.log.debug('获取到下载页面地址：', downloadPageUrl);
        await this.page.goto(downloadPageUrl, {
            referer: this.page.url()
        }).catch((e) => {
            this.log.error(e);
        });
        let $downBtn = await this.page.$('.now-load');
        if (!$downBtn) {
            $downBtn = await this.page.$('nowclick-load');
        }
        if (!$downBtn) {
            this.log.error('下载页面的下载按钮没有获取到，页面规则已经修改');
            throw new errors_1.CrawlerError('下载页面的下载按钮没有获取到，页面规则已经修改');
        }
        const isDownloadUrl = (url) => {
            const pattern = /https?:\/\/proxy[^.]+\.ooopic.com\/[^.]+\.[^?]+\?/;
            return pattern.test(url);
        };
        await this.page.setRequestInterception(true);
        this.page.on('request', (req) => {
            if (!isDownloadUrl(req.url())) {
                req.continue().catch(() => { });
            }
            else {
                this.log.info('拦截到下载地址：', req.url());
            }
        });
        $downBtn.click().catch(() => { });
        const request = await this.page.waitForRequest((req) => {
            return isDownloadUrl(req.url());
        }, {
            timeout: 6000
        }).catch((e) => {
            this.log.error('拦截下载地址超时：', e);
        });
        if (!request) {
            throw new errors_1.CrawlerError('没有获取到下载地址');
        }
        const downloadUrl = request.url();
        request.abort().catch(() => { });
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
//# sourceMappingURL=site-ooopic.js.map