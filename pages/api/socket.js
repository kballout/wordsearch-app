import {
    Server
} from "socket.io";
let usersMap = new Map()
let currentUsers = []

export default function SocketHandler(req, res) {
    if (res.socket.server.io) {
        console.log('server already started');
        return res.end();
    } else {
        const io = new Server(res.socket.server, {
            path: '/api/socket_io',
            addTrailingSlash: false,
            pingInterval: 2000,
            pingTimeout: 2000
        })
        res.socket.server.io = io
        io.on("connection", async (socket) => {
            console.log(`new connection from ${socket.id}`);

            socket.on('create-room', (data) => {
                usersMap.set(data.id, {
                    started: false,
                    users: [{
                        username: data.username,
                        socketId: data.id
                    }]
                })
                currentUsers.push({
                    socketId: data.id,
                    currentRoom: data.id
                })
            })

            socket.on('check-room', (data) => {
                let obj = usersMap.get(data.id)
                if (!obj || obj?.users.length === 0) {
                    socket.emit('errorJoining')
                } else {
                    if (obj.started === true) {
                        socket.emit('gameAlreadyStarted')
                    } else {
                        socket.emit('validLobby', { id: data.id })
                    }
                }
            })

            socket.on('join-room', (data) => {
                console.log('user has joined');
                let obj = usersMap.get(data.id)
                if (obj) {
                    socket.join(data.id)
                    currentUsers.push({
                        socketId: data.socketId,
                        currentRoom: data.id
                    })
                    let update = {
                        ...obj, users: [...obj.users, {
                            username: data.username,
                            socketId: data.socketId
                        }]
                    }
                    usersMap.set(data.id, update)
                    io.in(data.id).emit('userJoined', { arr: update.users, data: data })
                }
            })

            socket.on('leave-room', (data) => {
                console.log('user left');
                socket.leave(data.id)
                let obj = usersMap.get(data.id)
                let update = { ...obj, users: obj.users.filter((user) => user.socketId !== data.socketId) }
                currentUsers = currentUsers.filter((user) => user.socketId !== data.socketId)
                usersMap.set(data.id, update)
                io.in(data.id).emit('userLeft', { arr: update.users, data: data })
                if (update.started === true) {
                    //send to game
                    io.in(data.id).emit('userLeftInGame', data)
                }
            })

            socket.on('close-room', (data) => {
                console.log('room is closed');
                usersMap.delete(data.id)
                currentUsers = currentUsers.filter((user) => user.currentRoom !== data.id)
                io.in(data.id).emit('roomClosed')
            })


            socket.on('start-game', () => {
                let obj = usersMap.get(socket.id)
                let update = { ...obj, started: true }
                usersMap.set(socket.id, update)
                io.in(socket.id).emit('gameStart', update.users)
            })

            socket.on('set-board', (data) => {
                io.in(socket.id).emit('boardSet', data)
            })

            socket.on('send-message', (data) => {
                console.log('a message was sent');
                io.in(data.currentRoom).emit('receive-message', data)
            })

            socket.on('word-complete', (data) => {
                io.in(data.currentRoom).emit('completeWord', data)
            })

            socket.on('gameOver', (data) => {
                let obj = usersMap.get(socket.id)
                let update = { ...obj, started: false }
                usersMap.set(socket.id, update)
                io.in(data.currentRoom).emit('endGame', data.players)
            })

            socket.on('return-to-lobby', (data) => {
                io.in(data.currentRoom).emit('returnToLobby')
            })

            socket.on('disconnect', async () => {
                if (usersMap.has(socket.id)) {
                    //host
                    console.log('disconnection of host');
                    usersMap.delete(socket.id)
                    currentUsers = currentUsers.filter((user) => user.currentRoom !== socket.id)
                    io.in(socket.id).emit('roomClosed')
                } else {
                    //client
                    console.log('disconnection of client');
                    let find = currentUsers.find((user) => user.socketId === socket.id)
                    if (find) {
                        socket.leave(find.currentRoom)
                        let obj = usersMap.get(find.currentRoom)
                        let data = {
                            id: find.currentRoom,
                            socketId: socket.id,
                            username: obj.users.find((us) => us.socketId === find.socketId).username
                        }
                        let update = { ...obj, users: obj.users.filter((user) => user.socketId !== find.socketId) }
                        currentUsers = currentUsers.filter((user) => user.socketId !== find.socketId)
                        usersMap.set(find.currentRoom, update)
                        io.in(find.currentRoom).emit('userLeft', { arr: update.users, data: data })
                        if (update.started === true) {
                            //send to game
                            io.in(data.id).emit('userLeftInGame', data)
                        }
                    }
                }
            })
        })

        return res.end()
    }


}