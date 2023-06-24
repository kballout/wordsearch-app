import {
    Server
} from "socket.io";

export default function SocketHandler(req, res) {
    if(res.socket.server.io){
        console.log('server already started');
        res.end()
        return
    }
    const io = new Server(res.socket.server, {
        path: '/api/socket_io',
        addTrailingSlash: false
    })
    res.socket.server.io = io

    

    io.on("connection", (socket) => {
        console.log(`new connection from ${socket.id}`);
        socket.on('send-message', (msg) => {
            io.emit('receive-message', msg)
        })
    })

    console.log('setting socket');
    res.end()
    return
}