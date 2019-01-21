// 用来启动程序
var http = require('http')
var work = require('./lib/timetrack')
var mysql = require('mysql')

var db = mysql.createConnection({ // 连接MySQL
    host: '127.0.0.1',
    user: 'root',
    password: 'mysql1234',
    database: 'timetrack'
})

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'POST':
            switch (req.url) {
                case '/':
                    work.add(db, req, res)
                    break
                case '/archive':
                    work.archive(db, req, res)
                    break
                case '/delete':
                    work.delete(db, req, res)
                    break
            }
            break
        case 'GET':
            switch (req.url) {
                case '/':
                    work.show(db, res)
                    break
                case '/archive':
                    work.showArchived(db, res)
                    break
            }
            break
    }
})

// 创建数据库表
db.query(
    "CREATE TABLE IF NOT EXISTS work (" +
    "id INT(10) NOT NULL AUTO_INCREMENT, " +
    "hours DECIMAL(5,2) DEFAULT 0, " +
    "date DATE, " +
    "archived INT(1) DEFAULT 0, " +
    "description LONGTEXT, " +
    "PRIMARY KEY(id))",
    function (err) {
        if (err) {
            throw err
        }
        console.log('Server started...')
        server.listen(3000, '127.0.0.1')
    }
)

/*
报错：-bash: mysql: command not found
解决：sudo ln -s /usr/local/mysql/bin/mysql /usr/local/bin
 */

// mysql -u root -p

// show databases;
// create database timetrack;
// use timetrack;

/*
报错：
Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server;
解决：
alter user 'root'@'localhost' identified with mysql_native_password by 'mysql1234';
flush privileges;
 */