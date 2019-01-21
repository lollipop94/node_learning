// 挂载中间件和服务器
var connect = require('connect')

var logger = function (req, res, next) {
    console.log('%s %s', req.method, req.url)
    next()
}

var restrict = function (req, res, next) {
    var authorization = req.headers.authorization
    if (!authorization) {
        return next(new Error('Unauthorized'))
    }
    var parts = authorization.split(' ')
    var schema = parts[0]
    var auth = new Buffer(parts[1], 'base64').toString().split(':')
    var user = auth[0]
    var pass = auth[1]
    authenticateWithDatabase(user, pass, function (err) { // 根据数据库中的记录检查认证信息
        if (err) {
            return next(err)
        }
        next()
    })
}

var admin = function (req, res, next) {
    switch (req.url) {
        case '/':
            res.end('try/users')
            break
        case '/users':
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(['tobi', 'loki', 'jane']))
            break
    }
}

var hello = function (req, res) {
    res.setHeader('Content-Type', 'text/plain')
    res.end('hello world')
}

connect()
    .use(logger)
    .use('/admin', restrict)
    .use('/admin', admin)
    .use(hello)
    .listen(3000)