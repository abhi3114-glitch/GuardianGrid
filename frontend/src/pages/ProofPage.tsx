import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, CheckCircle, Zap } from 'lucide-react';
import clsx from 'clsx';

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

const ProofPage: React.FC = () => {
    const { sessionId } = useParams();
    const [data, setData] = useState<{ stats: MeshStats, insights: AIInsight, topology: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, use sessionId. For MVP, just get current global state.
                const res = await fetch('http://localhost:3001/api/proof/' + sessionId);
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sessionId]);

    if (loading) return <div className="p-8 text-white">Loading proof data...</div>;
    if (!data) return <div className="p-8 text-white">Failed to load data.</div>;

    const { stats, insights, topology } = data;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center gap-4 border-b border-slate-800 pb-6">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <Shield className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">GuardianGrid Session Proof</h1>
                        <p className="text-slate-400">Session ID: <span className="font-mono text-emerald-400">{sessionId || 'DEMO-SESSION'}</span></p>
                    </div>
                </header>

                {/* Scorecard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Network Reliability</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{(stats.deliverySuccessRate * 100).toFixed(1)}%</span>
                            <span className="text-xs text-emerald-400">Success Rate</span>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Active Nodes</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{stats.nodeCount}</span>
                            <span className="text-xs text-blue-400">Nodes</span>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Risk Assessment</p>
                        <div className={clsx(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold",
                            insights.riskLevel === 'LOW' ? "bg-emerald-500/10 text-emerald-400" :
                                insights.riskLevel === 'MEDIUM' ? "bg-amber-500/10 text-amber-400" :
                                    "bg-rose-500/10 text-rose-400"
                        )}>
                            {insights.riskLevel}
                        </div>
                    </div>
                </div>

                {/* Narrative */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                        AI Post-Mortem Analysis
                    </h3>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-slate-300 leading-relaxed mb-6">
                            {insights.summary}
                        </p>

                        <div className="space-y-4">
                            <h4 className="font-medium text-white">Key Observations:</h4>
                            <ul className="space-y-2">
                                {insights.suggestions.map((s, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-400">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Topology Snapshot */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Topology Snapshot</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {topology.map((node: any) => (
                            <div key={node.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-2" />
                                <p className="font-medium text-slate-200 text-sm">{node.name}</p>
                                <p className="text-xs text-slate-500">{node.neighbors.length} neighbors</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProofPage;
