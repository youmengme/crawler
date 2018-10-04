"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IORedis = require("ioredis");
const dependency_injection_1 = require("../dependency-injection");
exports.redis = new IORedis(dependency_injection_1.getParameter('redis'));
//# sourceMappingURL=redis.js.map