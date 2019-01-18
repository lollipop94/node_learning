// 把一张图片流到客户端
var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'image.png'
    });
    // 数据从文件中读进来（fs.createReadStream），然后数据随着进来就被送到（.pipe）客户端（res）
    fs.createReadStream('./image.png').pipe(res); // 设置一个从读取流到写出流的管道
}).listen(3000);

console.log('Server running at http://localhost:3000/');