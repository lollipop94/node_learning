// 上传文件
var http = require('http')
var formidable = require('formidable')

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'GET':
            show(res)
            break
        case 'POST':
            upload(req, res)
            break
    }
})

server.listen(3000)

var show = function (res) {
    var html = '<html><head><title>Upload file</title></head><body>' +
        '<form method="post" action="/" enctype="multipart/form-data">' +
        '<p><input type="text" name="name" /></p>' +
        '<p><input type="file" name="file" /></p>' +
        '<p><input type="submit" value="Upload" /></p>' +
        '</form></body></html>'
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Length', Buffer.byteLength(html))
    res.end(html)
}

var upload = function (req, res) {
    if (!isFormData(req)) {
        res.statusCode = 400
        res.end('Bad Request')
        return
    }
    var form = new formidable.IncomingForm()

    form.on('field', function (field, value) {
        console.log(field)
        console.log(value)
    })
    form.on('file', function (name, file) {
        console.log(name)
        console.log(file)
    })
    form.on('progress', function (bytesRecived, bytesExpected) {
        var percent = Math.floor(bytesRecived / bytesExpected * 100)
        console.log(percent)
    })
    form.on('end', function () {
        res.end('upload complete!')
    })

    form.parse(req, function (err, fields, files) {
        console.log(fields)
        console.log(files)
        res.end('upload complete!')
    })
}

var isFormData = function (req) {
    var type = req.headers['content-type'] || ''
    return 0 == type.indexOf('multipart/form-data')
}