import React from 'react';
import { Phone, Shield, Flame, Heart, Building2 } from 'lucide-react';

export const EmergencyContacts: React.FC = () => {
    const contacts = [
        { name: 'Police', number: '100', icon: Shield, color: 'text-blue-500' },
        { name: 'Fire', number: '101', icon: Flame, color: 'text-orange-500' },
        { name: 'Ambulance', number: '102', icon: Heart, color: 'text-rose-500' },
        { name: 'Emergency (108)', number: '108', icon: Shield, color: 'text-rose-600' },
        { name: 'Women Helpline', number: '1091', icon: Shield, color: 'text-purple-500' },
        { name: 'Disaster Mgmt', number: '1078', icon: Building2, color: 'text-amber-500' },
    ];

    const callNumber = (number: string) => {
        window.location.href = `tel:${number}`;
    };

    const copyNumber = (number: string) => {
        navigator.clipboard.writeText(number);
        console.log(`Copied: ${number}`);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-500" />
                Emergency Contacts
            </h3>

            <div className="space-y-2">
                {contacts.map((contact, idx) => {
                    const Icon = contact.icon;
                    return (
                        <div
                            key={idx}
                            className="bg-slate-950/50 rounded-lg p-3 flex items-center justify-between hover:bg-slate-950/80 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${contact.color}`} />
                                <div>
                                    <p className="text-sm font-medium text-white">{contact.name}</p>
                                    <p className="text-xs text-slate-400 font-mono">{contact.number}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => callNumber(contact.number)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors"
                                >
                                    Call
                                </button>
                                <button
                                    onClick={() => copyNumber(contact.number)}
                                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-slate-500 mt-4">
                💡 These contacts work offline. Tap to call or copy.
            </p>
        </div>
    );
};
