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
var MaterialAttachment_1;
"use strict";
const sequelize_typescript_1 = require("sequelize-typescript");
const material_1 = require("./material");
const model_1 = require("../core/adapther/model");
const log4js_1 = require("log4js");
exports.STATUS_WAIT = 'wait';
exports.STATUS_FAILED = 'failed';
exports.STATUS_UPLOADING = 'uploading';
exports.STATUS_DONE = 'done';
const log = log4js_1.getLogger('db');
let MaterialAttachment = MaterialAttachment_1 = class MaterialAttachment extends model_1.default {
    static async findOneByHash(mid, hash) {
        try {
            return await MaterialAttachment_1.findOne({
                where: {
                    material_id: mid,
                    hash: hash
                }
            });
        }
        catch (e) {
            log.error(e);
            return null;
        }
    }
    async output() {
        return {
            source: this.source,
            path: this.path,
            meta: this.meta,
            status: this.status
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], MaterialAttachment.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(32)),
    __metadata("design:type", Object)
], MaterialAttachment.prototype, "hash", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(1024)),
    __metadata("design:type", Object)
], MaterialAttachment.prototype, "source", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(128),
        allowNull: true,
        comment: '等于 oss key'
    }),
    __metadata("design:type", Object)
], MaterialAttachment.prototype, "path", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ENUM(exports.STATUS_WAIT, exports.STATUS_UPLOADING, exports.STATUS_DONE, exports.STATUS_FAILED)),
    __metadata("design:type", String)
], MaterialAttachment.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true
    }),
    __metadata("design:type", Object)
], MaterialAttachment.prototype, "meta", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => material_1.default),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER.UNSIGNED),
    __metadata("design:type", Number)
], MaterialAttachment.prototype, "material_id", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => material_1.default),
    __metadata("design:type", material_1.default)
], MaterialAttachment.prototype, "material", void 0);
MaterialAttachment = MaterialAttachment_1 = __decorate([
    sequelize_typescript_1.Table({
        tableName: 'material_attachment',
        deletedAt: false,
        indexes: [
            {
                fields: ['material_id', 'hash']
            }
        ]
    })
], MaterialAttachment);
exports.default = MaterialAttachment;
//# sourceMappingURL=material-attachment.js.map