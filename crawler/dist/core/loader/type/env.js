"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = require("js-yaml");
exports.default = new js_yaml_1.Type('!env', {
    kind: 'scalar',
    construct(name) {
        const parse = name.split('||', 2).map(function (v) {
            return v.trim();
        });
        let key = parse[0];
        if (process.env[key] === undefined) {
            if (parse.length === 1) {
                return undefined;
            }
            return parse[1];
        }
        return process.env[key];
    },
    resolve(name) {
        return typeof name === 'string';
    }
});
//# sourceMappingURL=env.js.map