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
const material_attachment_1 = require("./material-attachment");
const model_1 = require("../core/adapther/model");
const log4js_1 = require("log4js");
const site_account_1 = require("./site-account");
const log = log4js_1.getLogger('db');
exports.STATUS_WAIT = 'wait';
exports.STATUS_DOING = 'doing';
exports.STATUS_DONE = 'done';
exports.STATUS_FAILED = 'failed';
exports.NOTIFY_STATUS_NONE = 'none';
exports.NOTIFY_STATUS_FAILED = 'failed';
exports.NOTIFY_STATUS_DONE = 'done';
let Material = class Material extends model_1.default {
    /**
     * response 通用返回内容
     */
    async output() {
        return {
            id: this.id,
            title: this.title,
            site: (await this.$get('site')).slug,
            source: this.source,
            item_id: this.item_id,
            status: this.status,
            error_info: this.error_info,
            fail_reason: this.fail_reason,
            attachments: await this.$get('attachments').map(async function (a) {
                return await a.output();
            })
        };
    }
    static async findOneBySiteAndItemId(siteId, itemId) {
        try {
            return await this.findOne({
                where: {
                    site_id: siteId,
                    item_id: itemId
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
], Material.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING('64'),
        allowNull: true
    }),
    __metadata("design:type", String)
], Material.prototype, "title", void 0);
__decorate([
    sequelize_typescript_1.IsUrl,
    sequelize_typescript_1.NotEmpty,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(512)),
    __metadata("design:type", String)
], Material.prototype, "source", void 0);
__decorate([
    sequelize_typescript_1.Min(0),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], Material.prototype, "submit_count", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(64)),
    __metadata("design:type", String)
], Material.prototype, "item_id", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.ENUM(exports.STATUS_WAIT, exports.STATUS_DOING, exports.STATUS_DONE, exports.STATUS_FAILED),
        defaultValue: exports.STATUS_WAIT
    }),
    __metadata("design:type", String)
], Material.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(128),
        allowNull: true
    }),
    __metadata("design:type", Object)
], Material.prototype, "fail_reason", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(512),
        allowNull: true
    }),
    __metadata("design:type", Object)
], Material.prototype, "error_info", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true
    }),
    __metadata("design:type", Object)
], Material.prototype, "started_at", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.ENUM(exports.NOTIFY_STATUS_NONE, exports.NOTIFY_STATUS_DONE, exports.NOTIFY_STATUS_FAILED),
        defaultValue: exports.NOTIFY_STATUS_NONE
    }),
    __metadata("design:type", String)
], Material.prototype, "notify_status", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], Material.prototype, "notify_count", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true
    }),
    __metadata("design:type", Object)
], Material.prototype, "last_notify_at", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => site_1.default),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], Material.prototype, "site_id", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => site_1.default, 'site_id'),
    __metadata("design:type", site_1.default)
], Material.prototype, "site", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => material_attachment_1.default),
    __metadata("design:type", Array)
], Material.prototype, "attachments", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], Material.prototype, "account_lock", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED,
        allowNull: true
    }),
    __metadata("design:type", Number)
], Material.prototype, "account_id", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => site_account_1.default, 'account_id'),
    __metadata("design:type", site_account_1.default)
], Material.prototype, "account", void 0);
Material = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'material',
        indexes: [
            {
                fields: ['site_id', 'item_id'],
                unique: true
            }
        ]
    })
], Material);
exports.default = Material;
//# sourceMappingURL=material.js.map