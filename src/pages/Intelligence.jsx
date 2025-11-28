import React, { useState, useEffect } from 'react';
import { 
    Brain, TrendingUp, Target, Sparkles, Play, Loader2, Activity, Lightbulb, Zap,
    LineChart, GitBranch, Shield, AlertTriangle, CheckCircle2, X, Maximize2, Minimize2,
    Sliders, BarChart3, RefreshCw, Layers, Clock, Cpu, ChevronRight, SlidersHorizontal,
    FileText, Users, MessageSquare, Share2, Download, Settings2, Globe, Building2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar } from 'recharts';

// Dashboard Components
import MetricCard from '@/components/dashboard/MetricCard';
import PieChartCard from '@/components/dashboard/PieChartCard';
import RadialProgressCard from '@/components/dashboard/RadialProgressCard';
import HorizontalBarChart from '@/components/dashboard/HorizontalBarChart';
import RadarChartCard from '@/components/dashboard/RadarChart';
import StackedBarChart from '@/components/dashboard/StackedBarChart';
import AreaChartWithMarkers from '@/components/dashboard/AreaChartWithMarkers';
import MultiSelectDropdown from '@/components/intelligence/MultiSelectDropdown';
import LineChartWithMarkers from '@/components/dashboard/LineChartWithMarkers';

const MODULES = [
    { id: 'forecast', name: 'Forecast', subtitle: '5-year predictions across all sectors', icon: LineChart, color: '#F59E0B', bgColor: '#FEF3C7', dataSources: ['GDP Growth', 'Employment Rates', 'Trade Balance'], buttonText: 'Run Forecast' },
    { id: 'projection', name: 'Projection', subtitle: 'Decade-long sector trajectories', icon: TrendingUp, color: '#10B981', bgColor: '#D1FAE5', dataSources: ['Population Growth', 'Infrastructure Development', 'Technology Adoption'], buttonText: 'Run Projection' },
    { id: 'prophesy', name: 'Prophesy', subtitle: 'Long-term visionary predictions', icon: Sparkles, color: '#8B5CF6', bgColor: '#EDE9FE', dataSources: ['Demographic Shifts', 'Technological Breakthroughs', 'Climate Change'], buttonText: 'Run Prophesy' },
    { id: 'model', name: 'Model', subtitle: 'Complex systems modeling', icon: Cpu, color: '#0EA5E9', bgColor: '#E0F2FE', dataSources: ['Health-Economy Links', 'Education-Workforce', 'Defense-Security'], buttonText: 'Run Model' },
    { id: 'emulation', name: 'Emulation', subtitle: 'Crisis response simulation', icon: Activity, color: '#EF4444', bgColor: '#FEE2E2', dataSources: ['Pandemic Response', 'Economic Recession', 'Natural Disasters'], buttonText: 'Run Emulation' },
    { id: 'hypothetical', name: 'Hypothetical', subtitle: 'Policy intervention analysis', icon: Lightbulb, color: '#84CC16', bgColor: '#ECFCCB', dataSources: ['Universal Basic Income', 'Carbon Tax Impact', 'Education Reform'], buttonText: 'Run Hypothetical' },
    { id: 'simulation', name: 'Simulation', subtitle: 'Monte Carlo probability runs', icon: GitBranch, color: '#0EA5E9', bgColor: '#E0F2FE', dataSources: ['Economic Growth', 'Immigration Flows', 'Trade Variations'], buttonText: 'Run Simulation' },
    { id: 'scenario', name: 'Scenario', subtitle: 'Alternative future scenarios', icon: Layers, color: '#10B981', bgColor: '#D1FAE5', dataSources: ['Digital Utopia', 'Climate Crisis', 'Economic Stagnation'], buttonText: 'Run Scenario' },
    { id: 'custom', name: 'Custom Query', subtitle: 'Ask anything with AI', icon: MessageSquare, color: '#84CC16', bgColor: '#ECFCCB', dataSources: [], buttonText: 'Generate Analysis', isCustom: true },
];

