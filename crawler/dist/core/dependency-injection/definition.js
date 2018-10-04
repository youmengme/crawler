"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
class Definition {
    constructor(options) {
        this.class = null;
        this.factory = null;
        this.args = [];
        this.calls = [];
        this.autoreflection = false;
        this.singleton = true;
        this.alias = null;
        if (options === undefined) {
            return;
        }
        if (options.args !== undefined) {
            this.args = options.args;
        }
        if (options.singleton !== undefined) {
            this.singleton = options.singleton;
        }
        if (options.name !== undefined) {
            this.alias = options.name;
        }
    }
    valid() {
        return this.class !== null || this.factory !== null;
    }
    setClass(ctor) {
        this.class = ctor;
        return this;
    }
    getClass() {
        return this.class;
    }
    addArgument(arg) {
        this.args.push(arg);
        return this;
    }
    setArguments(args) {
        this.args = args;
        return this;
    }
    getArguments() {
        return this.args;
    }
    getArgument(index) {
        if (this.args[index] === undefined) {
            throw new errors_1.OutOfBoundsError(`The argument "${index}" doesn't exist.`);
        }
        return this.args[index];
    }
    addMethodCall(method, args) {
        if (args === undefined) {
            this.calls.push([method]);
        }
        else {
            this.calls.push([method, args]);
        }
        return this;
    }
    removeMethodCall(method) {
        if (this.calls.length === 0) {
            return this;
        }
        this.calls = this.calls.filter((call) => {
            return call[0] !== method;
        });
        return this;
    }
    hasMethodCall(method) {
        for (const call of this.calls) {
            if (call[0] === method) {
                return true;
            }
        }
        return false;
    }
    getMethodCalls() {
        return this.calls;
    }
    setFactory(factory) {
        this.factory = factory;
        return this;
    }
    getFactory() {
        return this.factory;
    }
    isAutoreflection() {
        return this.autoreflection;
    }
    setAutoReflection(bool) {
        this.autoreflection = bool;
        return this;
    }
    isSingleton() {
        return this.singleton;
    }
    setSingleton(bool) {
        this.singleton = bool;
        return this;
    }
    getAlias() {
        return this.alias;
    }
    setAlias(alias) {
        this.alias = alias;
        return this;
    }
}
exports.Definition = Definition;
//# sourceMappingURL=definition.js.map