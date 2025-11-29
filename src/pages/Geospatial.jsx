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

const KEY_POINTS = [
    { icon: MapPin, title: 'Location Data', desc: 'Tied to specific geographic coordinates' },
    { icon: BarChart3, title: 'Spatial Analysis', desc: 'Enables pattern recognition and visualization' },
    { icon: Layers, title: 'GIS Integration', desc: 'Geographic Information Systems support' },
    { icon: Target, title: 'Decision Support', desc: 'Powers informed decisions across sectors' },
    { icon: Satellite, title: 'Remote Sensing', desc: 'GPS and satellite imagery technologies' },
];

const APPLICATIONS = [
    { icon: TrendingUp, title: 'Spatial Analytics', desc: 'Analyze data for informed decisions' },
    { icon: Building2, title: 'Urban & Disaster', desc: 'Planning and emergency response' },
    { icon: Compass, title: 'GIS & Sensing', desc: 'Advanced mapping tools' },
    { icon: Activity, title: 'Resource Monitoring', desc: 'Environmental and asset tracking' },
    { icon: Navigation, title: 'Navigation', desc: 'Location-based services' },
];

export default function Geospatial() {
    useEffect(() => {
        document.title = 'Geospatial Intelligence Platform';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Geospatial intelligence platform with AI-powered spatial analytics, mapping, and visualization.');
        document.querySelector('meta[name="keywords"]')?.setAttribute('content', 'Geospatial, GIS, mapping, spatial analysis, satellite imagery');
    }, []);

    const [activeUseCases, setActiveUseCases] = useState(['greenhouse', 'carbon']);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('explore');
    const [mapData, setMapData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState([]);

    const selectedUseCases = USE_CASES.filter(u => activeUseCases.includes(u.id));
    const currentUseCase = selectedUseCases[0] || USE_CASES[0];

    const toggleUseCase = (id) => {
        setActiveUseCases(prev => 
            prev.includes(id) 
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const generateInsights = async () => {
        setLoading(true);
        try {
            const names = selectedUseCases.map(u => u.name).join(', ');
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 4 geospatial insights for these use cases: ${names}. Each insight should have a title, value/metric, and trend direction.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        insights: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    value: { type: "string" },
                                    trend: { type: "string" },
                                    change: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setInsights(response?.insights || []);
        } catch (error) {
            console.error('Failed to generate insights:', error);
            setInsights([
                { title: 'Active Zones', value: '1,247', trend: 'up', change: '+12%' },
                { title: 'Coverage Area', value: '45.2K km²', trend: 'up', change: '+8%' },
                { title: 'Data Points', value: '2.4M', trend: 'up', change: '+24%' },
                { title: 'Accuracy Rate', value: '98.7%', trend: 'stable', change: '0%' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateInsights();
    }, [activeUseCases.join(',')]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">Geospatial Intelligence</h1>
                                    <p className="text-white/70 text-sm">AI-Powered Spatial Analytics Platform</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Search */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                                <Input 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search locations..."
                                    className="pl-9 w-64 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                                />
                            </div>
                            <Button onClick={generateInsights} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                    </div>

                    {/* Key Points Row */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/20">
                        {KEY_POINTS.map((point, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <point.icon className="w-4 h-4 text-white/70" />
                                <span className="text-white/90">{point.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                {/* Use Case Selector */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                    {USE_CASES.map(useCase => {
                        const Icon = useCase.icon;
                        return (
                            <button
                                key={useCase.id}
                                onClick={() => setActiveUseCase(useCase.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                                    activeUseCase === useCase.id
                                        ? 'bg-white shadow-lg border-2 text-gray-900'
                                        : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200'
                                }`}
                                style={{ borderColor: activeUseCase === useCase.id ? useCase.color : undefined }}
                            >
                                <Icon className="w-5 h-5" style={{ color: useCase.color }} />
                                <div className="text-left">
                                    <span className="font-medium text-sm block">{useCase.name}</span>
                                    <span className="text-xs text-gray-500 hidden md:block">{useCase.description}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Insights Cards */}
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {insights.map((insight, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">{insight.title}</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-2xl font-bold text-gray-900">{insight.value}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        insight.trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                                        insight.trend === 'down' ? 'bg-red-50 text-red-600' :
                                        'bg-gray-50 text-gray-600'
                                    }`}>
                                        {insight.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
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

                {/* Main Map Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Large Map */}
                    <div className="lg:col-span-3">
                        <GeospatialMap 
                            useCase={activeUseCase}
                            mapType={activeTab}
                            searchQuery={searchQuery}
                            color={currentUseCase?.color}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Current Use Case Info */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                {currentUseCase && <currentUseCase.icon className="w-5 h-5" style={{ color: currentUseCase?.color }} />}
                                <h3 className="font-semibold text-gray-900">{currentUseCase?.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{currentUseCase?.description}</p>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Data Layers</span>
                                    <span className="font-medium text-gray-900">12 active</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Last Updated</span>
                                    <span className="font-medium text-gray-900">2 min ago</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Coverage</span>
                                    <span className="font-medium text-gray-900">Global</span>
                                </div>
                            </div>
                        </div>

                        {/* Applications */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Applications</h3>
                            <div className="space-y-2">
                                {APPLICATIONS.map((app, i) => (
                                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                            <app.icon className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{app.title}</p>
                                            <p className="text-xs text-gray-500">{app.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                <h3 className="font-semibold text-gray-900 text-sm">AI Analysis</h3>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">Run AI-powered spatial analysis on the current view.</p>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                                <Activity className="w-4 h-4 mr-2" />
                                Analyze Region
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Secondary Maps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Route className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm text-gray-900">Route Analysis</span>
                            </div>
                            <span className="text-xs text-gray-500">Live</span>
                        </div>
                        <GeospatialMap 
                            useCase="logistics"
                            mapType="default"
                            height="200px"
                            mini={true}
                            color="#3B82F6"
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TreePine className="w-4 h-4 text-emerald-600" />
                                <span className="font-medium text-sm text-gray-900">Land Cover</span>
                            </div>
                            <span className="text-xs text-gray-500">Satellite</span>
                        </div>
                        <GeospatialMap 
                            useCase="environment"
                            mapType="satellite"
                            height="200px"
                            mini={true}
                            color="#22C55E"
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-orange-600" />
                                <span className="font-medium text-sm text-gray-900">Population Density</span>
                            </div>
                            <span className="text-xs text-gray-500">Heatmap</span>
                        </div>
                        <GeospatialMap 
                            useCase="urban"
                            mapType="heatmap"
                            height="200px"
                            mini={true}
                            color="#F97316"
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