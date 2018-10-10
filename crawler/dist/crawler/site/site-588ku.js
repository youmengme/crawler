"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const errors_1 = require("../errors");
const urllib = require("url");
const crypto = require("crypto");
const qs = require("qs");
const log = log4js_1.getLogger('588ku');
module.exports = class Site588ku extends site_base_1.default {
    constructor(a, url) {
        super();
        this.account = a;
        this.url = url;
        this.log = log;
    }
    getSiteSlug() {
        return '588ku';
    }
    async start() {
        this.page.on('dialog', (dialog) => {
            dialog.dismiss().catch(this.log.error);
        });
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
        await this.getTitle();
        const results = [];
        const baseMeta = await this.page.evaluate(function () {
            let $nodes = document.querySelectorAll('.info-r-m li');
            const meta = {
                extra: {}
            };
            if ($nodes.length === 0) {
                $nodes = document.querySelectorAll('.info-ul.info-r-box li');
                for (const $node of $nodes) {
                    const arr = $($node).text().split('：');
                    if (arr.length !== 2) {
                        continue;
                    }
                    const label = arr[0].trim();
                    const value = arr[1].trim();
                    switch (label) {
                        case '格式':
                            meta.format = value;
                            break;
                        case '体积':
                            meta.size = value;
                            break;
                        case '肖像权':
                            meta.extra.portrait = value;
                            break;
                    }
                }
                return meta;
            }
            for (const $node of $nodes) {
                if ($node.childNodes.length < 2) {
                    continue;
                }
                // @ts-ignore 原生 js
                let n = $node.childNodes[0];
                let name = '';
                if (n.nodeName === '#text') {
                    name = n.nodeValue || '';
                }
                else {
                    // @ts-ignore
                    name = n.innerText;
                }
                name = name.trim();
                // @ts-ignore 原生 js
                n = $node.childNodes[1];
                let value = '';
                if (n.nodeName === '#text') {
                    value = n.nodeValue || '';
                }
                else {
                    // @ts-ignore
                    value = n.innerText;
                }
                value = value.trim();
                switch (name) {
                    case 'PNG尺寸：':
                    case '原图尺寸：':
                        if (meta.measure) {
                            break;
                        }
                        meta.measure = value;
                        break;
                    case '尺寸：':
                        meta.measure = value;
                        break;
                    case '源文件分辨率：':
                        meta.dpi = value;
                        break;
                    case '分辨率：':
                        if (meta.dpi) {
                            break;
                        }
                        meta.dpi = value;
                        break;
                    case '源文件格式：':
                    case '格式：':
                        meta.format = value;
                        break;
                }
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        if (!baseMeta.extra) {
            baseMeta.extra = {};
        }
        const isDownloadRequest = (req) => {
            this.log.debug(`request [${req.method()}] ${req.url()}`);
            const parse = urllib.parse(req.url());
            const query = qs.parse(parse.query || '');
            const a = ['downpsd', 'down'];
            // const m = ['back', 'element'];
            // query.m && m.indexOf(query.m) >= 0 &&
            if (query.a && a.indexOf(query.a) >= 0) {
                return true;
            }
            return /\/down\/(rar|zip|psd|png|jpg|jpeg|pic)/.test(parse.pathname || '') && parse.host === 'dl.588ku.com';
        };
        let $nodes = await this.page.$$('.info-r-t a.download-btn[data]');
        if ($nodes.length === 0) {
            $nodes = await this.page.$$('.info-r-t a.download-btn[data-type]');
        }
        if ($nodes.length === 0) {
            const downloadPageUrl = await this.page.evaluate(function () {
                const $nodes = $('.info-r-box a.download-y').not(':hidden');
                if ($nodes.length === 0) {
                    return null;
                }
                // @ts-ignore
                return $nodes.is('a') ? $nodes[0].href : null;
            });
            if (downloadPageUrl !== null) {
                this.log.info('黄色按钮的下载页面：', downloadPageUrl);
                if (downloadPageUrl.startsWith('http')) {
                    await this.page.goto(downloadPageUrl, {
                        referer: this.page.url()
                    }).catch(e => {
                        this.log.error('跳转到下载页面出错');
                    });
                    $nodes = await this.page.$$('.download-file');
                }
                else {
                    $nodes = await this.page.$$('.info-r-box a.download-y');
                }
            }
        }
        if ($nodes.length === 0) {
            this.log.error('页面规则已经改变，下载失败。', this.page.url());
            throw new errors_1.CrawlerError('页面规则已经改变，下载失败。');
        }
        const requestHandler = (req) => {
            this.log.debug(`[request ${req.method()}] ${req.url()}`);
            if (isDownloadRequest(req)) {
                this.log.info(`拦截到url: ${req.url()}`);
            }
            else {
                req.continue().catch(e => {
                    this.log.error(e);
                });
            }
        };
        let hit = 0;
        for (const $node of $nodes) {
            this.log.debug('开启拦截');
            await this.page.setRequestInterception(true);
            this.page.on('request', requestHandler);
            const request$ = this.page.waitForRequest(req => {
                this.log.debug(`[wait request ${req.method()}] ${req.url()}`);
                return isDownloadRequest(req);
            }, {
                timeout: 8000
            }).catch(async (e) => {
                await this.page.waitFor(99999999);
                this.log.error('拦截下载请求超时：', e);
            });
            this.log.debug('click');
            $node.click().catch(e => {
                this.log.error(e);
            });
            const request = await request$;
            if (!request) {
                this.page.off('request', requestHandler);
                continue;
            }
            const requestUrl = request.url();
            await request.abort().catch(() => { });
            this.log.debug('关闭拦截');
            this.page.off('request', requestHandler);
            await this.page.setRequestInterception(false);
            const parse = urllib.parse(requestUrl);
            const query = qs.parse(parse.query || '');
            const json = await this.page.evaluate(async function (url, cb) {
                const opt = {
                    url: url,
                    type: 'GET',
                    dataType: cb ? 'jsonp' : 'json'
                };
                if (opt.dataType === 'jsonp') {
                    opt.jsonp = 'callback';
                    opt.jsonpCallback = cb;
                }
                return await $.ajax(opt);
            }, requestUrl, query.callback).catch(e => {
                this.log.error('请求下载接口出错：', e);
                return null;
            });
            /*
            {
                code?: number,
                msg?: string,
                data?: {
                    id: number,
                    isVip: number,
                    keyword: any,
                    msg: string,
                    status: number,
                    type: number,
                    url: string
                }
            } | {
                status?: number,
                url?: string,
                uid?: string,
                isvip?: number,
                create_time?: any,
                id?: number,
                pic_class?: number,
                keyword?: null | string
            } | null
             */
            if (!json) {
                continue;
            }
            this.log.info('拦截到下载数据：', JSON.stringify(json));
            const meta = _.cloneDeep(baseMeta);
            meta.extra.format = meta.format;
            meta.format = await this.page.evaluate(function (a) {
                return $(a).text().replace('下载', '').trim();
            }, $node);
            let downloadUrl;
            if (json.code !== undefined) {
                if (json.code !== 200 || !json.data) {
                    this.log.error('接口返回异常 #1。', json);
                    continue;
                }
                meta.pid = _.toString(json.data.id);
                meta.type = _.toString(json.data.type);
                meta.extra = Object.assign({}, json.data, meta.extra);
                downloadUrl = json.data.url;
            }
            else if (json.id !== undefined) {
                if (json.status !== 0 || !json.url) {
                    this.log.error('接口返回异常 #1。', json);
                    continue;
                }
                meta.pid = _.toString(json.id);
                meta.type = _.toString(json.pic_class);
                downloadUrl = json.url;
            }
            else {
                this.log.warn('异常的返回格式');
                continue;
            }
            const result = await this.getResult(downloadUrl, meta);
            if (result.result) {
                const parse = urllib.parse(downloadUrl);
                const h = crypto.createHash('md5');
                result.result.hash = h.update(parse.pathname || downloadUrl).digest('hex').toLowerCase();
            }
            results.push(result);
            hit++;
        }
        if (hit === 0) {
            throw new errors_1.CrawlerError('下载失败');
        }
        return results;
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/588ku\.com\/dlogin\/callback\/qq\?/;
    }
    async qqLogin() {
        await this.startQQLogin('http://588ku.com/index.php?m=login&a=snsLogin&type=qq&source=undefined', {
            referer: this.page.url()
        });
        await this.page.reload();
    }
    async sinaLogin() {
    }
    async canDownload() {
        return {
            ok: true
        };
    }
    async getTitle() {
        if (!this.title) {
            this.title = await this.page.evaluate(() => {
                var $el = document.querySelector('.bread-nav span:last-child');
                return $el ? $el.innerText : undefined;
            });
        }
        return this.title || undefined;
    }
    async isLogin() {
        try {
            return this.page.evaluate(function () {
                // @ts-ignore
                return globaluid && globaluid !== '0';
            });
        }
        catch (e) {
            this.log.error('isLogin error。', e);
        }
        return false;
    }
};
//# sourceMappingURL=site-588ku.js.map