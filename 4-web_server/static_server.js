// 静态文件服务器
var http = require('http')
var parse = require('url').parse
var join = require('path').join
var fs = require('fs')

var root = __dirname // __dirname的值是该文件所在目录的路径

var server = http.createServer(function (req, res) {
    var url = parse(req.url)
    var path = join(root, url.pathname)

    // 检查文件是否存在，并在响应中提供Content-Length
    fs.stat(path, function (err, stat) {
        if (err) {
            if ('ENOENT' == err.code) {
                res.statusCode = 404
                res.end('Not Found')
            } else {
                res.statusCode = 500
                res.end('Internal Server Error')
            }
        } else {
            res.setHeader('Content-Length', stat.size)
            var stream = fs.createReadStream(path)
            // stream.on('data', function (chunk) {
            //     res.write(chunk)
            // })
            // stream.on('end', function () {
            //     res.end()
            // })
            stream.pipe(res)
            // 处理服务器错误
            stream.on('error', function (err) {
                res.statusCode = 500
                res.end('Internal Server Error')
            })
        }
    })
})

server.listen(3000)