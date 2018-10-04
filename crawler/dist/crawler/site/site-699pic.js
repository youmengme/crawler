"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const urllib = require("url");
const crypto = require("crypto");
const requestlib = require("request");
const errors_1 = require("../errors");
const log = log4js_1.getLogger('699pic');
module.exports = class Site699pic extends site_base_1.default {
    constructor(a, url) {
        super();
        this.js = null;
        this.account = a;
        this.url = url;
        this.log = log;
    }
    getSiteSlug() {
        return '699pic';
    }
    async canDownload() {
        return {
            ok: true
        };
    }
    async start() {
        this.log.debug('开启拦截');
        await this.page.setRequestInterception(true);
        const preRequestHandler = (req) => {
            if (/\/js\/downjsV3\/article\.v\d[^?]+\.js/.test(req.url())) {
                if (this.js !== null) {
                    req.respond({
                        status: 200,
                        body: this.js
                    }).catch(() => {
                    });
                    return;
                }
                requestlib({
                    method: 'GET',
                    uri: req.url(),
                    headers: req.headers()
                }, (err, resp, body) => {
                    if (err) {
                        this.log.error('请求 /js/downjsV3/article.js 错误。', err);
                        throw new errors_1.CrawlerError('请求 /js/downjsV3/article.js 错误');
                    }
                    if (resp.statusCode > 299 || resp.statusCode < 200) {
                        this.log.error('请求 /js/downjsV3/article.js 状态码错误。', resp.statusCode);
                        throw new errors_1.CrawlerError('请求 /js/downjsV3/article.js 状态码错误。' + resp.statusCode);
                    }
                    this.js = body = body.replace(/!onswitch2/g, 'true');
                    req.respond({
                        status: 200,
                        body: body
                    }).then(() => {
                        this.log.info('js 注入成功');
                    }).catch((e) => {
                        this.log.error('js 注入错误。', e);
                    });
                });
            }
            else {
                req.continue().catch(() => {
                });
            }
        };
        this.page.on('request', preRequestHandler);
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
        this.page.off('request', preRequestHandler);
        await this.page.setRequestInterception(false);
        await this.getTitle();
        const results = [];
        // 获取 meta 信息
        const baseMeta = await this.page.evaluate(function () {
            const $nodes = $('.infor p').toArray();
            if ($nodes.length === 0) {
                return {};
            }
            const meta = {
                extra: {}
            };
            for (const node of $nodes) {
                const $span = $(node).find('span');
                let label, value;
                if ($span.length === 1) {
                    if ($(node).contents().length !== 2) {
                        continue;
                    }
                    label = $(node).contents().eq(0).text().trim();
                    value = $(node).contents().eq(1).text().trim();
                }
                else if ($span.length === 2) {
                    label = $span[0].innerText.trim();
                    value = $span[1].innerText.trim();
                }
                else {
                    continue;
                }
                switch (label) {
                    case '编号':
                        meta.pid = value;
                        break;
                    case '分类':
                        meta.category = value;
                        break;
                    case '源文件体积':
                        meta.size = value;
                        break;
                    case '格式':
                        meta.format = value;
                        break;
                    case '推荐软件':
                        meta.app = value;
                        break;
                    case '尺寸':
                        meta.measure = value;
                        break;
                    case '体积':
                        meta.size = value;
                        break;
                    case '时长':
                        meta.extra.time = value;
                        break;
                }
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        if (!baseMeta.extra) {
            baseMeta.extra = {};
        }
        const isMetaRequest = (req) => {
            const parse = urllib.parse(req.url());
            if (parse.pathname) {
                if (parse.pathname.startsWith('/download/allowDownloadVideo')) {
                    this.log.info('拦截到video meta请求：', req.url());
                    return true;
                }
            }
            return false;
        };
        const isDownloadRequest = (req) => {
            const parse = urllib.parse(req.url());
            if (parse.pathname) {
                if (parse.pathname.startsWith('/download/video')) {
                    this.log.info('拦截到video下载请求：', req.url());
                    return true;
                }
                else if (parse.pathname.startsWith('/download/getDownloadUrl')) {
                    this.log.info('拦截到下载请求：', req.url());
                    return true;
                }
                else if (parse.pathname.startsWith('/download/media')) {
                    this.log.info('拦截到media下载请求：', req.url());
                    return true;
                }
                else if (parse.pathname.startsWith('/download/') && !parse.pathname.startsWith('/download/allowDownload')) {
                    this.log.info('拦截到未知下载请求：', req.url());
                    return true;
                }
                else if (parse.pathname.startsWith('/newdownload/design')) {
                    this.log.info('拦截到 /newdownload/design ：', req.url());
                    return true;
                }
                else if (parse.pathname.startsWith('/newdownload/phoneMap')) {
                    this.log.info('拦截到 /newdownload/phoneMap：', req.url());
                    return true;
                }
                else if (parse.pathname.startsWith('/newdownload/')) {
                    this.log.info('拦截到未知下载请求：', req.url());
                    return true;
                }
            }
            return false;
        };
        let $nodes = await this.page.$$('#video_download_btn');
        let isSel = false;
        if ($nodes.length > 0) {
            this.log.info('video 下载');
        }
        else if ($nodes.length === 0) {
            $nodes = await this.page.$$('#_event-set i');
            if ($nodes.length > 0) {
                isSel = true;
                this.log.info('普通素材下载 isSel=true');
            }
        }
        if ($nodes.length == 0) {
            $nodes = await this.page.$$('#detail_free_download_btn');
            if ($nodes.length > 0) {
                this.log.info('detail_free_download_btn');
            }
        }
        if ($nodes.length === 0) {
            this.log.error('页面规则已经改变，下载失败。', this.page.url());
            throw new errors_1.CrawlerError('页面规则已经改变，下载失败。');
        }
        const requestHandler = (req) => {
            this.log.debug(`request [${req.method()}] ${req.url()}`);
            if (isDownloadRequest(req)) {
                this.log.info(`拦截到下载地址：${req.url()}`);
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
            do {
                const request$ = this.page.waitForRequest(req => {
                    return isDownloadRequest(req);
                }, {
                    timeout: 10000
                }).catch(e => {
                    this.log.error('没有拦截到下载请求', e);
                    return null;
                });
                const metaResponse$ = this.page.waitForResponse(res => {
                    return isMetaRequest(res);
                }, {
                    timeout: 10000
                }).catch(() => {
                });
                if (isSel) {
                    console.log((await $node.getProperties()).keys());
                    await $node.click();
                    this.page.click('#detail_free_download_btn', {
                        delay: Site699pic.clickDelay()
                    }).catch(e => {
                        this.log.error(e);
                    });
                }
                else {
                    $node.click().catch(e => {
                        this.log.error(e);
                    });
                }
                const request = await request$;
                if (!request) {
                    await this.page.waitFor(60000);
                    this.log.error('没有拦截到下载地址请求');
                    break;
                }
                const ajaxOpt = {
                    url: request.url(),
                    type: request.method(),
                    dataType: 'json'
                };
                if (ajaxOpt.type.toUpperCase() === 'POST') {
                    ajaxOpt.data = request.postData();
                }
                await request.abort().catch(e => {
                    this.log.error(e);
                });
                const meta = _.cloneDeep(baseMeta);
                this.log.debug('关闭拦截');
                this.page.off('request', requestHandler);
                await this.page.setRequestInterception(false);
                const json = await this.page.evaluate(async function (ajaxOpt) {
                    return await $.ajax(ajaxOpt);
                }, ajaxOpt).catch(e => {
                    this.log.error(e);
                    return null;
                });
                if (!json) {
                    this.log.error('请求下载地址失败', JSON.stringify(ajaxOpt));
                    continue;
                }
                this.log.info('请求下载数据：', JSON.stringify(json));
                let downloadUrl = '';
                if (typeof json.src === 'string' && json.status !== undefined) {
                    downloadUrl = json.src;
                    if (json.resp) {
                        meta.extra = Object.assign(meta.extra || {}, json.resp);
                        if (json.resp.pid) {
                            meta.pid = _.toString(json.resp.pid);
                            meta.type = _.toString(json.resp.stat_type);
                            meta.category = _.toString(json.resp.pic_cate);
                        }
                    }
                    else {
                        const metaResponse = await metaResponse$;
                        if (!metaResponse) {
                            this.log.warn('没有拦截到 meta response');
                        }
                        else {
                            const text = await metaResponse.text();
                            this.log.info('获取到meta response: ', text);
                            const json = await metaResponse.json();
                            if (json && json.state === 1 && json.data && json.data.resp) {
                                if (json.data.resp.pid) {
                                    meta.pid = json.data.resp.pid;
                                }
                                if (json.data.resp.pic_cate) {
                                    meta.category = json.data.resp.pic_cate;
                                }
                                meta.extra = Object.assign(meta.extra || {}, json.data);
                            }
                            else {
                                this.log.warn('meta response 异常：', text);
                            }
                        }
                    }
                }
                else if (typeof json.url === 'string') {
                    downloadUrl = json.url;
                    if (json.stat) {
                        meta.extra = Object.assign(meta.extra || {}, json.stat);
                        if (json.stat.pid) {
                            meta.pid = _.toString(json.stat.pid);
                        }
                        if (json.stat.file_type) {
                            meta.type = _.toString(json.stat.file_type);
                        }
                    }
                }
                else {
                    this.log.error('未知情况', JSON.stringify(ajaxOpt), typeof json === 'object' ? JSON.stringify(json) : json);
                    break;
                }
                if (!downloadUrl) {
                    this.log.error('下载失败', json);
                    break;
                }
                if (downloadUrl.startsWith('//')) {
                    downloadUrl = await this.page.evaluate(function (downloadUrl) {
                        return location.protocol + downloadUrl;
                    }, downloadUrl);
                }
                const result = await this.getResult(downloadUrl, meta);
                if (!result.result) {
                    this.log.error('没有 result ', result);
                    break;
                }
                const parse = urllib.parse(downloadUrl);
                const md5 = crypto.createHash('md5');
                result.result.hash = md5.update(`${meta.pid}_${parse.pathname || (parse.host + (parse.query || ''))}`)
                    .digest('hex').toLowerCase();
                results.push(result);
                hit++;
            } while (false);
            this.page.off('request', requestHandler);
        }
        return results;
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
            return env.isLogin || false;
        });
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/699pic\.com\/auth\/qqcallback\?/;
    }
    async qqLogin() {
        await this.startQQLogin('http://699pic.com/?s=/Home/Auth/qqLogin', {
            referer: this.page.url()
        });
        await this.page.reload();
    }
    async sinaLogin() {
    }
};
//# sourceMappingURL=site-699pic.js.map