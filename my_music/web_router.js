'use strict';
const express = require('express');
const userController = require('./controllers/userController');
const musicController = require('./controllers/musicController');
// 4:处理请求
//配置路由规则 开始
let router = express.Router();
router.get('/test',userController.doTest)//测试
.post('/check-user',userController.checkUser)//检查用户名是否存在
.post('/do-register',userController.doRegister)//注册
.post('/do-login',userController.doLogin)//登录
.get('/logout',userController.logout)//退出登录
.post('/add-music',musicController.addMusic)//添加音乐
.put('/update-music',musicController.updateMusic)//更新音乐
.delete('/del-music',musicController.delMusic)//删除音乐



//配置路由规则 结束

module.exports = router;