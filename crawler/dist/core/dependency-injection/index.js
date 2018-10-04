"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const definition_1 = require("./definition");
const errors_1 = require("./errors");
const log4js_1 = require("log4js");
const log = log4js_1.getLogger();
const services = new Map();
const aliases = new Map();
const parameters = new Map();
const factories = new Map();
const loading = new Map();
function has(id) {
    if (typeof id === 'string' && aliases.has(id)) {
        id = aliases.get(id);
    }
    if (services.has(id)) {
        return true;
    }
    return factories.has(id);
}
exports.has = has;
function getParameter(name, defaultValue = null) {
    return hasParameter(name) ? parameters.get(name) : defaultValue;
}
exports.getParameter = getParameter;
function setParameter(name, value) {
    parameters.set(name, value);
}
exports.setParameter = setParameter;
function hasParameter(name) {
    return parameters.has(name);
}
exports.hasParameter = hasParameter;
function getParameters() {
    return parameters;
}
exports.getParameters = getParameters;
function setService(id, service) {
    if (typeof id === 'string' && aliases.has(id)) {
        aliases.delete(id);
    }
    if (service === null) {
        services.delete(id);
        return;
    }
    services.set(id, service);
}
exports.setService = setService;
function hasService(id) {
    if (typeof id === 'string' && aliases.has(id)) {
        id = aliases.get(id);
    }
    return services.has(id);
}
exports.hasService = hasService;
function getService(id) {
    if (services.has(id)) {
        return services.get(id);
    }
    if (typeof id === 'string') {
        if (aliases.has(id)) {
            id = aliases.get(id);
        }
        else {
            return make(id);
        }
    }
    return services.has(id) ? services.get(id) : make(id);
}
exports.getService = getService;
function getServices() {
    return services;
}
exports.getServices = getServices;
// export function register(name: string): Definition;
function register(id, definition) {
    if (definition === undefined) {
        definition = new definition_1.Definition();
    }
    // 自定义工厂方法
    if (typeof definition === 'function') {
        const factory = definition;
        definition = new definition_1.Definition();
        definition.setFactory(factory);
    }
    // 如果 id 是构造函数，则进行绑定
    if (typeof id === 'function') {
        definition.setClass(id);
    }
    const alias = definition.getAlias();
    if (alias !== null) {
        aliases.set(alias, id);
    }
    factories.set(id, definition);
    return definition;
}
exports.register = register;
function make(id, forceFresh = false) {
    if (loading.has(id)) {
        throw new errors_1.ServiceCircularReferenceError(id, loading);
    }
    if (typeof id === 'string') {
        if (!services.has(id) && aliases.has(id)) {
            id = aliases.get(id);
        }
    }
    if (!forceFresh && services.has(id)) {
        return services.get(id);
    }
    loading.set(id, true);
    try {
        if (!factories.has(id)) {
            throw new errors_1.ServiceNotFoundError(id);
        }
        const definition = factories.get(id);
        if (definition.isSingleton() && services.has(id)) {
            return services.get(id);
        }
        if (!definition.valid()) {
            throw new errors_1.NotFactoryMethodError(id);
        }
        const factory = definition.getFactory();
        if (factory !== null) {
            const name = typeof id === 'string' ? id : id.name;
            log.debug(`"${name}" use factory instantiation`);
            return factory();
        }
        const ctor = definition.getClass();
        let args = definition.getArguments();
        const calls = definition.getMethodCalls();
        if (args.length === 0 && definition.isAutoreflection()) {
            const name = typeof id === 'string' ? id : id.name;
            log.debug(`"${name}" use auto instantiation`);
            do {
                // 获取依赖
                // 自动加载依赖
                let paramTypes = Reflect.getMetadata('design:paramtypes', ctor);
                if (paramTypes === null || paramTypes === void 0 || paramTypes.length === 0) {
                    break;
                }
                // 识别依赖是否被注入
                for (let param of paramTypes) {
                    if (param === ctor) {
                        throw new Error('不能依赖本身');
                    }
                    else if (!has(param)) {
                        throw new Error(`class "${param.name}" 没有被注册`);
                    }
                }
                args = paramTypes.map(function (param) {
                    if (!has(param)) {
                        throw new Error(`class "${param.name}" 没有被注册，不能被注入`);
                    }
                    return getService(param);
                });
                break;
            } while (false);
        }
        else {
            const name = typeof id === 'string' ? id : id.name;
            log.debug(`"${name}" use new() instantiation`);
        }
        const instance = new ctor(...args);
        if (calls.length !== null) {
            for (const call of calls) {
                const method = instance[call[0]] || null;
                const methodArgs = call[1] || [];
                if (method === null) {
                    throw new errors_1.ClassNotMethodError(`class "${ctor}" not method "${call[0]}"`);
                }
                method(...methodArgs);
            }
        }
        services.set(id, instance);
        return instance;
    }
    catch (e) {
        throw e;
    }
    finally {
        loading.delete(id);
    }
}
exports.make = make;
//# sourceMappingURL=index.js.map