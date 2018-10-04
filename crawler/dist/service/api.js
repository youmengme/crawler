"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const _ = require("lodash");
const request = require("request");
const log4js_1 = require("log4js");
const injection_1 = require("../core/dependency-injection/injection");
const dependency_injection_1 = require("../core/dependency-injection");
const log = log4js_1.getLogger();
let Api = class Api {
    sign(params, isUrlEncode = false) {
        let keys = Object.keys(params).sort();
        const buffer = [];
        for (const key of keys) {
            let value = params[key];
            if (isUrlEncode) {
                value = encodeURIComponent(value);
            }
            buffer.push(`${key}=${value}`);
        }
        const key = dependency_injection_1.getParameter('apikey');
        buffer.push(`key=${key}`);
        const raw = buffer.join('&');
        const hash = crypto.createHash('md5');
        const md5 = hash.update(raw).digest('hex');
        return md5.toLocaleUpperCase();
    }
    notify(data) {
        const api = 'http://a.api.sszvip.com/api/downreport';
        let payload = {};
        payload.data = JSON.stringify(data);
        payload.timestamp = _.toInteger((+new Date()) / 1000);
        payload.sign = this.sign(payload);
        const bodyStr = JSON.stringify(payload);
        log.debug(`上报 body=${bodyStr}`);
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                uri: api,
                headers: {
                    'content-type': 'application/json',
                },
                body: bodyStr
            }, (error, response, body) => {
                if (error) {
                    log.error(`上报通知失败：`, body);
                    reject(error);
                    return;
                }
                if (_.toInteger(response.statusCode / 100) !== 2) {
                    log.error(`上报通知状态异常：code=${response.statusCode}。`, response.body);
                    reject(new Error(`上报通知状态异常：code=${response.statusCode}。`));
                    return;
                }
                if (typeof body === 'string') {
                    try {
                        body = JSON.parse(body);
                    }
                    catch (e) {
                        log.error('上报通知 json 解析错误。', body);
                        reject(e);
                        return;
                    }
                }
                if (body.code !== 0) {
                    log.error('响应内容错误。', response.body);
                    reject('上报接口通知失败');
                    return;
                }
                resolve(body);
            });
        });
    }
};
Api = __decorate([
    injection_1.Injectable({
        name: 'api'
    })
], Api);
exports.default = Api;
//# sourceMappingURL=api.js.map