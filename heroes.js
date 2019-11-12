const { pool, router, resJson } = require('./public/connect')
const {userSQL, lineManagement} = require('./public/sql')

router.get('/getheros',(req,res) => { // 获取所有
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(userSQL.queryAllHeroes, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //查询成功时
            if (result && result.length) {
                _data = {
                    code: 0,
                    msg: '查询成功',
                    data: {
                        result
                    }
                }
            } else {
                _data = {
                    code: -1,
                    msg: '获取失败'
                }
            }
            resJson(_res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
});

router.get('/gethero',(req,res) => { // 根据id查询
    const id = req.query.id
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(userSQL.queryHeroById, id, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //查询成功时
            if (result && result.length) {
                _data = {
                    code: 0,
                    msg: '查询成功',
                    data: {
                        result
                    }
                }
            } else {
                _data = {
                    code: -1,
                    msg: '获取失败'
                }
            }
            resJson(_res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
});

router.get('/delhero',(req,res) => { // 根据id删除
    const id = req.query.id
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(userSQL.delHeroById, id, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //删除成功时
            if (result.affectedRows > 0) {
                _data = {
                    code: 0,
                    msg: '删除成功',
                    data: {
                        result
                    }
                }
            } else if (result.affectedRows == 0) {
                _data = {
                    code: -1,
                    msg: '删除数据不存在'
                } 
            } else {
                _data = {
                    code: -1,
                    msg: '删除失败'
                }
            }
            resJson(_res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
});

router.post('/addhero',(req,res) => { // 添加
    // const data = {
    //     id : req.query.id,
    //     name : req.query.name,
    //     age : req.query.age,
    //     address : req.query.address
    // }
    const data = req.body;
    console.log(data);
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(userSQL.addHero, data, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //添加成功时
            if (result) {
                _data = {
                    code: 0,
                    msg: '添加成功',
                    data: {
                        result
                    }
                }
            }  else {
                _data = {
                    code: -1,
                    msg: '添加失败'
                }
            }
            resJson(_res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
});

router.get('/getline',(req,res) => { // 获取所有
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(lineManagement.queryAllLine, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //查询成功时
            if (result && result.length) {
                const pass_stationList = [];
                result.forEach(item => {
                    const list = getArry(item.pass_station);
                    pass_stationList.push(list);
                })
                _data = {
                    code: 0,
                    msg: '查询成功',
                    data: {
                        result,
                        pass_station: pass_stationList
                    },
                }
            } else {
                _data = {
                    code: -1,
                    msg: '获取失败'
                }
            }
            resJson(_res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
});

function getArry(data) {
    const arryList = [];
    const arry = data.split(',');
    arry.forEach(item => {
        arryList.push(item)
    });
    return arryList;
}

module.exports = router;