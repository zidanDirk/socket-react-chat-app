const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const { Server } = require("socket.io");

const PORT = 4000
app.use(cors());
let users = [];

const socketIO = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.get('/api', (req, res) => {
    res.json({
      message: 'Hello world',
    });
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} 用户已连接!`);

    // 监听和在控制台打印消息
    socket.on('message', (data) => {
        console.log(data);
        socketIO.emit('messageResponse', data);
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));


    // 监听新用户的加入
    socket.on('newUser', (data) => {
        // 添加新用户到 users 中
        users.push(data);
        // console.log(users);

        // 发送用户列表到客户端
        socketIO.emit('newUserResponse', users);
    });

    socket.on('disconnect', () => {
        console.log('🔥: 一个用户已断开连接');
        // 当用户下线的时候更新用户列表
        users = users.filter((user) => user.socketID !== socket.id);
        // console.log(users);
        
        // 发送用户列表到客户端
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});