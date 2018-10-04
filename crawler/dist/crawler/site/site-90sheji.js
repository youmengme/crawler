"use strict";
const site_base_1 = require("../site-base");
const log4js_1 = require("log4js");
const _ = require("lodash");
const errors_1 = require("../errors");
const urllib = require("url");
const log = log4js_1.getLogger('90sheji');
module.exports = class Site90sheji extends site_base_1.default {
    constructor(a, url) {
        super();
        this.account = a;
        this.url = url;
        this.log = log;
    }
    getSiteSlug() {
        return '90sheji';
    }
    async canDownload() {
        try {
            await this.loadUrl();
        }
        catch (e) {
            this.log.error('加载url错误', e);
        }
        return {
            ok: true
        };
    }
    async getTitle() {
        if (!this.title) {
            this.title = await this.page.evaluate(() => {
                // @ts-ignore
                return $.trim($('h1').text()) || undefined;
            });
        }
        return this.title || undefined;
    }
    async isLogin() {
        const content = await this.page.content();
        const match = /var\s+loginUid\s+=\s+"((?:\d+)?)"/.exec(content);
        if (!match) {
            this.log.error('检测登陆发现页面已经修改，无法判断是否登陆');
        }
        else {
            return match[1].length > 0;
        }
        return false;
    }
    get qqLoginCallbackPattern() {
        return /^https?:\/\/90sheji\.com\/callback\/qq\/\?/;
    }
    async qqLogin() {
        let qqLoginUrl = await this.page.evaluate(async function () {
            return await $.post('/?m=login&a=ajaxGetSnsLoginUrl');
        });
        if (!qqLoginUrl) {
            qqLoginUrl = 'https://graph.qq.com/oauth2.0/authorize?client_id=101174343&redirect_uri=http%3A%2F%2F90sheji.com%2Fcallback%2Fqq%2F&response_type=code&scope=get_user_info%2Cget_fanslist%2Cadd_pic_t%2Ccheck_page_fans';
        }
        await this.startQQLogin(qqLoginUrl, {
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
            var meta = {
                extra: {}
            };
            // @ts-ignore
            $('.show_imginfo_ul li').each(function () {
                // @ts-ignore
                var name = $.trim($(this).find('span:first').text());
                // @ts-ignore
                var value = $.trim($(this).find('span:last').text());
                switch (name) {
                    case '格式：':
                        meta.format = value;
                        break;
                    case '体积：':
                        meta.size = value;
                        break;
                    case '尺寸：':
                        meta.measure = value;
                        break;
                    case '分类：':
                        meta.category = value;
                        break;
                }
            });
            // @ts-ignore
            meta.pid = $('#xiazai').attr('data-id');
            if (!meta.pid) {
                // @ts-ignore
                meta.pid = $('#putongxiazai').attr('data-id');
            }
            return meta;
        });
        this.log.debug('获取meta', JSON.stringify(baseMeta));
        // 从当前页面加载 title 到变量
        // 因为要准备切换页面了
        baseMeta.title = await this.getTitle();
        this.log.debug('获取到标题：', baseMeta.title);
        const downloadPageUrl = await this.page.evaluate(function () {
            // @ts-ignore
            return $('#xiazai')[0].href;
        }).catch((e) => {
            this.log.error(e);
        });
        if (!downloadPageUrl) {
            this.log.error('页面规则已经改变');
            throw new errors_1.CrawlerError('页面规则已经改变');
        }
        await this.page.goto(downloadPageUrl, {
            referer: this.page.url()
        });
        const isDownloadRequest = (url) => {
            const parse = urllib.parse(url);
            const queries = parse.query || '';
            const params = queries.split('&');
            if (params.indexOf('a=getDownloadLink') >= 0) {
                this.log.debug('拦截到下载请求：', url);
                return true;
            }
            return false;
        };
        await this.page.setRequestInterception(true);
        this.page.on('request', (req) => {
            if (isDownloadRequest(req.url())) {
                this.log.info('拦截到下载地址：', req.url());
            }
            else {
                req.continue().catch(() => {
                });
            }
        });
        this.page.click('#putongxiazai').catch(() => { });
        const request = await this.page.waitForRequest(req => {
            return isDownloadRequest(req.url());
        }, {
            timeout: 6000
        }).catch((e) => {
            this.log.error('没有拦截到下载请求。', e);
        });
        if (!request) {
            throw new errors_1.CrawlerError('没有拦截到下载请求');
        }
        request.abort().catch(() => { });
        await this.page.setRequestInterception(false);
        const url = request.url();
        const post = request.postData();
        const json = await this.page.evaluate(async function (url, post) {
            return await $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: post
            });
        }, url, post).catch(e => {
            this.log.error('请求下载地址错误：', e);
        });
        if (typeof json !== 'object') {
            throw new errors_1.CrawlerError('下载失败');
        }
        else if (json.success !== 1 && json.success !== '1') {
            this.log.error('下载请求响应解析错误。', JSON.stringify(json));
            throw new errors_1.CrawlerError('下载失败');
        }
        else if (!json.link) {
            this.log.error('接口规则已经修改。');
            throw new errors_1.CrawlerError('接口规则已经修改');
        }
        const downloadUrl = json.link;
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
//# sourceMappingURL=site-90sheji.js.map