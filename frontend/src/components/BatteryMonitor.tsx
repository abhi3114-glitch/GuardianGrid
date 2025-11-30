import React, { useEffect } from 'react';
import { Battery, BatteryCharging, BatteryWarning } from 'lucide-react';
import clsx from 'clsx';

export const BatteryMonitor: React.FC = () => {
    const [battery, setBattery] = React.useState<number | null>(null);
    const [charging, setCharging] = React.useState(false);

    useEffect(() => {
        // Check if Battery API is available
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((bat: any) => {
                setBattery(Math.round(bat.level * 100));
                setCharging(bat.charging);

                // Listen for updates
                bat.addEventListener('levelchange', () => {
                    setBattery(Math.round(bat.level * 100));
                });
                bat.addEventListener('chargingchange', () => {
                    setCharging(bat.charging);
                });
            });
        }
    }, []);

    if (battery === null) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-sm text-slate-500">Battery info unavailable</p>
            </div>
        );
    }

    const getBatteryColor = () => {
        if (charging) return 'text-emerald-500';
        if (battery <= 20) return 'text-rose-500';
        if (battery <= 50) return 'text-amber-500';
        return 'text-emerald-500';
    };

    const getBatteryIcon = () => {
        if (charging) return BatteryCharging;
        if (battery <= 20) return BatteryWarning;
        return Battery;
    };

    const Icon = getBatteryIcon();

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className={clsx("w-5 h-5", getBatteryColor())} />
                    <span className="text-sm text-slate-400">Battery</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={clsx("text-2xl font-bold", getBatteryColor())}>
                        {battery}%
                    </span>
                    {charging && <span className="text-xs text-emerald-500">Charging</span>}
                </div>
            </div>
            {battery <= 20 && !charging && (
                <p className="text-xs text-rose-400 mt-2">⚠️ Low battery - Enable power saving</p>
            )}
        </div>
    );
};
