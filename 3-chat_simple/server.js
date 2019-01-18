var http = require('http'); // 内置的http模块提供了HTTP服务器和客户端功能
var fs = require('fs'); // fs模块用于对系统文件及目录进行读写操作
var path = require('path'); // 内置的path模块提供了与文件系统路径相关的功能
var mime = require('mime'); // 附加的mime模块有根据文件扩展名得出MIME类型的能力
var cache = {}; // 用来缓存文件内容的对象

// 在所请求的文件不存在时发送404错误
function send404(res) {
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    res.write('Error 404: resource not found.');
    res.end();
}

// 提供文件数据服务
function sendFile(res, filePath, fileContents) {
    res.writeHead(200, {
        // 在mime 2.x.x版本修改了函数名，lookup()重命名为getType()
        'content-type': mime.getType(path.basename(filePath))
    });
    res.end(fileContents);
}

// 提供静态文件服务
function serveStatic(res, cache, absPath) {
    // 检查文件是否缓存在内存中
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]); // 从内存中返回文件
    } else {
        fs.exists(absPath, function (exits) {
            // 检查文件是否存在
            if (exits) {
                fs.readFile(absPath, function (err, data) { // 从硬盘中读取文件
                    if (err) {
                        send404(res);
                    } else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            } else {
                send404(res);
            }
        });
    }
}

// 创建HTTP服务器，用匿名函数定义对每个请求的处理行为
var server = http.createServer(function (req, res) {
    var filePath = false;
    if (req.url == '/') {
        filePath = 'public/index.html'; // 默认HTML文件
    } else {
        filePath = 'public' + req.url; // 将URL路径转为文件的相对路径
    }
    var absPath = './' + filePath;
    serveStatic(res, cache, absPath); // 返回静态文件
});

// 启动HTTP服务器
server.listen(3000, function () {
    console.log("Server listening on port 3000.")
});

// 设置Socket.IO服务器
var chatServer = require('./lib/chat_server');
chatServer.listen(server); // 启动Socket.IO服务器