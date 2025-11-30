import React, { useEffect, useRef } from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface AlertOverlayProps {
    isOpen: boolean;
    message: string;
    sender: string;
    onDismiss: () => void;
}

export const AlertOverlay: React.FC<AlertOverlayProps> = ({ isOpen, message, sender, onDismiss }) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Play Siren Sound using Web Audio API (No external file needed)
            try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                    const ctx = new AudioContext();
                    audioContextRef.current = ctx;

                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(440, ctx.currentTime);
                    osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.5);
                    osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 1.0);

                    // Repeat the siren effect
                    const interval = setInterval(() => {
                        if (osc && ctx) {
                            osc.frequency.setValueAtTime(440, ctx.currentTime);
                            osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.5);
                            osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 1.0);
                        }
                    }, 1000);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    oscillatorRef.current = osc;

                    return () => {
                        clearInterval(interval);
                        osc.stop();
                        ctx.close();
                    };
                }
            } catch (e) {
                console.error("Audio play failed", e);
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/90 backdrop-blur-md animate-pulse">
            <div className="bg-red-900 border-4 border-red-500 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-red-900/50 mx-4">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full animate-bounce">
                        <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest">Emergency Alert</h2>
                <p className="text-red-200 text-lg mb-6 font-medium">
                    Broadcast from <span className="font-bold text-white">{sender}</span>
                </p>

                <div className="bg-red-950/50 p-4 rounded-lg border border-red-800 mb-8">
                    <p className="text-xl text-white font-bold">{message}</p>
                </div>

                <button
                    onClick={onDismiss}
                    className="w-full py-4 bg-white text-red-700 font-bold text-lg rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                    <XCircle className="w-6 h-6" />
                    ACKNOWLEDGE & DISMISS
                </button>
            </div>
        </div>
    );
};
