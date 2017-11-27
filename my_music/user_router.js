'use strict';
const express = require('express');
const userController = require('./controllers/userController');
//配置路由规则 开始
let router = express.Router();
router.get('/login',userController.showLogin)//登录页
.get('/register',userController.showRegister)//注册页
.get('/get-pic',userController.getCaptcha) //获取验证码
//配置路由规则 结束

module.exports = router;