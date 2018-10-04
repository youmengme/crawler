"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../core/bootstrap");
const db_1 = require("../core/adapther/db");
(async () => {
    try {
        const result = await db_1.db.sync({
        // force: true
        });
        console.log('ok');
        process.exit(0);
    }
    catch (e) {
        console.error(e);
    }
})();
//# sourceMappingURL=db-sync.js.map