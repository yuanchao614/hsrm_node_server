const userSQL = {
    queryAll: 'select * from user',   // 查询所有用户
    queryByName: 'select * from  user where username=?',  // 通过用户名索引查询用户
    queryByNamePassword: 'select * from  user where username=? and password=?',  // 通过用户名和密码索引查询用户
    insert: 'insert into user set ?',  // 插入新用户
    updateUser: 'update user set ? where username=?',// 更新用户信息
    deleteUser: 'delete from user where username=?', // 删除用户
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