"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const errors_1 = require("../errors");
const log = log4js_1.getLogger('88tph');
module.exports = class Site88tph extends site_base_1.default {
    constructor(a, url) {
        super();
        this.account = a;
        this.url = url.replace('https://', 'http://');
        this.log = log;
    }
    getSiteSlug() {
        return '88tph';
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
                return $.trim($('h1').text());
            });
        }
        return this.title || undefined;
    }
    async isLogin() {
        this.page.evaluate(() => {
            // @ts-ignore
            $('a.download:first').downloadCheck();
        }).catch(() => { });
        let response = await this.page.waitForResponse((res) => {
            return res.url().indexOf('/download/check.html') > 0;
        }, {
            timeout: 6000
        }).catch((e) => {
            this.log.error('检测登陆失败。', e);
        });
        if (!response) {
            return false;
        }
        return response.ok();
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/www\.88tph\.com\/qq\/redirect.html\?/;
    }
    async qqLogin() {
        const qqLoginPageUrl = 'http://www.88tph.com/qq/login.html';
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
            const $nodes = $('.infofloat dd').toArray();
            if ($nodes.length === 0) {
                return meta;
            }
            for (const node of $nodes) {
                const label = $(node).find('label').text().trim();
                const value = $(node).find('span').text().trim();
                if (!label || !value) {
                    continue;
                }
                switch (label) {
                    case '编号:':
                        meta.pid = value;
                        break;
                    case '格式:':
                        meta.format = value;
                        break;
                    case '颜色模式:':
                        meta.mode = value;
                        break;
                    case '类型:':
                        meta.type = value;
                        break;
                    case '分辨率:':
                        meta.dpi = value;
                        break;
                    case '尺寸:':
                        meta.measure = value;
                        break;
                    case '大小:':
                        meta.size = value;
                        break;
                    case '肖像权:':
                        meta.extra.portrait = value;
                        break;
                }
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        await this.page.evaluate(function () {
            $.prototype.download = function (b) {
                $.post({
                    url: "/download/get.json",
                    data: {
                        pid: b,
                        q: $("#_q_").val(),
                        pg: $("#_pg_").val(),
                        capture: $("input[name=capture]").val()
                    }
                });
            };
        });
        let $downBtn = await this.page.$('a.download-post-vip');
        if (!$downBtn) {
            $downBtn = await this.page.$('a.download-post');
        }
        let downloadUrl = [];
        if ($downBtn) {
            downloadUrl = await this.page.evaluate(function () {
                const urls = [];
                let $a = $('a.download-post-vip');
                const filterUrl = (url) => {
                    return url.startsWith('http') ? url : null;
                };
                if ($a.length > 0) {
                    // @ts-ignore
                    const url = filterUrl($a[0].href);
                    if (url) {
                        urls.push(url);
                    }
                }
                $a = $('a.download-post');
                if ($a.length > 0) {
                    // @ts-ignore
                    const url = filterUrl($a[0].href);
                    if (url) {
                        urls.push(url);
                    }
                }
                return urls;
            });
        }
        if (downloadUrl.length === 0) {
            this.log.debug('没有获取到下载按钮，开始重新获取');
            if (!$downBtn) {
                this.page.click('a.download').catch(() => {
                });
                const tmp = await this.page.waitForResponse((res) => {
                    return res.url().indexOf('/download/check.html') > 0;
                }, {
                    timeout: 6000
                }).catch((e) => {
                    this.log.error('检测下载失败。', e);
                });
                if (!tmp) {
                    throw new errors_1.CrawlerError('页面已经修改');
                }
                $downBtn = await this.page.$('a.download-post-vip');
                if (!$downBtn) {
                    $downBtn = await this.page.$('a.download-post');
                }
                if (!$downBtn) {
                    throw new errors_1.CrawlerError('页面已经修改');
                }
            }
            $downBtn.click().catch(() => { });
            const response = await this.page.waitForResponse((res) => {
                return res.url().indexOf('/download/get.json') > 0;
            }, {
                timeout: 6000
            }).catch((e) => {
                this.log.error('检测下载失败。页面可能已经被修改', e);
            });
            if (!response) {
                throw new errors_1.CrawlerError('检测下载失败');
            }
            else if (response.ok()) {
                try {
                    const ret = await response.json();
                    if (ret.status === 'ok') {
                        if (typeof ret.url === 'object') {
                            if (ret.url.a) {
                                downloadUrl.push(ret.url.a);
                            }
                            if (ret.url.b) {
                                downloadUrl.push(ret.url.b);
                            }
                            for (const k in ret.url) {
                                if (!ret.url.hasOwnProperty(k)) {
                                    continue;
                                }
                                if (k === 'a' || k === 'b') {
                                    continue;
                                }
                                downloadUrl.push(ret.url[k]);
                            }
                        }
                    }
                }
                catch (e) {
                    this.log.error('json parser error.', await response.text());
                }
            }
        }
        if (downloadUrl.length === 0) {
            throw new errors_1.CrawlerError('没有获取到下载按钮，页面可能已经被修改');
        }
        this.log.info('获取到下载地址：', downloadUrl);
        const results = [];
        const meta = _.cloneDeep(baseMeta);
        meta.extra.sources = downloadUrl;
        const result = await this.getResult(downloadUrl[0], meta);
        if (!result.result) {
            this.log.error('没有 result ', result);
            throw new errors_1.CrawlerError('没有 result');
        }
        result.result.hash = `${meta.pid}`;
        results.push(result);
        return results;
    }
};
//# sourceMappingURL=site-88tph.js.map