const { app, pool } =require('./connect')
const bodyParser = require('body-parser');
app.use(bodyParser());
app.use(bodyParser.urlencoded({
	extended: false
}))
const user = require('../user')
const font_user = require('../font-user')
const hsrm_line = require('../highSpeed-line')
const hsrm_highSpeedRail = require('../highSpeed-rail')
const hsrm_ticket = require('../highSpeed-ticket')
const hsrm_order = require('../highSpeed-order')

app.all('*', (req, res, next) => {
    //这里处理全局拦截，一定要写在最上面
    next()
})
app.all('/', (req, res) => {
    pool.getConnection((err, conn) => {
        res.json({ type: 'test'})
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
app.use('/api', user)
app.use('/api', font_user)
app.use('/api', hsrm_line)
app.use('/api', hsrm_highSpeedRail)
app.use('/api', hsrm_ticket)
app.use('/api', hsrm_order)
app.listen(3000, () => {
    console.log('hsrm后台node服务启动成功','端口: localhost:3000')
})