const DOMAINS = ['Economy', 'Health', 'Education', 'Defense', 'Trade', 'Labor', 'Tourism', 'Climate'];
const COUNTRIES = ['USA', 'China', 'India', 'Germany', 'UK', 'France', 'Japan', 'Brazil', 'Canada', 'Australia', 'South Korea', 'Spain', 'Italy', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia', 'Turkey', 'Switzerland', 'Poland'];
const TIME_HORIZONS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', '5-Year', '10-Year'];
const MODEL_TYPES = ['ARIMA', 'LSTM', 'Transformer', 'Ensemble', 'Gradient Boosting'];

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#0EA5E9', '#6366F1'];

export default function Intelligence() {
    useEffect(() => {
        document.title = 'AI Intelligence for automated decision making';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Intelligence platform delivering automated insights and smarter decisions for growth.');
        document.querySelector('meta[name="keywords"]')?.setAttribute('content', 'AI Intelligence, Intelligence');
    }, []);

    const [activeTab, setActiveTab] = useState('forecast');
    const [selectedDomains, setSelectedDomains] = useState(['Economy']);
    const [selectedCountries, setSelectedCountries] = useState(['USA', 'China']);
    const [selectedTimeHorizons, setSelectedTimeHorizons] = useState(['Monthly']);
    const [selectedModels, setSelectedModels] = useState(['Ensemble']);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Dynamic data states
    const [forecastData, setForecastData] = useState([]);
    const [riskData, setRiskData] = useState([]);
    const [opportunityData, setOpportunityData] = useState([]);
    const [impactData, setImpactData] = useState([]);
    const [radarData, setRadarData] = useState([]);
    const [distributionData, setDistributionData] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [countryComparisonData, setCountryComparisonData] = useState([]);
    const [timeSeriesData, setTimeSeriesData] = useState([]);

    // What-If Parameters
    const [interestRate, setInterestRate] = useState([3.5]);
    const [populationGrowth, setPopulationGrowth] = useState([1.2]);
    const [tradeFlows, setTradeFlows] = useState([50]);
    const [energyPrices, setEnergyPrices] = useState([75]);

    // Load dynamic data based on domain
    useEffect(() => {
        loadDynamicData();
    }, [selectedDomains, selectedCountries, selectedTimeHorizons, selectedModels, activeTab]);

    const loadDynamicData = async () => {
        setDataLoading(true);
        try {
            const domains = selectedDomains.join(', ');
            const countries = selectedCountries.join(', ');
            const horizons = selectedTimeHorizons.join(', ');
            const models = selectedModels.join(', ');
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate realistic analytics data for ${domains} sectors across ${countries}.
Time horizons: ${horizons}. Models: ${models}. Analysis type: ${activeTab}.

Provide JSON with:
1. forecastData: 12 periods with actual (first 8) and forecast values (periods 9-12), include upper/lower confidence bounds
2. riskData: 5 risk categories with likelihood (0-100) and impact (0-100) scores
3. opportunityData: 5 growth opportunities with potential (0-100) and feasibility (0-100)
4. radarData: 6 performance dimensions each scored 0-100
5. distributionData: 5 segments with percentage breakdown (must sum to 100)
6. metrics: accuracy (%), confidence (%), trend (up/down/stable), volatility (low/medium/high)
7. countryComparisonData: 6 countries with score values for comparison
8. timeSeriesData: 10 time periods with multiple trend lines`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        forecastData: { 
                            type: "array", 
                            items: { 
                                type: "object", 
                                properties: { 
                                    period: { type: "string" }, 
                                    actual: { type: "number" }, 
                                    forecast: { type: "number" }, 
                                    upper: { type: "number" }, 
                                    lower: { type: "number" } 
                                } 
                            } 
                        },
                        riskData: { 
                            type: "array", 
                            items: { 
                                type: "object", 
                                properties: { 
                                    name: { type: "string" }, 
                                    likelihood: { type: "number" }, 
                                    impact: { type: "number" } 
                                } 
                            } 
                        },
                        opportunityData: { 
                            type: "array", 
                            items: { 
                                type: "object", 
                                properties: { 
                                    name: { type: "string" }, 
                                    potential: { type: "number" }, 
                                    feasibility: { type: "number" } 
                                } 
                            } 
                        },
                        radarData: { 
                            type: "array", 
                            items: { 
                                type: "object", 
                                properties: { 
                                    dimension: { type: "string" }, 
                                    current: { type: "number" }, 
                                    target: { type: "number" } 
                                } 
                            } 
                        },
                        distributionData: { 
                            type: "array", 
                            items: { 
                                type: "object", 
                                properties: { 
                                    name: { type: "string" }, 
                                    value: { type: "number" } 
                                } 
                            } 
                        },
                        metrics: { 
                            type: "object", 
                            properties: { 
                                accuracy: { type: "number" }, 
                                confidence: { type: "number" }, 
                                trend: { type: "string" }, 
                                volatility: { type: "string" } 
                            } 
                        },
                        countryComparisonData: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    country: { type: "string" },
                                    score: { type: "number" }
                                }
                            }
                        },
                        timeSeriesData: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    period: { type: "string" },
                                    trend1: { type: "number" },
                                    trend2: { type: "number" },
                                    trend3: { type: "number" }
                                }
                            }
                        }
                    }
                }
            });

            if (response) {
                setForecastData(response.forecastData || []);
                setRiskData(response.riskData || []);
                setOpportunityData(response.opportunityData || []);
                setRadarData(response.radarData || []);
                setDistributionData(response.distributionData || []);
                setMetrics(response.metrics || {});
                setCountryComparisonData(response.countryComparisonData || []);
                setTimeSeriesData(response.timeSeriesData || []);
            }
        } catch (error) {
            console.error('Failed to load dynamic data:', error);
            // Fallback data
            generateFallbackData();
        } finally {
            setDataLoading(false);
        }
    };

    const generateFallbackData = () => {
        const periods = Array.from({ length: 12 }, (_, i) => {
            const base = 100 + Math.random() * 50;
            return {
                period: `P${i + 1}`,
                actual: i < 8 ? Math.round(base) : null,
                forecast: i >= 7 ? Math.round(base + (Math.random() - 0.5) * 10) : null,
                upper: i >= 7 ? Math.round(base + 15) : null,
                lower: i >= 7 ? Math.round(base - 15) : null,
            };
        });
        setForecastData(periods);
        setRiskData([
            { name: 'Market Risk', likelihood: 65, impact: 78 },
            { name: 'Regulatory', likelihood: 45, impact: 85 },
            { name: 'Operational', likelihood: 55, impact: 62 },
            { name: 'Cyber Risk', likelihood: 70, impact: 90 },
            { name: 'Climate', likelihood: 60, impact: 72 },
        ]);
        setOpportunityData([
            { name: 'Digital Transformation', potential: 85, feasibility: 72 },
            { name: 'Market Expansion', potential: 78, feasibility: 65 },
            { name: 'Innovation', potential: 90, feasibility: 55 },
            { name: 'Partnerships', potential: 70, feasibility: 80 },
            { name: 'Sustainability', potential: 75, feasibility: 68 },
        ]);
        setRadarData([
            { dimension: 'Growth', current: 75, target: 90 },
            { dimension: 'Efficiency', current: 82, target: 88 },
            { dimension: 'Innovation', current: 68, target: 85 },
            { dimension: 'Resilience', current: 78, target: 92 },
            { dimension: 'Sustainability', current: 65, target: 80 },
            { dimension: 'Compliance', current: 88, target: 95 },
        ]);
        setDistributionData([
            { name: 'Segment A', value: 35 },
            { name: 'Segment B', value: 28 },
            { name: 'Segment C', value: 20 },
            { name: 'Segment D', value: 12 },
            { name: 'Other', value: 5 },
        ]);
        setMetrics({ accuracy: 94, confidence: 87, trend: 'up', volatility: 'medium' });
        setCountryComparisonData(selectedCountries.slice(0, 6).map(country => ({
            country,
            score: Math.round(50 + Math.random() * 45)
        })));
        setTimeSeriesData(Array.from({ length: 10 }, (_, i) => ({
            period: `T${i + 1}`,
            trend1: Math.round(50 + Math.random() * 40),
            trend2: Math.round(60 + Math.random() * 35),
            trend3: Math.round(45 + Math.random() * 45)
        })));
    };

    const runAnalysis = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Perform ${activeTab} analysis for ${selectedDomains.join(', ')} sectors across ${selectedCountries.join(', ')}: "${query}"
Time horizons: ${selectedTimeHorizons.join(', ')}, Models: ${selectedModels.join(', ')}

Provide:
1. Executive Summary
2. Key Findings (5 points)
3. Risk Level with explanation
4. Confidence intervals
5. Recommendations
6. Projected Impact with metrics`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        summary: { type: "string" },
                        findings: { type: "array", items: { type: "string" } },
                        riskLevel: { type: "string" },
                        riskExplanation: { type: "string" },
                        recommendations: { type: "array", items: { type: "string" } },
                        projectedImpact: { type: "string" },
                        confidenceScore: { type: "number" },
                        confidenceInterval: { type: "string" }
                    }
                }
            });
            setResults(response);
            setShowModal(true);
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const activeModule = MODULES.find(m => m.id === activeTab);
    const gdpProjection = (2.5 + (interestRate[0] * -0.2) + (populationGrowth[0] * 0.3) + (tradeFlows[0] * 0.02) - (energyPrices[0] * 0.01)).toFixed(1);
    const [comparisonData, setComparisonData] = useState([
        { name: '2020', value1: 30, value2: 25, value3: 20 },
        { name: '2021', value1: 35, value2: 30, value3: 25 },
        { name: '2022', value1: 40, value2: 35, value3: 30 },
        { name: '2023', value1: 50, value2: 40, value3: 35 },
        { name: '2024', value1: 55, value2: 45, value3: 38 }
    ]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Controls Row */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <MultiSelectDropdown
                        options={DOMAINS}
                        selected={selectedDomains}
                        onChange={setSelectedDomains}
                        placeholder="Select Domains"
                        icon={Building2}
                    />
                    <MultiSelectDropdown
                        options={COUNTRIES}
                        selected={selectedCountries}
                        onChange={setSelectedCountries}
                        placeholder="Select Countries"
                        icon={Globe}
                    />
                    <MultiSelectDropdown
                        options={TIME_HORIZONS}
                        selected={selectedTimeHorizons}
                        onChange={setSelectedTimeHorizons}
                        placeholder="Time Horizons"
                        icon={Clock}
                    />
                    <MultiSelectDropdown
                        options={MODEL_TYPES}
                        selected={selectedModels}
                        onChange={setSelectedModels}
                        placeholder="Models"
                        icon={Cpu}
                    />
                </div>

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Generative Intelligence</h1>
                                <p className="text-white/80 text-sm">Ai-Powered Analytics</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold">7</p>
                                <p className="text-xs text-white/70">Analysis Modules</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">8</p>
                                <p className="text-xs text-white/70">Domains</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">5</p>
                                <p className="text-xs text-white/70">ML Models</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Module Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {MODULES.map(mod => (
                        <div 
                            key={mod.id} 
                            className="rounded-2xl p-5 transition-all hover:shadow-lg cursor-pointer"
                            style={{ backgroundColor: mod.bgColor }}
                            onClick={() => !mod.isCustom && setActiveTab(mod.id)}
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${mod.color}20` }}
                                >
                                    <mod.icon className="w-5 h-5" style={{ color: mod.color }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{mod.name}</h3>
                                    <p className="text-sm text-gray-600">{mod.subtitle}</p>
                                </div>
                            </div>
                            
                            {mod.isCustom ? (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-3">
                                        Ask anything: "What if we increase healthcare spending by 20%?" or "Predict economic impact of new trade agreement..."
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 font-medium mb-2">Key Data Sources</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {mod.dataSources.map((source, i) => (
                                            <span 
                                                key={i} 
                                                className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/70 text-gray-700 border border-gray-200"
                                            >
                                                {source}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (mod.isCustom) {
                                        setShowModal(true);
                                    } else {
                                        setActiveTab(mod.id);
                                        loadDynamicData();
                                    }
                                }}
                                className="w-full py-2.5 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                                style={{ backgroundColor: mod.color }}
                            >
                                <Sparkles className="w-4 h-4" />
                                {mod.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {dataLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <style>{`
                            @keyframes logoPulse {
                                0%, 100% { opacity: 0.4; transform: scale(1); }
                                50% { opacity: 0.7; transform: scale(1.03); }
                            }
                        `}</style>
                        <div className="relative mb-4 flex items-center justify-center">
                            <div className="absolute w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
                            <img 
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/622024f26_image-loading-logo.png" 
                                alt="Loading" 
                                className="w-12 h-12 object-contain grayscale opacity-50"
                                style={{ animation: 'logoPulse 1.5s ease-in-out infinite' }}
                            />
                        </div>
                        <span className="text-gray-600">Loading intelligence data...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Panel */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Metric Cards Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <MetricCard 
                                    title="Model Accuracy" 
                                    subtitle={`${selectedModels.join(', ')} Performance`} 
                                    value={`${metrics.accuracy || 94}%`} 
                                    change="+2.3%" 
                                    changeType="positive" 
                                    bgColor="#8B5CF6" 
                                />
                                <MetricCard 
                                    title="Confidence Level" 
                                    subtitle="Prediction Certainty" 
                                    value={`${metrics.confidence || 87}%`} 
                                    change="+1.5%" 
                                    changeType="positive" 
                                    bgColor="#10B981" 
                                />
                                <MetricCard 
                                    title="Trend Direction" 
                                    subtitle={`${selectedDomains.join(', ')} Outlook`} 
                                    value={metrics.trend === 'up' ? 'Bullish' : metrics.trend === 'down' ? 'Bearish' : 'Stable'} 
                                    change={metrics.volatility || 'Medium'} 
                                    changeType={metrics.trend === 'up' ? 'positive' : 'negative'} 
                                    bgColor="#F59E0B" 
                                />
                            </div>

                            {/* Forecasting View */}
                            {activeTab === 'forecast' && (
                                <>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900">Forecast Visualization</h3>
                                            <div className="flex gap-3 text-xs">
                                                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-purple-600 rounded" /> Actual</span>
                                                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-emerald-500 rounded" /> Forecast</span>
                                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-100 rounded" /> Confidence</span>
                                            </div>
                                        </div>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={forecastData}>
                                                    <defs>
                                                        <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="period" axisLine={false} tickLine={false} fontSize={11} />
                                                    <YAxis axisLine={false} tickLine={false} fontSize={11} />
                                                    <Tooltip />
                                                    <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confBand)" />
                                                    <Area type="monotone" dataKey="lower" stroke="none" fill="#fff" />
                                                    <Area type="monotone" dataKey="actual" stroke="#8B5CF6" fill="transparent" strokeWidth={2} dot={false} />
                                                    <Area type="monotone" dataKey="forecast" stroke="#10B981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <PieChartCard 
                                            title={`${selectedDomains.join(' & ')} Distribution`} 
                                            variant="donut" 
                                            data={distributionData} 
                                            colors={COLORS}
                                        />
                                        <HorizontalBarChart 
                                            title="Performance by Category" 
                                            data={opportunityData.map(d => ({ name: d.name, value1: d.potential, value2: d.feasibility }))} 
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                                            <h3 className="font-semibold text-gray-900 mb-4">Country Comparison</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={countryComparisonData}>
                                                        <XAxis dataKey="country" fontSize={10} />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Bar dataKey="score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <LineChartWithMarkers
                                            title="Multi-Trend Analysis"
                                            data={timeSeriesData}
                                            color="#8B5CF6"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Risk Assessment */}
                            {activeTab === 'risk' && (
                                <>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <h3 className="font-semibold text-gray-900 mb-4">Risk Matrix</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={riskData} layout="vertical">
                                                    <XAxis type="number" domain={[0, 100]} />
                                                    <YAxis type="category" dataKey="name" width={100} fontSize={11} />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="likelihood" fill="#8B5CF6" name="Likelihood" radius={[0, 4, 4, 0]} />
                                                    <Bar dataKey="impact" fill="#EF4444" name="Impact" radius={[0, 4, 4, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {riskData.slice(0, 4).map((risk, i) => (
                                            <RadialProgressCard 
                                                key={i}
                                                percentage={Math.round((risk.likelihood + risk.impact) / 2)} 
                                                size="medium" 
                                                color={risk.impact > 75 ? '#EF4444' : risk.impact > 50 ? '#F59E0B' : '#10B981'} 
                                                title={risk.name} 
                                            />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                                            <h3 className="font-semibold text-gray-900 mb-4">Risk Radar</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart data={radarData}>
                                                        <PolarGrid />
                                                        <PolarAngleAxis dataKey="dimension" fontSize={10} />
                                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                        <Radar name="Current" dataKey="current" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                                                        <Legend />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <LineChartWithMarkers
                                            title="Risk Trends Over Time"
                                            data={timeSeriesData}
                                            color="#EF4444"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Opportunity Mapping */}
                            {activeTab === 'opportunity' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                                            <h3 className="font-semibold text-gray-900 mb-4">Opportunity Analysis</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart data={radarData}>
                                                        <PolarGrid />
                                                        <PolarAngleAxis dataKey="dimension" fontSize={10} />
                                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                        <Radar name="Current" dataKey="current" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                                                        <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                                                        <Legend />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <PieChartCard 
                                            title="Growth Potential" 
                                            variant="pie" 
                                            data={opportunityData.map(d => ({ name: d.name, value: d.potential }))} 
                                            colors={COLORS}
                                        />
                                    </div>
                                    <HorizontalBarChart 
                                        title="Opportunity Feasibility Matrix" 
                                        data={opportunityData.map(d => ({ name: d.name, value1: d.potential, value2: d.feasibility }))} 
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                                            <h3 className="font-semibold text-gray-900 mb-4">Country Analysis</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={countryComparisonData} layout="vertical">
                                                        <XAxis type="number" domain={[0, 100]} />
                                                        <YAxis type="category" dataKey="country" width={80} fontSize={10} />
                                                        <Tooltip />
                                                        <Bar dataKey="score" fill="#EC4899" radius={[0, 4, 4, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <StackedBarChart
                                            title="Opportunity Timeline"
                                            data={comparisonData}
                                            colors={COLORS}
                                        />
                                    </div>
                                </>
                            )}

                            {/* What-If Analysis */}
                            {activeTab === 'whatif' && (
                                <>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <h3 className="font-semibold text-gray-900 mb-4">Parameter Sliders</h3>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Interest Rate</span>
                                                    <span className="text-sm text-purple-600 font-medium">{interestRate[0]}%</span>
                                                </div>
                                                <Slider value={interestRate} onValueChange={setInterestRate} min={0} max={10} step={0.1} />
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Population Growth</span>
                                                    <span className="text-sm text-purple-600 font-medium">{populationGrowth[0]}%</span>
                                                </div>
                                                <Slider value={populationGrowth} onValueChange={setPopulationGrowth} min={-2} max={5} step={0.1} />
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Trade Flows Index</span>
                                                    <span className="text-sm text-purple-600 font-medium">{tradeFlows[0]}</span>
                                                </div>
                                                <Slider value={tradeFlows} onValueChange={setTradeFlows} min={0} max={100} step={1} />
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Energy Prices Index</span>
                                                    <span className="text-sm text-purple-600 font-medium">{energyPrices[0]}</span>
                                                </div>
                                                <Slider value={energyPrices} onValueChange={setEnergyPrices} min={0} max={150} step={1} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <MetricCard 
                                            title="GDP Projection" 
                                            subtitle="Based on parameters" 
                                            value={`${gdpProjection}%`} 
                                            change={parseFloat(gdpProjection) > 2 ? 'Growth' : 'Contraction'} 
                                            changeType={parseFloat(gdpProjection) > 2 ? 'positive' : 'negative'} 
                                            bgColor="#8B5CF6" 
                                        />
                                        <MetricCard 
                                            title="Inflation Impact" 
                                            subtitle="Projected" 
                                            value={`${(interestRate[0] * 0.5 + energyPrices[0] * 0.02).toFixed(1)}%`} 
                                            change="Estimate" 
                                            changeType="neutral" 
                                            bgColor="#F59E0B" 
                                        />
                                        <MetricCard 
                                            title="Employment" 
                                            subtitle="Projected Change" 
                                            value={`${(populationGrowth[0] * 0.8 + tradeFlows[0] * 0.01).toFixed(1)}%`} 
                                            change="Forecast" 
                                            changeType="positive" 
                                            bgColor="#10B981" 
                                        />
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <h3 className="font-semibold text-gray-900 mb-4">Parameter Impact Trends</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={timeSeriesData}>
                                                    <XAxis dataKey="period" fontSize={10} />
                                                    <YAxis fontSize={11} />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Area type="monotone" dataKey="trend1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="GDP" />
                                                    <Area type="monotone" dataKey="trend2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Employment" />
                                                    <Area type="monotone" dataKey="trend3" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} name="Inflation" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Simulation */}
                            {activeTab === 'simulation' && (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <RadialProgressCard percentage={Math.round(metrics.accuracy || 85)} size="medium" color="#8B5CF6" title="Simulation Accuracy" />
                                        <RadialProgressCard percentage={Math.round(metrics.confidence || 78)} size="medium" color="#10B981" title="Convergence" />
                                        <RadialProgressCard percentage={72} size="medium" color="#F59E0B" title="Stability" />
                                        <RadialProgressCard percentage={88} size="medium" color="#3B82F6" title="Reliability" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <HorizontalBarChart 
                                            title="Monte Carlo Results" 
                                            data={riskData.map(d => ({ name: d.name, value1: d.likelihood, value2: 100 - d.impact }))} 
                                        />
                                        <PieChartCard 
                                            title="Scenario Distribution" 
                                            variant="donut" 
                                            data={distributionData} 
                                            colors={COLORS}
                                        />
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <h3 className="font-semibold text-gray-900 mb-4">Cross-Country Simulation</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={countryComparisonData}>
                                                    <XAxis dataKey="country" fontSize={10} />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Impact Analysis */}
                            {activeTab === 'impact' && (
                                <>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <h3 className="font-semibold text-gray-900 mb-4">Cross-Domain Impact</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={DOMAINS.map(d => ({ name: d, impact: 30 + Math.random() * 60, baseline: 50 }))}>
                                                    <XAxis dataKey="name" fontSize={10} />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="baseline" fill="#E5E7EB" name="Baseline" />
                                                    <Bar dataKey="impact" fill="#8B5CF6" name="Projected Impact" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <HorizontalBarChart 
                                            title="Ripple Effects" 
                                            data={opportunityData.slice(0, 4).map(d => ({ name: d.name, value1: d.potential, value2: Math.round(d.potential * 0.6) }))} 
                                        />
                                        <PieChartCard 
                                            title="Impact Distribution" 
                                            variant="pie" 
                                            data={distributionData} 
                                            colors={COLORS}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                                            <h3 className="font-semibold text-gray-900 mb-4">Country Impact Scores</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={countryComparisonData} layout="vertical">
                                                        <XAxis type="number" />
                                                        <YAxis type="category" dataKey="country" width={70} fontSize={10} />
                                                        <Tooltip />
                                                        <Bar dataKey="score" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <StackedBarChart
                                            title="Historical Impact Trends"
                                            data={comparisonData}
                                            colors={COLORS}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Scenario Builder */}
                            {activeTab === 'scenario' && (
                                <>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900">Scenario Templates</h3>
                                            <Button variant="outline" size="sm" className="gap-1">
                                                <Share2 className="w-4 h-4" /> Share
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Climate Transition', 'Economic Recession', 'Trade War', 'Tech Disruption', 'Pandemic Response', 'Defense Buildup'].map((scenario, i) => (
                                                <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all">
                                                    <h4 className="font-medium text-gray-900">{scenario}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">Pre-configured template</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <PieChartCard 
                                            title="Scenario Comparison" 
                                            variant="donut" 
                                            data={[
                                                { name: 'Optimistic', value: 35 },
                                                { name: 'Base Case', value: 40 },
                                                { name: 'Pessimistic', value: 25 }
                                            ]} 
                                            colors={['#10B981', '#8B5CF6', '#EF4444']}
                                        />
                                        <HorizontalBarChart 
                                            title="Scenario Outcomes" 
                                            data={[
                                                { name: 'GDP Growth', value1: 3.2, value2: 2.1 },
                                                { name: 'Inflation', value1: 2.5, value2: 4.2 },
                                                { name: 'Employment', value1: 95, value2: 92 }
                                            ]} 
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <LineChartWithMarkers
                                            title="Scenario Timeline"
                                            data={timeSeriesData}
                                            color="#10B981"
                                        />
                                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                                            <h3 className="font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={countryComparisonData}>
                                                        <XAxis dataKey="country" fontSize={10} />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Bar dataKey="score" fill="#10B981" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Query Input */}
                            {/* Query Input */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    <span className="font-semibold text-gray-900">Custom Analysis Query</span>
                                </div>
                                <Textarea value={query} onChange={(e) => setQuery(e.target.value)}
                                    placeholder={`e.g., "Forecast ${selectedDomains.join(' and ').toLowerCase()} indicators for ${selectedCountries.join(', ')} using ${selectedModels.join(', ')} models..."`}
                                    className="min-h-[80px] mb-3" />
                                <Button onClick={runAnalysis} disabled={loading || !query.trim()} className="bg-purple-600 hover:bg-purple-700">
                                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                                    Run Analysis
                                </Button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            {/* Capabilities */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Platform Capabilities</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                        <Cpu className="w-4 h-4 text-purple-600" />
                                        <span>Hybrid ML (ARIMA, LSTM, Transformer)</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                        <RefreshCw className="w-4 h-4 text-blue-600" />
                                        <span>Real-time ingestion & retraining</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                        <Layers className="w-4 h-4 text-emerald-600" />
                                        <span>Multi-domain transfer learning</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                        <BarChart3 className="w-4 h-4 text-amber-600" />
                                        <span>Confidence & uncertainty scoring</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                        <FileText className="w-4 h-4 text-pink-600" />
                                        <span>Ai narrative generation</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                        <Users className="w-4 h-4 text-indigo-600" />
                                        <span>Collaborative workspaces</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Model Performance</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <p className="text-xl font-bold text-purple-600">{metrics.accuracy || 94}%</p>
                                        <p className="text-xs text-gray-500">Accuracy</p>
                                    </div>
                                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                        <p className="text-xl font-bold text-emerald-600">8.4K</p>
                                        <p className="text-xs text-gray-500">Predictions</p>
                                    </div>
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xl font-bold text-blue-600">1.2K</p>
                                        <p className="text-xs text-gray-500">Scenarios</p>
                                    </div>
                                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                                        <p className="text-xl font-bold text-amber-600">Live</p>
                                        <p className="text-xs text-gray-500">Retraining</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Analyses */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Recent Analyses</h3>
                                <div className="space-y-2">
                                    {['GDP Forecast Q1 2025', 'Trade Flow Scenario', 'Climate Risk Assessment'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-700 flex-1">{item}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className={`${isFullscreen ? 'max-w-full w-full h-full rounded-none' : 'max-w-2xl max-h-[85vh]'} overflow-y-auto p-0`}>
                    {results && (
                        <div>
                            <div className="p-5 text-white" style={{ background: `linear-gradient(135deg, ${activeModule?.color || '#8B5CF6'}, #6366F1)` }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {activeModule && <activeModule.icon className="w-6 h-6" />}
                                        <div>
                                            <h2 className="text-lg font-bold">{activeModule?.name} Results</h2>
                                            <p className="text-white/80 text-sm">{selectedDomains.join(', ')} • {selectedCountries.join(', ')} • {selectedTimeHorizons.join(', ')} • {selectedModels.join(', ')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="text-white hover:bg-white/20">
                                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="text-white hover:bg-white/20">
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                                    <p className="text-gray-700">{results.summary}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Key Findings</h3>
                                    <ul className="space-y-2">
                                        {results.findings?.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                                                <span className="text-gray-600">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-xl ${results.riskLevel === 'High' ? 'bg-red-50' : results.riskLevel === 'Medium' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <AlertTriangle className={`w-4 h-4 ${results.riskLevel === 'High' ? 'text-red-500' : results.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
                                            <span className="font-medium">Risk: {results.riskLevel}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{results.riskExplanation}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-purple-50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Target className="w-4 h-4 text-purple-600" />
                                            <span className="font-medium">Confidence: {results.confidenceScore}%</span>
                                        </div>
                                        <div className="h-2 bg-purple-200 rounded-full mt-2">
                                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${results.confidenceScore}%` }} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
                                    <ul className="space-y-2">
                                        {results.recommendations?.map((r, i) => (
                                            <li key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">{i+1}</span>
                                                <span className="text-gray-700">{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-1">Projected Impact</h3>
                                    <p className="text-gray-600">{results.projectedImpact}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <Download className="w-4 h-4" /> Export
                                    </Button>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <Share2 className="w-4 h-4" /> Share
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}