import React, { useState } from 'react';
import { MapPin, Search, Filter, Layers, Circle, Square, Hexagon, ChevronDown, X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const QUERY_TYPES = [
    { id: 'radius', name: 'Radius Search', icon: Circle, description: 'Find within distance' },
    { id: 'bbox', name: 'Bounding Box', icon: Square, description: 'Rectangular area' },
    { id: 'polygon', name: 'Polygon Select', icon: Hexagon, description: 'Custom shape' },
];

const LAYERS = [
    { id: 'economic', name: 'Economic Zones', color: '#22C55E' },
    { id: 'population', name: 'Population Density', color: '#3B82F6' },
    { id: 'infrastructure', name: 'Infrastructure', color: '#F59E0B' },
    { id: 'resources', name: 'Natural Resources', color: '#8B5CF6' },
    { id: 'trade', name: 'Trade Routes', color: '#EC4899' },
];

export default function SpatialQuery({ onQuery, activeDomain }) {
    const [queryType, setQueryType] = useState('radius');
    const [radius, setRadius] = useState([500]);
    const [selectedLayers, setSelectedLayers] = useState(['economic']);
    const [searchLocation, setSearchLocation] = useState('');
    const [results, setResults] = useState(null);
    const [isQuerying, setIsQuerying] = useState(false);

    const toggleLayer = (layerId) => {
        setSelectedLayers(prev => 
            prev.includes(layerId) ? prev.filter(l => l !== layerId) : [...prev, layerId]
        );
    };

    const executeQuery = () => {
        setIsQuerying(true);
        setTimeout(() => {
            setResults({
                count: Math.floor(Math.random() * 50) + 10,
                entities: [
                    { name: 'Industrial Zone A', type: 'Economic', distance: '45 km', score: 87 },
                    { name: 'Port Complex', type: 'Infrastructure', distance: '78 km', score: 92 },
                    { name: 'Mining Region', type: 'Resources', distance: '120 km', score: 75 },
                    { name: 'Trade Hub', type: 'Trade', distance: '156 km', score: 81 },
                    { name: 'Urban Center', type: 'Population', distance: '23 km', score: 95 },
                ]
            });
            setIsQuerying(false);
        }, 800);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Spatial Query</h3>
                    <p className="text-xs text-gray-500">Geospatial data analysis</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Query Type</label>
                    <div className="flex gap-2">
                        {QUERY_TYPES.map(qt => (
                            <button key={qt.id} onClick={() => setQueryType(qt.id)}
                                className={`flex-1 p-2 rounded-lg border text-center transition-all ${queryType === qt.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <qt.icon className={`w-4 h-4 mx-auto mb-1 ${queryType === qt.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                <span className={`text-xs font-medium ${queryType === qt.id ? 'text-indigo-600' : 'text-gray-600'}`}>{qt.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Location</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} placeholder="Enter location or coordinates" className="pl-9 text-sm" />
                    </div>
                </div>

                {queryType === 'radius' && (
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-xs font-medium text-gray-600">Radius</label>
                            <span className="text-xs font-bold text-indigo-600">{radius[0]} km</span>
                        </div>
                        <Slider value={radius} onValueChange={setRadius} max={1000} step={50} className="w-full" />
                    </div>
                )}

                <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Data Layers</label>
                    <div className="flex flex-wrap gap-2">
                        {LAYERS.map(layer => (
                            <button key={layer.id} onClick={() => toggleLayer(layer.id)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${selectedLayers.includes(layer.id) ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                                style={{ backgroundColor: selectedLayers.includes(layer.id) ? layer.color : undefined }}>
                                {selectedLayers.includes(layer.id) && <Check className="w-3 h-3" />}
                                {layer.name}
                            </button>
                        ))}
                    </div>
                </div>

                <Button onClick={executeQuery} disabled={isQuerying} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    {isQuerying ? 'Querying...' : 'Execute Query'}
                </Button>

                {results && (
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-900">{results.count} Results</span>
                            <Button variant="ghost" size="sm" onClick={() => setResults(null)}><X className="w-3 h-3" /></Button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {results.entities.map((entity, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{entity.name}</div>
                                        <div className="text-xs text-gray-500">{entity.type} • {entity.distance}</div>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-600">{entity.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}