import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { RoutingService } from './RoutingService';
import { InsightService } from './InsightService';
import { MeshNode, MessagePacket, MeshStats } from '../types';

export class MeshManager {
    private io: Server;
    private nodes: Map<string, MeshNode> = new Map();
    private messages: MessagePacket[] = [];

    // Metrics
    private totalMessages = 0;
    private deliveredMessages = 0;
    private totalLatency = 0;
    private droppedMessages = 0;

    constructor(io: Server) {
        this.io = io;
    }

    handleConnection(socket: Socket) {
        socket.on('register', (data: { name: string }) => {
            const nodeId = uuidv4();
            const node: MeshNode = {
                id: nodeId,
                socketId: socket.id,
                name: data.name || `Node-${nodeId.substring(0, 4)}`,
                neighbors: [],
                status: 'active',
                lastSeen: Date.now()
            };

            this.nodes.set(nodeId, node);
            socket.emit('registered', { nodeId, config: node });

            // Auto-connect to existing nodes to form mesh
            this.autoConnectNewNode(nodeId);

            this.broadcastTopology();

            console.log(`Node registered: ${node.name} (${nodeId})`);

            socket.on('disconnect', () => {
                this.handleDisconnect(nodeId);
            });

            socket.on('heartbeat', () => {
                this.updateHeartbeat(nodeId);
            });


            socket.on('send-message', (data: { to: string, content: any, type: 'DIRECT' | 'SOS' | 'CHAT' | 'STATUS' | 'RESOURCE' | 'LOCATION' | 'BROADCAST_ALERT' }) => {
                this.handleMessage(nodeId, data.to, data.content, data.type);
            });

            socket.on('connect-node', (data: { targetId: string }) => {
                this.connectNodes(nodeId, data.targetId);
            });
        });
    }

    private handleDisconnect(nodeId: string) {
        const node = this.nodes.get(nodeId);
        if (node) {
            node.status = 'inactive';
            // Remove from neighbors
            this.nodes.forEach(n => {
                n.neighbors = n.neighbors.filter(id => id !== nodeId);
            });
            this.nodes.delete(nodeId);
            console.log(`Node disconnected: ${node.name}`);
            this.broadcastTopology();
        }
    }

    private updateHeartbeat(nodeId: string) {
        const node = this.nodes.get(nodeId);
        if (node) {
            node.lastSeen = Date.now();
            node.status = 'active';
        }
    }

    private connectNodes(nodeId1: string, nodeId2: string) {
        const node1 = this.nodes.get(nodeId1);
        const node2 = this.nodes.get(nodeId2);

        if (node1 && node2 && nodeId1 !== nodeId2) {
            if (!node1.neighbors.includes(nodeId2)) node1.neighbors.push(nodeId2);
            if (!node2.neighbors.includes(nodeId1)) node2.neighbors.push(nodeId1);
            this.broadcastTopology();
        }
    }

    private autoConnectNewNode(newNodeId: string) {
        const existingNodes = Array.from(this.nodes.values()).filter(n => n.id !== newNodeId);

        if (existingNodes.length === 0) return; // First node, nothing to connect to

        // Strategy: Connect to 2-3 random existing nodes to form a mesh
        const connectionsToMake = Math.min(3, existingNodes.length);
        const shuffled = existingNodes.sort(() => Math.random() - 0.5);

        for (let i = 0; i < connectionsToMake; i++) {
            this.connectNodes(newNodeId, shuffled[i].id);
        }
    }

    private handleMessage(fromId: string, toId: string, content: any, type: 'DIRECT' | 'SOS' | 'CHAT' | 'STATUS' | 'RESOURCE' | 'LOCATION' | 'BROADCAST_ALERT') {
        const messageId = uuidv4();
        this.totalMessages++;

        if (type === 'SOS' || type === 'CHAT' || type === 'STATUS' || type === 'RESOURCE' || type === 'LOCATION' || type === 'BROADCAST_ALERT') {
            // If it's a location update, update the node's state
            if (type === 'LOCATION' && content.location) {
                const node = this.nodes.get(fromId);
                if (node) {
                    node.location = content.location;
                    this.broadcastTopology(); // Notify everyone of the new location
                }
            }

            // Broadcast to all reachable nodes
            this.io.emit('message-received', {
                id: messageId,
                from: fromId,
                to: 'BROADCAST',
                content,
                type,
                path: [],
                timestamp: Date.now()
            });
            this.deliveredMessages++;
            return;
        }

        // Direct Message Routing
        const route = RoutingService.findPath(this.nodes, fromId, toId);

        if (route) {
            const packet: MessagePacket = {
                id: messageId,
                from: fromId,
                to: toId,
                content,
                type,
                path: route.path,
                timestamp: Date.now(),
                status: 'delivered' // Optimistic delivery for simulation
            };

            // Simulate network delay based on hops
            setTimeout(() => {
                const targetNode = this.nodes.get(toId);
                if (targetNode) {
                    this.io.to(targetNode.socketId).emit('message-received', packet);
                    this.deliveredMessages++;
                    this.totalLatency += route.estimatedLatency;
                } else {
                    this.droppedMessages++;
                }
                this.broadcastStats();
            }, route.estimatedLatency);

            this.messages.push(packet);
        } else {
            this.droppedMessages++;
            console.log(`No route found from ${fromId} to ${toId}`);
            // Notify sender of failure
            const sender = this.nodes.get(fromId);
            if (sender) {
                this.io.to(sender.socketId).emit('message-failed', { to: toId, reason: 'No route' });
            }
        }
        this.broadcastStats();
    }

    private broadcastTopology() {
        const topology = Array.from(this.nodes.values());
        this.io.emit('topology-update', topology);
        this.broadcastStats();
    }

    private broadcastStats() {
        const stats: MeshStats = {
            nodeCount: this.nodes.size,
            deliverySuccessRate: this.totalMessages > 0 ? this.deliveredMessages / this.totalMessages : 1,
            averageLatency: this.deliveredMessages > 0 ? this.totalLatency / this.deliveredMessages : 0,
            packetDropRate: this.totalMessages > 0 ? this.droppedMessages / this.totalMessages : 0
        };

        const insights = InsightService.generateInsights(stats);

        this.io.emit('stats-update', {
            stats,
            insights
        });
    }

    public getTopology() {
        return Array.from(this.nodes.values());
    }

    public getStats() {
        const stats: MeshStats = {
            nodeCount: this.nodes.size,
            deliverySuccessRate: this.totalMessages > 0 ? this.deliveredMessages / this.totalMessages : 1,
            averageLatency: this.deliveredMessages > 0 ? this.totalLatency / this.deliveredMessages : 0,
            packetDropRate: this.totalMessages > 0 ? this.droppedMessages / this.totalMessages : 0
        };
        const insights = InsightService.generateInsights(stats);
        return { stats, insights };
    }
}
