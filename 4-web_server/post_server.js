// POST请求
var http = require('http')
var server = http.createServer(function (req, res) {
    req.setEncoding('utf8') // 如果不加这一句，数据块默认是个Buffer对象（字节数组），加上这一句是一个utf8字符串
    req.on('data', function (chunk) {
        console.log('parsed', chunk)
    })
    req.on('end', function () {
        console.log('done parsing')
        res.end()
    })
})
server.listen(3000)

// 用cURL代替Web浏览器跟Web服务交互
// cURL是一个强大的命令行HTTP客户端，可以用来向目标服务器发送请求
// POST 向待办事项清单中添加事项
// curl -d 'buy node in action' http://localhost:3000