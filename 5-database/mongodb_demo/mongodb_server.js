var mongoClient = require('mongodb').MongoClient
var url = 'mongodb://127.0.0.1:27017'
var dbName = 'mydatabase'

mongoClient.connect(url, function (err, client) {
    if (err) {
        throw err
    }
    console.log('connect successful.')
    var db = client.db(dbName)
    var collection = db.collection('test_insert')
    // 查询
    collection.find().toArray(function (err, res) {
        if (err) {
            throw err
        }
        console.log(res)
    })
    collection.find({
        "title": "I like cake"
    }).toArray(function (err, res) {
        if (err) {
            throw err
        }
        console.log('result: ' + res)
    })
    // 插入
    var obj = [{
        "title": "I like cake",
        "body": "It is quite good."
    }, {
        "title": "I like apple",
        "body": "It is good."
    }]
    collection.insert(obj, {
            safe: true
        },
        function (err, documents) {
            if (err) {
                throw err
            }
            console.log(documents)
        }
    )
    // 更新数据
    var str = {
        "title": "I like cake"
    }
    collection.update(str, {
            $set: {
                "title": "I ate too much cake"
            }
        }, {
            safe: true
        },
        function (err, documents) {
            if (err) {
                throw err
            }
            console.log('update successful.')
        }
    )
    // 删除
    collection.deleteMany({
        "title": "I like cake"
    }, {
        safe: true
    }, function (err) {
        if (err) {
            throw err
        }
        console.log('delete successful.')
    })
})

// 启动mongoDB：mongo
// http://127.0.0.1:27017/
// 创建数据库
// use mydatabase')
// db.createCollection('test_insert

// var mongodb = require('mongodb')
// var server = new mongodb.Server('127.0.0.1', 27017, {})
// var client = new mongodb.Db('mydatabase', server, {
//     w: 1
// })

// // 访问MongoDB集合
// client.open(function (err) {
//     if (err) {
//         throw err
//     }
//     client.collection('test_insert', function (err, collection) {
//         if (err) {
//             throw err
//         }
//         console.log('We are now able to perform queries.')

//         // 将文档插入集合中
//         collection.insert({
//                 "title": "I like cake",
//                 "body": "It is quite good."
//             }, {
//                 safe: true
//             },
//             function (err, documents) {
//                 if (err) {
//                     throw err
//                 }
//                 console.log('Document ID is: ' + documents[0]._id)
//             }
//         )

//         // 用文档ID更新数据
//         var _id = new client.bson_serializer.ObjectID('4e650d344ac74b5a01000001')
//         collection.update({
//                 _id: _id
//             }, {
//                 $set: {
//                     "title": "I ate too much cake"
//                 }
//             }, {
//                 safe: true
//             },
//             function (err) {
//                 if (err) {
//                     throw err
//                 }
//             }
//         )

//         // 搜索文档
//         collection.find({
//             "title": "I like cake"
//         }).toArray(
//             function (err, results) {
//                 if (err) {
//                     throw err
//                 }
//                 console.log(results)
//             }
//         )

//         // 删除文档
//         var _id = new client.bson_serializer.ObjectID('4e650d344ac74b5a01000001')
//         collection.remove({
//             _id: _id
//         }, {
//             safe: true
//         }, function (err) {
//             if (err) {
//                 throw err
//             }
//         })
//     })
// })