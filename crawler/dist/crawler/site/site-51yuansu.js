"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const errors_1 = require("../errors");
const urllib = require("url");
const qs = require("qs");
const crypto = require("crypto");
const log = log4js_1.getLogger('51yuansu');
module.exports = class Site51yuansu extends site_base_1.default {
    constructor(a, url) {
        super();
        this.js = null;
        this.account = a;
        this.url = url.replace('https://', 'http://');
        this.log = log;
    }
    getSiteSlug() {
        return '51yuansu';
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
                return $.trim($('h3:eq(1)').text());
            });
        }
        return this.title || undefined;
    }
    async isLogin() {
        return this.page.evaluate(function () {
            const selectors = ['.p-down-operate', '.p-down-operate-zip', '.b-down-operate', '.b-down-operate-zip'];
            for (const sel of selectors) {
                if ($(sel).length > 0 && !$(sel).eq(0).hasClass('log-cl')) {
                    return true;
                }
            }
            return false;
        });
    }
    async qqLogin() {
        const qqLoginPageUrl = 'http://www.51yuansu.com/index.php?m=login&a=thirdLogin&way=qq';
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
        this.log.debug('准备下载');
        // 获取 meta 信息
        const baseMeta = await this.page.evaluate(function () {
            const meta = {
                extra: {}
            };
            const $nodes = $('.pic-info p').toArray();
            console.log($nodes);
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
                    case '编号 :':
                        meta.pid = value;
                        break;
                    case '格式 :':
                        meta.format = value;
                        break;
                    case '分辨率 :':
                        meta.dpi = value;
                        break;
                    case '尺寸 :':
                        meta.measure = value;
                        break;
                }
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        const isDownloadRequest = (req) => {
            const parse = urllib.parse(req.url());
            const query = qs.parse(parse.query || '');
            const a = ['down', 'downPsd', 'bdown', 'bdownPsd'];
            return query.a && a.indexOf(query.a) >= 0;
        };
        const selectors = ['.show-pic-operate .p-down-operate', '.show-pic-operate .p-down-operate-zip', '.show-pic-operate .b-down-operate', '.show-pic-operate .b-down-operate-zip'];
        const requestHandler = (req) => {
            if (!isDownloadRequest(req)) {
                req.continue().catch(() => {
                });
            }
            else {
                this.log.info('拦截到下载请求：', req.url());
            }
        };
        const results = [];
        for (const sel of selectors) {
            const $node = await this.page.$(sel);
            if (!$node) {
                this.log.debug('skip ', sel);
                continue;
            }
            this.log.debug('hit ', sel);
            this.log.debug('开启拦截');
            await this.page.setRequestInterception(true);
            this.page.on('request', requestHandler);
            do {
                const request$ = this.page.waitForRequest(req => {
                    return isDownloadRequest(req);
                }, {
                    timeout: 10000
                }).catch(e => {
                    this.log.error(`拦截 "${sel}" 的下载地址错误：`, e);
                });
                const meta = await this.page.evaluate(function (sel, meta) {
                    const format = meta.format;
                    meta.format = $(sel).eq(0).text().replace('下载', '').trim();
                    if (format) {
                        if (!meta.extra) {
                            meta.extra = {};
                        }
                        meta.extra.format = format;
                    }
                    return meta;
                }, sel, _.cloneDeep(baseMeta));
                this.page.evaluate(function (sel) {
                    $(sel)[0].click();
                }, sel);
                const request = await request$;
                if (!request) {
                    break;
                }
                const requestUrl = request.url();
                await request.abort().catch(() => {
                });
                await this.page.setRequestInterception(false);
                const json = await this.page.evaluate(async function (url) {
                    try {
                        return await $.ajax({
                            url: url,
                            type: 'GET',
                            dataType: 'json'
                        });
                    }
                    catch (e) {
                        return null;
                    }
                }, requestUrl);
                if (!json || typeof json !== 'object' || !json.url) {
                    this.log.error('下载失败：', requestUrl, json);
                    break;
                }
                this.log.debug('拦截到下载请求返回数据：', JSON.stringify(json));
                const downloadUrl = json.url;
                const result = await this.getResult(downloadUrl, meta);
                if (!result.result) {
                    this.log.error('没有 result ', result);
                    throw new errors_1.CrawlerError('没有 result');
                }
                const parse = urllib.parse(downloadUrl);
                const h = crypto.createHash('md5');
                result.result.hash = h.update(parse.pathname || downloadUrl).digest('hex').toLowerCase();
                results.push(result);
            } while (false);
            this.log.debug('关闭拦截');
            await this.page.setRequestInterception(false);
            this.page.off('request', requestHandler);
        }
        if (results.length === 0) {
            throw new errors_1.CrawlerError('下载失败，可能页面规则又改了。shit!!!');
        }
        return results;
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/www\.51yuansu\.com\/login\/callback\/qq\?code/;
    }
};
//# sourceMappingURL=site-51yuansu.js.map