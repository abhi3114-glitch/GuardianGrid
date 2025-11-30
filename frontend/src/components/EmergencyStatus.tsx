import React from 'react';
import { useSocket } from '../context/SocketContext';
import clsx from 'clsx';

type StatusType = 'SAFE' | 'HELP' | 'EMERGENCY' | 'OFFLINE';

export const EmergencyStatus: React.FC = () => {
    const [status, setStatus] = React.useState<StatusType>('OFFLINE');
    const { sendMessage, topology } = useSocket();

    const updateStatus = (newStatus: StatusType) => {
        setStatus(newStatus);
        // Broadcast status update to all nodes
        sendMessage('BROADCAST', {
            statusType: newStatus,
            timestamp: Date.now()
        }, 'STATUS' as any);
    };

    const statusConfig = {
        SAFE: { icon: '✅', label: "I'm Safe", color: 'bg-emerald-600 hover:bg-emerald-700', border: 'border-emerald-500' },
        HELP: { icon: '⚠️', label: 'Need Help', color: 'bg-amber-600 hover:bg-amber-700', border: 'border-amber-500' },
        EMERGENCY: { icon: '🆘', label: 'Emergency!', color: 'bg-rose-600 hover:bg-rose-700', border: 'border-rose-500' },
        OFFLINE: { icon: '⚫', label: 'Offline', color: 'bg-slate-700', border: 'border-slate-600' }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">🚨 Emergency Status</h3>

            {/* Current Status Display */}
            <div className={clsx(
                "p-4 rounded-lg border-2 mb-4",
                statusConfig[status].border
            )}>
                <p className="text-sm text-slate-400 mb-1">Your Current Status:</p>
                <p className="text-2xl font-bold text-white">
                    {statusConfig[status].icon} {statusConfig[status].label}
                </p>
            </div>

            {/* Quick Status Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => updateStatus('SAFE')}
                    className={clsx(
                        "px-4 py-3 rounded-lg text-white font-medium transition-colors text-sm",
                        statusConfig.SAFE.color
                    )}
                >
                    {statusConfig.SAFE.icon} {statusConfig.SAFE.label}
                </button>
                <button
                    onClick={() => updateStatus('HELP')}
                    className={clsx(
                        "px-4 py-3 rounded-lg text-white font-medium transition-colors text-sm",
                        statusConfig.HELP.color
                    )}
                >
                    {statusConfig.HELP.icon} {statusConfig.HELP.label}
                </button>
                <button
                    onClick={() => updateStatus('EMERGENCY')}
                    className={clsx(
                        "px-4 py-3 rounded-lg text-white font-medium transition-colors text-sm col-span-2",
                        statusConfig.EMERGENCY.color
                    )}
                >
                    {statusConfig.EMERGENCY.icon} {statusConfig.EMERGENCY.label}
                </button>
            </div>

            {/* Active Nodes Count */}
            <p className="text-xs text-slate-500 mt-3 text-center">
                Broadcasting to {topology.length} active node{topology.length !== 1 ? 's' : ''}
            </p>
        </div>
    );
};
