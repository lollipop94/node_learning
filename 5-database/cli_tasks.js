// 基于文件的存储
// 基于Web的待办事项程序创建一个简单的命令行版本
var fs = require('fs')
var path = require('path')
var args = process.argv.splice(2) // 去掉“node cli_task.js”，只留下参数
var command = args.shift() // 取出第一个参数（命令）
var taskDescription = args.join(' ') // 合并剩余的参数
var file = path.join(process.cwd(), '/.tasks') // 根据当前的工作目录解析数据库的相对路径

// 从文本文件中加载用JSON编码的数据
var loadOrInitializeTaskArray = function (file, cb) {
    fs.exists(file, function (exists) {
        var tasks = []
        if (exists) {
            fs.readFile(file, 'utf8', function (err, data) { // 从.task文件中读取待办事项数据
                if (err) {
                    throw err
                }
                var data = data.toString()
                tasks = JSON.parse(data || '[]') // 把用JSON编码的待办事项数据解析到任务数组中
                cb(tasks)
            })
        } else { // 如果.task文件不存在，则创建空的任务数组
            cb([])
        }
    })
}

// 列出任务
var listTasks = function (file) {
    loadOrInitializeTaskArray(file, function (tasks) {
        for (var i in tasks) {
            console.log(tasks[i])
        }
    })
}

// 把任务保存到磁盘
var storeTasks = function (file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
        if (err) {
            throw err
        }
        console.log('Saved.')
    })
}

// 添加一项任务
var addTask = function addTask(file, taskDescription) {
    loadOrInitializeTaskArray(file, function (tasks) {
        tasks.push(taskDescription)
        storeTasks(file, tasks)
    })
}

switch (command) {
    case 'list':
        listTasks(file)
        break
    case 'add':
        addTask(file, taskDescription)
        break
    default:
        console.log('Usage: ' + process.argv[0] + ' list|add [taskDescription]')
}

// node cli_tasks.js add Floss the cat.
// node cli_tasks.js add Buy some hats.
// node cli_tasks.js list