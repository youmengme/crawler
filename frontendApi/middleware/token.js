const jwt = require('jsonwebtoken');
const sign = require('../conf/sign.js').sign; //私钥

function  generateToken(data){
    let token = jwt.sign(data, sign.token, { expiresIn: 60 * 60 });  //number of seconds
    return token;
}

function verifyToken(token){
    var decoded = null;
    try{
        decoded = jwt.verify(token, sign.token);
    }catch(e){
        decoded = null;
    }
    return decoded;
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
    check: function check (req, res, next) {
        //检查post的信息或者url查询参数或者头信息
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            // 确认token
            var decoded = verifyToken(token);
            if (decoded) {
                // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
                req.user = decoded;
                next();
            } else {
                return res.json({ code: 99999, message: '凭证信息错误' });
            }
        } else {
            // 如果没有token，则返回错误
            return res.status(403).send({
                code: -1,
                message: '没有提供凭证'
            });
        }
    }
}