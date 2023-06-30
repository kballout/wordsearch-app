import {
    Server
} from "socket.io";
let usersMap = new Map()

export default function SocketHandler(req, res) {
    if (res.socket.server.io) {
        console.log('server already started');
        return res.end();
    }
    else {
        const io = new Server(res.socket.server, {
            path: '/api/socket_io',
            addTrailingSlash: false
        })
        res.socket.server.io = io
        io.on("connection", async (socket) => {
            console.log(`new connection from ${socket.id}`);
    
            socket.on('create-room', (data) => {
                usersMap.set(data.id, [data.username])
            })
           
            socket.on('join-room', (data) => {
                console.log('user has joined');
                socket.join(data.id)
                let arr = usersMap.get(data.id)
                arr.push(data.username)
                usersMap.set(data.id, arr)
                io.in(data.id).emit('userJoined', arr)
            })

            socket.on('leave-room', (data) => {
                console.log('user left');
                socket.leave(data.id)
                let arr = usersMap.get(data.id)
                arr = arr.filter((name) => name !== data.username)
                usersMap.set(data.id, arr)
                io.in(data.id).emit('userJoined', arr)
            })
           
            socket.on('send-message', (data) => {
                console.log('a message was sent');
                io.in(data.currentRoom).emit('receive-message', data)
            })
    
            socket.on('disconnect', async (socket) => {
            })
        })
    
        return res.end()
    }


}