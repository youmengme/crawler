var CryptoJS = require('crypto-js');
var Oss = require('ali-oss');
var memberModel = require('../model/member');
var sqlCommands = require('../conf/sqlCommands');
var redis = require('../lib/redis');
var common = require('../lib/common');
var sign = require('../conf/sign');
var jwt = require('../middleware/token');
var log4js = require('../lib/logConfig');

var logger = log4js.getLogger('oth');

/**
 * 激活Action
 */
function activateAction(req, res, next){
    // 获取前台页面传过来的参数
    var param = req.body;
    (async ()=>{
        try {
            if(!param.mobile){
                res.send(JSON.stringify({code: -1, message: '手机号码不能为空'})).end();
                return false;
            }

            if(!param.code){
                res.send(JSON.stringify({code: -1, message: '激活秘钥不能为空'})).end();
                return false;
            }

            let memObj = await memberModel.isMobileExist(param);
            if(memObj && memObj.length == 0) {
                let pwdObj = await memberModel.findByPwd(param);
                if(pwdObj && pwdObj[0].isopen == 1 && pwdObj[0].status == 0) {
                    param.uid = pwdObj[0].uid;
                    let agentObj = await memberModel.findAgent(param);
                    let domain = req.headers['referer'];
                    if(agentObj && agentObj.length > 0 && domain.indexOf(agentObj[0].website) !== -1) {
                        let key = sign.sign.token + '123456';
                        param.password = common.md5(key);
                        param.member_id = '';
                        param.status = 1;
                        param.isopen = 1;
                        param.created_at = common.time2date((new Date()).getTime());
                        param.updated_at = common.time2date((new Date()).getTime());
                        param.uid = pwdObj[0].uid;
                        param.combo_id = pwdObj[0].combo_id;
                        let comboObj = await memberModel.findCombo(param);
                        if (comboObj && comboObj.length > 0) {
                            if (comboObj[0].timelong == 0) {
                                var endtime = (new Date()).getTime() + 20 * 365 * 24 * 60 * 60 * 1000;
                            }
                            else {
                                var endtime = (new Date()).getTime() + comboObj[0].timelong * 24 * 60 * 60 * 1000;
                            }

                            param.begin = common.time2date((new Date()).getTime());
                            param.end = common.time2date(endtime);
                            param.count = comboObj[0].count;
                            param.point = comboObj[0].point;
                        }

                        param.many = []
                        let comboSiteObj = await memberModel.findComboSite(param);
                        for (let i = 0; i < comboSiteObj.length; i++) {
                            param.many.push(
                                [param.member_id, comboSiteObj[i].website_id, comboSiteObj[i].count, param.created_at, param.updated_at]
                            );
                        }
                        let rtn = await memberModel.activate(param);

                        res.send(JSON.stringify({code: 0, message: '激活成功'})).end();
                    }
                    else{
                        res.send(JSON.stringify({code: -1, message: '充值卡不符'})).end();
                    }
                }
                else{
                    res.send(JSON.stringify({code: -1, message: '激活秘钥已失效'})).end();
                }
            }
            else{
                res.send(JSON.stringify({code: -1, message: '该手机号码已激活'})).end();
            }
        }
        catch (err){
            console.log(err);
            res.send(JSON.stringify({code: -1, message: '数据错误'})).end();
        }
    })();
}

