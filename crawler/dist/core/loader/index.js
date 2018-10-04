"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require("js-yaml");
const fs_1 = require("fs");
const env_1 = require("./type/env");
const path_1 = require("./type/path");
const schema = yaml.Schema.create([
    env_1.default,
    path_1.default
]);
function load(file, encode = 'utf8') {
    return yaml.load(fs_1.readFileSync(file, encode), {
        schema: schema
    });
}
exports.load = load;
function loadAll(file, encode, cb) {
    if (!cb) {
        return;
    }
    if (typeof encode !== 'string') {
        cb = encode;
        encode = 'utf8';
    }
    yaml.loadAll(fs_1.readFileSync(file, encode), cb, {
        schema: schema
    });
}
exports.loadAll = loadAll;
function safeLoad(file, encode = 'utf8') {
    return yaml.safeLoad(fs_1.readFileSync(file, encode), {
        schema: schema
    });
}
exports.safeLoad = safeLoad;
function safeLoadAll(file, encode, cb) {
    if (!cb) {
        return;
    }
    if (typeof encode !== 'string') {
        cb = encode;
        encode = 'utf8';
    }
    yaml.safeLoadAll(fs_1.readFileSync(file, encode), cb, {
        schema: schema
    });
}
exports.safeLoadAll = safeLoadAll;
//# sourceMappingURL=index.js.map