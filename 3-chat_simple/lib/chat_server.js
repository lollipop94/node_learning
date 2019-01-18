/*
该模块提供的逻辑用来处理基于Socket.IO的服务端聊天功能
*/

// 初始化一些定义聊天状态的变量
var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

// 启动Socket.IO服务器
exports.listen = function (server) {
    io = socketio.listen(server); // 启动Socket.IO服务器。允许它搭载在已有的HTTP服务器上
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) { // 定义每个用户连接的处理逻辑
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);
        socket.on('rooms', function () { // 用户发出请求时，向其提供已经被占用的聊天室的列表
            // socket.emit('rooms', io.sockets.manager.rooms); // socket.io版本问题导致报错
            socket.emit('rooms', io.of('/').adapter.rooms);
        });
        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};

// 分配用户昵称
var assignGuestName = function (socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest' + guestNumber; // 生成新昵称
    nickNames[socket.id] = name; // 把用户昵称跟客户端连接ID关联上
    socket.emit('nameResult', { // 让用户知道他们的昵称
        success: true,
        name: name
    });
    namesUsed.push(name); // 存放已经被占用的昵称
    return guestNumber + 1; // 增加用来生成昵称的计数器
}

// 进入聊天室
var joinRoom = function (socket, room) {
    socket.join(room); // 让用户进入房间
    currentRoom[socket.id] = room; // 记录用户的当前房间
    socket.emit('joinResult', { // 让用户知道他们进入了新的房间
        room: room
    });
    socket.broadcast.to(room).emit('message', { // 让房间里的其他用户知道有新用户进入了房间
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });
    // var usersInRoom = io.sockets.clients(room); // socket.io版本问题导致报错
    var usersInRoom = io.of('/').in(room).clients; // 确定有哪些用户在这个房间里
    if (usersInRoom.length > 1) { // 如果不止一个用户在这个房间里，汇总下都是谁
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message', { // 将房间里其他用户的汇总发送给这个用户
            text: usersInRoomSummary
        });
    }
}

// 处理昵称变更请求
var handleNameChangeAttempts = function (socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function (name) { // 添加nameAttempt事件的监听器
        if (name.indexOf('Guest') == 0) { // 昵称不能以Guest开头
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest".'
            });
        } else {
            if (namesUsed.indexOf(name) == -1) { // 如果昵称还没注册就注册上
                var previousName = nickNames[socket.id];
                var previoousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previoousNameIndex]; // 删掉之前用额昵称，让其他用户可以使用
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
            } else { // 如果昵称已经被占用，给客户端发送错误消息
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                });
            }
        }
    });
}

// 发送聊天消息
var handleMessageBroadcasting = function (socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        });
    });
}

// 创建房间
var handleRoomJoining = function (socket) {
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}

// 用户断开连接
var handleClientDisconnection = function (socket) {
    socket.on('disconnect', function () {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    });
}