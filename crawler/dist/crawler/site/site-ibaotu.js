"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const errors_1 = require("../errors");
const urllib = require("url");
const qs = require("qs");
const requestlib = require("request");
const ibaotu_captcha_1 = require("../../model/ibaotu-captcha");
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
            return !!isLogin;
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
            var node = document.querySelector('.download-wrap a.down-btn');
            if (!node)
                return null;
            // @ts-ignore
            return node.href;
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
        this.log.debug('开启拦截');
        await this.page.setRequestInterception(true);
        this.page.on('request', (req) => {
            const pattern = /http:\/\/proxy-[^.]+\.ibaotu.com\/[^.]+\.[^?]+/;
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
        this.page.waitForResponse(res => {
            const parse = urllib.parse(res.url());
            const query = qs.parse(parse.query || '');
            return query.m === 'downVarify';
        }).then(async (res) => {
            this.log.info('开始识别验证码');
            await this.page.waitForNavigation({
                waitUntil: 'networkidle2'
            });
            const captcha = await this.page.evaluate(() => {
                const tips = $('.tips span').text().trim();
                const arr = [];
                for (const img of $('.imgs-wrap img').toArray()) {
                    // @ts-ignore
                    arr.push(img.src);
                }
                return {
                    text: tips,
                    list: arr
                };
            });
            this.log.debug('captcha=', JSON.stringify(captcha));
            if (captcha.text && captcha.list.length > 0) {
                const ibaotuCaptcha = await ibaotu_captcha_1.default.findOneByText(captcha.text);
                if (!ibaotuCaptcha) {
                    this.log.warn('无法识别的文字，准备添加新样本');
                    const promises = [];
                    for (const url of captcha.list) {
                        const parse = urllib.parse(url);
                        const query = qs.parse(parse.query || '');
                        if (!query || !query.k) {
                            log.warn(`bad ibaotu sample "${url}"`);
                            continue;
                        }
                        const hash = query.k;
                        const record = await ibaotu_captcha_1.default.findOneByHash(hash);
                        if (record) {
                            log.debug(`已经存在的样本 "${hash}"`);
                            continue;
                        }
                        promises.push(new Promise((resolve, reject) => {
                            requestlib({
                                uri: url,
                                method: 'get',
                                headers: {
                                    'user-agent': this.account.user_agent || this.defaultUserAgent,
                                    'referer': this.page.url()
                                }
                            }, (error, response, body) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                if (typeof body === 'string') {
                                    body = Buffer.from(body);
                                }
                                ibaotu_captcha_1.default.create({
                                    hash: hash,
                                    data: body.toString('base64')
                                }).then(() => {
                                    this.log.debug(`添加新样本 "${hash}"`);
                                }).catch(e => {
                                    this.log.error('添加新样本出错', e);
                                });
                                resolve();
                            });
                        }));
                    }
                }
                else {
                    this.log.info(`识别出验证码 [${ibaotuCaptcha.text}]`);
                    let resultIndex = -1;
                    for (const [index, url] of captcha.list.entries()) {
                        const parse = urllib.parse(url);
                        const query = qs.parse(parse.query || '');
                        this.log.debug(`compare hash=${ibaotuCaptcha.hash}, query=${parse.query}`);
                        if (query.k === ibaotuCaptcha.hash) {
                            resultIndex = index;
                            break;
                        }
                    }
                    this.log.debug(`找到验证码按钮位置 "${resultIndex}"`);
                    if (resultIndex >= 0) {
                        await this.page.evaluate((index) => {
                            const $el = $('.imgs-wrap img').eq(index);
                            if ($el[0]) {
                                $el[0].click();
                            }
                        }, resultIndex);
                        await this.page.waitForNavigation({
                            waitUntil: 'networkidle2'
                        }).catch(e => {
                            this.log.error(e);
                        });
                        this.page.click('#downvip').catch(() => { });
                    }
                }
            }
        }).catch(() => {
        });
        this.page.click('#downvip').catch(() => { });
        const request = await this.page.waitForRequest((req) => {
            const pattern = /http:\/\/proxy-[^.]+\.ibaotu.com\/[^.]+\.[^?]+/;
            return pattern.test(req.url());
        }, { timeout: 20000 }).catch((err) => {
            this.log.error('拦截下载地址超时。', err);
        });
        if (!request) {
            this.log.debug(this.page.url());
            await this.page.waitFor(999999999);
            throw new errors_1.CrawlerError('没有获取到下载地址');
        }
        const downloadUrl = request.url();
        request.abort().catch((err) => {
            this.log.error(err);
        });
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