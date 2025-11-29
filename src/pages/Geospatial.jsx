import React, { useState, useEffect } from 'react';
import { 
    Globe, MapPin, Layers, Navigation, Satellite, Map, 
    Search, Filter, ZoomIn, Compass, Target, Route,
    Building2, TreePine, Waves, Mountain, Cloud, Activity,
    BarChart3, TrendingUp, Users, Truck, Loader2, RefreshCw, Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import GeospatialMap from '@/components/geospatial/GeospatialMap';

const USE_CASES = [
    { id: 'greenhouse', name: 'Greenhouse Issues', icon: Cloud, color: '#EF4444', description: 'Emissions tracking, climate impact analysis' },
    { id: 'carbon', name: 'Carbon Footprint', icon: Activity, color: '#F97316', description: 'Carbon emissions, offset tracking, net zero' },
    { id: 'grid', name: 'Grid Map', icon: Layers, color: '#6366F1', description: 'Power grid infrastructure, transmission lines' },
    { id: 'production', name: 'Production & Consumption', icon: TrendingUp, color: '#3B82F6', description: 'Energy production, consumption patterns' },
    { id: 'renewables', name: 'Renewables & Sustainability', icon: TreePine, color: '#22C55E', description: 'Solar, wind, hydro, sustainable sources' },
    { id: 'reliability', name: 'Grid Reliability', icon: Activity, color: '#8B5CF6', description: 'Outages, maintenance, uptime monitoring' },
    { id: 'provincial', name: 'Provincial Usage', icon: Map, color: '#0EA5E9', description: 'Regional energy consumption data' },
    { id: 'towns', name: 'Towns & Cities', icon: Building2, color: '#EC4899', description: 'Urban energy distribution, smart cities' },
    { id: 'smart', name: 'Smart Systems', icon: Compass, color: '#10B981', description: 'IoT, smart meters, automation' },
    { id: 'environmental', name: 'Environmental Impact', icon: Mountain, color: '#14B8A6', description: 'Ecosystem effects, biodiversity' },
    { id: 'future', name: 'Future & Innovation', icon: Sparkles, color: '#A855F7', description: 'Emerging tech, innovation projects' },
];



export default function Geospatial() {
    useEffect(() => {
        document.title = 'Geospatial Intelligence Platform';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Geospatial intelligence platform with AI-powered spatial analytics, mapping, and visualization.');
        document.querySelector('meta[name="keywords"]')?.setAttribute('content', 'Geospatial, GIS, mapping, spatial analysis, satellite imagery');
    }, []);

    const [activeUseCases, setActiveUseCases] = useState(['greenhouse']);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('explore');
    const [loading, setLoading] = useState(false);

    const selectedUseCases = USE_CASES.filter(u => activeUseCases.includes(u.id));
    const currentUseCase = selectedUseCases[0] || USE_CASES[0];

    const toggleUseCase = (id) => {
        setActiveUseCases(prev => 
            prev.includes(id) 
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const filteredUseCases = USE_CASES.filter(uc => 
        uc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            {/* Top Row - Stats Left, Use Case Selector Right */}
            <div className="mx-4 md:mx-8 mt-4 flex flex-col lg:flex-row gap-4">
                {/* Stats Panel - Left */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 shadow-lg lg:w-1/2 flex flex-col justify-between min-h-[320px]">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Geospatial Intelligence</h1>
                        <p className="text-purple-200 text-sm">AI-Powered Spatial Analytics</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center">
                            <p className="text-xl md:text-2xl font-bold text-white">{activeUseCases.length}</p>
                            <p className="text-xs text-purple-200">Active Layers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl md:text-2xl font-bold text-white">4</p>
                            <p className="text-xs text-purple-200">Map Views</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl md:text-2xl font-bold text-white">Global</p>
                            <p className="text-xs text-purple-200">Coverage</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl md:text-2xl font-bold text-white">2.4M</p>
                            <p className="text-xs text-purple-200">Data Points</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl md:text-2xl font-bold text-white">98.7%</p>
                            <p className="text-xs text-purple-200">Accuracy</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl md:text-2xl font-bold text-white">Live</p>
                            <p className="text-xs text-purple-200">Updates</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-purple-200 mb-1">
                            <span>Data Quality</span>
                            <span>Excellent</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all bg-white/80" style={{ width: '87%' }} />
                        </div>
                    </div>

                    {/* Selected & Generate Button */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                        <span className="text-xs text-white/70">
                            {activeUseCases.length} selected: {selectedUseCases.map(s => s.name).join(', ').substring(0, 30)}{selectedUseCases.map(s => s.name).join(', ').length > 30 ? '...' : ''}
                        </span>
                        <Button 
                            onClick={() => setLoading(true)}
                            disabled={loading || activeUseCases.length === 0}
                            className="bg-white text-purple-700 hover:bg-white/90 text-sm"
                            size="sm"
                        >
                            <RefreshCw className={`w-3 h-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                            Analyze Data
                        </Button>
                    </div>
                </div>

                {/* Use Case Selector - Right */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:w-1/2 flex flex-col">
                    {/* Search Bar */}
                    <div className="mb-2">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-gray-700 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Use Cases list */}
                    <div className="flex-1 overflow-y-auto max-h-[250px]">
                        <div className="space-y-1">
                            {filteredUseCases.map(useCase => {
                                const isSelected = activeUseCases.includes(useCase.id);
                                const Icon = useCase.icon;
                                return (
                                    <button
                                        key={useCase.id}
                                        onClick={() => toggleUseCase(useCase.id)}
                                        className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-colors ${
                                            isSelected ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <div 
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${useCase.color}20` }}
                                        >
                                            <Icon className="w-4 h-4" style={{ color: useCase.color }} />
                                        </div>
                                        <span className="flex-1 text-left text-sm font-medium text-gray-700">
                                            {useCase.name}
                                        </span>
                                        {isSelected && (
                                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: useCase.color }}>✓</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {filteredUseCases.length === 0 && (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                No categories found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                {/* Map View Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                    <TabsList className="bg-white border border-gray-200">
                        <TabsTrigger value="explore" className="gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Map className="w-4 h-4" /> Explore Map
                        </TabsTrigger>
                        <TabsTrigger value="satellite" className="gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Satellite className="w-4 h-4" /> Satellite View
                        </TabsTrigger>
                        <TabsTrigger value="heatmap" className="gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Activity className="w-4 h-4" /> Heatmap
                        </TabsTrigger>
                        <TabsTrigger value="terrain" className="gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Mountain className="w-4 h-4" /> Terrain
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Selected categories summary */}
                {activeUseCases.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="text-sm text-gray-500">Viewing:</span>
                        {selectedUseCases.map(uc => (
                            <span key={uc.id} className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: uc.color }}>
                                {uc.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* World Map - Full Width */}
                <div className="mb-6">
                    <GeospatialMap 
                        useCase={currentUseCase?.id || 'greenhouse'}
                        mapType={activeTab}
                        searchQuery={searchQuery}
                        color={currentUseCase?.color}
                        height="500px"
                        isWorldMap={true}
                    />
                </div>

                {/* Secondary Maps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Cloud className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-sm text-gray-900">Emissions Hotspots</span>
                            </div>
                            <span className="text-xs text-gray-500">Live</span>
                        </div>
                        <GeospatialMap 
                            useCase="greenhouse"
                            mapType="heatmap"
                            height="200px"
                            mini={true}
                            color="#EF4444"
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TreePine className="w-4 h-4 text-emerald-600" />
                                <span className="font-medium text-sm text-gray-900">Renewable Sources</span>
                            </div>
                            <span className="text-xs text-gray-500">Satellite</span>
                        </div>
                        <GeospatialMap 
                            useCase="renewables"
                            mapType="satellite"
                            height="200px"
                            mini={true}
                            color="#22C55E"
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-indigo-600" />
                                <span className="font-medium text-sm text-gray-900">Power Grid</span>
                            </div>
                            <span className="text-xs text-gray-500">Grid</span>
                        </div>
                        <GeospatialMap 
                            useCase="grid"
                            mapType="default"
                            height="200px"
                            mini={true}
                            color="#6366F1"
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About Geospatial Intelligence</h2>
                    <p className="text-gray-600 mb-6">
                        Geospatial data and information is associated with specific geographic locations on Earth's surface, 
                        enabling analysis and visualization of spatial relationships across multiple domains.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">What is Geospatial?</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                                    Data tied to specific geographic locations
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                                    Enables spatial analysis and visualization
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                                    Utilized in Geographic Information Systems (GIS)
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">4</span>
                                    Supports decision-making in various fields
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">5</span>
                                    Involves technologies like GPS and satellite imagery
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Applications</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                                    Analyze spatial data for informed decisions
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                                    Support sectors like urban planning and disaster response
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                                    Utilize tools like GIS and remote sensing
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">4</span>
                                    Enhance resource management and environmental monitoring
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">5</span>
                                    Facilitate location-based services and navigation
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}