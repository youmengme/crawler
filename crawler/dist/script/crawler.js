"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
process.chdir(path_1.dirname(path_1.dirname(__dirname)));
require("../core/bootstrap");
const initialize_1 = require("../core/initialize");
const site_1 = require("../model/site");
const log4js_1 = require("log4js");
const dependency_injection_1 = require("../core/dependency-injection");
const redis_1 = require("../core/adapther/redis");
const _ = require("lodash");
const material_1 = require("../model/material");
const material_attachment_1 = require("../model/material-attachment");
const path = require("path");
const download = require("download");
const fs = require("fs");
const errors_1 = require("../crawler/errors");
(async () => {
    await initialize_1.default;
    const log = log4js_1.getLogger();
    const time = dependency_injection_1.getService('time');
    const api = dependency_injection_1.getService('api');
    async function appendUpload(a) {
        log.debug(`开始上传`, JSON.stringify(a.dataValues));
        const key = a.path;
        const fullname = path.join(dependency_injection_1.getParameter('downloadDir'), key);
        const buffer = fs.readFileSync(fullname);
        const oss = dependency_injection_1.getService('oss');
        let result = true;
        // @ts-ignore
        await oss.put(key, buffer).catch((err) => {
            log.error(`oss上传遇到错误。`, err);
            result = false;
        });
        log.debug(`${key} 上传完成`);
        if (result) {
            a.status = material_attachment_1.STATUS_DONE;
        }
        try {
            fs.unlinkSync(fullname);
        }
        catch (e) {
            log.error(`文件"${fullname}"不存在`);
        }
        await a.save();
    }
    async function appendDownload(data, a) {
        if (!data.result) {
            log.error(`错误的下载数据[${a.id}]`, data);
            return;
        }
        log.debug(`开始下载[${a.id}]`, JSON.stringify(data));
        const meta = data.result.meta;
        const url = data.result.source;
        const key = data.result.path;
        const relativePath = path.dirname(key);
        const filename = path.basename(key);
        const savePath = path.join(dependency_injection_1.getParameter('downloadDir'), relativePath);
        try {
            await download(url, savePath, {
                filename: filename
            });
            log.debug(`下载完成：${url}`);
            a.meta = meta;
            a.source = url;
            a.path = key;
            a.status = material_attachment_1.STATUS_UPLOADING;
            await a.save();
            await appendUpload(a);
        }
        catch (e) {
            log.error(`下载文件遇到错误：filename=${filename}, path=${savePath}, url=${url}. error: `, e);
            data.msg = '下载文件遇到错误。' + url;
            throw new errors_1.CrawlerError(`下载文件遇到错误：filename=${filename}, path=${savePath}, url=${url}`);
        }
    }
    function start(site) {
        let CrawlerSite;
        try {
            CrawlerSite = require(`../crawler/site/site-${site.slug}`);
        }
        catch (e) {
            log.warn(`找不到站点 "${site.slug}"`);
            return;
        }
        log.info(`启动站点 "${site.slug}"`);
        const workip = dependency_injection_1.getParameter('workip');
        const queueKey = `ma:${site.id}:${workip}`;
        (async (queueKey) => {
            let isWaiting = false;
            while (true) {
                const results = await redis_1.redis.multi()
                    .zrange(queueKey, 0, 0)
                    .zremrangebyrank(queueKey, 0, 0)
                    .exec();
                if (!_.has(results, '0.1.0')) {
                    if (!isWaiting) {
                        log.debug(`wait: `, results);
                    }
                    await time.sleep(1000);
                    isWaiting = true;
                    continue;
                }
                isWaiting = false;
                // 获取任务 id（素材id）
                const taskId = _.toInteger(_.get(results, '0.1.0'));
                if (taskId <= 0) {
                    log.warn(`没有获取到任务ID:`, results);
                    continue;
                }
                log.debug(`taskId = ${taskId}`);
                const task = await material_1.default.findById(taskId);
                if (!task) {
                    log.warn(`任务 "${taskId}" 不存在`);
                    continue;
                }
                if (task.site_id !== site.id) {
                    log.error(`此条记录异常！任务 "${task.id}" 为站点 "${task.site_id}" 的任务，不支持当前站点 "${site.id}"`);
                    continue;
                }
                if (task.status !== material_1.STATUS_WAIT) {
                    if (task.status !== material_1.STATUS_FAILED) {
                        log.warn(`当前任务 "${task.id}" 的状态为 "${task.status}"，跳过`);
                        continue;
                    }
                    task.status = material_1.STATUS_DOING;
                    await task.save();
                }
                log.debug(`当前任务 "${task.id}" 的状态为 "${task.status}"`);
                const account = await task.$get('account');
                if (!account) {
                    log.error(`任务 "${task.id}" 没有绑定账号`);
                    continue;
                }
                log.debug(`准备开始任务。task=${task.id}，site=${site.slug}，account=${account.username}[${task.account_id}]，type=${account.type}`);
                let crawler;
                try {
                    crawler = new CrawlerSite(account, task.source);
                    await crawler.init();
                }
                catch (e) {
                    log.error(`任务 "${task.id}" 初始化错误。`, e);
                    continue;
                }
                try {
                    const can = await crawler.canDownload();
                    if (!can.ok) {
                        task.error_info = can.error;
                        task.fail_reason = can.reason;
                        log.error(`任务 "${task.id}" 无法下载，原因是：${can.reason}, ${can.error}`);
                        continue;
                    }
                    const results = await crawler.start();
                    if (results.length === 0) {
                        task.error_info = '没有获取到下载数据';
                        task.fail_reason = '没有下载成功';
                        log.error(`任务 "${task.id}" 没有下载成功`);
                        continue;
                    }
                    account.counter = account.counter + 1;
                    task.title = await crawler.getTitle();
                    const promises = [];
                    for (const result of results) {
                        const r = result.result || {};
                        let attachment = await material_attachment_1.default.findOneByHash(task.id, r.hash);
                        if (!attachment) {
                            attachment = await material_attachment_1.default.create({
                                material_id: task.id,
                                hash: r.hash,
                                status: material_attachment_1.STATUS_WAIT
                            });
                        }
                        attachment.source = r.source;
                        attachment.meta = r.meta;
                        if (result.result) {
                            log.debug(`任务 "${task.id}" 的素材 ${r.source} 下载成功`);
                            promises.push(appendDownload(result, attachment));
                        }
                        else {
                            log.debug(`任务 "${task.id}" 的素材下载失败`);
                            attachment.status = material_attachment_1.STATUS_FAILED;
                        }
                        await attachment.save();
                    }
                    try {
                        await api.notify(await task.output());
                        task.notify_status = material_1.NOTIFY_STATUS_DONE;
                    }
                    catch (e) {
                        log.error('上报错误', e);
                        task.notify_status = material_1.NOTIFY_STATUS_FAILED;
                    }
                    task.notify_count = task.notify_count + 1;
                    task.last_notify_at = new Date();
                    try {
                        await Promise.all(promises);
                    }
                    catch (e) {
                        task.status = material_1.STATUS_FAILED;
                        continue;
                    }
                    task.status = material_1.STATUS_DONE;
                    task.fail_reason = '';
                    task.error_info = '';
                    try {
                        await api.notify(await task.output());
                        task.notify_status = material_1.NOTIFY_STATUS_DONE;
                    }
                    catch (e) {
                        log.error('上报错误2', e);
                        task.notify_status = material_1.NOTIFY_STATUS_FAILED;
                    }
                    task.notify_count = task.notify_count + 1;
                    task.last_notify_at = new Date();
                    redis_1.redis.sadd('material:task:done', task.id);
                }
                catch (e) {
                    log.error(`任务 "${site.slug} [${task.id}]" 下载错误：`, e);
                    task.status = material_1.STATUS_FAILED;
                    task.error_info = e.toString();
                    task.fail_reason = '内部下载出错';
                }
                finally {
                    // 不管成功失败与否，都保存 cookie
                    try {
                        account.cookie = await crawler.getAllCookies();
                        task.title = await crawler.getTitle();
                        await Promise.all([
                            account.save(),
                            task.save(),
                            crawler.close()
                        ]);
                        await api.notify(await task.output());
                    }
                    catch (e) {
                        log.error('ERROR: ', e);
                    }
                    log.debug(`task=${task.id}, next`);
                }
            }
        })(queueKey);
    }
    const sites = await site_1.default.all();
    for (const site of sites) {
        try {
            start(site);
        }
        catch (e) {
            log.fatal('****** ERROR!!!!', e);
        }
    }
})();
//# sourceMappingURL=crawler.js.map