function loginAction(req, res, next){
    // 获取前台页面传过来的参数
    var param = req.body;
    (async ()=>{
        try {
            if(!param.mobile){
                res.send(JSON.stringify({code: -1, message: '手机号码不能为空'})).end();
                return false;
            }

            if(!param.password){
                res.send(JSON.stringify({code: -1, message: '密码不能为空'})).end();
                return false;
            }

            let key = sign.sign.token + param.password;
            param.password = common.md5(key);
            let memObj = await memberModel.login(param);
            if(memObj && memObj.length > 0 && memObj[0].isopen == 1) {
                param.uid = memObj[0].uid;
                let agentObj = await memberModel.findAgent(param);
                let domain = req.headers['referer'];
                if(agentObj && agentObj.length > 0 && domain.indexOf(agentObj[0].website) !== -1) {
                    param.id = memObj[0].id;
                    param.member_id = memObj[0].id;
                    param.combo_id = memObj[0].combo_id;
                    param.updated_at = common.time2date((new Date()).getTime());
                    param.last_login_time = common.time2date((new Date()).getTime());
                    await memberModel.updateLoginTime(param);
                    let comboObj = await memberModel.findCombo(param);

                    var token = jwt.generateToken({
                        id: memObj[0].id,
                        mobile: memObj[0].mobile,
                        password: memObj[0].password
                    });
                    memObj[0].token = token;
                    memObj[0].combo = comboObj && comboObj.length > 0 ? comboObj[0] : [];
                    if(comboObj && comboObj.length > 0) {
                        let memcomboObj = await memberModel.findMemcombo(param);
                        if(memcomboObj && memcomboObj.length > 0){
                            for(let i=0; i<memcomboObj.length; i++){
                                param.site_id = memcomboObj[i].site_id;
                                let webObj = await memberModel.findWebsite(param);
                                memcomboObj[i].site_url = webObj && webObj.length > 0 ? webObj[0].url : '';
                                memcomboObj[i].site_isopen = webObj && webObj.length > 0 ? webObj[0].isopen : 0;
                            }
                        }
                        memObj[0].memcombo = memcomboObj && memcomboObj.length > 0 ? memcomboObj : [];
                    }

                    res.send(JSON.stringify({code: 0, message: '登录成功', data: memObj[0]})).end();
                }
                else{
                    res.send(JSON.stringify({code: -1, message: '非法用户'})).end();
                }
            }
            else if(memObj && memObj.length > 0 && memObj[0].isopen == 0){
                res.send(JSON.stringify({code: -1, message: '用户已冻结'})).end();
            }
            else{
                let mObj = await memberModel.isMobileExist(param);
                if(mObj && mObj.length > 0) {
                    res.send(JSON.stringify({code: -1, message: '密码错误'})).end();
                }
                else{
                    res.send(JSON.stringify({code: -1, message: '用户不存在'})).end();
                }
            }
        }
        catch (err){
            console.log(err);
            res.send(JSON.stringify({code: -1, message: '数据错误'})).end();
        }
    })();
}

function chgpwdAction(req, res, next){
    // 获取前台页面传过来的参数
    var param = req.body;
    (async ()=>{
        try {
            if(!param.oldpwd){
                res.send(JSON.stringify({code: -1, message: '原密码不能为空'})).end();
                return false;
            }

            if(!param.newpwd){
                res.send(JSON.stringify({code: -1, message: '新密码不能为空'})).end();
                return false;
            }

            let newkey = sign.sign.token + param.newpwd;
            let oldkey = sign.sign.token + param.oldpwd;
            param.newpwd = common.md5(newkey);
            param.oldpwd = common.md5(oldkey);
            param.id = req.user.id;
            param.mobile = req.user.mobile;
            param.updated_at = common.time2date((new Date()).getTime());
            let memObj = await memberModel.chgpwd(param);
            if (memObj && memObj.affectedRows > 0) {
                res.send(JSON.stringify({code: 0, message: '修改成功'})).end();
            }
            else {
                res.send(JSON.stringify({code: -1, message: '修改失败'})).end();
            }
        }
        catch (err){
            res.send(JSON.stringify({code: -1, message: '数据错误'})).end();
        }
    })();
}

function chargelogAction(req, res, next){
    // 获取前台页面传过来的参数
    var param = req.body;
    (async ()=>{
        try {
            param.page = Number(param.page);
            param.num = Number(param.num);

            if(!param.page){
                res.send(JSON.stringify({code: -1, message: '获取页码不能为空'})).end();
                return false;
            }

            if(!param.num){
                res.send(JSON.stringify({code: -1, message: '获取数量不能为空'})).end();
                return false;
            }

            param.member_id = req.user.id;
            param.offset = param.num * ( param.page - 1 );

            let total = await memberModel.chargetotal(param);
            let lists = await memberModel.chargepage(param);
            let rtn = {
                'total': total.length,
                'data': lists
            }

            res.send(JSON.stringify({code: 0, message: '获取成功', data: rtn})).end();
        }
        catch (err){
            console.log(err);
            res.send(JSON.stringify({code: -1, message: '数据错误'})).end();
        }
    })();
}

