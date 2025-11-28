import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import { 
    Globe, Map, Building2, Factory, Home, Users, TrendingUp, Layers,
    Target, CircleDot, Hexagon, Network, Loader2, ChevronRight, Play,
    BarChart3, PieChart, ArrowRight, Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#06B6D4', '#84CC16'];

const GEOGRAPHICAL_MODELS = [
    { id: 'gravity', name: 'Gravity Model', icon: Target, color: '#3B82F6', category: 'spatial', description: 'Predicts interaction between places based on size and distance' },
    { id: 'central-place', name: 'Central Place Theory', icon: Hexagon, color: '#8B5CF6', category: 'urban', description: 'Explains size and distribution of settlements' },
    { id: 'von-thunen', name: 'Von Thünen Model', icon: CircleDot, color: '#10B981', category: 'agricultural', description: 'Agricultural land use patterns around a market center' },
    { id: 'christaller', name: "Christaller's Model", icon: Network, color: '#F59E0B', category: 'urban', description: 'Hierarchical arrangement of settlements' },
    { id: 'weber', name: "Weber's Industrial Location", icon: Factory, color: '#EF4444', category: 'industrial', description: 'Optimal industrial location based on transport costs' },
    { id: 'bid-rent', name: 'Bid Rent Theory', icon: Home, color: '#EC4899', category: 'urban', description: 'Land use and value variation with distance from CBD' },
    { id: 'burgess', name: 'Concentric Zone Model', icon: CircleDot, color: '#06B6D4', category: 'urban', description: 'Burgess model of urban growth in rings' },
    { id: 'hoyt', name: 'Sector Model', icon: PieChart, color: '#84CC16', category: 'urban', description: 'Hoyt model - urban growth along transportation routes' },
    { id: 'harris-ullman', name: 'Multiple Nuclei Model', icon: Layers, color: '#F97316', category: 'urban', description: 'Harris & Ullman - cities develop around multiple centers' },
    { id: 'urban-realms', name: 'Urban Realms Model', icon: Map, color: '#14B8A6', category: 'urban', description: 'Suburban realms as self-sufficient urban areas' },
    { id: 'galactic', name: 'Peripheral Model', icon: Globe, color: '#A855F7', category: 'urban', description: 'Galactic city model - edge cities and suburban growth' },
    { id: 'world-systems', name: 'World Systems Theory', icon: Globe, color: '#0EA5E9', category: 'global', description: 'Wallerstein - core, periphery, semi-periphery nations' },
    { id: 'core-periphery', name: 'Core-Periphery Model', icon: Target, color: '#D946EF', category: 'development', description: 'Economic development disparities between regions' },
    { id: 'rostow', name: "Rostow's Stages of Growth", icon: TrendingUp, color: '#22C55E', category: 'development', description: '5 stages of economic development' },
    { id: 'dtm', name: 'Demographic Transition Model', icon: Users, color: '#EAB308', category: 'demographic', description: 'Population changes through development stages' },
    { id: 'epidemiological', name: 'Epidemiological Transition', icon: BarChart3, color: '#EF4444', category: 'demographic', description: 'Changing patterns of disease with development' }
];

const CATEGORIES = [
    { id: 'all', name: 'All Models' },
    { id: 'urban', name: 'Urban Models' },
    { id: 'development', name: 'Development' },
    { id: 'demographic', name: 'Demographic' },
    { id: 'spatial', name: 'Spatial' },
    { id: 'global', name: 'Global' }
];

export default function GeographicalModels({ selectedCountries = [] }) {
    const [selectedModel, setSelectedModel] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredModels = activeCategory === 'all' 
        ? GEOGRAPHICAL_MODELS 
        : GEOGRAPHICAL_MODELS.filter(m => m.category === activeCategory);

    const runModelAnalysis = async (model) => {
        if (selectedCountries.length === 0) {
            alert('Please select at least one country first');
            return;
        }
        
        setSelectedModel(model);
        setLoading(true);
        setAnalysisData(null);

        const countriesStr = selectedCountries.join(', ');

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Analyze ${countriesStr} using the ${model.name} geographical/economic model. 
                
                Provide:
                1. How this model applies to these countries
                2. Current stage/position in the model
                3. Key indicators and metrics
                4. Predictions and trends
                5. Comparison between countries if multiple selected
                
                Return JSON with:
                - summary (detailed markdown analysis)
                - currentStage (string describing current position)
                - indicators (array of {name, value, trend: 'up'|'down'|'stable'})
                - chartData (array of 6 objects with {stage, value} for visualization)
                - predictions (array of 3-4 prediction strings)
                - countryComparison (array of {country, score, stage} if multiple countries)`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        summary: { type: "string" },
                        currentStage: { type: "string" },
                        indicators: { type: "array", items: { type: "object" } },
                        chartData: { type: "array", items: { type: "object" } },
                        predictions: { type: "array", items: { type: "string" } },
                        countryComparison: { type: "array", items: { type: "object" } }
                    }
                }
            });
            setAnalysisData(response);
        } catch (error) {
            console.error('Model analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeCategory === cat.id 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredModels.map(model => (
                    <div
                        key={model.id}
                        className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                            selectedModel?.id === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => runModelAnalysis(model)}
                    >
                        <div className="flex items-start gap-3">
                            <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${model.color}15` }}
                            >
                                <model.icon className="w-5 h-5" style={{ color: model.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm">{model.name}</h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{model.description}</p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">{model.category}</span>
                            <Play className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Analysis Results */}
            {loading && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Analyzing {selectedCountries.join(', ')} using {selectedModel?.name}...</p>
                </div>
            )}

            {!loading && analysisData && selectedModel && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b">
                        <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${selectedModel.color}15` }}
                        >
                            <selectedModel.icon className="w-6 h-6" style={{ color: selectedModel.color }} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900">{selectedModel.name} Analysis</h3>
                            <p className="text-sm text-gray-500">{selectedCountries.join(', ')}</p>
                        </div>
                    </div>

                    {/* Current Stage */}
                    {analysisData.currentStage && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                            <h4 className="font-semibold text-blue-900 mb-1">Current Position</h4>
                            <p className="text-blue-700">{analysisData.currentStage}</p>
                        </div>
                    )}

                    {/* Indicators */}
                    {analysisData.indicators?.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {analysisData.indicators.slice(0, 4).map((ind, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-600">{ind.name}</p>
                                    <p className="text-xl font-bold text-gray-900">{ind.value}</p>
                                    <span className={`text-xs ${ind.trend === 'up' ? 'text-emerald-600' : ind.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                                        {ind.trend === 'up' ? '↑' : ind.trend === 'down' ? '↓' : '→'} {ind.trend}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {analysisData.chartData?.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-5">
                                <h4 className="font-semibold text-gray-900 mb-4">Model Visualization</h4>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analysisData.chartData}>
                                            <defs>
                                                <linearGradient id="modelGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={selectedModel.color} stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor={selectedModel.color} stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="stage" fontSize={10} />
                                            <YAxis fontSize={10} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="value" stroke={selectedModel.color} fill="url(#modelGrad)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {analysisData.countryComparison?.length > 1 && (
                            <div className="bg-gray-50 rounded-xl p-5">
                                <h4 className="font-semibold text-gray-900 mb-4">Country Comparison</h4>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analysisData.countryComparison} layout="vertical">
                                            <XAxis type="number" fontSize={10} />
                                            <YAxis type="category" dataKey="country" fontSize={10} width={80} />
                                            <Tooltip />
                                            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                                                {analysisData.countryComparison.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="prose prose-sm max-w-none">
                        <h4 className="font-semibold text-gray-900 mb-2">Detailed Analysis</h4>
                        <ReactMarkdown>{analysisData.summary || ''}</ReactMarkdown>
                    </div>

                    {/* Predictions */}
                    {analysisData.predictions?.length > 0 && (
                        <div className="bg-amber-50 rounded-xl p-4">
                            <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Predictions & Trends
                            </h4>
                            <div className="space-y-2">
                                {analysisData.predictions.map((pred, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-amber-800">
                                        <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{pred}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!loading && !analysisData && selectedCountries.length > 0 && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
                    <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Model to Analyze</h3>
                    <p className="text-sm text-gray-500">Click on any geographical model above to analyze {selectedCountries.join(', ')}</p>
                </div>
            )}

            {selectedCountries.length === 0 && (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 text-center">
                    <Globe className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                    <p className="text-amber-700">Please select countries from the header dropdown to run model analysis</p>
                </div>
            )}
        </div>
    );
}