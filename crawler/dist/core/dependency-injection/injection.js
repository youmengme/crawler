"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const definition_1 = require("./definition");
const index_1 = require("./index");
/**
 * 依赖注入
 * @constructor
 */
function Injectable(options) {
    const definition = new definition_1.Definition(options);
    return function (target) {
        if (index_1.has(target)) {
            // 已经注册
            return;
        }
        index_1.register(target, definition);
        // 由外部自定义参数注入
        if (definition.getArguments().length > 0) {
            return;
        }
        definition.setAutoReflection(true);
    };
}
exports.Injectable = Injectable;
/**
 * 属性注入
 * @constructor
 */
function Inject(options) {
    return function (parent, propertyKey, parameterIndex) {
        if (propertyKey) { // only intercept constructor parameters
            return;
        }
        if (!index_1.has(parent)) {
            index_1.register(parent).setAutoReflection(true);
        }
        // 从类中获取到参数本身
        const paramTypes = Reflect.getMetadata('design:paramtypes', parent);
        const target = paramTypes[parameterIndex];
        if (typeof target !== 'function') {
            throw new Error(`暂时还不支持这种类型(${typeof target})的变量注入`);
        }
        Injectable(options)(target);
    };
}
exports.Inject = Inject;
//# sourceMappingURL=injection.js.map