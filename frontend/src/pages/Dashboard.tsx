import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Activity, Server, Zap, AlertTriangle, CheckCircle, MapPin, Home, Network, MessageSquare, Menu, Share2 } from 'lucide-react';
import clsx from 'clsx';
import { EmergencyStatus } from '../components/EmergencyStatus';
import { BatteryMonitor } from '../components/BatteryMonitor';
import { ResourceRequest } from '../components/ResourceRequest';
import { LocationSharing } from '../components/LocationSharing';
import { EmergencyContacts } from '../components/EmergencyContacts';
import { MapView } from '../components/MapView';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
        <div className={clsx("p-3 rounded-lg bg-opacity-10", color)}>
            <Icon className={clsx("w-6 h-6", color.replace('bg-', 'text-'))} />
        </div>
        <div>
            <p className="text-sm text-slate-400 font-medium">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { registerNode, topology, stats, insights, sendMessage, messages, myLocation, sendBroadcastAlert } = useSocket();
    const [chatMessage, setChatMessage] = React.useState('');
    const [activeTab, setActiveTab] = React.useState<'home' | 'mesh' | 'chat' | 'tools'>('home');

    // Auto-register a demo node on mount if empty
    useEffect(() => {
        // registerNode('Dashboard-Monitor');
    }, []);

    const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        setDeferredPrompt(null);
    };



    return (
        <div className="space-y-6 pb-24 md:pb-0 md:space-y-8">
            {/* Mobile Sticky Header */}
            <div className="md:hidden sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 -mx-4 -mt-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white leading-tight">GuardianGrid</h1>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">Online</span>
                        </div>
                    </div>
                </div>
                {deferredPrompt && (
                    <button
                        onClick={handleInstall}
                        className="p-2 bg-purple-600/20 text-purple-400 rounded-lg active:bg-purple-600/30 transition-colors"
                    >
                        <Zap className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Stats Grid - Home Tab */}
            <div className={clsx(
                "grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6",
                activeTab !== 'home' && "hidden md:grid"
            )}>
                <StatCard
                    label="Active Nodes"
                    value={stats?.nodeCount || 0}
                    icon={Server}
                    color="bg-blue-500 text-blue-500"
                />
                <StatCard
                    label="Success Rate"
                    value={`${((stats?.deliverySuccessRate || 0) * 100).toFixed(1)}%`}
                    icon={CheckCircle}
                    color="bg-emerald-500 text-emerald-500"
                />
                <StatCard
                    label="Avg Latency"
                    value={`${(stats?.averageLatency || 0).toFixed(0)}ms`}
                    icon={Zap}
                    color="bg-amber-500 text-amber-500"
                />
                <StatCard
                    label="Packet Drop"
                    value={`${((stats?.packetDropRate || 0) * 100).toFixed(1)}%`}
                    icon={AlertTriangle}
                    color="bg-rose-500 text-rose-500"
                />
            </div>

            {/* Emergency Features Section - Home Tab */}
            <div className={clsx(
                "grid grid-cols-1 md:grid-cols-3 gap-6",
                activeTab !== 'home' && "hidden md:grid"
            )}>
                <EmergencyStatus />
                <BatteryMonitor />
                <div className="hidden md:block">
                    <ResourceRequest />
                </div>
            </div>

            {/* Tools Tab Content (Mobile Only Wrapper) */}
            <div className={clsx(
                "md:hidden space-y-6",
                activeTab !== 'tools' && "hidden"
            )}>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">App Installation</h3>

                    {/* Automatic Install Button */}
                    <button
                        onClick={handleInstall}
                        disabled={!deferredPrompt}
                        className={clsx(
                            "w-full flex items-center justify-between p-4 rounded-lg border transition-colors mb-4",
                            deferredPrompt
                                ? "bg-purple-600/10 border-purple-600/20 text-purple-400 active:bg-purple-600/20"
                                : "bg-slate-800/50 border-slate-700 text-slate-500"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Zap className={clsx("w-5 h-5", deferredPrompt ? "text-purple-500" : "text-slate-500")} />
                            <div className="text-left">
                                <p className={clsx("font-medium", deferredPrompt ? "text-purple-100" : "text-slate-400")}>
                                    {deferredPrompt ? "Install App" : "Automatic Install Unavailable"}
                                </p>
                                <p className="text-xs opacity-70">
                                    {deferredPrompt ? "Tap to install PWA" : "Browser didn't prompt automatically"}
                                </p>
                            </div>
                        </div>
                        {deferredPrompt && <Share2 className="w-4 h-4" />}
                    </button>

                    {/* Manual Instructions (Fallback) */}
                    {!deferredPrompt && (
                        <div className="space-y-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 mb-4">
                            <p className="text-xs text-slate-400 font-medium">How to Install Manually:</p>

                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-blue-500/10 rounded text-blue-400">
                                    <Share2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-300 font-bold">iPhone (iOS)</p>
                                    <p className="text-[10px] text-slate-500">Tap <span className="text-blue-400">Share</span> button → Scroll down → Tap <span className="text-blue-400">Add to Home Screen</span></p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-emerald-500/10 rounded text-emerald-400">
                                    <Menu className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-300 font-bold">Android (Chrome)</p>
                                    <p className="text-[10px] text-slate-500">Tap <span className="text-emerald-400">Menu (⋮)</span> → Tap <span className="text-emerald-400">Install App</span> or <span className="text-emerald-400">Add to Home Screen</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Broadcast Alert Button */}
                    <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 mb-4">
                        <h3 className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wider">Emergency Broadcast</h3>
                        <button
                            onClick={() => {
                                if (confirm("⚠️ SEND BROADCAST ALERT?\n\nThis will trigger a loud alarm on ALL connected devices.\n\nOnly use in extreme emergencies.")) {
                                    sendBroadcastAlert("EMERGENCY! IMMEDIATE ASSISTANCE REQUIRED!");
                                }
                            }}
                            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-900/50 flex items-center justify-center gap-3 transition-transform active:scale-95"
                        >
                            <AlertTriangle className="w-6 h-6 animate-pulse" />
                            SEND ALERT TO ALL
                        </button>
                        <p className="text-xs text-red-400/60 text-center mt-2">Triggers audible alarm on mesh network</p>
                    </div>

                    {/* Debug Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Debug Info</h3>
                        <div className="space-y-1 text-[10px] font-mono text-slate-500">
                            <p>Secure Context: {window.isSecureContext ? 'Yes (HTTPS)' : 'No (HTTP)'}</p>
                            <p>Service Worker: {'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}</p>
                            <p>Prompt Event: {deferredPrompt ? 'Ready' : 'Null'}</p>
                        </div>
                    </div>
                </div>

                <ResourceRequest />
                <EmergencyContacts />
            </div>

            {/* Emergency Tools Section - Desktop Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
                <LocationSharing />
                <EmergencyContacts />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Topology List - Mesh Tab */}
                <div className={clsx(
                    "lg:col-span-2 space-y-6",
                    activeTab !== 'mesh' && "hidden md:block"
                )}>
                    {/* Map View (Mesh Tab) */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-hidden">
                        <MapView myLocation={myLocation} topology={topology} />
                    </div>

                    {/* Mobile Location Sharing (Mesh Tab) */}
                    <div className="md:hidden mb-6">
                        <LocationSharing />
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            Live Mesh Topology
                        </h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {topology.length === 0 ? (
                                <p className="text-slate-500 text-sm">No nodes connected.</p>
                            ) : (
                                topology.map(node => (
                                    <div key={node.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className={clsx("w-2 h-2 rounded-full", node.status === 'active' ? "bg-emerald-500" : "bg-slate-500")} />
                                            <div>
                                                <p className="font-medium text-slate-200">{node.name}</p>
                                                <p className="text-xs text-slate-500 font-mono">{node.id.substring(0, 8)}...</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Distance Display */}
                                            {myLocation && node.location && (
                                                <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                                    <MapPin className="w-3 h-3" />
                                                    {(() => {
                                                        const R = 6371e3; // metres
                                                        const φ1 = myLocation.lat * Math.PI / 180;
                                                        const φ2 = node.location.lat * Math.PI / 180;
                                                        const Δφ = (node.location.lat - myLocation.lat) * Math.PI / 180;
                                                        const Δλ = (node.location.lng - myLocation.lng) * Math.PI / 180;

                                                        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                                                            Math.cos(φ1) * Math.cos(φ2) *
                                                            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                                                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                                        const d = R * c; // in metres

                                                        return d > 1000 ? `${(d / 1000).toFixed(1)}km` : `${d.toFixed(0)}m`;
                                                    })()}
                                                </div>
                                            )}
                                            <span className="text-xs text-slate-400">{node.neighbors.length} neighbors</span>
                                            <div className="flex -space-x-2">
                                                {node.neighbors.map(nid => (
                                                    <div key={nid} className="w-6 h-6 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-[10px] text-slate-400" title={nid}>
                                                        {nid.substring(0, 2)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Mesh Controls</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Node Management */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-slate-400">Node Management</h4>
                                <button
                                    onClick={() => registerNode(`Node-${Math.floor(Math.random() * 1000)}`)}
                                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Add Random Node
                                </button>
                            </div>

                            {/* Messaging */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-slate-400">Messaging Simulation</h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            if (topology.length < 2) {
                                                alert("Need at least 2 nodes to simulate traffic");
                                                return;
                                            }
                                            // Pick two random nodes
                                            const source = topology[Math.floor(Math.random() * topology.length)];
                                            let target = topology[Math.floor(Math.random() * topology.length)];
                                            while (target.id === source.id) {
                                                target = topology[Math.floor(Math.random() * topology.length)];
                                            }
                                            sendMessage(target.id, { text: `Ping from ${source.name}` }, 'DIRECT');
                                            console.log(`Simulated message from ${source.name} to ${target.name}`);
                                        }}
                                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Simulate Traffic
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (topology.length === 0) {
                                                alert("Need at least 1 node to broadcast SOS");
                                                return;
                                            }
                                            const source = topology[Math.floor(Math.random() * topology.length)];
                                            sendMessage('BROADCAST', { text: "SOS! EMERGENCY!" }, 'SOS');
                                            console.log(`Simulated SOS from ${source.name}`);
                                            alert(`🆘 SOS Broadcasted from ${source.name} to all nodes!`);
                                        }}
                                        className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Broadcast SOS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Insights - Home Tab (Mobile) / Sidebar (Desktop) */}
                <div className={clsx(
                    "bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-fit",
                    activeTab !== 'home' && "hidden md:flex"
                )}>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                        AI Network Analysis
                    </h3>

                    {insights ? (
                        <div className="space-y-4 flex-1">
                            <div className={clsx(
                                "p-4 rounded-lg border",
                                insights.riskLevel === 'LOW' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                    insights.riskLevel === 'MEDIUM' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                        "bg-rose-500/10 border-rose-500/20 text-rose-400"
                            )}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider">Risk Level</span>
                                    <span className="font-bold">{insights.riskLevel}</span>
                                </div>
                                <p className="text-sm opacity-90">{insights.summary}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-2">Optimization Suggestions</h4>
                                <ul className="space-y-2">
                                    {insights.suggestions.map((suggestion, i) => (
                                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                            <span className="text-purple-500 mt-1">•</span>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm min-h-[200px]">
                            Waiting for network data...
                        </div>
                    )}
                </div>
            </div>

            {/* Group Chat Section - Chat Tab */}
            <div className={clsx(
                "bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col",
                activeTab === 'chat' ? "h-[calc(100vh-180px)]" : "hidden md:block"
            )}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 shrink-0">
                    💬 Group Chat
                    <span className="text-xs text-slate-500">({messages.length} messages)</span>
                </h3>

                {/* Message History */}
                <div className="bg-slate-950/50 rounded-lg p-4 mb-4 flex-1 overflow-y-auto space-y-2">
                    {messages.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-8">No messages yet. Start a conversation!</p>
                    ) : (
                        messages
                            .filter(msg => msg.type !== 'LOCATION') // Hide location broadcasts from chat
                            .map((msg, idx) => (
                                <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={clsx(
                                            "text-xs font-bold px-2 py-0.5 rounded",
                                            msg.type === 'SOS' ? "bg-rose-500/20 text-rose-400" :
                                                msg.type === 'CHAT' ? "bg-emerald-500/20 text-emerald-400" :
                                                    "bg-blue-500/20 text-blue-400"
                                        )}>
                                            {msg.type === 'SOS' ? '🆘 SOS' : msg.type === 'CHAT' ? '💬 Chat' : '📡 Direct'}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {msg.from ? `Node ${msg.from.substring(0, 8)}` : 'Unknown'}
                                        </span>
                                        <span className="text-xs text-slate-600">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        {msg.type === 'RESOURCE' && msg.content?.resourceType
                                            ? `Requesting: ${msg.content.resourceType}`
                                            : msg.type === 'STATUS' && msg.content?.statusType
                                                ? `Status: ${msg.content.statusType}`
                                                : msg.type === 'LOCATION' && msg.content?.location
                                                    ? `📍 Location: ${msg.content.location.lat.toFixed(4)}, ${msg.content.location.lng.toFixed(4)}`
                                                    : msg.content?.text || JSON.stringify(msg.content)}
                                    </p>
                                </div>
                            ))
                    )}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2 shrink-0">
                    <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && chatMessage.trim()) {
                                sendMessage('BROADCAST', { text: chatMessage }, 'CHAT' as any);
                                setChatMessage('');
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                    <button
                        onClick={() => {
                            if (chatMessage.trim()) {
                                sendMessage('BROADCAST', { text: chatMessage }, 'CHAT' as any);
                                setChatMessage('');
                            }
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Floating Install Button (Mobile Only) */}
            {
                (deferredPrompt || !window.isSecureContext) && (
                    <button
                        onClick={() => {
                            if (deferredPrompt) {
                                handleInstall();
                            } else {
                                alert("⚠️ Installation Blocked by Browser\n\nYou are connected via HTTP (Insecure).\nBrowsers only allow automatic PWA installation on HTTPS or localhost.\n\nTo install:\n1. Open Browser Menu (⋮)\n2. Select 'Add to Home Screen' or 'Install App'");
                            }
                        }}
                        className={clsx(
                            "fixed bottom-24 right-6 z-50 md:hidden w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 animate-bounce",
                            deferredPrompt
                                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/50"
                                : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-900/50"
                        )}
                        aria-label={deferredPrompt ? "Install App" : "Installation Info"}
                    >
                        {deferredPrompt ? <Zap className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </button>
                )
            }

            {/* Bottom Navigation Bar (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 md:hidden z-40 pb-safe">
                <div className="flex items-center justify-around p-1">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={clsx(
                            "flex flex-col items-center p-3 rounded-xl transition-all duration-200",
                            activeTab === 'home' ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500 hover:text-slate-400"
                        )}
                    >
                        <Home className={clsx("w-6 h-6 mb-1", activeTab === 'home' && "fill-emerald-500/20")} />
                        <span className="text-[10px] font-medium">Home</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('mesh')}
                        className={clsx(
                            "flex flex-col items-center p-3 rounded-xl transition-all duration-200",
                            activeTab === 'mesh' ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500 hover:text-slate-400"
                        )}
                    >
                        <Network className={clsx("w-6 h-6 mb-1", activeTab === 'mesh' && "fill-emerald-500/20")} />
                        <span className="text-[10px] font-medium">Mesh</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={clsx(
                            "flex flex-col items-center p-3 rounded-xl transition-all duration-200",
                            activeTab === 'chat' ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500 hover:text-slate-400"
                        )}
                    >
                        <MessageSquare className={clsx("w-6 h-6 mb-1", activeTab === 'chat' && "fill-emerald-500/20")} />
                        <span className="text-[10px] font-medium">Chat</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('tools')}
                        className={clsx(
                            "flex flex-col items-center p-3 rounded-xl transition-all duration-200",
                            activeTab === 'tools' ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500 hover:text-slate-400"
                        )}
                    >
                        <Menu className={clsx("w-6 h-6 mb-1", activeTab === 'tools' && "fill-emerald-500/20")} />
                        <span className="text-[10px] font-medium">Tools</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
