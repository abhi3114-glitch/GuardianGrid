import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity, Shield, Share2, Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import clsx from 'clsx';

const Layout: React.FC = () => {
    const { isConnected, stats } = useSocket();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Activity },
        { path: '/proof/demo', label: 'Proof Page', icon: Share2 },
    ];

    const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

    React.useEffect(() => {
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
        <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Sidebar - Hidden on Mobile */}
            <aside className="hidden md:flex w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex-col">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-emerald-500" />
                    <h1 className="text-xl font-bold tracking-tight text-white">GuardianGrid</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                    isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-lg border border-slate-800">
                        {isConnected ? (
                            <Wifi className="w-5 h-5 text-emerald-500" />
                        ) : (
                            <WifiOff className="w-5 h-5 text-rose-500" />
                        )}
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-400">Status</span>
                            <span className={clsx("text-sm font-bold", isConnected ? "text-emerald-400" : "text-rose-400")}>
                                {isConnected ? 'Connected' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Desktop Header - Hidden on Mobile */}
                <header className="hidden md:flex h-16 border-b border-slate-800 items-center justify-between px-8 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-slate-200">
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        {deferredPrompt && (
                            <button
                                onClick={handleInstall}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-purple-900/20"
                            >
                                <Share2 className="w-4 h-4" />
                                Install App
                            </button>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium text-slate-300">
                                {stats?.nodeCount || 0} Active Nodes
                            </span>
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
