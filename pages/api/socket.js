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
                usersMap.set(data.id, [{
                    username: data.username,
                    socketId: data.id
                }])
                currentUsers.push({
                    socketId: data.id,
                    currentRoom: data.id
                })
            })

            socket.on('join-room', (data) => {
                console.log('user has joined');
                socket.join(data.id)
                let arr = usersMap.get(data.id)
                currentUsers.push({
                    socketId: data.socketId,
                    currentRoom: data.id
                })
                arr.push({
                    username: data.username,
                    socketId: data.socketId
                })
                usersMap.set(data.id, arr)
                
                io.in(data.id).emit('userJoined', arr)
            })

            socket.on('leave-room', (data) => {
                console.log('user left');
                socket.leave(data.id)
                let arr = usersMap.get(data.id)
                arr = arr.filter((user) => user.socketId !== data.socketId)
                currentUsers = currentUsers.filter((user) => user.socketId !== data.socketId)
                usersMap.set(data.id, arr)
                io.in(data.id).emit('userJoined', arr)
            })

            socket.on('close-room', (data) => {
                console.log('room is closed');
                usersMap.delete(data.id)
                currentUsers = currentUsers.filter((user) => user.currentRoom !== data.id)
                io.in(data.id).emit('roomClosed')
            })

            
            socket.on('start-game', () => {
                let arr = usersMap.get(socket.id)
                io.in(socket.id).emit('gameStart', arr)
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
                        let arr = usersMap.get(find.currentRoom)
                        arr = arr.filter((user) => user.socketId !== find.socketId)
                        currentUsers = currentUsers.filter((user) => user.socketId !== find.socketId)
                        usersMap.set(find.currentRoom, arr)
                        io.in(find.currentRoom).emit('userJoined', arr)
                    }
                }
            })
        })

        return res.end()
    }


}