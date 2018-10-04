const express = require('express');
const pictureAction = require('../action/picture');

module.exports = function () {
    var router = express.Router();
    router.get('/', (req, res)=>{
        res.send('我是web').end();
    });

    router.get('/login', (req, res)=>{
        res.send('我是login').end();
    });

    router.get('/list', (req, res, next)=>{
        pictureAction.findPage(req, res, next);
    });

    router.post('/save', (req, res, next)=>{
        pictureAction.add(req, res, next);
    });

    return router
}