function chargeAction(req, res, next){
    // 获取前台页面传过来的参数
    var param = req.body;
    (async ()=>{
        try {
            if(!param.code){
                res.send(JSON.stringify({code: -1, message: '充值秘钥不能为空'})).end();
                return false;
            }

            let pwdObj = await memberModel.findByPwd(param);
            if(pwdObj && pwdObj.length>0 && pwdObj[0].isopen == 1 && pwdObj[0].status == 0) {
                param.uid = pwdObj[0].uid;
                let agentObj = await memberModel.findAgent(param);
                let domain = req.headers['referer'];
                if(agentObj && agentObj.length > 0 && domain.indexOf(agentObj[0].website) !== -1) {
                    param.member_id = req.user.id;
                    param.mobile = req.user.mobile;
                    param.status = 1;
                    param.created_at = common.time2date((new Date()).getTime());
                    param.updated_at = common.time2date((new Date()).getTime());
                    param.combo_id = pwdObj[0].combo_id;
                    let comboObj = await memberModel.findCombo(param);
                    if (comboObj && comboObj.length > 0) {
                        if (comboObj[0].timelong == 0) {
                            var endtime = (new Date()).getTime() + 20 * 365 * 24 * 60 * 60 * 1000;
                        }
                        else {
                            var endtime = (new Date()).getTime() + comboObj[0].timelong * 24 * 60 * 60 * 1000;
                        }

                        param.begin = common.time2date((new Date()).getTime());
                        param.end = common.time2date(endtime);
                        param.count = comboObj[0].count;
                        param.point = comboObj[0].point;
                    }

                    param.many = []
                    let comboSiteObj = await memberModel.findComboSite(param);
                    for (let i = 0; i < comboSiteObj.length; i++) {
                        param.many.push(
                            [param.member_id, comboSiteObj[i].website_id, comboSiteObj[i].count, param.created_at, param.updated_at]
                        );
                    }
                    let rtn = await memberModel.charge(param);

                    res.send(JSON.stringify({code: 0, message: '充值成功'})).end();
                }
                else{
                    res.send(JSON.stringify({code: -1, message: '充值卡不符'})).end();
                }
            }
            else if(pwdObj && pwdObj.length == 0){
                res.send(JSON.stringify({code: -1, message: '激活秘钥不存在'})).end();
            }
            else{
                res.send(JSON.stringify({code: -1, message: '激活秘钥已失效'})).end();
            }
        }
        catch (err){
            console.log(err)
            res.send(JSON.stringify({code: -1, message: '数据错误'})).end();
        }
    })();
}

function privilegeAction(req, res, next){
    (async ()=>{
        try {
            let param = {};
            param.member_id = req.user.id;
            param.mobile = req.user.mobile;
            let mObj = await memberModel.isMobileExist(param);
            if(mObj && mObj.length > 0 && mObj[0].isopen == 1) {
                let rtn = {};
                rtn.member = mObj[0];
                param.combo_id = mObj[0].combo_id;
                let comboObj = await memberModel.findCombo(param);
                rtn.combo = comboObj && comboObj.length > 0 ? comboObj[0] : [];
                if(comboObj && comboObj.length > 0) {
                    let memcomboObj = await memberModel.findMemcombo(param);
                    if(memcomboObj && memcomboObj.length > 0){
                        for(let i=0; i<memcomboObj.length; i++){
                            param.site_id = memcomboObj[i].site_id;
                            let webObj = await memberModel.findWebsite(param);
                            memcomboObj[i].site_url = webObj && webObj.length > 0 ? webObj[0].url : '';
                            memcomboObj[i].site_isopen = webObj && webObj.length > 0 ? webObj[0].isopen : 0;
                        }
                    }
                    rtn.memcombo = memcomboObj && memcomboObj.length > 0 ? memcomboObj : [];
                }

                res.send(JSON.stringify({code: 0, message: '获取成功', data: rtn})).end();
            }
            else if(mObj && mObj.length > 0 && mObj[0].isopen == 0) {
                res.send(JSON.stringify({code: -1, message: '用户已冻结'})).end();
            }
            else{
                res.send(JSON.stringify({code: -1, message: '用户不存在'})).end();
            }
        }
        catch (err){
            console.log(err);
            res.send(JSON.stringify({code: -1, message: '数据错误'})).end();
        }
    })();
}

