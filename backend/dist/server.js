"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const MeshManager_1 = require("./services/MeshManager"); // Import MeshManager service
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const meshManager = new MeshManager_1.MeshManager(io);
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
