"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const lodash_1 = require("lodash");
const loader_1 = require("./loader");
const glob = require("glob");
const log4js_1 = require("log4js");
const constant_1 = require("./constant");
const dependency_injection_1 = require("./dependency-injection");
console.info('加载环境变量...');
dotenv_1.load({
    path: constant_1.ROOT_DIR + '/.env'
});
console.info('环境变量加载完毕');
console.info('加载配置文件...');
lodash_1.each(loader_1.load(constant_1.ROOT_DIR + '/config/config.yaml'), (v, k) => {
    dependency_injection_1.setParameter(k, v);
});
console.info('配置文件加载完毕');
console.info('初始化日志对象...');
// log4js 初始化
log4js_1.configure(loader_1.load(constant_1.ROOT_DIR + '/config/logger.yaml'));
const log = log4js_1.getLogger();
console.log('日志对象初始化完毕');
// service 注入
log.info('service 注入...');
for (let file of glob.sync(__dirname + '/../service/**/*.js')) {
    log.debug('import: ' + file.substr(constant_1.ROOT_DIR.length));
    require(file);
}
log.info('service 注入完成');
// controller 注入
log.info('controller 注入...');
for (let file of glob.sync(__dirname + '/../controller/**/*.js')) {
    log.debug('import: ' + file.substr(constant_1.ROOT_DIR.length));
    require(file);
}
log.info('controller 注入完成');
//# sourceMappingURL=bootstrap.js.map