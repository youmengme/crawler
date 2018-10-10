"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var IbaotuCaptcha_1;
"use strict";
const sequelize_typescript_1 = require("sequelize-typescript");
const model_1 = require("../core/adapther/model");
const log4js_1 = require("log4js");
const log = log4js_1.getLogger('db');
let IbaotuCaptcha = IbaotuCaptcha_1 = class IbaotuCaptcha extends model_1.default {
    static async findOneByHash(hash) {
        try {
            return await IbaotuCaptcha_1.findOne({
                where: {
                    hash: hash
                }
            });
        }
        catch (e) {
            log.error(e);
            return null;
        }
    }
    static async findOneByText(text) {
        try {
            return await IbaotuCaptcha_1.findOne({
                where: {
                    text: text
                }
            });
        }
        catch (e) {
            log.error(e);
            return null;
        }
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], IbaotuCaptcha.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(128),
        unique: true,
        allowNull: false
    }),
    __metadata("design:type", String)
], IbaotuCaptcha.prototype, "hash", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false
    }),
    __metadata("design:type", String)
], IbaotuCaptcha.prototype, "data", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(8)),
    __metadata("design:type", String)
], IbaotuCaptcha.prototype, "text", void 0);
IbaotuCaptcha = IbaotuCaptcha_1 = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'ibaotu_captcha',
        timestamps: false
    })
], IbaotuCaptcha);
exports.default = IbaotuCaptcha;
//# sourceMappingURL=ibaotu-captcha.js.map