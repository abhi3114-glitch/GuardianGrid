import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { MeshManager } from './services/MeshManager'; // Import MeshManager service

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const meshManager = new MeshManager(io);

app.get('/api/topology', (req, res) => {
    res.json(meshManager.getTopology());
});

app.get('/api/stats', (req, res) => {
    res.json(meshManager.getStats());
});

app.get('/api/proof/:sessionId', (req, res) => {
    // For MVP, ignore sessionId and return current state
    res.json({
        topology: meshManager.getTopology(),
        ...meshManager.getStats()
    });
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    meshManager.handleConnection(socket);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`GuardianGrid Backend running on port ${PORT}`);
});
