const express = require('express');
const jwt = require('../middleware/token');
const memberAction = require('../action/member');

module.exports = function () {
    var router = express.Router();
    router.get('/', (req, res)=>{
        res.send('我是api').end();
    });

    router.post('/login', (req, res, next)=>{
        memberAction.login(req, res, next);
    });

    router.post('/activate', (req, res, next)=>{
        memberAction.activate(req, res, next);
    });

    router.post('/chgpwd', jwt.check, (req, res, next)=>{
        memberAction.chgpwd(req, res, next);
    });

    router.post('/chargelog', jwt.check, (req, res, next)=>{
        memberAction.chargelog(req, res, next);
    });

    router.post('/charge', jwt.check, (req, res, next)=>{
        memberAction.charge(req, res, next);
    });

    router.get('/privilege', jwt.check, (req, res, next)=>{
        memberAction.privilege(req, res, next);
    });

    router.get('/sysinfo', jwt.check, (req, res, next)=>{
        memberAction.sysinfo(req, res, next);
    });

    router.post('/download', jwt.check, (req, res, next)=>{
        memberAction.download(req, res, next);
    });

    router.post('/downpage', jwt.check, (req, res, next)=>{
        memberAction.downpage(req, res, next);
    });


    return router;
}