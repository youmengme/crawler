var db = require('../lib/db');
var sqlCommands = require('../conf/sqlCommands');
var log4js = require('../lib/logConfig');
var logger = log4js.getLogger('oth');
var axios = require('axios');
axios.defaults.baseURL = 'http://10.47.105.170:12333/api';

function activate(param) {
    // 执行Query
    return db.execActivateTrans([
        {
            sql: sqlCommands.member.insertOne,
            params: [param.mobile, param.password, param.uid, param.combo_id, param.begin, param.end, param.count, param.point, param.isopen, param.created_at, param.updated_at]
        },
        {
            sql: sqlCommands.memcombo.deleteOne,
            params: [param.member_id]
        },
        {
            sql: sqlCommands.memcombo.insertMany,
            params: [param.many]
        },
        {
            sql: sqlCommands.password.updateOne,
            params: [param.status, param.member_id, param.updated_at, param.code]
        },
        {
            sql: sqlCommands.charge.insertOne,
            params: [param.member_id, param.code, param.created_at, param.updated_at]
        }
    ]);
}

function isMobileExist(param) {
    // 执行Query
    return db.queryArgs(sqlCommands.member.findByMobile, [param.mobile]);
}

function findByPwd(param) {
    // 执行Query
    return db.queryArgs(sqlCommands.password.findByPwd, [param.code]);
}

function login(param) {
    // 执行Query
    return db.queryArgs(sqlCommands.member.login, [param.mobile, param.password]);
}

function updateLoginTime(param) {
    return db.queryArgs(sqlCommands.member.updateLoginTime, [param.updated_at, param.last_login_time, param.id]);
}

function chgpwd(param) {
    return db.queryArgs(sqlCommands.member.updatePwd, [param.newpwd, param.updated_at, param.oldpwd, param.id]);
}

function charge(param) {
    // 执行Query
    return db.execTrans([
        {
            sql: sqlCommands.member.charge,
            params: [param.combo_id, param.begin, param.end, param.count, param.point, param.updated_at, param.member_id]
        },
        {
            sql: sqlCommands.memcombo.deleteOne,
            params: [param.member_id]
        },
        {
            sql: sqlCommands.memcombo.insertMany,
            params: [param.many]
        },
        {
            sql: sqlCommands.password.updateOne,
            params: [param.status, param.member_id, param.updated_at, param.code]
        },
        {
            sql: sqlCommands.charge.insertOne,
            params: [param.member_id, param.code, param.created_at, param.updated_at]
        }
    ]);
}

function chargepage(param) {
    return db.queryArgs(sqlCommands.charge.findByPage, [param.member_id, param.offset, param.num]);
}

function chargetotal(param) {
    return db.queryArgs(sqlCommands.charge.findAll, [param.member_id]);
}

function findCombo(param) {
    // 执行Query
    return db.queryArgs(sqlCommands.combo.findOne, [param.combo_id]);
}

function findComboSite(param) {
    return db.queryArgs(sqlCommands.combosite.findComboSite, [param.combo_id]);
}

function findAgent(param) {
    return db.queryArgs(sqlCommands.agents.findById, [param.uid]);
}

function findWebsite(param) {
    return db.queryArgs(sqlCommands.website.findById, [param.site_id]);
}

function findMemcombo(param) {
    return db.queryArgs(sqlCommands.memcombo.findMemcombo, [param.member_id]);
}

function findSysinfo(param) {
    return db.queryArgs(sqlCommands.system.findOne, [param.uid]);
}

function download(param) {
    return new Promise(function (resolve, reject) {
        let p = 'url=' + param.url;
        axios.post('/material/submit', p)
        .then(function (response) {
            logger.info('download response');
            logger.info(JSON.stringify(response.data));
            resolve(response.data);
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

function payCountMoney(param) {
    return db.execTrans([
        {
            sql: sqlCommands.member.payMoney,
            params: [param.updated_at, param.member_id]
        },
        {
            sql: sqlCommands.memdown.insertMemDown,
            params:  [param.member_id, param.downlist_id, param.created_at, param.updated_at]
        }
    ]);
}

function payDayMoney(param) {
    // 执行Query
    return db.execTrans([
        {
            sql: sqlCommands.member.payMoney,
            params: [param.updated_at, param.member_id]
        },
        {
            sql: sqlCommands.memcombo.payMoney,
            params: [param.updated_at, param.member_id, param.site_id]
        },
        {
            sql: sqlCommands.memdown.insertMemDown,
            params:  [param.member_id, param.downlist_id, param.created_at, param.updated_at]
        }
    ]);
}

function payPoint(param) {
    return db.execTrans([
        {
            sql: sqlCommands.member.payPoint,
            params: [param.point, param.updated_at, param.member_id]
        },
        {
            sql: sqlCommands.memdown.insertMemDown,
            params:  [param.member_id, param.downlist_id, param.created_at, param.updated_at]
        }
    ]);
}

function downpage(param) {
    return db.queryArgs(sqlCommands.downlist.findByPage, [param.member_id, param.offset, param.num]);
}

function downtotal(param) {
    return db.queryArgs(sqlCommands.downlist.findAll, [param.member_id]);
}

function updateDownMember(param) {
    return db.queryArgs(sqlCommands.downlist.updateDownMember, [param.member_id, param.updated_at, param.id]);
}

function findSource(param) {
    return db.queryArgs(sqlCommands.downlist.findBySource, [param.url]);
}

function findMemDown(param){
	return db.queryArgs(sqlCommands.memdown.findMemDown, [param.member_id, param.downlist_id]);
}

// exports
module.exports = {
    activate: activate,
    isMobileExist: isMobileExist,
    findByPwd: findByPwd,
    login: login,
    chgpwd: chgpwd,
    charge: charge,
    chargepage: chargepage,
    chargetotal: chargetotal,
    updateLoginTime: updateLoginTime,
    findCombo: findCombo,
    findComboSite: findComboSite,
    findAgent: findAgent,
    findWebsite: findWebsite,
    findMemcombo: findMemcombo,
    findSysinfo: findSysinfo,
    download: download,
    payCountMoney: payCountMoney,
    payDayMoney: payDayMoney,
    payPoint: payPoint,
    downtotal: downtotal,
    downpage: downpage,
    updateDownMember: updateDownMember,
    findSource: findSource,
    findMemDown: findMemDown
};