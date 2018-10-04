const express = require('express');

module.exports = function () {
    var router = express.Router();
    router.use((req, res, next)=>{
        //req.url为去除了admin的login，即该子路由下的路由名称
        if(!req.session['admin_id'] && req.url != '/login'){
            res.redirect('/admin/login');
        }
        else{
            next();
        }
    });

    router.get('/', (req, res)=>{
        res.render('admin/index.ejs', {name: 'cat'});
    });

    router.get('/login', (req, res)=>{
        res.render('admin/login.ejs', {});
    });

    router.post('/login', (req, res)=>{
        //判断登录逻辑,成功则保存session然后跳转
        req.session['admin_id'] = 1;

        res.redirect('/admin');
    });

    return router
}