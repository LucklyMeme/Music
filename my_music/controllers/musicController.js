// module.exports 默认是一空对象，和exports 是相等的
'use strict';
// 引入数据库操作db对象
const db = require('../models/db');
//解析文件上传
const formidable = require('formidable');
//引入path核心对象
const path = require('path');
//引入配置对象
const config = require('../config');


/**
 * [添加音乐]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.addMusic = (req,res,next)=>{

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(config.rootPath,'public/files');
    form.parse(req, function(err, fields, files) {
        if(err) return next(err);
        // { title: '告白气球', singer: '周杰伦', time: '03:00' }
        // { file:{}
        // console.log(fields);
        // console.log(files);
        //获取6个字段中的3个
        let datas = [fields.title,fields.singer,fields.time];
        let sql = 'insert into musics (title,singer,time,';
        let params = '(?,?,?';
        //两个路径
        if(files.file){
            //获取文件名
            let filename = path.parse(files.file.path).base;
            //如果上传了文件
            datas.push(`/public/files/${filename}`);
            sql += 'file,';
            params += ',?';
        }
        if(files.filelrc){
            //获取文件名
            let lrcname = path.parse(files.filelrc.path).base;
            //如果上传了文件
            datas.push(`/public/files/${lrcname}`);
            sql += 'filelrc,';
            params += ',?';
        }
        params += ',?)';
        sql += 'uid) values ';
        //用户的id
        datas.push(req.session.user.id);
        // console.log(sql);
        // console.log(params);
        //插入音乐数据
        db.q(sql + params ,datas,(err,data)=>{
            res.json({
                code:'001',
                msg:'添加音乐成功'
            });
        });
    });
};
/**
 * [更新音乐]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.updateMusic = (req,res,next)=>{
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(config.rootPath,'public/files');
    form.parse(req, function(err, fields, files) {
        if(err) return next(err);
        //获取6个字段中的3个
        let sql = 'update musics set title=?,singer=?,time=?,';
        let datas = [fields.title,fields.singer,fields.time]; 
        //两个路径
        if(files.file){
            //获取文件名
            let filename = path.parse(files.file.path).base;
            //如果上传了文件
            datas.push(`/public/files/${filename}`);
            sql += 'file=?,';
        }
        if(files.filelrc){
            //获取文件名
            let lrcname = path.parse(files.filelrc.path).base;
            //如果上传了文件
            datas.push(`/public/files/${lrcname}`);
            sql += 'filelrc=?,';
        }
        //去除一个逗号
        sql = sql.substr(0,sql.length -1);
        //加上条件
        sql += 'where id = ?';
        datas.push(fields.id);
        //更新音乐数据
        db.q(sql,datas,(err,data)=>{
            res.json({
                code:'001',
                msg:'更新音乐成功'
            });
        });
    });
};
/**
 * 删除音乐
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.delMusic = (req,res,next)=>{

    //获取用户id
    let userid = req.session.user.id;

    //1:接收参数
    let musicId = req.query.id;
    //2:db删除数据
    db.q('delete from musics where id = ? and uid = ?',[musicId,userid],(err,result)=>{
        if(err) return next(err);
        // console.log(result);
        //判断是否删除成功
        if(result.affectedRows == 0){
            //歌曲不存在
            return res.json({
                code:'002',msg:'歌曲不存在'
            });
        }
        //删除成功
        res.json({
            code:'001',msg:'删除成功'
        });
    });
};
/**
 * 添加音乐
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.showAddMusic = (req,res,next)=>{
    res.render('add.html');
}
/**
 * 音乐列表
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.showListMusic = (req,res,next)=>{
    let userId = req.session.user.id;
    //以用户id作为查询条件查询音乐表
    db.q('select * from musics where uid = ?',[userId],(err,musics)=>{
        res.render('list.html',{
            //循环，给每个元素加一个索引，利用模板引擎的index属性+1
            musics, //musics:musics ES6简写
            // user:req.session.user
        })
    })
}

/**
 * [显示编辑]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.showEdit = (req,res,next)=>{
    //1:url上的path方式参数接收
    let musicId = req.params.id;
    // console.log(musicId);
    //2: 查询数据库
    db.q('select * from musics where id = ?',[musicId],(err,musics)=>{
        //判断是否有这个歌曲
        if(musics.length == 0){
            return res.json({
                code:'001',
                msg:'没有该歌曲'
            });
        }

        //将数据与页面渲染到客户端
        res.render('edit.html',{
            music:musics[0]
        })

    })
}