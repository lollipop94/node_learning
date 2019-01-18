// 请求Node.js自带的http模块，并把它赋值给http变量
var http = require('http');

// 调用http模块提供的函数：createServer，该函数返回一个对象
// 这个对象有一个叫做listen的方法，该方法有一个数值参数，指定这个HTTP服务器监听的端口号
// http.createServer(function (req, res) {
//     res.writeHead(200, {
//         'Content-Type': 'text/plain'
//     });
//     res.end('hello world\n');
// }).listen(3000);

// 换一种写法
var server = http.createServer();
// 为request设置一个事件监听器
server.on('request', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    // res.write('hello world\n');
    // res.end();
    // 上面两句可以合为下面一句
    res.end('hello world\n');
});
// 绑定端口
server.listen(3000);

console.log('Server running at http://localhost:3000/');

/*
Node HTTP服务器上的整个HTTP请求生命周期如下：
1、HTTP客户端，比如Web浏览器，发起了一个HTTP请求；
2、Node接受连接，以及发送给HTTP服务器的请求数据；
3、HTTP服务器解析完HTTP头，将控制权转交给请求回调函数；
4、请求回调执行应用逻辑；
5、响应通过HTTP服务器送回去，由它为客户端构造格式正确的HTTP响应。
*/