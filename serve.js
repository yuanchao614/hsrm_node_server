
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: false
}))
const mysql = require('mysql')
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'yuanchao123456',
    database:'test'
})
conn.connect()
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
 })

// 获取所有的数据

 app.get('/api/getheros',(req,res) => {
    // 定义SQL语句
    const sqlStr = 'select * from person'
    conn.query(sqlStr,(err,results) => {
        console.log(results)
        if(err) return res.json({err_code:1,message:'获取失败',affectedRows:0})
        res.json({
            err_code:0,message:results,affectedRows:0
        })
    })
});

// 根据ID 获取相关数据
app.get('/api/gethero',(req,res) => {
    const id = req.query.id
    const sqlStr = 'select * from person where id = ?' 
    conn.query(sqlStr,id,(err,results) => {
        if(err) return res.json({err_code:1,message:'获取数据失败',affectedRows:0})
        if(results.length !== 1) return res.json({err_code:1,message:'数据不存在',affectedRows:0})
        res.json({
            err_code:0,
            message:results[0],
            affectedRows:0
        })
    })
})

// 根据Id删除
app.get('/api/delhero',(req,res) => {
    const id = req.query.id
    console.log(id);
    const sqlStr = 'DELETE FROM person WHERE id=?;'
    conn.query(sqlStr,id,(err,results) => {
        if(err) return res.json({err_code:1,message:'删除英雄失败',affectedRows:0})
        if(results.affectedRows !== 1) return res.json({err_code:1,message:'删除英雄失败',affectedRows:0})
        res.json({err_code:0,message:'删除英雄成功',affectedRows:results.affectedRows})
    })
})


// 添加数据
app.post('/api/addhero',(req,res) => {
    const id = req.query.id;
    const name = req.query.name;
    const age = req.query.age;
    const address = req.query.address;
    const sqlStr = 'insert into person set id=?,name=?,age=?,address=?'
    conn.query(sqlStr,[id,name,age,address],(err,results) => {
        if(err) return res.json({err_code:1,message:'添加失败',affectedRows:0})
        if(results.affectedRows !== 1) return res.json({err_code:1,message:'添加失败',affectedRows:0})
        res.json({err_code:0,message:'添加成功',affectedRows:results.affectedRows})
    })
})

// update
app.post('/api/updatehero',(req,res) => {
    const id = req.query.id;
    const name = req.query.name;
    const age = req.query.age;
    const address = req.query.address;
    const sqlStr = 'update person set name = ?,age = ?,address=? where id = ?'
    conn.query(sqlStr,[name,age,address,id],(err,results) => {
        if(err) return res.json({err_code:1,message:'更新英雄失败',affevtedRows:0})
        //影响行数不等于1
        if(results.affectedRows !== 1) return res.json({err_code:1,message:'更新的英雄不存在',affectedRows:0})
        res.json({err_code:0,message:'更新成功',affectedRows:results.affectedRows})
    })
})

app.listen(5000, ()=>{
    // 打印一下
    console.log('http://127.0.0.1:5000')
})

function getAll() {
    const uri = 'http://127.0.0.1:5000//api/getheros'
}