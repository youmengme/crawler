var pictureModel = require('../model/picture');
var sqlCommands = require('../conf/sqlCommands');
var redis = require('../lib/redis');
var common = require('../lib/common');

/**
 * 增加用户Action
 */
function addAction(req, res, next){
    // 获取前台页面传过来的参数
    var param = req.body;
    (async ()=>{
        console.log('000000000');
        console.log(param.data)
        try {
            let jsonData = JSON.parse(param.data);
            let num = 0;
            for(var i=0; i<jsonData.length; i++) {
                var singleParam = {};
                singleParam.title = jsonData[i]['名称'];
                singleParam.keywords = jsonData[i]['关键词'];
                singleParam.description = jsonData[i]['描述'];
                singleParam.category = jsonData[i]['分类'];
                singleParam.software = jsonData[i]['属性'][0]['软件'];
                singleParam.type = jsonData[i]['属性'][0]['格式'];
                singleParam.copyright = jsonData[i]['属性'][0]['版权'];
                singleParam.color = jsonData[i]['属性'][0]['色系'];
                singleParam.format = jsonData[i]['属性'][0]['板式'];
                singleParam.size = jsonData[i]['属性'][0]['尺寸'];
                singleParam.pixel = jsonData[i]['属性'][0]['大小'];
                singleParam.resolution = jsonData[i]['属性'][0]['分辨率'];
                singleParam.label = jsonData[i]['属性'][0]['标签'];
                singleParam.content = jsonData[i]['属性'][0]['内容'];
                singleParam.file = jsonData[i]['属性'][0]['文件'];
                let rtn = await pictureModel.add(singleParam);
                if(rtn.affectedRows > 0){
                    num++;
                }
            }

            res.send(JSON.stringify({code: 0, message: num + 'success'})).end();
        }
        catch (err){
            res.send(JSON.stringify({code: -1, message: '插入数据错误'})).end();
        }
    })();
}

/**
 * 获取picture Action
 * 执行到await的时候，async函数暂停，执行async函数之外的后面的代码，等到await异步执行完后，事件循环进入async函数，执行async函数内部后面的代码
 */
function findPageAction(req, res, next){
    // 获取前台页面传过来的参数
    var param = req.params;
    (async ()=>{
        /*
         * await等待的虽然是promise对象，但不必写.then(..)，直接可以得到返回值
         * .then(..)不用写，.catch(..)也不用写，可以直接用标准的try catch语法捕捉错误
         * await看起来就像是同步代码，所以可以写在for循环里，但不能是forEach里
         */

        try {
            let rtn = '';
            let key = common.getKey(sqlCommands.images.findByPage(param), [param.category, param.software, param.type, param.copyright, param.format, param.orderby, param.offset, param.num]);
            let cacheValue = await redis.get(key);
            if(!cacheValue) {
                let picture = await pictureModel.findByPage(param);
                rtn = picture;
                res.send(JSON.stringify({code: 0, message: '获取成功，我从数据库来', data: rtn})).end();
            }
            else{
                rtn = JSON.parse(cacheValue);
                res.send(JSON.stringify({code: 0, message: '获取成功,我从缓存来', data: rtn})).end();
            }
        }
        catch (err) {
            // 这里捕捉到错误 `error`
            res.send(JSON.stringify({code: -1, message: '获取列表出错'})).end();
        }
    })();
}

// exports
module.exports = {
    add: addAction,
    findPage: findPageAction
};