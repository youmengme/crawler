"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../core/bootstrap");
const db_1 = require("../core/adapther/db");
const yargs = require("yargs");
const argv = yargs
    .boolean('force')
    .default('force', false, '强制清空原有数据表内容和结构')
    .argv;
(async () => {
    try {
        const result = await db_1.db.sync({
            force: argv.force
        });
        await db_1.db.query("INSERT INTO `site` (`id`, `name`, `host`, `slug`, `enable`, `extra`, `created_at`, `updated_at`) \
        VALUES \
            (1, '摄图网', '699pic.com', '699pic', 1, NULL, '2018-08-07 22:13:26', '2018-08-07 22:13:26'), \
            (2, '千库网', '588ku.com', '588ku', 1, NULL, '2018-08-11 09:36:58', '2018-09-11 14:23:40'), \
            (3, '包图网', 'ibaotu.com', 'ibaotu', 1, NULL, '2018-08-12 16:15:04', '2018-08-12 16:15:04'), \
            (4, '昵图网', 'www.nipic.com', 'nipic', 1, NULL, '2018-08-13 21:33:49', '2018-08-13 21:33:49'), \
            (5, '千图网', 'www.58pic.com', '58pic', 1, NULL, '2018-08-16 22:07:01', '2018-08-16 22:07:01'), \
            (6, '90设计', '90sheji.com', '90sheji', 1, NULL, '2018-08-16 22:07:01', '2018-08-16 22:07:01'), \
            (7, '我图网', 'www.ooopic.com', 'ooopic', 1, NULL, '2018-08-16 22:07:01', '2018-08-16 22:07:01'), \
            (8, '图品汇', 'www.88tph.com', '88tph', 1, NULL, '2018-08-16 22:07:01', '2018-08-16 22:07:01'), \
            (9, '觅元素', 'www.51yuansu.com', '51yuansu', 1, NULL, '2018-08-16 22:07:01', '2018-08-16 22:07:01'), \
            (10, '六图网', 'www.16pic.com', '16pic', 1, NULL, '2018-08-16 22:07:01', '2018-08-16 22:07:01'), \
            (11, '熊猫办公', 'www.tukuppt.com', 'tukuppt', 1, NULL, '2018-08-16 22:07:01', '2018-08-16 22:07:01');");
        console.log('ok');
        process.exit(0);
    }
    catch (e) {
        console.error(e);
    }
})();
//# sourceMappingURL=db-sync.js.map