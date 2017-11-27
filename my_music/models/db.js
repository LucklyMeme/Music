// 引入数据库对象
const mysql = require('mysql');
const config = require('../config');
const pool = mysql.createPool({
    connectionLimit: config.db_connectionLimit,
    host: config.db_host,
    user: config.db_user,
    password: config.db_password,
    database: config.db_database
});

//思考过程
// let q = function(sql,props,callback){
//     pool.getConnection((err, connection)=> {
//         if(err)return callback(err,null);
//         connection.query(sql,props,(error, results)=>{
//             connection.release();
//             //将这两段合二为一
//             if(error) return callback(error,null);
//             callback(null,results);

//             //不管有没有error,让外部判断
//             callback(error,results);
//         })
//     });
// }
// q('select * from users',[],function(err,data){
//     if(err) 有异常
//         否则操作data
// })


//正常代码
let q = function(sql,props,callback){
    pool.getConnection((err, connection)=> {
        if(err)return callback(err,null);
        connection.query(sql,props,(error, results)=>{
            connection.release();
            //不管有没有error,让外部判断
            callback(error,results);
        })
    });
}

//将q向外暴露
module.exports = {
    q:q
};

//let db = require('./db.js');
//  db('select * ')
//  现在的写法就是
//  db.q('select * ')
//  总结： 封装更为灵活，api使用的时候更加语义化