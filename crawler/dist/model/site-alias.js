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
var SiteAlias_1;
"use strict";
const sequelize_typescript_1 = require("sequelize-typescript");
const site_1 = require("./site");
const model_1 = require("../core/adapther/model");
const log4js_1 = require("log4js");
const log = log4js_1.getLogger('db');
let SiteAlias = SiteAlias_1 = class SiteAlias extends model_1.default {
    static async findByHost(host) {
        try {
            return await SiteAlias_1.findOne({
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
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], SiteAlias.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(32),
        unique: true
    }),
    __metadata("design:type", String)
], SiteAlias.prototype, "host", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], SiteAlias.prototype, "enable", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => site_1.default),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], SiteAlias.prototype, "site_id", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => site_1.default),
    __metadata("design:type", site_1.default)
], SiteAlias.prototype, "site", void 0);
SiteAlias = SiteAlias_1 = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'site_alias'
    })
], SiteAlias);
exports.default = SiteAlias;
//# sourceMappingURL=site-alias.js.map