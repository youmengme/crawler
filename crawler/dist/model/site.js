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
var Site_1;
"use strict";
const sequelize_typescript_1 = require("sequelize-typescript");
const model_1 = require("../core/adapther/model");
const log4js_1 = require("log4js");
const log = log4js_1.getLogger('db');
exports.SLUG_699PIC = '699pic';
exports.SLUG_588KU = '588ku';
exports.SLUG_IBAOTU = 'ibaotu';
exports.SLUG_NIPIC = 'nipic';
exports.SLUG_58PIC = '58pic';
exports.SLUG_90SHEJI = '90sheji';
exports.SLUG_OOOPIC = 'ooopic';
exports.SLUG_88TPH = '88tph';
exports.SLUG_51YUANSU = '51yuansu';
exports.SLUG_16PIC = '16pic';
exports.SLUG_TUKUPPT = 'tukuppt';
let Site = Site_1 = class Site extends model_1.default {
    static async findByHost(host) {
        try {
            return await Site_1.findOne({
                where: {
                    host: host
                }
            });
        }
        catch (e) {
            log.error(e);
            return null;
        }
    }
    static async findBySlug(slug) {
        try {
            return await Site_1.findOne({
                where: {
                    slug: slug
                }
            });
        }
        catch (e) {
            log.error(e);
            return null;
        }
    }
    parseId(url) {
        let r, match, index = 1;
        switch (this.slug) {
            case exports.SLUG_16PIC:
                r = /(?:[^\/]*[^\d])?_(\d+)\.html/i;
                index = 1;
                break;
            case exports.SLUG_51YUANSU:
            case exports.SLUG_TUKUPPT:
                r = /\/([^\\/.]+)\.html/i;
                break;
            case exports.SLUG_OOOPIC:
                r = /[^_]+_(\d+)\.html/i;
                break;
            default:
                r = /[^\d](\d+)\.html/i;
        }
        match = r.exec(url);
        if (!match || !match[index]) {
            return null;
        }
        return match[1];
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], Site.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.NotEmpty,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(64)),
    __metadata("design:type", String)
], Site.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.NotEmpty,
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(32),
        unique: true
    }),
    __metadata("design:type", String)
], Site.prototype, "host", void 0);
__decorate([
    sequelize_typescript_1.NotEmpty,
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(32),
        comment: '站点标实，表来标实一个站点'
    }),
    __metadata("design:type", String)
], Site.prototype, "slug", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], Site.prototype, "enable", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        comment: '额外的参数信息'
    }),
    __metadata("design:type", Object)
], Site.prototype, "extra", void 0);
Site = Site_1 = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'site',
        indexes: [
            {
                fields: ['slug']
            }
        ]
    })
], Site);
exports.default = Site;
//# sourceMappingURL=site.js.map