// HTTPS
var https = require('https')
var fs = require('fs')

var options = { // 作为配置项的SSL秘钥和证书
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./key-cert.pem')
}

https.createServer(options, function (req, res) {
    res.writeHead(200)
    res.end('hello world\n')
}).listen(3000)

// 生成私钥：openssl genrsa 1024 > key.pem
// 创建证书需要私钥：openssl req -x509 -new -key key.pem > key-cert.pem