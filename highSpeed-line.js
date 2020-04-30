const { pool, router, resJson } = require('./public/connect')
const { lineManagement} = require('./public/sql')


router.get('/lineManagement/deleteLineById',(req,res) => { // 根据id删除
    const id = req.query.id
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(lineManagement.deleteLine, id, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //删除成功时
            if (result.affectedRows > 0) {
                _data = {
                    code: 2002,
                    msg: '删除高铁线路信息成功',
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


router.get('/lineManagement/getLine',(req,res) => { // 获取所有高铁线路
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
                // result.forEach(item => {
                //     const list = getArry(item.pass_station);
                //     pass_stationList.push(list);
                // })
                _data = {
                    code: 2001,
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

// 新增线路信息
router.post('/lineManagement/addLine',function(req,res){
    let param = req.body;
    let _res = res;
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(lineManagement.queryByNum, param.line_num, (e, r) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            if (r) {
                //判断用户列表是否为空
                if (r.length) {
                    //如不为空，则说明存在此用户
                    _data = {
                        code: -1,
                        msg: '线路编号已存在'
                    }
                } else {
                    //插入用户信息
                    conn.query(lineManagement.insert, param, (err, result) => {
                        if (result) {
                            _data = {
                                code: 2003,
                                msg: '添加高铁线路信息成功'
                            }
                        } else {
                            _data = {
                                code: -1,
                                msg: '添加失败'
                            }
                        }
                    })
                }
            }
            setTimeout(() => {
                //把操作结果返回给前台页面
                resJson(_res, _data)
            }, 200);
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
    console.log(req.body);
})

// 更新线路信息
router.post('/lineManagement/updateLine',function(req,res){
    let param = req.body;
    let _res = res;
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(lineManagement.queryByNum, param.line_num, (e, r) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            if (r) {
                //判断用户列表是否为空
                if (r.length) {
                    //如不为空，则说明存在此用户
                    conn.query(lineManagement.updateLine, [param, param.line_num], (err, result) => {
                        if (result) {
                            _data = {
                                code: 2004,
                                msg: '修改高铁线路信息成功'
                            }
                        } else {
                            _data = {
                                code: -1,
                                msg: '修改失败'
                            }
                        }
                    })
                }
            }
            setTimeout(() => {
                //把操作结果返回给前台页面
                resJson(_res, _data)
            }, 200);
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
    console.log(req.body);
})


module.exports = router;