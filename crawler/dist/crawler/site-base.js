"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const site_account_1 = require("../model/site-account");
const puppeteer_core_1 = require("puppeteer-core");
const dependency_injection_1 = require("../core/dependency-injection");
const _ = require("lodash");
const urllib = require("url");
const path = require("path");
const qs = require("qs");
const moment = require("moment");
const material_attachment_1 = require("../model/material-attachment");
const errors_1 = require("./errors");
const site_1 = require("../model/site");
const urlencode_1 = require("urlencode");
class SiteBase {
    constructor() {
        this.defaultUserAgent = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36';
    }
    async init() {
        await this.launch();
    }
    get log() {
        return this._log;
    }
    set log(value) {
        this._log = value;
    }
    get page() {
        return this._page;
    }
    get browser() {
        return this._browser;
    }
    get cookies() {
        return this._cookies || [];
    }
    set cookies(cookies) {
        this._cookies = cookies;
    }
    async launch() {
        let options = dependency_injection_1.getParameter('browser');
        this._browser = await puppeteer_core_1.launch(options);
        this._page = (await this.browser.pages())[0];
        await this.page.setUserAgent(this.account.user_agent || this.defaultUserAgent);
        const cookies = this.account.cookie || [];
        await this.page.setCookie(...cookies);
        if (cookies.length === 0) {
            this.log.warn('没有 cookies');
        }
    }
    async canDownload() {
        return {
            ok: true
        };
    }
    async close() {
        await this._browser.close();
    }
    async newPage() {
        const page = await this.browser.newPage();
        await page.setUserAgent(this.account.user_agent || this.defaultUserAgent);
        return page;
    }
    async loadUrl() {
        this.log.debug(`加载url：${this.url}`);
        await this.gotoPage(this.url, {
            timeout: 15000,
            waitUntil: 'networkidle2'
        }).catch((reason) => {
            this.log.error(`页面出错，可能部分资源无相应：`, reason);
        });
        this.log.debug(`加载完成`);
    }
    async getResult(url, meta) {
        let source = url;
        this.log.debug(`预下载：${url}`);
        if (this.getSiteSlug() === site_1.SLUG_NIPIC) {
            const parse = urllib.parse(url);
            if (parse.query) {
                const o = qs.parse(parse.query);
                if (o.clink) {
                    url = o.clink;
                }
            }
        }
        else if (this.getSiteSlug() === site_1.SLUG_58PIC) {
            const parse = urllib.parse(url);
            if (parse.query) {
                const o = qs.parse(parse.query);
                if (o.n) {
                    try {
                        decodeURI(o.n);
                    }
                    catch (e) {
                        try {
                            o.n = urlencode_1.decode(o.n, 'gbk');
                        }
                        catch (e) {
                            o.n = '';
                        }
                        parse.search = '?' + qs.stringify(o);
                        // @ts-ignore
                        source = parse.format();
                    }
                }
            }
        }
        const data = {};
        const parse = urllib.parse(url);
        const ext = path.extname(parse.pathname || '');
        const relativePath = path.join(this.getSiteSlug(), moment().format('YYYY/MM/DD'));
        const prefix = _.random(1000000, 9999999).toString(16);
        const time = moment().format('HHmmss');
        const filename = `${prefix}_${time}_${meta.pid}${ext}`;
        data.result = {
            source: source,
            meta: meta,
            path: path.join(relativePath, filename),
            status: material_attachment_1.STATUS_WAIT
        };
        return data;
    }
    async getAllCookies() {
        let page = this.page;
        if (page.isClosed()) {
            return this.cookies;
        }
        let ret = await page._client.send('Network.getAllCookies');
        return ret.cookies;
    }
    async gotoPage(url, options) {
        return await this.page.goto(url, options);
    }
    async login() {
        if (await this.isLogin()) {
            this.log.debug(`已登陆`);
            return;
        }
        this.log.info(`准备进行登陆 id=${this.account.id}, type=${this.account.type}`);
        switch (this.account.type) {
            case site_account_1.TYPE_QQ:
                return await this.qqLogin();
            case site_account_1.TYPE_SINA:
                return await this.sinaLogin();
            default:
                this.log.error(`不支持的账号类型 "${this.account.type}"`);
        }
    }
    async startQQLogin(url, options) {
        this.log.debug('开始加载QQ登陆页面');
        const qqLoginPage = await this.newPage();
        await qqLoginPage.setRequestInterception(true);
        qqLoginPage.on('request', req => {
            if (/^https?:\/\/localhost\.ptlogin2\.qq\.com:\d+\/pt_get_uins\?/.test(req.url())) {
                this.log.info('禁止qq快速登陆，加快登陆时间');
                req.abort().catch(() => {
                });
            }
            else {
                this.log.debug(`on req: [${req.method()}] ${req.url()}`);
                req.continue().catch(() => {
                });
            }
        });
        this.log.debug('goto: ', url);
        await qqLoginPage.goto(url, options);
        this.log.debug('end goto: ', url);
        return await this.qqTypeAccount(qqLoginPage).catch((e) => {
            this.log.error('QQ登陆遇到错误。', e);
        });
    }
    async qqTypeAccount(page, retries = 3) {
        --retries;
        this.log.debug(`开始输入QQ账号密码`);
        let frame = null;
        for (const f of page.frames()) {
            if (f.name() === 'ptlogin_iframe') {
                frame = f;
                break;
            }
        }
        if (frame === null) {
            this.log.error('没有获取到QQ登陆的 frame. ', page.url());
            return;
        }
        await frame.waitForSelector('#login_button').catch((e) => {
            this.log.error(e);
        });
        await frame.click('#switcher_plogin', {
            delay: SiteBase.clickDelay()
        }).catch((e) => {
            this.log.warn('没有看见 #switcher_plogin 元素。', e);
        });
        const qq = this.account.username;
        const pwd = this.account.password;
        // 关闭所有拦截
        await page.setRequestInterception(false);
        this.log.debug(`输入账号：${qq}`);
        await frame.evaluate(() => {
            // @ts-ignore
            document.querySelector('#u').value = '';
            // @ts-ignore
            document.querySelector('#p').value = '';
        });
        await frame.type('#u', qq, {
            delay: SiteBase.typeDelay()
        });
        await page.waitFor(200);
        this.log.debug('输入密码：****');
        await frame.focus('#p');
        await frame.type('#p', pwd, {
            delay: SiteBase.typeDelay()
        });
        // https://ssl.captcha.qq.com/cap_union_new_show?
        // https://ssl.captcha.qq.com/cap_union_prehandle?
        // https://ssl.captcha.qq.com/cap_union_new_verify?
        // https://ssl.ptlogin2.qq.com/login?
        let loginResponse = null;
        const responseHandler = (res) => {
            this.log.debug(`on res: [${res.status()}] ${res.url()}`);
            if (!loginResponse && res.url().indexOf('https://ssl.ptlogin2.qq.com/login?') >= 0) {
                loginResponse = res;
                this.log.info('发现请求：https://ssl.ptlogin2.qq.com/login');
            }
        };
        page.on('response', responseHandler);
        await frame.click('#login_button', {
            delay: SiteBase.clickDelay()
        });
        let isCaptcha = null;
        await page.waitForRequest((req) => {
            return isCaptcha = req.url().startsWith('https://ssl.captcha.qq.com/cap_union_new_show');
        }, {
            timeout: 1000
        }).catch(() => {
            isCaptcha = false;
        });
        if (isCaptcha) {
            loginResponse = null;
            this.log.debug('QQ 登陆需要验证码');
            let _retries = 3;
            let isSuccess = false;
            while (_retries-- > 0) {
                if (await this.inputCaptcha(page, frame) === 0) {
                    isSuccess = true;
                    break;
                }
            }
            if (!isSuccess) {
                this.log.warn('验证码识别失败');
            }
        }
        else {
            this.log.debug('QQ 登陆无需验证码，直接登陆');
        }
        if (!loginResponse) {
            this.log.debug('等待登陆请求返回数据');
            loginResponse = await page.waitForResponse((res) => {
                return res.url().startsWith('https://ssl.ptlogin2.qq.com/login?');
            }, {
                timeout: 6000
            }).catch(async (e) => {
                this.log.error('拦截 https://ssl.ptlogin2.qq.com/login 请求错误。', e);
                return null;
            });
        }
        if (loginResponse) {
            const data = await loginResponse.text();
            this.log.debug('收到登陆请求返回的数据：', data);
            const match = /^[^'"]+\(['"](\d)['"]/.exec(data);
            this.log.debug('match: ', match);
            if (match && match[1] !== '0') {
                this.log.warn('登陆失败：', data);
                if (retries > 0) {
                    this.log.info('重新登陆');
                    await page.waitFor(1000);
                    await this.qqTypeAccount(page, retries);
                }
                else {
                    this.log.warn(`[QQ] 账号密码错误 username=${this.account.username}, pwd=${this.account.password}`);
                    throw new errors_1.CrawlerError(`[QQ] 账号密码错误`);
                }
            }
        }
        else {
            this.log.debug('没有收到登陆请求返回的数据！！！');
        }
        await page.waitForResponse(res => {
            if (this.qqLoginCallbackPattern.test(res.url())) {
                this.log.info('拦截到 QQ 登陆回调');
                return true;
            }
            return false;
        }, {
            timeout: 6000
        }).catch(async (e) => {
            this.log.error('等待QQ登陆回调超时 ', e);
            await page.screenshot({
                path: dependency_injection_1.getParameter('storageDir') + '/screenshots/qq_' + this.getSiteSlug() + '_timeout.png',
                fullPage: true
            });
        });
        if (!page.isClosed()) {
            page.close().catch(() => {
            });
        }
    }
    async startSinaLogin(url, options) {
        const sinaLoginPage = await this.newPage();
        await sinaLoginPage.goto(url, options);
        await sinaLoginPage.waitForSelector('.WB_btn_login').catch((e) => {
            this.log.error('页面加载错误。', e);
        });
        return await this.sinaTypeAccount(sinaLoginPage).catch((e) => {
            this.log.error('sina 登陆遇到错误。', e);
        });
    }
    async sinaTypeAccount(page, retries = 3) {
        await page.click('#userId');
        await page.evaluate(() => {
            // @ts-ignore
            document.querySelector('#userId').value = '';
        });
        await page.type('#userId', this.account.username, {
            delay: SiteBase.clickDelay()
        });
        await page.focus('#passwd');
        await page.evaluate(() => {
            // @ts-ignore
            document.querySelector('#passwd').value = '';
        });
        await page.type('#passwd', this.account.password, {
            delay: SiteBase.clickDelay()
        });
        let isVerify = await page.evaluate(() => {
            // @ts-ignore
            return document.querySelector('.oauth_code').style.display !== 'none';
        });
        if (isVerify) {
            await page.click('.WB_text2');
            this.log.debug('需要验证码');
            let _retries = 3;
            const jsdati = dependency_injection_1.getService('verify.jsdati');
            while (_retries-- > 0) {
                let verifyCodeResponse;
                await page.click('.WB_text2');
                try {
                    verifyCodeResponse = await page.waitForResponse((request) => {
                        return /^https?:\/\/login\.sina\.com\.cn\/cgi\/pin\.php\?.+$/.test(request.url());
                    }, {
                        timeout: 6000
                    });
                }
                catch (e) {
                    this.log.error('验证码图片获取错误: ', e);
                    verifyCodeResponse = null;
                    await page.click('.WB_text2');
                    continue;
                }
                this.log.debug('开始识别验证码');
                let verifyCode = await jsdati.verify(await verifyCodeResponse.buffer(), 1038, 2, 6);
                if (!verifyCode) {
                    this.log.debug('没有识别出来验证码');
                    verifyCodeResponse = null;
                    await page.click('.WB_text2');
                    continue;
                }
                this.log.info('识别出验证码：', verifyCode);
                await page.evaluate(() => {
                    // @ts-ignore
                    document.querySelector('.oauth_form_code').value = '';
                });
                await page.focus('.oauth_form_code');
                await page.type('.oauth_form_code', verifyCode);
                break;
            }
        }
        await page.click('.WB_btn_login');
        const response = await page.waitForResponse(res => {
            return /^https?:\/\/login\.sina\.com\.cn\/sso\/login\.php\?/.test(res.url());
        }, {
            timeout: 6000
        }).catch(e => {
            this.log.error('sina 拦截登陆请求错误。', e);
        });
        if (response) {
            const json = await response.json().catch(() => { }) || {};
            if (json.retcode !== 0) {
                this.log.warn('sina 登陆结果：', await response.text());
                if (retries > 0) {
                    return await this.sinaTypeAccount(page, --retries);
                }
            }
        }
        await page.waitForNavigation({
            waitUntil: 'networkidle2'
        });
        if (!page.isClosed()) {
            page.close().catch(() => {
            });
        }
    }
    async inputCaptcha(page, frame) {
        const captchaFrame = frame.childFrames()[0];
        this.log.info('准备识别验证码');
        const captchas = [];
        const captchas$ = Promise.all([
            page.waitForResponse(function (req) {
                return req.url().startsWith('https://hy.captcha.qq.com/hycdn_1');
            }),
            page.waitForResponse(function (req) {
                return req.url().startsWith('https://hy.captcha.qq.com/hycdn_2');
            })
        ]).then((resps) => {
            captchas[0] = resps[0].url().startsWith('https://hy.captcha.qq.com/hycdn_1') ? resps[0] : resps[1];
            captchas[1] = resps[1].url().startsWith('https://hy.captcha.qq.com/hycdn_1') ? resps[0] : resps[1];
        });
        // 获取偏移值
        const offset = await page.evaluate(() => {
            var f = document.querySelector('#ptlogin_iframe');
            var offset = {};
            // @ts-ignore
            offset.x = f.offsetLeft + f.clientLeft;
            // @ts-ignore
            offset.y = f.offsetTop + f.clientTop;
            return offset;
        });
        offset.x += 80;
        offset.y += 240;
        this.log.info(`滑块按钮位置 x=${offset.x}, y=${offset.y}`);
        this.log.info('开始获取验证码图片');
        try {
            await captchas$;
        }
        catch (e) {
            this.log.error('获取验证码图片错误。', e);
            return -1;
        }
        this.log.info('获取到验证码图片，长度：', captchas.length);
        if (captchas.length === 2) {
            this.log.info('开始获取验证码坐标');
            const captchaQq = dependency_injection_1.getService('captcha.qq');
            const target = captchaQq.analyze(await captchas[0].buffer(), await captchas[1].buffer(), true);
            this.log.info('获取到坐标: ', target);
            this.log.info('准备移动滑块');
            await new Promise(r => {
                setTimeout(() => {
                    r();
                }, 1000);
            });
            const steps = _.random(130, 180);
            this.log.info('开始移动滑块: ' + steps);
            await page.mouse.move(offset.x, offset.y, {
                steps: steps
            });
            await page.mouse.down();
            const t = target + offset.x - 39;
            let tmpOffset = _.random(10, 17);
            // if (Math.abs(tmpOffset) < 9) {
            //     tmpOffset *= 2;
            // }
            await page.mouse.move(t + tmpOffset, _.random(offset.y - 5, offset.y + 5), {
                steps: _.random(30, 60)
            });
            await page.mouse.move(t, _.random(offset.y - 5, offset.y + 5), {
                steps: _.random(110, 160)
            });
            page.mouse.up().catch(this.log.error);
            this.log.info('打码结束');
            const response = await page.waitForResponse((res) => {
                this.log.debug(res.url());
                return res.url().startsWith('https://ssl.captcha.qq.com/cap_union_new_verify');
            }, {
                timeout: 6000
            }).catch((e) => {
                this.log.error('拦截验证码识别错误', e);
            });
            if (response) {
                try {
                    const json = await response.json();
                    if (json.errorCode == '0') {
                        return 0;
                    }
                    captchaFrame.click('#e_reload').catch(this.log.error);
                    return 1;
                }
                catch (e) {
                    this.log.error('解析 json 错误', e);
                }
            }
            else {
                this.log.error('没有获取到 https://ssl.captcha.qq.com/cap_union_new_verify');
            }
        }
        else {
            return 0;
        }
        return -1;
    }
    static clickDelay() {
        return _.random(30, 120);
    }
    static typeDelay() {
        return _.random(30, 70);
    }
}
exports.default = SiteBase;
//# sourceMappingURL=site-base.js.map