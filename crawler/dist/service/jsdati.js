"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const _ = require("lodash");
const injection_1 = require("../core/dependency-injection/injection");
const API_URL = 'https://v2-api.jsdama.com/upload';
let JsDati = class JsDati {
    verify(imgBuffer, type = 1013, min = 4, max = 6) {
        let payload = {
            "softwareId": 10393,
            "softwareSecret": "XFPAbuItEcVBV99cvGuWp1z9UkQqTlJJzRoIV059",
            "username": "fantian",
            "password": "fantianAAA123",
            "captchaData": imgBuffer.toString('base64'),
            "captchaType": type,
            "captchaMinLength": min,
            "captchaMaxLength": max
        };
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: API_URL,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }, function (err, httpResponse, body) {
                if (err) {
                    reject(err);
                    return;
                }
                if (typeof body === 'string') {
                    try {
                        body = JSON.parse(body);
                    }
                    catch (e) {
                        reject(e);
                        return;
                    }
                }
                if (body.code !== 0) {
                    reject(body);
                    return;
                }
                resolve(_.get(body, 'data.recognition', null));
            });
        });
    }
};
JsDati = __decorate([
    injection_1.Injectable({
        name: 'verify.jsdati'
    })
], JsDati);
exports.default = JsDati;
//# sourceMappingURL=jsdati.js.map