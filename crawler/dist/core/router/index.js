"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KoaRouter = require("koa-router");
exports.router = new KoaRouter();
function Route(path, name, options) {
    return function (target, propertyKey, descriptor) {
        if (typeof name === 'object') {
            options = name;
            name = null;
        }
        let methods = [];
        if (typeof options === 'object') {
            if (options.methods === 'ALL') {
                exports.router.all(name, path, descriptor.value);
                return;
            }
            if (typeof options.methods === 'string') {
                methods = [options.methods];
            }
            else {
                for (const method of options.methods) {
                    methods.push(method);
                }
            }
        }
        else {
            exports.router.all(path, descriptor.value.bind(target));
            return;
        }
        exports.router.register(path, methods, descriptor.value, {
            name: name
        });
    };
}
exports.Route = Route;
//# sourceMappingURL=index.js.map