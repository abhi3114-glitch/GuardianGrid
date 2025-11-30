import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AlertOverlay } from '../components/AlertOverlay';

interface MeshNode {
    id: string;
    name: string;
    neighbors: string[];
    status: 'active' | 'inactive';
    lastSeen: number;
    location?: { lat: number; lng: number };
}

interface MeshStats {
    nodeCount: number;
    deliverySuccessRate: number;
    averageLatency: number;
    packetDropRate: number;
}

interface AIInsight {
    summary: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
    suggestions: string[];
}

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    topology: MeshNode[];
    stats: MeshStats | null;
    insights: AIInsight | null;
    messages: any[];
    myLocation: { lat: number; lng: number } | null;
    setMyLocation: (loc: { lat: number; lng: number } | null) => void;
    registerNode: (name: string) => void;
    sendMessage: (to: string, content: any, type: 'DIRECT' | 'SOS' | 'CHAT' | 'STATUS' | 'RESOURCE' | 'LOCATION' | 'BROADCAST_ALERT') => void;
    connectNode: (targetId: string) => void;
    sendBroadcastAlert: (message: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [topology, setTopology] = useState<MeshNode[]>([]);
    const [stats, setStats] = useState<MeshStats | null>(null);
    const [insights, setInsights] = useState<AIInsight | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [alertState, setAlertState] = useState<{ isOpen: boolean; message: string; sender: string }>({
        isOpen: false,
        message: '',
        sender: ''
    });

    useEffect(() => {
        const backendUrl = `http://${window.location.hostname}:3001`;
        const newSocket = io(backendUrl);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to backend');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('topology-update', (data: MeshNode[]) => {
            setTopology(data);
        });

        newSocket.on('stats-update', (data: { stats: MeshStats, insights: AIInsight }) => {
            setStats(data.stats);
            setInsights(data.insights);
        });

        newSocket.on('message-received', (message: any) => {
            setMessages(prev => {
                const newMessages = [...prev, message];
                if (newMessages.length > 100) return newMessages.slice(newMessages.length - 100);
                return newMessages;
            });
            if (message.type === 'SOS') {
                console.log('🆘 SOS ALERT!', message.content.text, 'From Node:', message.from);
            }
            // Handle Broadcast Alerts received as messages
            if (message.type === 'BROADCAST_ALERT') {
                setAlertState({
                    isOpen: true,
                    message: message.content.text,
                    sender: message.from
                });
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const registerNode = React.useCallback((name: string) => {
        socket?.emit('register', { name });
    }, [socket]);

    const sendMessage = React.useCallback((to: string, content: any, type: 'DIRECT' | 'SOS' | 'CHAT' | 'STATUS' | 'RESOURCE' | 'LOCATION' | 'BROADCAST_ALERT') => {
        socket?.emit('send-message', { to, content, type });
    }, [socket]);

    const connectNode = React.useCallback((targetId: string) => {
        socket?.emit('connect-node', { targetId });
    }, [socket]);

    const sendBroadcastAlert = React.useCallback((message: string) => {
        sendMessage('BROADCAST', { text: message }, 'BROADCAST_ALERT');
    }, [sendMessage]);

    const dismissAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <SocketContext.Provider value={{ socket, isConnected, topology, stats, insights, messages, myLocation, setMyLocation, registerNode, sendMessage, connectNode, sendBroadcastAlert }}>
            {children}
            <AlertOverlay
                isOpen={alertState.isOpen}
                message={alertState.message}
                sender={alertState.sender}
                onDismiss={dismissAlert}
            />
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
