const userSQL = {
    queryAll: 'select * from hsrm_user',   // 查询所有用户
    queryByName: 'select * from  hsrm_user where username=?',  // 通过用户名索引查询用户
    queryByNamePassword: 'select * from  hsrm_user where username=? and password=?',  // 通过用户名和密码索引查询用户
    insert: 'insert into hsrm_user set ?',  // 插入新用户
    updateUser: 'update hsrm_user set ? where username=?',// 更新用户信息
    deleteUser: 'delete from hsrm_user where username=?', // 删除用户
    islogin: 'update hsrm_user set active=1 where username=?', // 用户在线状态
    isloginout: 'update hsrm_user set active=0 where username=?', // 用户离线状态
    operationRecord: 'insert into user_log set ?', // 用户操作记录
    getOperationRecord: 'select * from user_log' // 查询所有操作记录
}

const lineManagement = {
    queryAllLine: 'select * from hsrm_line', // 查询所有线路信息
    queryByNum: 'select * from  hsrm_line where line_num=?', // 根据线路编号查找
    insert: 'insert into hsrm_line set ?', // 增加线路
    deleteLine: 'delete from hsrm_line where line_num=?', // 根据线路编号删除
    updateLine: 'update hsrm_line set ? where line_num=?' // 根据线路编号更新数据
}

module.exports = {
    userSQL,
    lineManagement
}