function sysinfoAction(req, res, next){
    (async ()=>{
        try {
            let param = {};
            param.member_id = req.user.id;
            param.mobile = req.user.mobile;
            let mObj = await memberModel.isMobileExist(param);
            if(mObj && mObj.length > 0 && mObj[0].isopen == 1) {
                param.uid = mObj[0].uid;
                let sysObj = await memberModel.findSysinfo(param);
                if(sysObj && sysObj.length > 0) {
                    res.send(JSON.stringify({code: 0, message: '获取成功', data: sysObj[0]})).end();
                }
                else{
                    res.send(JSON.stringify({code: -1, message: '获取失败'})).end();
                }
            }
            else if(mObj && mObj.length > 0 && mObj[0].isopen == 0) {
                res.send(JSON.stringify({code: -1, message: '用户已冻结'})).end();
            }
            else{
                res.send(JSON.stringify({code: -1, message: '用户不存在'})).end();
            }
        }
        catch (err){
            console.log(err);
            res.send(JSON.stringify({code: -1, message: '数据错误'})).end();
        }
    })();
}

function signatureUrl(path){
    const store = new Oss({
        region: 'oss-cn-hangzhou',
        accessKeyId: 'LTAIsn7KdGONfsZB',
        accessKeySecret: 'CSj7o1wxOYSxPOoFmT8xjSZXT7pdVO',
        bucket: 'downdb2'
    });

    let url = store.signatureUrl(path, {
        expires: 1800
    });

    return url;
}

