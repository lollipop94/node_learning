// // 创建一些假数据
// var photos = []
// photos.push({
//     name: 'Node.js Logo',
//     path: 'http://nodejs.org/images/logos/nodejs-green.png'
// })

// photos.push({
//     name: 'Ryan Speaking',
//     path: 'http://nodejs.org/images/ryan-speaker.jpg'
// })

// exports.list = function (req, res) {
//     res.render('photos', {
//         title: 'Photos',
//         photos: photos
//     })
// }

var Photo = require('../models/Photo') // 引入Photo模型
var path = require('path')
var fs = require('fs')
var join = path.join

// 显示图片列表
exports.list = function (req, res, next) {
    Photo.find({}, function (err, photos) { // {}查出photo集合中的所有记录
    // console.log(photos)
        if (err) {
            return next(err)
        }
        res.render('index', {
            title: 'Photos',
            photos: photos
        })
    })
}

// 显示表单
exports.form = function (req, res) {
    res.render('upload', {
        title: 'Photo upload'
    })
}

// 下载图片
exports.download  = function () {
    return function (req, res, next) {
        var id = req.params.id
        Photo.findById(id, function (err, photo) { // 加载照片记录
            if (err) {
                return next(err)
            }
            var path = 'public/photos/' + photo.path
            // res.sendfile(path) // 传输文件
            res.download(path) // 下载文件
        })
    }
}