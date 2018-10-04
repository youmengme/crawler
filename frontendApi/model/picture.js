var db = require('../lib/db');
var sqlCommands = require('../conf/sqlCommands');

function add(param) {
    // 执行Query
    return db.queryArgs(sqlCommands.images.insertOne, [param.title, param.keywords, param.description, param.category, param.software, param.type, param.copyright, param.color, param.format, param.size, param.pixel, param.resolution, param.label, param.content, param.file]);
}

function findByPage(param) {
    // 执行Query
    return db.queryArgs(sqlCommands.images.findByPage(param), [param.category, param.software, param.type, param.copyright, param.format, param.orderby, param.offset, param.num]);
}

// exports
module.exports = {
    add: add,
    findByPage: findByPage
};