const crypto = require('crypto');
const CryptoJS = require('crypto-js');
function toDou(n) {
    return n < 10 ? '0'+n : n;
}

module.exports = {
    time2date: (timestamp)=>{
        var oDate = new Date();
        oDate.setTime(timestamp);
        var str = oDate.getFullYear() + '-' + toDou(oDate.getMonth() + 1) + '-' + toDou(oDate.getDate()) + ' ' + toDou(oDate.getHours()) + '-' + toDou(oDate.getMinutes()) + '-' + toDou(oDate.getSeconds());
        return str;
    },
    md5: (str)=>{
        var sign = 'maoxy';
        var newstr = str + sign;
        var obj = crypto.createHash('md5');
        obj.update(newstr);
        var res = obj.digest('hex');
        return res;
    },
    getKey: (sql, params)=>{
        var str = '';
        if(params){
            str = sql + params.join();
        }
        else{
            str = sql;
        }

        var key = CryptoJS.SHA1(str).toString();
        return key;
    }
}