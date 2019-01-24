var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/photo_app') // 建立到localhost上mongodb的连接，用photo_app做数据库

mongoose.connection.on('connected', function () {
    console.log('connect successful')
})

var photoSchema = new mongoose.Schema({
    name: String,
    path: String
})

module.exports = mongoose.model('Photo', photoSchema)