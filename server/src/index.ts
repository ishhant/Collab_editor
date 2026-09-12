import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import mongoose from 'mongoose';
import { RoomModel } from './models/Room';

const app = express();
app.use(cors());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || '';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('📦 Connected to MongoDB Successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

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

// API route to fetch or initialize a room
app.get('/api/room/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    let room = await RoomModel.findOne({ roomId });
    
    if (!room) {
      room = await RoomModel.create({
        roomId,
        files: DEFAULT_FILES
      });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room data' });
  }
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws) => {
  let currentRoom = '';
  console.log('✅ New client connected!');

  ws.on('message', async (messageAsString) => {
    const data = JSON.parse(messageAsString.toString());

    if (data.type === 'join') {
      currentRoom = data.roomId;
      if (!rooms.has(currentRoom)) {
        rooms.set(currentRoom, new Set());
      }
      rooms.get(currentRoom)!.add(ws);
      console.log(`👥 User joined room: ${currentRoom}. Total users in room: ${rooms.get(currentRoom)!.size}`);
    } 
    else if (data.type === 'code_change') {
      const roomClients = rooms.get(currentRoom);
      if (roomClients) {
        roomClients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'code_change',
              fileId: data.fileId,
              content: data.content
            }));
          }
        });
      }

      // Save the code to MongoDB permanently
      try {
        await RoomModel.updateOne(
          { roomId: currentRoom, "files.id": data.fileId },
          { $set: { "files.$.content": data.content } }
        );
      } catch (error) {
        console.error("Failed to save to database:", error);
      }
    }
  });

  ws.on('close', () => {
    console.log(`❌ Client disconnected from room: ${currentRoom}`);
    if (currentRoom && rooms.has(currentRoom)) {
      rooms.get(currentRoom)!.delete(ws);
      if (rooms.get(currentRoom)!.size === 0) {
        rooms.delete(currentRoom);
      }
    }
  });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});