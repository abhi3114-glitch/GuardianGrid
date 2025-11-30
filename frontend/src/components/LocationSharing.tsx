import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { MapPin, Navigation, Lock, Unlock, AlertTriangle } from 'lucide-react';

export const LocationSharing: React.FC = () => {
    const { sendMessage, myLocation, setMyLocation } = useSocket();
    const [sharing, setSharing] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!sharing) return;

        const updateLocation = () => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const newLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        setMyLocation(newLocation);
                        setError('');

                        // Broadcast location to mesh
                        sendMessage('BROADCAST', {
                            location: newLocation,
                            timestamp: Date.now()
                        }, 'LOCATION' as any);
                    },
                    (err) => {
                        setError('Location access denied');
                        console.error(err);
                    }
                );
            } else {
                setError('Geolocation not supported');
            }
        };

        updateLocation();
        const interval = setInterval(updateLocation, 60000); // Update every 60s

        return () => clearInterval(interval);
    }, [sharing, sendMessage, setMyLocation]);

    const toggleSharing = () => {
        setSharing(!sharing);
        if (sharing) {
            setMyLocation(null);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Location Sharing
            </h3>

            {/* Toggle */}
            <button
                onClick={toggleSharing}
                className={`w-full mb-4 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${sharing
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
            >
                {sharing ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {sharing ? 'Sharing Location' : 'Share My Location'}
            </button>

            {/* Location Display */}
            {myLocation && (
                <div className="bg-slate-950/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Latitude:</span>
                        <span className="text-sm text-white font-mono">{myLocation.lat.toFixed(6)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Longitude:</span>
                        <span className="text-sm text-white font-mono">{myLocation.lng.toFixed(6)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2">
                        <Navigation className="w-3 h-3" />
                        <span>Broadcasting every 60 seconds</span>
                    </div>
                </div>
            )}

            {/* Insecure Context Warning (HTTP) */}
            {!window.isSecureContext && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-amber-400">Insecure Connection (HTTP)</p>
                            <p className="text-[10px] text-amber-300/80 leading-relaxed">
                                GPS and PWA features are disabled by the browser on non-HTTPS connections.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const baseLat = 28.6139;
                            const baseLng = 77.2090;
                            const randomOffset = () => (Math.random() - 0.5) * 0.01;

                            const simulatedLocation = {
                                lat: baseLat + randomOffset(),
                                lng: baseLng + randomOffset()
                            };

                            setMyLocation(simulatedLocation);
                            setSharing(true); // Force sharing state
                            setError('');

                            sendMessage('BROADCAST', {
                                location: simulatedLocation,
                                timestamp: Date.now()
                            }, 'LOCATION' as any);
                        }}
                        className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Navigation className="w-3 h-3" />
                        Enable Test Mode (Simulate Location)
                    </button>
                </div>
            )}

            {/* Error & Manual Fallback (for other errors) */}
            {error && window.isSecureContext && (
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg space-y-3">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-rose-400">Location Access Issue</p>
                            <p className="text-[10px] text-rose-300/80 leading-relaxed">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Privacy Note */}
            {!sharing && (
                <p className="text-[10px] text-slate-500 mt-4 text-center">
                    Location is encrypted and only shared with connected mesh nodes.
                </p>
            )}
        </div>
    );
};
