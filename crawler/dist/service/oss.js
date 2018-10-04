"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Oss = require("ali-oss");
const dependency_injection_1 = require("../core/dependency-injection");
const client = new Oss(dependency_injection_1.getParameter('oss'));
dependency_injection_1.setService('oss', client);
module.exports = client;
//# sourceMappingURL=oss.js.map