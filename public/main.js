const { app, pool } =require('./connect')
const user = require('../user')
const heroes = require('../heroes')
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
app.use('/api', heroes)
app.listen(3000, () => {
    console.log('服务启动','localhost:3000')
})