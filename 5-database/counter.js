// 内存存储，用来跟踪记录与聊天用户和任务相关的详细信息，用变量存放数据
// 跟踪记录最近一次重启服务器后页面访问次数的计数器
var http = require('http')
var counter = 0

var server = http.createServer(function (req, res) {
    counter++
    res.write('I have been accessed ' + counter + ' times.')
    res.end()
})

server.listen(8888)