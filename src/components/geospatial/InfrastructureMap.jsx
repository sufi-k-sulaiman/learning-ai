import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import { Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const LAYER_COLORS = {
    transportation: '#3B82F6',
    energy: '#F59E0B',
    water: '#06B6D4',
    telecom: '#8B5CF6',
    defense: '#EF4444',
    public: '#10B981'
};

export default function InfrastructureMap({ 
    center = [39.8283, -98.5795], 
    zoom = 4,
    data = [],
    activeLayers = ['transportation', 'energy'],
    onMarkerClick = null
}) {
    const [mapReady, setMapReady] = useState(false);

    const filteredData = data.filter(item => activeLayers.includes(item.type));

    return (
        <div className="relative h-full w-full rounded-xl overflow-hidden border border-gray-200">
            {!mapReady && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
            )}
            <MapContainer
                center={center}
                zoom={zoom}
                className="h-full w-full"
                whenReady={() => setMapReady(true)}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredData.map((item, i) => (
                    <CircleMarker
                        key={i}
                        center={[item.lat, item.lng]}
                        radius={item.size || 8}
                        fillColor={LAYER_COLORS[item.type] || '#8B5CF6'}
                        color={LAYER_COLORS[item.type] || '#8B5CF6'}
                        weight={2}
                        opacity={0.8}
                        fillOpacity={0.5}
                        eventHandlers={{
                            click: () => onMarkerClick?.(item)
                        }}
                    >
                        <Popup>
                            <div className="text-sm">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-gray-600">{item.description}</p>
                                {item.capacity && <p className="text-purple-600">Capacity: {item.capacity}</p>}
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
            
            {/* Layer Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
                <p className="text-xs font-semibold text-gray-700 mb-2">Active Layers</p>
                <div className="space-y-1">
                    {activeLayers.map(layer => (
                        <div key={layer} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LAYER_COLORS[layer] }} />
                            <span className="text-xs text-gray-600 capitalize">{layer}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}