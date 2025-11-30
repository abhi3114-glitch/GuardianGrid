import React from 'react';
import { useSocket } from '../context/SocketContext';
import { Droplet, Utensils, Heart, Home, Zap, Radio } from 'lucide-react';

type ResourceType = 'WATER' | 'FOOD' | 'MEDICAL' | 'SHELTER' | 'POWER' | 'COMMUNICATION';

export const ResourceRequest: React.FC = () => {
    const { sendMessage } = useSocket();

    const resources: { type: ResourceType; icon: any; label: string; color: string }[] = [
        { type: 'WATER', icon: Droplet, label: 'Water', color: 'bg-blue-600 hover:bg-blue-700' },
        { type: 'FOOD', icon: Utensils, label: 'Food', color: 'bg-orange-600 hover:bg-orange-700' },
        { type: 'MEDICAL', icon: Heart, label: 'Medical', color: 'bg-rose-600 hover:bg-rose-700' },
        { type: 'SHELTER', icon: Home, label: 'Shelter', color: 'bg-purple-600 hover:bg-purple-700' },
        { type: 'POWER', icon: Zap, label: 'Power', color: 'bg-yellow-600 hover:bg-yellow-700' },
        { type: 'COMMUNICATION', icon: Radio, label: 'Radio', color: 'bg-emerald-600 hover:bg-emerald-700' },
    ];

    const requestResource = (resource: ResourceType) => {
        sendMessage('BROADCAST', {
            resourceType: resource,
            urgency: 'MEDIUM',
            timestamp: Date.now()
        }, 'RESOURCE' as any);

        console.log(`🆘 Resource request sent: ${resource}`);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">🏥 Resource Requests</h3>
            <p className="text-sm text-slate-400 mb-4">Request help from nearby nodes</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {resources.map(({ type, icon: Icon, label, color }) => (
                    <button
                        key={type}
                        onClick={() => requestResource(type)}
                        className={`${color} p-3 rounded-lg text-white font-medium transition-colors text-sm flex flex-col items-center gap-2`}
                    >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
