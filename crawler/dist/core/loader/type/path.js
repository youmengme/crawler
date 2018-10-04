"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = require("js-yaml");
const path = require("path");
const constant_1 = require("../../constant");
exports.default = new js_yaml_1.Type('!path', {
    kind: 'scalar',
    construct(dir) {
        if (dir.startsWith('/')) {
            return dir;
        }
        return path.join(constant_1.ROOT_DIR, dir);
    },
    resolve(name) {
        return typeof name === 'string';
    }
});
//# sourceMappingURL=path.js.map