import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
    myLocation: { lat: number; lng: number } | null;
    topology: any[];
}

// Component to update map center when location changes
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

export const MapView: React.FC<MapViewProps> = ({ myLocation, topology }) => {
    if (!myLocation) {
        return (
            <div className="h-64 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">Acquiring GPS Signal...</p>
                </div>
            </div>
        );
    }

    // Create custom icons
    const createCustomIcon = (color: string) => L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background-color: ${color};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 10px ${color};
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });

    const myIcon = createCustomIcon('#10b981'); // Emerald-500
    const nodeIcon = createCustomIcon('#3b82f6'); // Blue-500

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-800 relative z-0">
            <MapContainer
                center={[myLocation.lat, myLocation.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater center={[myLocation.lat, myLocation.lng]} />

                {/* My Location */}
                <Marker position={[myLocation.lat, myLocation.lng]} icon={myIcon}>
                    <Popup>
                        <div className="text-slate-900 font-bold">You are here</div>
                    </Popup>
                </Marker>

                {/* Other Nodes */}
                {topology.map((node) => (
                    node.location && (
                        <React.Fragment key={node.id}>
                            <Marker position={[node.location.lat, node.location.lng]} icon={nodeIcon}>
                                <Popup>
                                    <div className="text-slate-900">
                                        <strong>{node.name}</strong><br />
                                        Status: {node.status}
                                    </div>
                                </Popup>
                            </Marker>
                            {/* Draw line to this node (Mesh Link) */}
                            <Polyline
                                positions={[
                                    [myLocation.lat, myLocation.lng],
                                    [node.location.lat, node.location.lng]
                                ]}
                                pathOptions={{ color: '#10b981', weight: 2, opacity: 0.5, dashArray: '5, 10' }}
                            />
                        </React.Fragment>
                    )
                ))}
            </MapContainer>

            {/* Overlay Legend */}
            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-800 z-[1000] text-xs">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
                    <span className="text-slate-300">You</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
                    <span className="text-slate-300">Nodes</span>
                </div>
            </div>
        </div>
    );
};
