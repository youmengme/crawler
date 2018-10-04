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
const sequelize_typescript_1 = require("sequelize-typescript");
const site_1 = require("./site");
const model_1 = require("../core/adapther/model");
exports.TYPE_DEFAULT = 'default';
exports.TYPE_QQ = 'qq';
exports.TYPE_SINA = 'sina';
exports.TYPE_SMS = 'sms';
let SiteAccount = class SiteAccount extends model_1.default {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], SiteAccount.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(128),
        allowNull: true
    }),
    __metadata("design:type", Object)
], SiteAccount.prototype, "username", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(128),
        allowNull: true
    }),
    __metadata("design:type", Object)
], SiteAccount.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.ENUM(exports.TYPE_DEFAULT, exports.TYPE_QQ, exports.TYPE_SINA, exports.TYPE_SMS)
    }),
    __metadata("design:type", String)
], SiteAccount.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], SiteAccount.prototype, "counter", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], SiteAccount.prototype, "enable", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true
    }),
    __metadata("design:type", Object)
], SiteAccount.prototype, "cookie", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(256),
        allowNull: true
    }),
    __metadata("design:type", Object)
], SiteAccount.prototype, "user_agent", void 0);
__decorate([
    sequelize_typescript_1.IsIPv4,
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(32),
        allowNull: true
    }),
    __metadata("design:type", Object)
], SiteAccount.prototype, "server", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => site_1.default),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], SiteAccount.prototype, "site_id", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => site_1.default),
    __metadata("design:type", site_1.default)
], SiteAccount.prototype, "site", void 0);
SiteAccount = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'site_account'
    })
], SiteAccount);
exports.default = SiteAccount;
//# sourceMappingURL=site-account.js.map