"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const Room_1 = require("./models/Room");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const MONGODB_URI = process.env.MONGODB_URI || '';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Successfully!'))
    .catch(err => console.error('MongoDB Connection Error:', err));
const DEFAULT_FILES = [
    { id: '1', name: 'main.js', language: 'javascript', content: 'console.log("Hello from main.js!");' },
    { id: '2', name: 'script.py', language: 'python', content: 'print("Hello from script.py!")' },
    { id: '3', name: 'index.html', language: 'html', content: '<div class="container">\n  <h1>Hello HTML</h1>\n</div>' },
    { id: '4', name: 'styles.css', language: 'css', content: '.container {\n  color: #61afef;\n}' },
    { id: '5', name: 'data.json', language: 'json', content: '{\n  "appName": "CoSync",\n  "status": "Active"\n}' }
];
app.get('/', (req, res) => {
    res.send('Hello from the CoSync Backend!');
});
app.get('/api/room/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        let room = await Room_1.RoomModel.findOne({ roomId });
        if (!room) {
            room = await Room_1.RoomModel.create({
                roomId,
                files: DEFAULT_FILES
            });
        }
        res.json(room);
    }
    catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ error: 'Failed to fetch room data' });
    }
});
const crypto_1 = __importDefault(require("crypto"));
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
const rooms = new Map();
const getRandomColor = () => {
    const colors = ['#e06c75', '#98c379', '#d19a66', '#61afef', '#c678dd', '#56b6c2'];
    return colors[Math.floor(Math.random() * colors.length)];
};
const broadcastRoomUsers = (roomId) => {
    const roomClients = rooms.get(roomId);
    if (!roomClients)
        return;
    const users = Array.from(roomClients.values());
    roomClients.forEach((userData, client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'room_users',
                users
            }));
        }
    });
};
wss.on('connection', (ws) => {
    let currentRoom = '';
    console.log('New client connected');
    ws.on('message', async (messageAsString) => {
        const data = JSON.parse(messageAsString.toString());
        if (data.type === 'join') {
            currentRoom = data.roomId;
            const userName = data.userName || 'Anonymous';
            if (!rooms.has(currentRoom)) {
                rooms.set(currentRoom, new Map());
            }
            const userData = {
                id: crypto_1.default.randomUUID(),
                name: userName,
                color: getRandomColor()
            };
            rooms.get(currentRoom).set(ws, userData);
            console.log(`User ${userName} joined room: ${currentRoom}. Total users: ${rooms.get(currentRoom).size}`);
            broadcastRoomUsers(currentRoom);
        }
        else if (data.type === 'code_change') {
            const roomClients = rooms.get(currentRoom);
            if (roomClients) {
                roomClients.forEach((userData, client) => {
                    if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'code_change',
                            fileId: data.fileId,
                            content: data.content
                        }));
                    }
                });
            }
            try {
                await Room_1.RoomModel.updateOne({ roomId: currentRoom, "files.id": data.fileId }, { $set: { "files.$.content": data.content } });
            }
            catch (error) {
                console.error("Failed to save to database:", error);
            }
        }
    });
    ws.on('close', () => {
        if (currentRoom && rooms.has(currentRoom)) {
            const roomClients = rooms.get(currentRoom);
            const userData = roomClients.get(ws);
            console.log(`Client ${userData?.name} disconnected from room: ${currentRoom}`);
            roomClients.delete(ws);
            if (roomClients.size === 0) {
                rooms.delete(currentRoom);
            }
            else {
                broadcastRoomUsers(currentRoom);
            }
        }
    });
});
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
