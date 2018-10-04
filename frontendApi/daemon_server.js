const express = require('express');
const fs = require('fs');
const pathLib = require('path');
const expressStatic = require('express-static')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const connectRedis = require('connect-redis');

const bodyParser = require('body-parser')
const multer = require('multer')
const consolidate = require('consolidate');  //适配模板引擎
const routeAdmin = require('./route/routeAdmin');
const routeWeb = require('./route/routeWeb');
const routeApi = require('./route/routeApi');
const log4js= require('./lib/logConfig')
const {redisconf}  = require( './conf/redis' );

//根据需要获取logger
const logger = log4js.getLogger();
const accesslogger = log4js.getLogger('access');
const errlogger = log4js.getLogger('err');
const othlogger = log4js.getLogger('oth');

// 本地redis配置参数
const RedisStore = connectRedis(session);

var objMulter = multer({
    dest: './upload/'
});

var server = express();
server.listen(8080);

//server.use只接受一个函数作为参数，则对所有路由作用  解析cookie
server.use(cookieParser('sign'));

//解析session
server.use(session({
    secret: 'sign',
    saveUninitialized:true,
    resave:false,
    store:new RedisStore(redisconf),
    cookie: {
        maxAge: 10 * 60 * 1000 //10min
    }
}));

//处理application/x-www-form-urlencoded表单
server.use(bodyParser.urlencoded({extended: false}));

////处理multipart/form-data表单，上传文件
server.use(objMulter.any());

//配置模板引擎
server.set('view engine', 'html');
//模板所在目录
server.set('views', './templete');
//哪种模板引擎
server.engine('html', consolidate.ejs);

//自动记录每次请求信息，放在其他use上面
log4js.useLogger(server, accesslogger);

//route
server.use('/', routeWeb());
server.use('/admin', routeAdmin());
server.use('/api', routeApi());

//设置静态文件路径
server.use(expressStatic('./static'));


/*
 * 终止进程信号
 * 通常用来要求程序自己正常退出
 * 在收到SIGTERM信号时正常退出
 */
process.on('SIGTERM', function () {
    process.exit(0);
});