function downloadAction(req, res, next){
    var param = req.body;
    (async ()=>{
        try {
            param.member_id = req.user.id;
            param.mobile = req.user.mobile;
            param.combo_id = req.user.combo_id;
            param.created_at = common.time2date((new Date()).getTime());
            param.updated_at = common.time2date((new Date()).getTime());

            if(!param.url){
                res.send(JSON.stringify({code: -1, message: '下载地址不能为空'})).end();
                return false;
            }
            else{
            	var str = param.member_id + param.url;
            	var key = CryptoJS.SHA1(str).toString();
            	var cacheValue = await redis.get(key);
            	if(cacheValue){
            		res.send(JSON.stringify({code: 10000, message: '下载频率过快'})).end();
                    return false;
            	}
            }

            let sourceObj = await memberModel.findSource(param);
            if(sourceObj && sourceObj.length > 0 && sourceObj[0].attachments && sourceObj[0].status == 'done'){
                //已有人下载过该文件
                let attachs = JSON.parse(sourceObj[0].attachments);
                for(let i=0; i<attachs.length; i++){
                    attachs[i].path = signatureUrl(attachs[i].path);
                }
                sourceObj[0].attachments = attachs;

            	param.downlist_id = sourceObj[0].id;
            	let memDownObj = await memberModel.findMemDown(param);
            	if(memDownObj && memDownObj.length > 0){
            		res.send(JSON.stringify({code: 0, message: '下载成功', data: sourceObj[0]})).end();
                    return false;
            	}
            	else{
            	    //扣费
                    logger.info('pay money');
                    let mObj = await memberModel.isMobileExist(param);
                    if (mObj && mObj.length > 0) {
                        param.combo_id = mObj[0].combo_id;
                        let comboObj = await memberModel.findCombo(param);
                        if (comboObj && comboObj.length > 0) {
                            let memcomboObj = await memberModel.findMemcombo(param);
                            if (memcomboObj && memcomboObj.length > 0) {
                                let flag = false;
                                for (let i = 0; i < memcomboObj.length; i++) {
                                    param.site_id = memcomboObj[i].site_id;
                                    let webObj = await memberModel.findWebsite(param);
                                    if (webObj && webObj.length > 0 && param.url.indexOf(webObj[0].url) !== -1) {
                                        if(webObj[0].isopen == 0){
                                            res.send(JSON.stringify({code: -1, message: '网站维护中'})).end();
                                            break;
                                        }

                                        //website match
                                        flag = true;
                                        let now = (new Date()).getTime();
                                        let begin = (new Date(mObj[0].begin)).getTime();
                                        let end = (new Date(mObj[0].end)).getTime();

                                        if (now >= begin && now <= end) {
                                            if (mObj[0].count > 0 && webObj[0].type == 'money') {
                                                if (comboObj[0].type == 'day' && memcomboObj[i].count <= 0) {
                                                    res.send(JSON.stringify({code: 10003, message: '该网站下载次数已用完'})).end();
                                                    break;
                                                }

                                                let downObj = await memberModel.download(param);
                                                if (downObj && downObj.code == 0) {
                                                    //扣费
                                                    param.site_id = webObj[0].id;
                                                    param.combo_type = comboObj[0].type;
                                                    if (param.combo_type == 'day') {
                                                        logger.info('pay day');
                                                        await memberModel.payDayMoney(param);
                                                    }
                                                    else {
                                                        logger.info('pay count');
                                                        logger.info(JSON.stringify(param));
                                                        await memberModel.payCountMoney(param);
                                                    }

                                                    res.send(JSON.stringify({code: 0, message: '下载成功', data: sourceObj[0]})).end();
                                                    break;
                                                }
                                                else {
                                                    res.send(JSON.stringify({code: -1, message: downObj.msg})).end();
                                                    break;
                                                }
                                            }
                                            else if (mObj[0].point > 0 && webObj[0].type == 'point') {
                                                let downObj = await memberModel.download(param);
                                                if (downObj && downObj.code == 0) {
                                                    logger.info('pay point');
                                                    logger.log(attachs[0].meta.price);
                                                    param.point = attachs[0].meta && attachs[0].meta.price ? attachs[0].meta.price : 0;
                                                    await memberModel.payPoint(param);
                                                    res.send(JSON.stringify({code: 0, message: '下载成功', data: sourceObj[0]})).end();
                                                    break;
                                                }
                                                else {
                                                    res.send(JSON.stringify({code: -1, message: downObj.msg})).end();
                                                    break;
                                                }
                                            }
                                            else if (mObj[0].point <= 0 && webObj[0].type == 'point') {
                                                res.send(JSON.stringify({code: 10006, message: '账户积分不足'})).end();
                                                break;
                                            }
                                            else if (mObj[0].count <= 0 && webObj[0].type == 'money') {
                                                res.send(JSON.stringify({code: 10003, message: '下载次数已使用完'})).end();
                                                break;
                                            }
                                            else {
                                                res.send(JSON.stringify({code: 10003, message: '下载次数已使用完'})).end();
                                                break;
                                            }
                                        }
                                        else {
                                            res.send(JSON.stringify({code: 10002, message: '下载权限已过期'})).end();
                                            break;
                                        }
                                        break;
                                    }
                                }

                                if (!flag) {
                                    res.send(JSON.stringify({code: 10009, message: '没有该网站的下载权限'})).end();
                                }
                            }
                            else {
                                res.send(JSON.stringify({code: -1, message: '获取套餐相详情失败'})).end();
                            }
                        }
                        else {
                            res.send(JSON.stringify({code: -1, message: '获取套餐信息失败'})).end();
                        }
                    }
                    else{
                        res.send(JSON.stringify({code: -1, message: '获取用户信息失败'})).end();
                    }
            	}
            }
            else if(sourceObj && sourceObj.length > 0 && sourceObj[0].status != 'done'){
                //已提交下载，等待下载完成
            	res.send(JSON.stringify({code: 0, message: '正在下载中', data: sourceObj[0]})).end();
                return false;
            }
            else {
                //从未有人下载过，提交下载
                let mObj = await memberModel.isMobileExist(param);
                if (mObj && mObj.length > 0 && mObj[0].isopen == 1) {
                    param.combo_id = mObj[0].combo_id;
                    let comboObj = await memberModel.findCombo(param);
                    if (comboObj && comboObj.length > 0) {
                        let memcomboObj = await memberModel.findMemcombo(param);
                        if (memcomboObj && memcomboObj.length > 0) {
                            let flag = false;
                            for (let i = 0; i < memcomboObj.length; i++) {
                                param.site_id = memcomboObj[i].site_id;
                                let webObj = await memberModel.findWebsite(param);
                                if (webObj && webObj.length > 0 && param.url.indexOf(webObj[0].url) !== -1) {
                                    if(webObj[0].isopen == 0){
                                        res.send(JSON.stringify({code: -1, message: '网站维护中'})).end();
                                        break;
                                    }

                                    //website match
                                    flag = true;
                                    let now = (new Date()).getTime();
                                    let begin = (new Date(mObj[0].begin)).getTime();
                                    let end = (new Date(mObj[0].end)).getTime();

                                    if (now >= begin && now <= end) {
                                        if (mObj[0].count > 0 && webObj[0].type == 'money') {
                                            if (comboObj[0].type == 'day' && memcomboObj[i].count <= 0) {
                                                res.send(JSON.stringify({code: 10003, message: '该网站下载次数已用完'})).end();
                                                break;
                                            }

                                            let downObj = await memberModel.download(param);
                                            if (downObj && downObj.code == 0) {
                                                redis.set(key, JSON.stringify(param.url), 5);
                                                res.send(JSON.stringify({code: 0, message: '正在下载中', data: downObj.data})).end();
                                                break;
                                            }
                                            else {
                                                res.send(JSON.stringify({code: -1, message: downObj.msg})).end();
                                                break;
                                            }
                                        }
                                        else if (mObj[0].point > 0 && webObj[0].type == 'point') {
                                            let downObj = await memberModel.download(param);
                                            if (downObj && downObj.code == 0) {
                                                redis.set(key, JSON.stringify(param.url), 5);
                                                res.send(JSON.stringify({code: 0, message: '正在下载中', data: downObj.data})).end();
                                                break;
                                            }
                                            else {
                                                res.send(JSON.stringify({code: -1, message: downObj.msg})).end();
                                                break;
                                            }
                                        }
                                        else if (mObj[0].point <= 0 && webObj[0].type == 'point') {
                                            res.send(JSON.stringify({code: 10006, message: '账户积分不足'})).end();
                                            break;
                                        }
                                        else if (mObj[0].count <= 0 && webObj[0].type == 'money') {
                                            res.send(JSON.stringify({code: 10003, message: '下载次数已使用完'})).end();
                                            break;
                                        }
                                        else {
                                            res.send(JSON.stringify({code: 10003, message: '下载次数已使用完'})).end();
                                            break;
                                        }
                                    }
                                    else {
                                        res.send(JSON.stringify({code: 10002, message: '下载权限已过期'})).end();
                                        break;
                                    }
                                    break;
                                }
                            }

                            if (!flag) {
                                res.send(JSON.stringify({code: 10009, message: '没有该网站的下载权限'})).end();
                            }
                        }
                        else {
                            res.send(JSON.stringify({code: -1, message: '获取套餐相详情失败'})).end();
                        }
                    }
                    else {
                        res.send(JSON.stringify({code: -1, message: '获取套餐信息失败'})).end();
                    }
                }
            }
        }
        catch (err){
            console.log(err);
            res.send(JSON.stringify({code: -1, message: '未知错误'})).end();
        }
    })();
}

