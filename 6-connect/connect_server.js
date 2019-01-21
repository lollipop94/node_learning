// 一个简单的Connect程序
var connect = require('connect')

/**
 * 做日志的中间件
 * @param req 请求对象
 * @param res 响应对象
 * @param next 回调函数
 */
var logger = function (req, res, next) {
    console.log('%s %s', req.method, req.url)
    next()
}

/**
 * 响应“hello world”的中间件
 * @param req 
 * @param res 
 */
var hello = function (req, res) {
    res.setHeader('Content-Type', 'text/plain')
    res.end('hello world')
}

var app = connect()
app.use(logger)
    .use(hello)
app.listen(3000)