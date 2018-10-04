"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function response(ctx, code, data) {
    if (typeof code !== 'number') {
        data = code;
    }
    else {
        if (data === void 0) {
            data = {};
        }
        else if (typeof data === 'string') {
            let msg = data;
            data = {};
            data.msg = msg;
        }
        if (data.code === undefined) {
            data.code = code;
        }
    }
    if (data.msg === void 0) {
        data.msg = '';
    }
    if (data.data === void 0) {
        data.data = {};
    }
    if (data.error === void 0) {
        data.error = data.msg;
    }
    ctx.body = JSON.stringify(data);
    return ctx.body;
}
exports.response = response;
//# sourceMappingURL=common.js.map