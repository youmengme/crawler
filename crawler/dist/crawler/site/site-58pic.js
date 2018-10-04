"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const errors_1 = require("../errors");
const urllib = require("url");
const qs = require("qs");
const log = log4js_1.getLogger('58pic');
module.exports = class Site58pic extends site_base_1.default {
    constructor(a, url) {
        super();
        const pattern = /[^\d](\d+)\.html/;
        const match = pattern.exec(url);
        if (!match) {
            throw new errors_1.CrawlerError('错误的url：' + url);
        }
        this.account = a;
        this.url = `http://www.58pic.com/newpic/${match[1]}.html`;
        this.log = log;
    }
    getSiteSlug() {
        return '58pic';
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
                // @ts-ignore
                for (const $el of document.querySelector('.detail-title').childNodes) {
                    if ($el.nodeName === '#text') {
                        // @ts-ignore
                        return $el.nodeValue.trim() || undefined;
                    }
                }
                return undefined;
            });
        }
        return this.title || undefined;
    }
    async isLogin() {
        return this.page.evaluate(function () {
            // @ts-ignore
            return isLoginStatus == '1';
        });
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/www\.58pic\.com\/index\.php\?/;
    }
    async qqLogin() {
        await this.startQQLogin('http://www.58pic.com/index.php?m=login&a=snsLogin&type=qq', {
            referer: this.page.url(),
            waitUntil: [
                'load', 'networkidle2'
            ]
        });
        this.log.debug('重新加载原来的页面');
        await this.page.reload();
    }
    async sinaLogin() {
        await this.startSinaLogin('http://www.58pic.com/index.php?m=login&a=snsLogin&type=sina', {
            referer: this.page.url()
        });
        this.log.debug('重新加载原来的页面');
        await this.page.reload();
    }
    async start() {
        try {
            await this.login();
        }
        catch (e) {
            if (e instanceof errors_1.CrawlerError) {
                throw e;
            }
            this.log.error('登陆错误', e);
        }
        await this.getTitle(); // 预加载标题
        const baseMeta = await this.page.evaluate(function () {
            var $nodes = document.querySelectorAll('.main-right p');
            var meta = {
                extra: {}
            };
            for (var $node of $nodes) {
                // @ts-ignore
                var parts = $node.innerText.trim().split('：');
                if (parts.length < 2) {
                    continue;
                }
                switch (parts[0]) {
                    case '文件格式':
                        meta.format = (parts[1] || '').trim();
                        break;
                    case '版本':
                        meta.version = (parts[1] || '').trim();
                        break;
                    case '编号':
                        meta.pid = (parts[1] || '').trim();
                        break;
                    case '尺寸':
                        meta.measure = (parts[1] || '').trim();
                        break;
                    case '模式':
                        meta.mode = (parts[1] || '').trim();
                        break;
                    case '体积':
                        meta.size = (parts[1] || '').trim();
                        break;
                    case '分辨率':
                        meta.dpi = (parts[1] || '').trim();
                        break;
                }
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        const isDownloadUrl = (url) => {
            const r = /^https?:\/\/(proxy[^.]+|down)\.58pic.com\/[^.]+\.[^?]+\?/;
            if (r.test(url)) {
                return true;
            }
            if (!url.startsWith('http://www.58pic.com/index.php?')
                && !url.startsWith('https://www.58pic.com/index.php?')) {
                return false;
            }
            const parse = urllib.parse(url);
            if (!parse || !parse.query) {
                return false;
            }
            const queries = parse.query.split('&');
            return queries.indexOf('a=down') >= 0 || queries.indexOf('a=download') >= 0;
        };
        const isRiskRequest = (req) => {
            const parse = urllib.parse(req.url());
            const query = qs.parse(parse.query || '');
            return query.m === 'riskControlSystem' && query.a === 'checkIdentityForDl';
        };
        const downloadUrl$ = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.log.error('没有获取到新的页面');
                reject();
            }, 29000);
            this.browser.on('targetcreated', async (target) => {
                this.log.debug('targetcreated: ', target.type());
                if (target.type() !== 'page') {
                    return;
                }
                this.log.debug('打开下载页面：', target.url());
                const page = await target.page();
                // region 风控系统
                page.waitForResponse(res => {
                    return isRiskRequest(res);
                }).then(async (res) => {
                    const reload = await page.evaluate(async function () {
                        const rows = [];
                        const result = await $.ajax({
                            url: location.protocol + '//www.58pic.com/index.php?m=userHomePage&a=getUserDlRecord',
                            data: {
                                page: 1,
                                time: 0
                            },
                            type: 'POST',
                            dataType: 'json'
                        });
                        if (result.status == 1) {
                            for (const v of result.data.pics) {
                                rows.push(v.picid);
                            }
                        }
                        let hit = 0;
                        $('.risk-Sudoku-elem').each(function () {
                            if (hit == 3) {
                                $('.risk-prompt2-submit')[0].click();
                                return false;
                            }
                            const picid = $(this).find('.risk-Sudoku-img img').data('picid');
                            for (let id of rows) {
                                if (picid == id) {
                                    $(this).find('.risk-Sudoku-img .risk-Sudoku-gou')[0].click();
                                    hit++;
                                    return;
                                }
                            }
                        });
                        return hit > 0;
                    });
                    if (reload) {
                        this.log.debug('等待验证风险控制系统');
                        await page.waitForNavigation({
                            timeout: 6000
                        }).catch(() => { });
                        this.log.debug('重新加载页面');
                        await page.reload();
                    }
                }).catch(e => {
                    this.log.error(e);
                });
                // endregion
                await page.setRequestInterception(true);
                page.on('request', (req) => {
                    if (isDownloadUrl(req.url())) {
                        this.log.info('拦截到下载地址: ', req.url());
                        resolve(req.url());
                        req.abort().catch(() => { });
                        clearTimeout(timer);
                    }
                    else {
                        req.continue().catch((e) => {
                            this.log.error(e);
                        });
                    }
                });
                if (page.url().startsWith('https://')) {
                    await page.goto(page.url().replace('https://', 'http://'), {
                        referer: this.page.url()
                    });
                }
            });
        });
        await this.page.evaluate(() => {
            let $nodes = $('.detailBtn-down').not(':hidden').toArray();
            // @ts-ignore
            for (const $node of $nodes) {
                $node.click();
            }
        }).catch((e) => {
            this.log.error(e);
        });
        const downloadUrl = await downloadUrl$.catch(() => { });
        if (!downloadUrl) {
            // await this.page.waitFor(99999999);
            throw new errors_1.CrawlerError('拦截下载地址出错');
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
//# sourceMappingURL=site-58pic.js.map