function downpageAction(req, res, next){
    // 获取前台页面传过来的参数
    var param = req.body;
    (async ()=>{
        try {
            param.page = Number(param.page);
            param.num = Number(param.num);

            if(!param.page){
                res.send(JSON.stringify({code: -1, message: '获取页码不能为空'})).end();
                return false;
            }

            if(!param.num){
                res.send(JSON.stringify({code: -1, message: '获取数量不能为空'})).end();
                return false;
            }

            param.member_id = req.user.id;
            param.offset = param.num * ( param.page - 1 );

            let total = await memberModel.downtotal(param);
            let lists = await memberModel.downpage(param);
            if(lists && lists.length > 0){
                for(let i=0; i<lists.length; i++){
                    let attachs = JSON.parse(lists[i].attachments);
                    for(let j=0; j<attachs.length; j++){
                        attachs[j].path = signatureUrl(attachs[j].path);
                    }
                    lists[i].attachments = attachs;
                }
            }

            let rtn = {
                'total': total.length,
                'data': lists
            }

            res.send(JSON.stringify({code: 0, message: '获取成功', data: rtn})).end();
        }
        catch (err){
            console.log(err);
            res.send(JSON.stringify({code: -1, message: '数据错误'})).end();
        }
    })();
}

// exports
module.exports = {
    activate: activateAction,
    login: loginAction,
    chgpwd: chgpwdAction,
    chargelog: chargelogAction,
    charge: chargeAction,
    privilege: privilegeAction,
    sysinfo: sysinfoAction,
    download: downloadAction,
    downpage: downpageAction
};