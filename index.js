const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')
const app = express()
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`listening from port ${PORT}`)
})
const io = socket(server)

app.use(express.static(path.join(__dirname, 'public')))

io.sockets.on('connection', socket => {
    socket.emit('con_message', 'socket connection established')
    
    socket.on('nickname', nickname => {
        socket.broadcast.emit('user_join', nickname)
        socket.nickname = nickname
        console.log(`nickname is set to ${socket.nickname}`)
    })

    socket.on('send_chat', chat => {
        io.emit('chat', {
            chat: chat,
            nickname: socket.nickname ?? 'Anonymous'
        })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user_disconnect', socket.nickname)
    })
})


