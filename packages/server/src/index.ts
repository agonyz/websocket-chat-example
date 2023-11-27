import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

app.use(express.static('public'));

io.on('connection', (socket: Socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });

    // emit a message to all clients when a user joins (except the joining user)
    socket.broadcast.emit('user-joined', { user: socket.id, color: '#D2042D' });

    // emit a message to all clients when a message is sent
    socket.on('chat-message', (msg: string) => {
        io.emit('chat-message', { sender: socket.id, message: msg, color: '#000' });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});