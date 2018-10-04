"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const opencv4nodejs_1 = require("opencv4nodejs");
const injection_1 = require("../core/dependency-injection/injection");
const _ = require("lodash");
let CaptchaQQ = class CaptchaQQ {
    analyze(bg, slider, isOffset = false) {
        // 阈值
        const threshold1 = 200;
        const threshold2 = 300;
        // 读取图片，并分析边缘
        const original = opencv4nodejs_1.imdecode(bg, 0).resize(new opencv4nodejs_1.Size(280, 158));
        const edges = original.canny(threshold1, threshold2);
        const shape = opencv4nodejs_1.imdecode(slider, 0).resize(new opencv4nodejs_1.Size(55, 55));
        const template = shape.canny(threshold1, threshold2);
        // 获取滑块大小
        const w = template.sizes[0];
        // const h = template.sizes[1]; // 这里不需要高度
        // 查找目标坐标范围
        const { maxLoc } = edges.matchTemplate(template, opencv4nodejs_1.TM_CCOEFF).minMaxLoc();
        const targetX = maxLoc.x + w / 2;
        if (isOffset) {
            return _.random(targetX - 5, targetX + 5);
        }
        return targetX;
    }
};
CaptchaQQ = __decorate([
    injection_1.Injectable({
        name: 'captcha.qq'
    })
], CaptchaQQ);
exports.default = CaptchaQQ;
//# sourceMappingURL=captcha-qq.js.map