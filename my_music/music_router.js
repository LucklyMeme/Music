'use strict';
const express = require('express');
const musicController = require('./controllers/musicController');
//配置路由规则 开始
let router = express.Router();
router.get('/add-music',musicController.showAddMusic)//添加音乐
.get('/list-music',musicController.showListMusic) //显示音乐列表
.get('/edit-music/:id',musicController.showEdit) //显示编辑页面
//配置路由规则 结束

module.exports = router;