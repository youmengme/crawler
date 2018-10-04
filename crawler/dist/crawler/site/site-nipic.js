"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const errors_1 = require("../errors");
const log = log4js_1.getLogger('nipic');
module.exports = class SiteNipic extends site_base_1.default {
    constructor(a, url) {
        super();
        this.account = a;
        this.url = url;
        this.log = log;
    }
    getSiteSlug() {
        return 'nipic';
    }
    async canDownload() {
        try {
            await this.loadUrl();
        }
        catch (e) {
            this.log.error('加载url错误', e);
        }
        const ret = await this.page.evaluate(function () {
            const $el = document.querySelector('a.works-manage-download');
            if (!$el) {
                return [-1, '没有获取到下载按钮'];
            }
            // @ts-ignore
            let parse = new URL($el.href);
            if (parse.pathname === '/download') {
                return [0, undefined];
            }
            else if (parse.pathname === '/download_sell') {
                return [-2, '人民币资源', '人民币资源无法下载'];
            }
            return [-3, '未知资源类型'];
        }).catch(async (e) => {
            this.log.error(e);
        });
        return {
            ok: ret[0] === 0,
            reason: ret[1]
        };
    }
    async getTitle() {
        if (!this.title) {
            this.title = await this.page.evaluate(() => {
                var $el = document.querySelector('h1');
                return $el ? $el.innerText : undefined;
            });
        }
        return this.title || undefined;
    }
    async isLogin() {
        return this.page.evaluate(function () {
            // @ts-ignore
            return checkLogin();
        });
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/login\.nipic\.com\/account\/auth\/qq\/callback\?/;
    }
    async qqLogin() {
        await this.startQQLogin('https://login.nipic.com/account/auth/qq', {
            referer: 'https://login.nipic.com/?backurl=' + encodeURIComponent(this.page.url())
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
        await this.getTitle(); // 预加载标题
        const downloadPageUrl = await this.page.evaluate(() => {
            var $el = document.querySelector('a.works-manage-download');
            // @ts-ignore
            return $el ? $el.href : null;
        });
        if (!downloadPageUrl) {
            this.log.error('没有获取到下载页面按钮，页面规则已经改变');
            throw new errors_1.CrawlerError('没有获取到下载页面按钮');
        }
        const baseMeta = await this.page.evaluate(function () {
            var $nodes = document.querySelectorAll('.works-img-about-intro span[itemprop]');
            var meta = {
                extra: {}
            };
            for (var $node of $nodes) {
                if ($node.childNodes.length < 2) {
                    continue;
                }
                var name, value;
                var n = $node.childNodes[0];
                if (n.nodeName === '#text') {
                    name = (n.nodeValue || '').trim();
                }
                else {
                    // @ts-ignore
                    name = (n.innerText || '').trim();
                }
                n = $node.childNodes[1];
                if (n.nodeName === '#text') {
                    value = (n.nodeValue || '').trim();
                }
                else {
                    // @ts-ignore
                    value = (n.innerText || '').trim();
                }
                switch (name) {
                    case '编号：':
                        meta.pid = value;
                        break;
                    case '大小：':
                        meta.size = value;
                        break;
                    case '尺寸：':
                        meta.measure = value;
                        break;
                    case '格式：':
                        meta.format = value;
                        break;
                    case '颜色：':
                        meta.mode = value;
                        break;
                }
            }
            try {
                var $star = document.querySelector('.new-works-star-level');
                if ($star) {
                    for (var c of $star.classList) {
                        if (!c)
                            continue;
                        if (c.startsWith('new-works-star-')) {
                            var star = parseInt(c.substr(15));
                            if (!isNaN(star) && star >= 0 && star <= 10) {
                                meta.extra.star = star;
                                break;
                            }
                        }
                    }
                }
                // @ts-ignore
                meta.price = document.querySelector('.works-price-box b').innerText.trim();
            }
            catch (e) {
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        this.log.debug(`打开下载页面 ${downloadPageUrl}`);
        await this.page.goto(downloadPageUrl, {
            referer: this.page.url(),
            waitUntil: 'networkidle2'
        }).catch((e) => {
            this.log.error(e);
        });
        const results = [];
        this.log.debug('开启拦截');
        await this.page.setRequestInterception(true);
        this.page.on('request', (req) => {
            const pattern = /^https?:\/\/file[a-z0-9]+\.nipic\.com\/(\d+|[0-9-]+)\/[^.]+\.[^?]+/;
            if (pattern.test(req.url())) {
                this.log.debug(`拦截到下载地址：${req.url()}`);
                // req.abort().catch(this.log.error);  // 不拒绝，外部再去捕获
            }
            else {
                req.continue().catch((err) => {
                    this.log.error(err);
                });
            }
        });
        const $downButtons = await this.page.$$('a.J-download');
        if ($downButtons.length > 1) {
            $downButtons[1].click().catch((e) => {
                this.log.error(e);
            });
        }
        else {
            $downButtons[0].click().catch((e) => {
                this.log.error(e);
            });
        }
        // const resp = await this.page.waitForResponse('http://down.nipic.com/ajax/download_go', {
        //     timeout: 6000
        // }).catch(e => {
        //     this.log.error('wait for error: ', e);
        // });
        // {"code":"2000","mes":"下载成功","data":{"url":"http://file1875d2.nipic.com/0000-00-00/downvsid.ashx?clink=http://file1875d2.nipic.com/20180914/Nipic_3046502_814ef5dca3c47caa.zip\u0026ctime=2018/9/20 23:42:30\u0026ccode=6ee6b6a866c6f3f87b4794ace5f02e6f\u0026ckind=4\u0026ctout=2018/9/21 2:29:10 "}}
        const request = await this.page.waitForRequest((req) => {
            const pattern = /^https?:\/\/file[a-z0-9]+\.nipic\.com\/(\d+|[0-9-]+)\/[^.]+\.[^?]+/;
            return pattern.test(req.url());
        }, { timeout: 6000 }).catch((err) => {
            this.log.error('拦截下载地址超时。', err);
        });
        if (!request) {
            throw new errors_1.CrawlerError('下载失败');
        }
        const downloadUrl = request.url();
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
//# sourceMappingURL=site-nipic.js.map