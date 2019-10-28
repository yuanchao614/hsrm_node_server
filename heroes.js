const { pool, router, resJson } = require('./public/connect')
const userSQL = require('./public/sql')

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

module.exports = router;