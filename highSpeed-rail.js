const { pool, router, resJson } = require('./public/connect')
const { highSpeedRailManagement} = require('./public/sql')


router.get('/highSpeedRailManagement/deleteRailById',(req,res) => { // 根据id删除
    const id = req.query.id
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(highSpeedRailManagement.deleteRail, id, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //删除成功时
            if (result.affectedRows > 0) {
                _data = {
                    code: 3003,
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


router.get('/highSpeedRailManagement/getHighSpeedRail',(req,res) => { // 获取所有高铁线路
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(highSpeedRailManagement.queryAllHighSpeedRail, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //查询成功时
            if (result && result.length) {
                _data = {
                    code: 3001,
                    msg: '查询成功',
                    data: {
                        result
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


router.post('/highSpeedRailManagement/addRail',function(req,res){
    let param = req.body;
    let _res = res;
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(highSpeedRailManagement.queryById, param.hs_carId, (e, r) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            if (r) {
                //判断用户列表是否为空
                if (r.length) {
                    console.log(r.length);
                    //如不为空，则说明存在此用户
                    _data = {
                        code: -1,
                        msg: '高铁编号已存在'
                    }
                } else {
                    //插入用户信息
                    conn.query(highSpeedRailManagement.insert, param, (err, result) => {
                        if (result) {
                            _data = {
                                code: 3002,
                                msg: '添加高铁信息成功'
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
});

router.post('/highSpeedRailManagement/updateRail',function(req,res){
    let param = req.body;
    let _res = res;
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(highSpeedRailManagement.queryById, param.hs_carId, (e, r) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            if (r) {
                //判断用户列表是否为空
                if (r.length) {
                    //如不为空，则说明存在此用户
                    conn.query(highSpeedRailManagement.updateRail, [param, param.hs_carId], (err, result) => {
                        if (result) {
                            _data = {
                                code: 3004,
                                msg: '修改高铁信息成功'
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
});

module.exports = router;