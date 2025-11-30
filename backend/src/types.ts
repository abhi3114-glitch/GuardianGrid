export interface MeshNode {
    id: string;
    socketId: string;
    name: string;
    neighbors: string[];
    status: 'active' | 'inactive';
    lastSeen: number;
    location?: { lat: number; lng: number };
}

export interface MessagePacket {
    id: string;
    from: string;
    to: string; // 'BROADCAST' for SOS
    content: any;
    type: 'DIRECT' | 'SOS' | 'CHAT' | 'STATUS' | 'RESOURCE' | 'LOCATION' | 'BROADCAST_ALERT';
    path: string[];
    timestamp: number;
    status: 'pending' | 'delivered' | 'failed';
}

export interface MeshStats {
    nodeCount: number;
    deliverySuccessRate: number;
    averageLatency: number;
    packetDropRate: number;
}

export interface AIInsight {
    summary: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
    suggestions: string[];
}

export interface RoutePath {
    path: string[]; // Array of Node IDs
    hops: number;
    estimatedLatency: number;
}
