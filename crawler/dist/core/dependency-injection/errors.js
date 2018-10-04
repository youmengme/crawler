"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceCircularReferenceError extends Error {
    constructor(id, loading) {
        let service;
        if (typeof id !== 'string') {
            service = `[Function ${id.name}]`;
        }
        let paths = [];
        let keys = [];
        loading.forEach((_, k) => {
            keys.push(k);
            if (typeof k !== 'string') {
                k = `[Function ${k.name}]`;
            }
            paths.push(k);
        });
        super(`Circular reference detected for service "${service}", path: "${paths.join(' -> ')}".`);
        this.id = id;
        this.keys = keys;
    }
}
exports.ServiceCircularReferenceError = ServiceCircularReferenceError;
class ServiceNotFoundError extends Error {
    constructor(id) {
        let service = id;
        if (typeof id !== 'string') {
            service = `[Function ${id.name}]`;
        }
        super(`You have requested a non-existent service "${service}".`);
        this.id = id;
    }
}
exports.ServiceNotFoundError = ServiceNotFoundError;
class NotFactoryMethodError extends Error {
    constructor(id) {
        let service = id;
        if (typeof id !== 'string') {
            service = `[Function ${id.name}]`;
        }
        super(`You don't have to set up a factory method effectively by service "${service}".`);
        this.id = id;
    }
}
exports.NotFactoryMethodError = NotFactoryMethodError;
class ClassNotMethodError extends Error {
}
exports.ClassNotMethodError = ClassNotMethodError;
class OutOfBoundsError extends Error {
}
exports.OutOfBoundsError = OutOfBoundsError;
//# sourceMappingURL=errors.js.map