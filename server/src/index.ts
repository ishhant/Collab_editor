import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from the CoSync Backend!');
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws) => {
  let currentRoom = '';
  console.log('✅ New client connected!');

  ws.on('message', (messageAsString) => {
    const data = JSON.parse(messageAsString.toString());
    console.log(`📩 Received message type: ${data.type} from room: ${data.roomId || currentRoom}`);

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

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`🚀 Server is running and listening on http://localhost:${PORT}`);
});