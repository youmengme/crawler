"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const constant_1 = require("../constant");
const dependency_injection_1 = require("../dependency-injection");
const log4js_1 = require("log4js");
const log = log4js_1.getLogger('db');
exports.db = new sequelize_typescript_1.Sequelize({
    url: dependency_injection_1.getParameter('mysql'),
    modelPaths: [
        constant_1.APP_DIR + '/model/**/*.js',
        constant_1.APP_DIR + '/model/**/*.ts'
    ],
    define: {
        underscoredAll: true,
        underscored: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    },
    timezone: 'Asia/Shanghai',
    logging: function (sql) {
        log.info(sql);
    }
});
//# sourceMappingURL=db.js.map