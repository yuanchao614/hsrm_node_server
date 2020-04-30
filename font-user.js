const {
    pool,
    router,
    resJson
} = require('./public/connect')
var moment = require('moment')
const {
    fontUser,
    lineManagement
} = require('./public/sql')
const jwt = require('jsonwebtoken') // 用于生成token
/**
 * 用户登出功能
 */
router.get('/user/loginout', (req, res) => {
    let user = {
        username: req.query.name
    }
    let _res = res;
    if (!user.username) {
        return resJson(_res, {
            code: -1,
            msg: '用户名不能为空'
        })
    }
    let _data;
    // 从连接池获取链接
    pool.getConnection((err, conn) => {
        conn.query(userSQL.queryByName, user.username, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            console.log(123);
            // 如果查询到有用户
            if (result && result.length) {
                console.log(456);
                _data = {
                    code: 0,
                    msg: '查询成功/退出登录',
                    data: {
                        userInfo: {
                            username: user.username,
                        }
                    }
                }
                conn.query(userSQL.isloginout, user.username, (err, result) => {
                    // console.log(err)
                    if (result) {
                        _data = {
                            msg: '成功'
                        }
                    } else {
                        _data = {
                            code: -1,
                            msg: '失败'
                        }
                    }
                })
            } else {
                _data = {
                    code: -1,
                    msg: '用户名不存在'
                }
            }
            resJson(_res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
/**
 * 用户登录功能
 */
router.post('/fontUser/login', (req, res) => {
    // let user = {
    //     username: req.query.name,
    //     password: req.query.password
    // }
    let user = req.body;
    let _res = res;
    // // 判断参数是否为空
    // if (!user.username) {
    //     return resJson(_res, {
    //         code: -1,
    //         msg: '用户名不能为空'
    //     })
    // }
    // if (!user.password) {
    //     return resJson(_res, {
    //         code: -1,
    //         msg: '密码不能为空'
    //     })
    // }
    let _data;
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        conn.query(fontUser.login, [user.phoneNum, user.password], (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //通过用户名和密码索引查询数据，有数据说明用户存在且密码正确，只能返回登录成功，否则返回用户名不存在或登录密码错误
            if (result && result.length) {
                console.log(result);
                const token = jwt.sign({
                    name: result.username,
                    rolId: result.rol_id
                }, 'my_token', {
                    expiresIn: '1h'
                });
                console.log(token);
                _data = {
                    code: 200,
                    msg: '登录成功',
                    data: {
                        userInfo: {
                            phoneNum: user.phoneNum,
                            username: result.name,
                            token: token
                        }
                    },
                }
            } else {
                _data = {
                    code: -1,
                    msg: '用户名不存在或登录密码错误'
                }
            }
            resJson(_res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})

/**
 * 查看所有用户
 */

router.get('/fontUser/allFontUser', (req, res) => { // 获取所有
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(fontUser.allFontUser, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //查询成功时
            if (result && result.length) {
                _data = {
                    code: 200,
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

/**
 * 注册用户功能
 */

router.post('/fontUser/register', (req, res) => {
    let user = req.body;
    console.log(user);
    let _res = res;
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(fontUser.queryByPhone, user.phoneNum, (e, r) => {
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
                        msg: '用户已存在'
                    }
                } else {
                    //插入用户信息
                    conn.query(fontUser.register, user, (err, result) => {
                        console.log(result);
                        if (result) {
                            _data = {
                                code: 200,
                                msg: '注册成功'
                            }
                        } else {
                            _data = {
                                code: -1,
                                msg: '注册失败',
                                // time: moment().format()
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
})

/**
 * 修改密码
 */

router.post('/user/updatePassword', (req, res) => {
    let user = req.body;
    console.log(user.update_time);
    let _res = res;
    // 判断参数是否为空
    if (!user.username) {
        return resJson(_res, {
            code: -1,
            msg: '用户名不能为空'
        })
    }
    if (!user.oldPassword) {
        return resJson(_res, {
            code: -1,
            msg: '旧密码不能为空'
        })
    }
    if (!user.newPassword) {
        return resJson(_res, {
            code: -1,
            msg: '新密码不能为空'
        })
    }
    if (!user.conformPassword || user.conformPassword !== user.newPassword) {
        return resJson(_res, {
            code: -1,
            msg: '请确认新密码或两次新密码不一致'
        })
    }
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(userSQL.queryByNamePassword, [user.username, user.oldPassword], (e, r) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            if (r) {
                //判断用户列表是否为空
                if (r.length) {
                    //如不为空，则说明存在此用户且密码正确
                    conn.query(userSQL.updateUser, [{
                        password: user.newPassword,
                        update_time: user.update_time
                    }, user.username], (err, result) => {
                        // console.log(err)
                        if (result) {
                            _data = {
                                msg: '密码修改成功'
                            }
                        } else {
                            _data = {
                                code: -1,
                                msg: '密码修改失败'
                            }
                        }
                    })

                } else {
                    _data = {
                        code: -1,
                        msg: '用户不存在或旧密码输入错误'
                    }
                }
            }
            setTimeout(() => {
                //把操作结果返回给前台页面
                resJson(_res, _data)
            }, 200);
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})

module.exports = router;