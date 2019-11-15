const { pool, router, resJson } = require('./public/connect')
var moment = require('moment')
const {userSQL, lineManagement } = require('./public/sql')
const jwt = require('jsonwebtoken') // 用于生成token
/**
 * 用户登录功能
 */
console.log(moment().format().split('+')[0]);
router.get('/user/login', (req, res) => {
    let user = {
        username: req.query.name,
        password: req.query.password
    }
    let _res = res;
    // 判断参数是否为空
    if (!user.username) {
        return resJson(_res, {
            code: -1,
            msg: '用户名不能为空'
        })
    }
    if (!user.password) {
        return resJson(_res, {
            code: -1,
            msg: '密码不能为空'
        })
    }
    let _data;
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        conn.query(userSQL.queryByNamePassword, [user.username, user.password], (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            //通过用户名和密码索引查询数据，有数据说明用户存在且密码正确，只能返回登录成功，否则返回用户名不存在或登录密码错误
            if (result && result.length) {
                console.log(result);
                const token = jwt.sign({
                    name: result.username,
                    rolId:result.rol_id 
                },'my_token',{expiresIn: '1h'});
                console.log(token);
                _data = {
                    code: 0,
                    msg: '登录成功',
                    data: {
                        userInfo: {
                            username: user.username,
                            token: token
                        }
                    },
                }
                console.log(_data);
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

router.get('/user/allUsers',(req,res) => { // 获取所有
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(userSQL.queryAll, (e, result) => {
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


/**
 * 注册用户功能
 */

router.get('/user/register', (req, res) => {
    // 获取前台页面传过来的参数
    let user = {
        id: req.query.id,
        username: req.query.name,
        realname: req.query.realname,
        password: req.query.password,
        create_time: moment().format().split('+')[0]
    }
    let _res = res;
    // 判断参数是否为空
    if (!user.id) {
        return resJson(_res, {
            code: -1,
            msg: '账号不能为空'
        })
    }
    if (!user.username) {
        return resJson(_res, {
            code: -1,
            msg: '用户名不能为空'
        })
    }
    if (!user.realname) {
        return resJson(_res, {
            code: -1,
            msg: '真实姓名不能为空'
        })
    }
    if (!user.password) {
        return resJson(_res, {
            code: -1,
            msg: '密码不能为空'
        })
    }
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(userSQL.queryByName, user.username, (e, r) => {
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
                    conn.query(userSQL.insert, user, (err, result) => {
                        if (result) {
                            _data = {
                                code: 0,
                                msg: '注册成功'
                            }
                        } else {
                            _data = {
                                code: -1,
                                msg: '注册失败',
                                time: moment().format()
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

router.get('/user/updatePassword', (req, res) => {
    let user = {
        username: req.query.name,
        oldPassword: req.query.oldPassword,
        newPassword: req.query.newPassword,
        againPassword: req.query.againPassword,
        update_time: moment().format('YYYY/M/DD HH:mm')
    }
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
    if (!user.againPassword || user.againPassword !== user.newPassword) {
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

/**
 * 删除用户
 */

router.get('/user/deleteUser', (req, res) => {
    // 获取前台页面传过来的参数
    let user = {
        username: req.query.name
    }
    let _res = res;
    // 判断参数是否为空
    if (!user.username) {
        return resJson(_res, {
            code: -1,
            msg: '用户名不能为空'
        })
    }
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(userSQL.queryByName, user.username, (e, r) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            if (r) {
                //判断用户列表是否为空
                if (r.length) {
                    //如不为空，则说明存在此用户
                    conn.query(userSQL.deleteUser, user.username, (err, result) => {
                        if (err) _data = {
                            code: -1,
                            msg: e
                        }
                        if (result) {
                            _data = {
                                msg: '删除用户操作成功'
                            }
                        }
                    })
                } else {
                    _data = {
                        code: -1,
                        msg: '用户不存在，操作失败'
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
/**
 * 操作记录
 */
router.get('/user/operator', (req, res) => {
    // 获取前台页面传过来的参数
    let operator = {
        operator_id: req.query.operator_id,
        operator_name: req.query.operator_name,
        operator_data: req.query.operator_data,
        operator_type: req.query.operator_type,
        operator_time: moment().format().split('+')[0]
    }
    let _res = res;
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
                    //插入用户操作记录数据
                    conn.query(userSQL.operationRecord, operator, (err, result) => {
                        if (result) {
                            _data = {
                                code: 0,
                                msg: '成功'
                            }
                        } else {
                            _data = {
                                code: -1,
                                msg: '失败',
                            }
                        }
                    })
            setTimeout(() => {
                //把操作结果返回给前台页面
                resJson(_res, _data)
            }, 200);
            pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
        })
    })

/**
 * 查询所有用户操作记录
 */
router.get('/user/alloperators',(req,res) => { // 获取所有
    let _res = res;
    pool.getConnection((err, conn) => {
        conn.query(userSQL.getOperationRecord, (e, result) => {
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

module.exports = router;