"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.APP_DIR = path_1.dirname(__dirname);
exports.ROOT_DIR = path_1.dirname(exports.APP_DIR);
// 字节单位换算
exports.BYTE_OF_KIB = 1024;
exports.BYTE_OF_MIB = exports.BYTE_OF_KIB * 1024;
exports.BYTE_OF_GIB = exports.BYTE_OF_MIB * 1024;
exports.BYTE_OF_TIB = exports.BYTE_OF_GIB * 1024;
exports.BYTE_OF_PIB = exports.BYTE_OF_TIB * 1024;
// region 错误码
// 成功
exports.RET_CODE_SUCCESS = 0;
// 失败
exports.RET_CODE_FAILED = 10000;
// 错误
exports.RET_CODE_ERROR = 10001;
// 缺少参数
exports.RET_CODE_LACK_PARAM = 10002;
// 参数错误
exports.RET_CODE_PARAM_ERROR = 10003;
// 数据库错误
exports.RET_CODE_DB_ERROR = 10004;
// 不存在
exports.RET_CODE_NO_EXISTSED = 10005;
// 未开启
exports.RET_CODE_NO_ENABLED = 10006;
// 解析失败
exports.RET_CODE_PARSE_FAILURE = 10007;
// 缺少账号
exports.RET_CODE_LACK_ACCOUNT = 10008;
// endregion
// region redis key
// 任务队列 key site:ip
exports.REDIS_KEY_MATERIAL_QUEUE = 'ma:%d:%s';
// 站点账号 key  site:ip
exports.REDIS_KEY_SITE_ACCOUNT = 'sa:%d:%s';
// endregion
//# sourceMappingURL=constant.js.map