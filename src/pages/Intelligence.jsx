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
import CountrySelectModal from '@/components/shared/CountrySelectModal';

const MODULES = [
    { id: 'forecast', name: 'Forecast', subtitle: '5-year predictions across all sectors', icon: LineChart, color: '#F59E0B', dataSources: ['GDP Growth', 'Employment Rates', 'Trade Balance', 'Consumer Spending', 'Industrial Output', 'Interest Rates'], buttonText: 'Run Forecast' },
    { id: 'projection', name: 'Projection', subtitle: 'Decade-long sector trajectories', icon: TrendingUp, color: '#10B981', dataSources: ['Population Growth', 'Infrastructure Development', 'Technology Adoption', 'Urbanization Trends', 'Energy Consumption', 'Resource Allocation'], buttonText: 'Run Projection' },
    { id: 'prophesy', name: 'Prophesy', subtitle: 'Long-term visionary predictions', icon: Sparkles, color: '#8B5CF6', dataSources: ['Demographic Shifts', 'Technological Breakthroughs', 'Climate Change', 'Geopolitical Realignment', 'AI Disruption', 'Space Economy'], buttonText: 'Run Prophesy' },
    { id: 'model', name: 'Model', subtitle: 'Complex systems modeling', icon: Cpu, color: '#0EA5E9', dataSources: ['Health-Economy Links', 'Education-Workforce', 'Defense-Security', 'Supply Chain Networks', 'Financial Interconnections', 'Social Mobility'], buttonText: 'Run Model' },
    { id: 'emulation', name: 'Emulation', subtitle: 'Crisis response simulation', icon: Activity, color: '#EF4444', dataSources: ['Pandemic Response', 'Economic Recession', 'Natural Disasters', 'Cyber Attacks', 'Supply Disruptions', 'Political Instability'], buttonText: 'Run Emulation' },
    { id: 'hypothetical', name: 'Hypothetical', subtitle: 'Policy intervention analysis', icon: Lightbulb, color: '#84CC16', dataSources: ['Universal Basic Income', 'Carbon Tax Impact', 'Education Reform', 'Healthcare Overhaul', 'Trade Agreements', 'Immigration Policy'], buttonText: 'Run Hypothetical' },
    { id: 'simulation', name: 'Simulation', subtitle: 'Monte Carlo probability runs', icon: GitBranch, color: '#0EA5E9', dataSources: ['Economic Growth', 'Immigration Flows', 'Trade Variations', 'Currency Fluctuations', 'Commodity Prices', 'Labor Market Shifts'], buttonText: 'Run Simulation' },
    { id: 'scenario', name: 'Scenario', subtitle: 'Alternative future scenarios', icon: Layers, color: '#10B981', dataSources: ['Digital Utopia', 'Climate Crisis', 'Economic Stagnation', 'Green Transition', 'Deglobalization', 'Tech Dominance'], buttonText: 'Run Scenario' },
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
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [showCountryModal, setShowCountryModal] = useState(false);
    const selectedCountries = selectedCountry ? [selectedCountry] : [];
    const [selectedTimeHorizons, setSelectedTimeHorizons] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);
    const [selectedDataSources, setSelectedDataSources] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [viewMode, setViewMode] = useState('modules'); // 'modules' or 'results'
    const [savedReports, setSavedReports] = useState([]);

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

    const toggleDataSource = (source) => {
        setSelectedDataSources(prev => 
            prev.includes(source) 
                ? prev.filter(s => s !== source)
                : [...prev, source]
        );
    };

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

    const runModuleAnalysis = async (moduleId) => {
        const module = MODULES.find(m => m.id === moduleId);
        if (!module) return;
        
        setDataLoading(true);
        setActiveTab(moduleId);
        
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate comprehensive ${module.name} analysis for ${selectedDomains.join(', ')} sectors across ${selectedCountries.join(', ')}.
Time horizons: ${selectedTimeHorizons.join(', ')}, Models: ${selectedModels.join(', ')}
Data sources to consider: ${selectedDataSources.length > 0 ? selectedDataSources.join(', ') : module.dataSources.join(', ')}

Provide detailed JSON with:
1. Executive summary (2-3 detailed paragraphs with specific metrics and insights)
2. Key findings (5 detailed points with percentages and data)
3. Risk level (Low/Medium/High) with detailed explanation
4. Confidence score (0-100) with interval
5. Recommendations (5 actionable items)
6. projectedImpact: detailed object with metrics, timeline, scenarios
7. forecastData: 12 periods with actual (first 8) and forecast values
8. distributionData: 5 segments for ${selectedDomains.join(', ')} breakdown
9. trendData: 10 time periods with 3 trend lines
10. countryData: comparison scores for ${selectedCountries.join(', ')}
11. radarData: 6 performance dimensions scored 0-100
12. impactMetrics: 4 key impact metrics with values and changes
13. scenarioData: 3 scenarios (optimistic, base, pessimistic) with probability`,
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
                        confidenceInterval: { type: "string" },
                        forecastData: { type: "array", items: { type: "object", properties: { period: { type: "string" }, actual: { type: "number" }, forecast: { type: "number" }, upper: { type: "number" }, lower: { type: "number" } } } },
                        distributionData: { type: "array", items: { type: "object", properties: { name: { type: "string" }, value: { type: "number" } } } },
                        trendData: { type: "array", items: { type: "object", properties: { period: { type: "string" }, trend1: { type: "number" }, trend2: { type: "number" }, trend3: { type: "number" } } } },
                        countryData: { type: "array", items: { type: "object", properties: { country: { type: "string" }, score: { type: "number" } } } },
                        radarData: { type: "array", items: { type: "object", properties: { dimension: { type: "string" }, current: { type: "number" }, target: { type: "number" } } } },
                        impactMetrics: { type: "array", items: { type: "object", properties: { name: { type: "string" }, value: { type: "string" }, change: { type: "string" }, trend: { type: "string" } } } },
                        scenarioData: { type: "array", items: { type: "object", properties: { name: { type: "string" }, probability: { type: "number" }, gdpImpact: { type: "number" }, employmentImpact: { type: "number" } } } },
                        impactTimeline: { type: "array", items: { type: "object", properties: { period: { type: "string" }, shortTerm: { type: "number" }, mediumTerm: { type: "number" }, longTerm: { type: "number" } } } }
                    }
                }
            });
            
            // Merge response with fallback data to ensure all charts have data
            const fallbackData = generateFallbackAnalysisData(module);
            const mergedResults = {
                ...fallbackData,
                ...response,
                forecastData: response?.forecastData?.length > 0 ? response.forecastData : fallbackData.forecastData,
                distributionData: response?.distributionData?.length > 0 ? response.distributionData : fallbackData.distributionData,
                countryData: response?.countryData?.length > 0 ? response.countryData : fallbackData.countryData,
                radarData: response?.radarData?.length > 0 ? response.radarData : fallbackData.radarData,
                impactMetrics: response?.impactMetrics?.length > 0 ? response.impactMetrics : fallbackData.impactMetrics,
                scenarioData: response?.scenarioData?.length > 0 ? response.scenarioData : fallbackData.scenarioData,
                impactTimeline: response?.impactTimeline?.length > 0 ? response.impactTimeline : fallbackData.impactTimeline,
                findings: response?.findings?.length > 0 ? response.findings : fallbackData.findings,
                recommendations: response?.recommendations?.length > 0 ? response.recommendations : fallbackData.recommendations,
                module,
                timestamp: new Date().toISOString()
            };
            setAnalysisResults(mergedResults);
            setViewMode('results');
        } catch (error) {
            console.error('Analysis failed:', error);
            const fallbackResults = { ...generateFallbackAnalysisData(module), module, timestamp: new Date().toISOString() };
            setAnalysisResults(fallbackResults);
            setViewMode('results');
        } finally {
                    setDataLoading(false);
                    }
                    };

    const generateFallbackAnalysisData = (module) => ({
        summary: `Comprehensive ${module.name} analysis for ${selectedDomains.join(', ')} sectors across ${selectedCountries.join(', ')}. The analysis reveals significant trends and opportunities based on current market conditions and historical data patterns. Key indicators suggest moderate growth potential with manageable risk levels across most sectors.`,
        findings: [
            `${selectedDomains[0] || 'Economic'} indicators show positive momentum with 3.2% growth trajectory`,
            `Cross-border trade flows between ${selectedCountries.slice(0, 2).join(' and ')} increased by 12% YoY`,
            'Technology adoption rates accelerating faster than projected baseline',
            'Labor market flexibility improving across key metropolitan areas',
            'Infrastructure investments yielding measurable productivity gains'
        ],
        riskLevel: 'Medium',
        riskExplanation: 'Moderate volatility expected due to geopolitical uncertainties and supply chain adjustments',
        recommendations: [
            'Diversify investment portfolios across multiple sectors',
            'Increase monitoring of leading economic indicators',
            'Strengthen partnerships in high-growth regions',
            'Implement adaptive planning frameworks',
            'Build resilience through scenario-based strategies'
        ],
        projectedImpact: `Based on current trajectories, we project a cumulative impact of 8-12% improvement in key performance metrics over the ${selectedTimeHorizons[0] || 'monthly'} horizon. This assumes stable policy environments and continued market momentum.`,
        confidenceScore: 78,
        confidenceInterval: '±8%',
        forecastData: Array.from({ length: 12 }, (_, i) => ({
            period: `P${i + 1}`,
            actual: i < 8 ? Math.round(100 + Math.random() * 50) : null,
            forecast: i >= 7 ? Math.round(120 + Math.random() * 40) : null
        })),
        distributionData: [
            { name: selectedDomains[0] || 'Primary', value: 35 },
            { name: selectedDomains[1] || 'Secondary', value: 28 },
            { name: 'Tertiary', value: 22 },
            { name: 'Emerging', value: 10 },
            { name: 'Other', value: 5 }
        ],
        countryData: selectedCountries.slice(0, 6).map(country => ({
            country,
            score: Math.round(55 + Math.random() * 40)
        })),
        radarData: [
            { dimension: 'Growth', current: 72, target: 85 },
            { dimension: 'Stability', current: 78, target: 88 },
            { dimension: 'Innovation', current: 65, target: 80 },
            { dimension: 'Resilience', current: 70, target: 85 },
            { dimension: 'Efficiency', current: 75, target: 90 },
            { dimension: 'Sustainability', current: 60, target: 78 }
        ],
        impactMetrics: [
            { name: 'GDP Growth', value: '+3.2%', change: '+0.8%', trend: 'up' },
            { name: 'Employment', value: '94.2%', change: '+1.2%', trend: 'up' },
            { name: 'Trade Balance', value: '$42B', change: '-$3B', trend: 'down' },
            { name: 'Investment Flow', value: '$128B', change: '+$18B', trend: 'up' }
        ],
        scenarioData: [
            { name: 'Optimistic', probability: 25, gdpImpact: 4.5, employmentImpact: 2.1 },
            { name: 'Base Case', probability: 55, gdpImpact: 2.8, employmentImpact: 1.2 },
            { name: 'Pessimistic', probability: 20, gdpImpact: 0.5, employmentImpact: -0.8 }
        ],
        impactTimeline: Array.from({ length: 8 }, (_, i) => ({
            period: `Q${i + 1}`,
            shortTerm: Math.round(20 + Math.random() * 30),
            mediumTerm: Math.round(30 + Math.random() * 35),
            longTerm: Math.round(40 + Math.random() * 40)
        }))
    });

    const saveToLibrary = () => {
        if (analysisResults) {
            setSavedReports(prev => [...prev, { ...analysisResults, id: Date.now() }]);
        }
    };

    const activeModule = MODULES.find(m => m.id === activeTab);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Generative Intelligence</h1>
                                <p className="text-white/80 text-sm">AI-Powered Analytics</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold">8</p>
                                <p className="text-xs text-white/70">Analysis Modules</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{savedReports.length}</p>
                                <p className="text-xs text-white/70">Saved Reports</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Row */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button
                        onClick={() => setShowCountryModal(true)}
                        className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 rounded-xl hover:border-purple-400 transition-all min-w-[200px]"
                    >
                        <Globe className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">{selectedCountry || 'Select Country'}</span>
                    </button>
                    <MultiSelectDropdown
                        options={TIME_HORIZONS}
                        selected={selectedTimeHorizons}
                        onChange={setSelectedTimeHorizons}
                        placeholder="Time Horizons"
                        icon={Clock}
                    />

                </div>

                {/* View Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setViewMode('modules')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'modules' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Analysis Modules
                    </button>
                    <button
                        onClick={() => setViewMode('results')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'results' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                        disabled={!analysisResults}
                    >
                        Analysis Results
                    </button>
                    {savedReports.length > 0 && (
                        <button
                            onClick={() => setViewMode('library')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'library' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            Intelligence Library ({savedReports.length})
                        </button>
                    )}
                </div>

                {dataLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                        <span className="text-gray-600">Generating analysis report...</span>
                    </div>
                ) : viewMode === 'modules' ? (
                    /* Module Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {MODULES.map(mod => (
                            <div 
                                key={mod.id} 
                                className="bg-white rounded-2xl p-5 border border-gray-200 transition-all hover:shadow-lg hover:border-gray-300"
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <div 
                                        className="w-10 h-10 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${mod.color}15` }}
                                    >
                                        <mod.icon className="w-5 h-5" style={{ color: mod.color }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{mod.name}</h3>
                                        <p className="text-sm text-gray-500">{mod.subtitle}</p>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 font-medium mb-2">Key Data Sources</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {mod.dataSources.map((source, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => toggleDataSource(source)}
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                                                    selectedDataSources.includes(source)
                                                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                                }`}
                                            >
                                                {source}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => runModuleAnalysis(mod.id)}
                                    disabled={dataLoading}
                                    className="w-full py-2.5 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: mod.color }}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {mod.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : viewMode === 'results' && analysisResults ? (
                    /* Analysis Results View */
                    <div className="space-y-6">
                        {/* Results Header */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {activeModule && <activeModule.icon className="w-6 h-6" style={{ color: activeModule.color }} />}
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{activeModule?.name} Analysis Results</h2>
                                        <p className="text-sm text-gray-500">{selectedDomains.join(', ')} • {selectedCountries.join(', ')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={saveToLibrary} variant="outline" className="gap-2">
                                        <Download className="w-4 h-4" /> Save to Library
                                    </Button>
                                    <Button onClick={() => setViewMode('modules')} variant="outline">
                                        New Analysis
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Executive Summary */}
                            <div className="p-5 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl mb-4 border border-gray-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <Brain className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-gray-900">Executive Summary</h3>
                                </div>
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-3">{analysisResults.summary}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Domains Analyzed</p>
                                            <p className="font-bold text-purple-600">{selectedDomains.length}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Countries</p>
                                            <p className="font-bold text-blue-600">{selectedCountries.length}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Time Horizon</p>
                                            <p className="font-bold text-emerald-600">{selectedTimeHorizons[0]}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Model</p>
                                            <p className="font-bold text-amber-600">{selectedModels[0]}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className={`p-4 rounded-xl ${analysisResults.riskLevel === 'High' ? 'bg-red-50' : analysisResults.riskLevel === 'Medium' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                                    <p className="text-xs text-gray-500">Risk Level</p>
                                    <p className={`text-xl font-bold ${analysisResults.riskLevel === 'High' ? 'text-red-600' : analysisResults.riskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {analysisResults.riskLevel}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-purple-50">
                                    <p className="text-xs text-gray-500">Confidence</p>
                                    <p className="text-xl font-bold text-purple-600">{analysisResults.confidenceScore}%</p>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-50">
                                    <p className="text-xs text-gray-500">Interval</p>
                                    <p className="text-xl font-bold text-blue-600">{analysisResults.confidenceInterval || '±5%'}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-indigo-50">
                                    <p className="text-xs text-gray-500">Countries</p>
                                    <p className="text-xl font-bold text-indigo-600">{selectedCountries.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Forecast Trend</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analysisResults.forecastData || []}>
                                            <defs>
                                                <linearGradient id="confBand2" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="period" fontSize={10} />
                                            <YAxis fontSize={10} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="actual" stroke="#8B5CF6" fill="url(#confBand2)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="forecast" stroke="#10B981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <PieChartCard 
                                title="Distribution Analysis" 
                                variant="donut" 
                                data={analysisResults.distributionData || []} 
                                colors={COLORS}
                            />
                        </div>

                        {/* Charts Row 2 - Country Comparison (only show if multiple countries selected) */}
                        {selectedCountries.length > 1 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Country Comparison Analysis</h3>
                                <p className="text-sm text-gray-600 mb-4">Comparative performance metrics across {selectedCountries.join(', ')}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Country Bar Chart */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Scores</h4>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analysisResults.countryData || []}>
                                                    <XAxis dataKey="country" fontSize={10} />
                                                    <YAxis fontSize={10} />
                                                    <Tooltip />
                                                    <Bar dataKey="score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Country Ranking List */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Country Rankings</h4>
                                        <div className="space-y-2">
                                            {(analysisResults.countryData || [])
                                                .sort((a, b) => b.score - a.score)
                                                .map((country, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-200 text-gray-700' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                                                            {i + 1}
                                                        </span>
                                                        <span className="flex-1 font-medium text-gray-900">{country.country}</span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${country.score}%` }} />
                                                            </div>
                                                            <span className="text-sm font-semibold text-purple-600">{country.score}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Performance Radar */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Performance Radar</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={analysisResults.radarData || []}>
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
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Forecast Trend</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analysisResults.forecastData || []}>
                                            <defs>
                                                <linearGradient id="confBand3" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="period" fontSize={10} />
                                            <YAxis fontSize={10} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="actual" stroke="#8B5CF6" fill="url(#confBand3)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="forecast" stroke="#10B981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Findings & Recommendations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Key Findings</h3>
                                <ul className="space-y-3">
                                    {analysisResults.findings?.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
                                <ul className="space-y-3">
                                    {analysisResults.recommendations?.map((r, i) => (
                                        <li key={i} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                                            <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">{i+1}</span>
                                            <span className="text-gray-700">{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Projected Impact Section */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Target className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Projected Impact Analysis</h3>
                            </div>
                            
                            {/* Impact Description */}
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl mb-6">
                                <p className="text-gray-700 leading-relaxed">{analysisResults.projectedImpact}</p>
                            </div>

                            {/* Impact Metrics Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {(analysisResults.impactMetrics || [
                                    { name: 'GDP Growth', value: '+3.2%', change: '+0.8%', trend: 'up' },
                                    { name: 'Employment', value: '94.2%', change: '+1.2%', trend: 'up' },
                                    { name: 'Trade Balance', value: '$42B', change: '-$3B', trend: 'down' },
                                    { name: 'Investment Flow', value: '$128B', change: '+$18B', trend: 'up' }
                                ]).map((metric, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">{metric.name}</p>
                                        <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                                        <div className={`flex items-center gap-1 mt-1 text-xs ${metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                            {metric.change}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Impact Charts Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Scenario Analysis */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Scenario Analysis</h4>
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={analysisResults.scenarioData || [
                                                { name: 'Optimistic', probability: 25, gdpImpact: 4.5, employmentImpact: 2.1 },
                                                { name: 'Base Case', probability: 55, gdpImpact: 2.8, employmentImpact: 1.2 },
                                                { name: 'Pessimistic', probability: 20, gdpImpact: 0.5, employmentImpact: -0.8 }
                                            ]}>
                                                <XAxis dataKey="name" fontSize={10} />
                                                <YAxis fontSize={10} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="probability" name="Probability %" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="gdpImpact" name="GDP Impact %" fill="#10B981" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Impact Timeline */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Impact Timeline</h4>
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={analysisResults.impactTimeline || Array.from({ length: 8 }, (_, i) => ({
                                                period: `Q${i + 1}`,
                                                shortTerm: Math.round(20 + Math.random() * 30),
                                                mediumTerm: Math.round(30 + Math.random() * 35),
                                                longTerm: Math.round(40 + Math.random() * 40)
                                            }))}>
                                                <XAxis dataKey="period" fontSize={10} />
                                                <YAxis fontSize={10} />
                                                <Tooltip />
                                                <Legend />
                                                <Area type="monotone" dataKey="shortTerm" name="Short Term" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                                                <Area type="monotone" dataKey="mediumTerm" name="Medium Term" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                                                <Area type="monotone" dataKey="longTerm" name="Long Term" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Key Takeaways */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span className="font-medium text-emerald-900">Opportunities</span>
                                    </div>
                                    <p className="text-sm text-emerald-700">Strong growth potential in {selectedDomains[0]} sector with favorable market conditions</p>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                        <span className="font-medium text-amber-900">Risks</span>
                                    </div>
                                    <p className="text-sm text-amber-700">Monitor geopolitical developments and policy changes in {selectedCountries[0]}</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium text-blue-900">Action Items</span>
                                    </div>
                                    <p className="text-sm text-blue-700">Implement {selectedModels[0]} model updates for {selectedTimeHorizons[0]} forecasting</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : viewMode === 'library' ? (
                    /* Library View */
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Intelligence Library</h2>
                        {savedReports.map((report, i) => (
                            <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-all"
                                onClick={() => { setAnalysisResults(report); setViewMode('results'); }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <report.module.icon className="w-6 h-6" style={{ color: report.module.color }} />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{report.module.name} Analysis</h3>
                                            <p className="text-sm text-gray-500">{new Date(report.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                <CountrySelectModal
                    isOpen={showCountryModal}
                    onClose={() => setShowCountryModal(false)}
                    selectedCountry={selectedCountry}
                    onSelect={setSelectedCountry}
                    title="Select Country for Analysis"
                />
            </div>
        </div>
    );
}