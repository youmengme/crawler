'use strict';
const mysql  = require( 'mysql' );
const async = require('async');
const redis = require('./redis');
const { dbconf }  = require( '../conf/database' );
const common = require('../lib/common');

var pool  = mysql.createPool( Object.assign({
    connectionLimit : 50,
    multipleStatements : true,  //是否允许执行多条sql语句\
}, dbconf) );

/**
 * 封装query之sql不带参数占位符func
 */
var query=( sql )=>{
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
                return;
            }
            connection.query(sql, function (error, res) {
                connection.release();
                if (error) {
                    reject(error);
                    return;
                }
                storeCache(sql , null, res, 60 * 60);
                resolve(res);
            });
        });
    });
};

/**
 * 封装query之sql带占位符func
 */
var queryArgs=( sql , params )=>{
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
                return;
            }

            connection.query(sql, params, function (error, res) {
                connection.release();
                if (error) {
                    reject(error);
                    return;
                }
                storeCache(sql , params, res, 60 * 60);
                resolve(res);
            });
        });
    });
};

var execActivateTrans = ( sqlParams )=>{
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
                return;
            }

            connection.beginTransaction(function(err){
                if (err) {
                    reject(err);
                    return;
                }

                var funcAry = [];
                sqlParams.forEach(function (sql_param, index) {
                    if(index != 0){
                        var temp = function (last_result, cb) {
                            var sql = sql_param.sql;
                            var param = sql_param.params;
                            if(index == 1){
                                param[0] = last_result.member_id;
                            }
                            else if(index == 2){
                                for(let i=0; i<param[0].length; i++){
                                    param[0][i][0] = last_result.member_id;
                                }
                            }
                            else if(index == 3){
                                param[1] = last_result.member_id;
                            }
                            else if(index == 4){
                                param[0] = last_result.member_id;
                            }

                            connection.query(sql, param, function (err, result) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                if(index == 1){
                                    result.member_id = last_result.insertId;
                                }
                                else{
                                    result.member_id = last_result.member_id;
                                }

                                cb(null, result);
                            });
                        };
                    }
                    else{
                        var temp = function (cb) {
                            var sql = sql_param.sql;
                            var param = sql_param.params;
                            connection.query(sql, param, function (err, result) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                cb(null, result);
                            });
                        };
                    }
                    funcAry.push(temp);
                });
                async.waterfall(funcAry, function(err, result){
                    if(err){
                        connection.rollback(function () {
                            connection.release();
                        });

                        reject(err);
                        return;
                    }

                    connection.commit(function (err) {
                        if(err){
                            reject(err);
                            return;
                        }

                        connection.release();
                        resolve(result);
                    });
                });
            });
        });
    });
}

var execTrans = ( sqlParams )=>{
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
                return;
            }

            connection.beginTransaction(function(err){
                if (err) {
                    reject(err);
                    return;
                }

                var funcAry = [];
                sqlParams.forEach(function (sql_param) {
                    var temp = function (cb) {
                        var sql = sql_param.sql;
                        var param = sql_param.params;

                        connection.query(sql, param, function (err, result) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            if(typeof (cb) == 'function') {
                                cb(null, result);
                            }
                        });
                    };
                    funcAry.push(temp);
                });
                async.series(funcAry, function(err, result){
                    if(err){
                        connection.rollback(function () {
                            connection.release();
                        });

                        reject(err);
                        return;
                    }

                    connection.commit(function (err) {
                        if(err){
                            reject(err);
                            return;
                        }

                        connection.release();
                        resolve(result);
                    });
                });
            });
        });
    });
}

var storeCache = (sql, params, value, expires)=>{
    if(sql.indexOf('select') !== -1 || sql.indexOf('SELECT') !== -1) {
        var key = common.getKey(sql, params);
        redis.set(key, JSON.stringify(value), expires);
    }
}

//模块导出
module.exports = {
    query: query,
    queryArgs: queryArgs,
    execActivateTrans: execActivateTrans,
    execTrans: execTrans
}