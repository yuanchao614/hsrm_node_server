const {
    pool,
    router,
    resJson
} = require('./public/connect')
const {
    orderManagement
} = require('./public/sql')


router.get('/highSpeedOrderManagement/deleteOrder', (req, res) => { // 根据id删除
    const id = req.query.id
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(orderManagement.deleteOrder, id, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //删除成功时
            if (result.affectedRows > 0) {
                _data = {
                    code: 200,
                    msg: '删除车票订单成功',
                    data: {
                    }
                }
            } else if (result.affectedRows == 0) {
                _data = {
                    code: -1,
                    msg: '删除订单不存在'
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


router.get('/highSpeedOrderManagement/queryByPhoneNum', (req, res) => { // 获取所车票
    const phone = req.query.phoneNum;
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(orderManagement.queryByPhoneNum, phone, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //查询成功时
            if (result && result.length) {
                _data = {
                    code: 200,
                    msg: '查询订票成功',
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


router.post('/highSpeedOrderManagement/addOrder', function (req, res) { // 订票
    let param = req.body;
    let _res = res;
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在

        //插入用户信息
        conn.query(orderManagement.insert, param, (err, result) => {
            console.log(result)
            if (result) {
                _data = {
                    code: 200,
                    msg: '订票成功'
                }
            } else {
                _data = {
                    code: -1,
                    msg: '订票失败'
                }
            }
            setTimeout(() => {
                //把操作结果返回给前台页面
                resJson(_res, _data)
            }, 200);
        }
        )
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
    console.log(req.body);
})


module.exports = router;