const userSQL = {
    queryAll: 'select * from hsrm_user',   // 查询所有系统用户
    queryByName: 'select * from  hsrm_user where username=?',  // 通过用户名索引查询用户
    queryByNamePassword: 'select * from  hsrm_user where username=? and password=?',  // 通过用户名和密码索引查询用户
    insert: 'insert into hsrm_user set ?',  // 新增用户
    updateUser: 'update hsrm_user set ? where username=?',// 更新用户信息
    deleteUser: 'delete from hsrm_user where username=?', // 删除用户
    islogin: 'update hsrm_user set active=1 where username=?', // 用户在线状态
    isloginout: 'update hsrm_user set active=0 where username=?', // 用户离线状态
    operationRecord: 'insert into user_log set ?', // 用户操作记录
    getOperationRecord: 'select * from user_log', // 查询所有操作记录
    deleOperator: 'delete from user_log where operator_id=?', // 删除操作日志
    uplodadImg: 'update hsrm_user set avatar= ? where username=?' // 上传头像
}

const lineManagement = {
    queryAllLine: 'select * from hsrm_line', // 查询所有线路信息
    queryByNum: 'select * from  hsrm_line where line_num=?', // 根据线路编号查找
    insert: 'insert into hsrm_line set ?', // 增加线路
    deleteLine: 'delete from hsrm_line where line_num=?', // 根据线路编号删除
    updateLine: 'update hsrm_line set ? where line_num=?' // 根据线路编号更新数据
}

const highSpeedRailManagement = {
    queryAllHighSpeedRail: 'select * from hsrm_highspeed_rail', // 查询所有线路信息
    queryById: 'select * from  hsrm_highspeed_rail where hs_carId=?', // 根据列车编号查找
    insert: 'insert into hsrm_highspeed_rail set ?', // 增加列车
    deleteRail: 'delete from hsrm_highspeed_rail where hs_carId=?', // 根据列车编号删除
    updateRail: 'update hsrm_highspeed_rail set ? where hs_carId=?' // 根据列车编号更新数据
}

const highSpeedTicketsManagement = {
    queryAllTickets: 'select * from hsrm_ticket', // 查询所有车票
    queryById: 'select * from  hsrm_ticket where hs_railId=?', // 根据列车编号查找
    insert: 'insert into hsrm_ticket set ?', // 新增车票
    deleteTicket: 'delete from hsrm_ticket where id=?', // 根据车票编号删除
    updateTicket: 'update hsrm_ticket set ? where id=?' // 根据车票编号更新数据
}

const orderManagement = {
    insert: 'insert into hsrm_order_ticket set ?', // 订票
    queryByPhoneNum: 'select * from  hsrm_order_ticket where phoneNum=?', // 根据手机号查找
    deleteOrder: 'delete from hsrm_order_ticket where id=?' // 删除订票
}

const fontUser = {
    register: 'insert into hsrm_font_user set ?', // 订票用户注册
    queryByPhone: 'select * from  hsrm_font_user where phoneNum=?',  // 通过手机号查询用户
    login: 'select * from  hsrm_font_user where phoneNum=? and password=?', // 登录
    allFontUser: 'select * from  hsrm_font_user' // 查询
}

module.exports = {
    userSQL,
    fontUser,
    lineManagement,
    highSpeedRailManagement,
    highSpeedTicketsManagement,
    orderManagement
}