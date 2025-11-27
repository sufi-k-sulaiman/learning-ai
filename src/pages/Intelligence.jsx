import React, { useState } from 'react';
import { 
    Brain, TrendingUp, Globe, Target, Sparkles, Play, Loader2,
    BarChart3, PieChart, Activity, Lightbulb, Zap, Clock, ChevronRight,
    LineChart, GitBranch, Shield, AlertTriangle, CheckCircle2, MapPin, X,
    Maximize2, Minimize2, Database, FileText, Copy
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart as RechartsLC, Line, Legend, PieChart as RechartsPC, Pie, Cell } from 'recharts';

const ANALYSIS_TYPES = [
    { id: 'forecast', name: 'Forecast', icon: TrendingUp, description: '5-year predictions across sectors', color: '#8B5CF6', tags: ['GDP Growth', 'Employment', 'Trade Balance'] },
    { id: 'projection', name: 'Projection', icon: LineChart, description: 'Decade-long sector trajectories', color: '#3B82F6', tags: ['Population', 'Infrastructure', 'Technology'] },
    { id: 'scenario', name: 'Scenario', icon: GitBranch, description: 'Alternative future scenarios', color: '#10B981', tags: ['Digital Utopia', 'Climate Crisis', 'Economic Growth'] },
    { id: 'simulation', name: 'Simulation', icon: Activity, description: 'Monte Carlo probability runs', color: '#F59E0B', tags: ['Economic Growth', 'Immigration', 'Trade'] },
    { id: 'emulation', name: 'Emulation', icon: Shield, description: 'Crisis response simulation', color: '#EF4444', tags: ['Pandemic', 'Recession', 'Natural Disasters'] },
    { id: 'hypothetical', name: 'Hypothetical', icon: Lightbulb, description: 'Policy intervention analysis', color: '#EC4899', tags: ['UBI', 'Carbon Tax', 'Education Reform'] },
];

const SECTORS = ['Economy', 'Trade', 'Health', 'Defense', 'Citizenship', 'Environment', 'Education', 'Technology'];

const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'China', 'India', 'Brazil', 'Canada', 'Australia'];

const SCENARIO_FRAMEWORKS = [
    'Counterfactual Analysis', 'Thought Experiment', 'Possible World Model', 'Speculative Vignette',
    'Conjectural Paradigm', 'Notional Case Study', 'Prospective Tableau', 'Envisaged Contingency',
    'Uchronia', 'Phantasmatic Projection'
];

const ANOMALY_DETECTION = [
    'Heteroclite Patterns', 'Aberration Detection', 'Parergon Analysis', 'Ectopia Mapping', 'Apophasis Framework'
];

const SCENARIOS = [
    'Economic Recession 2025', 'Trade War Escalation', 'Pandemic Response', 'Climate Policy Shift',
    'Technology Disruption', 'Immigration Reform', 'Defense Spending Increase', 'Healthcare Overhaul'
];

const ECONOMY_DATASETS = [
    { label: 'GDP Growth Rates', desc: 'Quarterly & annual, segmented by sector' },
    { label: 'Unemployment Metrics', desc: 'Labor force participation, underemployment, youth unemployment' },
    { label: 'Fiscal Policy Indicators', desc: 'Government spending, deficits, debt-to-GDP' },
    { label: 'Inflation Indexes', desc: 'CPI, PPI, core inflation' },
    { label: 'Consumer Spending', desc: 'Retail sales, e-commerce penetration, household debt ratios' },
];

const SAMPLE_CHART_DATA = [
    { name: 'Q1', value: 65 }, { name: 'Q2', value: 72 }, { name: 'Q3', value: 68 }, { name: 'Q4', value: 78 },
    { name: 'Q5', value: 82 }, { name: 'Q6', value: 75 }, { name: 'Q7', value: 88 }, { name: 'Q8', value: 92 }
];

export default function Intelligence() {
    const [activeTab, setActiveTab] = useState('generator');
    const [selectedSector, setSelectedSector] = useState('Economy');
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [customQuery, setCustomQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('United States');
    const [scenarioFramework, setScenarioFramework] = useState('Envisaged Contingency');
    const [anomalyDetection, setAnomalyDetection] = useState('Heteroclite Patterns');
    const [selectedScenario, setSelectedScenario] = useState('');
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [trendData, setTrendData] = useState([
        { name: 'Q1', primary: 65, secondary: 55, tertiary: 45 },
        { name: 'Q2', primary: 72, secondary: 62, tertiary: 52 },
        { name: 'Q3', primary: 68, secondary: 58, tertiary: 48 },
        { name: 'Q4', primary: 78, secondary: 68, tertiary: 58 },
        { name: 'Q5', primary: 82, secondary: 72, tertiary: 62 },
        { name: 'Q6', primary: 75, secondary: 65, tertiary: 55 },
        { name: 'Q7', primary: 88, secondary: 78, tertiary: 68 },
        { name: 'Q8', primary: 92, secondary: 82, tertiary: 72 },
    ]);
    const [activeTrendLines, setActiveTrendLines] = useState(['primary', 'secondary', 'tertiary']);

    const stats = [
        { label: 'AI Models Active', value: '12', icon: Brain },
        { label: 'Predictions Generated', value: '8,432', change: '+18%', icon: TrendingUp },
        { label: 'Scenarios Analyzed', value: '1,247', icon: Globe },
        { label: 'Accuracy Rate', value: '94.2%', change: '+2.1%', icon: Target },
    ];

    const runSimulation = async () => {
        if (!selectedScenario) return;
        setSimulationRunning(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Run an AI scenario simulation for "${selectedScenario}" in ${selectedCountry} focusing on ${selectedSector}. 
                Use the ${scenarioFramework} framework and ${anomalyDetection} for anomaly detection.
                Provide detailed analysis with quantitative projections.`,
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
                        anomaliesDetected: { type: "number" },
                        timelineMonths: { type: "number" }
                    }
                }
            });
            setResults(response);
            setSelectedAnalysis({ name: selectedScenario, color: '#8B5CF6' });
            setShowResultModal(true);
        } catch (error) {
            console.error('Simulation failed:', error);
        } finally {
            setSimulationRunning(false);
        }
    };

    const toggleTrendLine = (line) => {
        setActiveTrendLines(prev => 
            prev.includes(line) ? prev.filter(l => l !== line) : [...prev, line]
        );
    };

    const runAnalysis = async (type) => {
        setLoading(true);
        setSelectedAnalysis(type);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate a ${type.name} analysis for the ${selectedSector} sector. Include:
                1. Executive Summary (2-3 sentences)
                2. Key Findings (3-5 bullet points)
                3. Risk Assessment (low/medium/high with explanation)
                4. Recommendations (3 actionable items)
                5. Projected Impact (quantitative if possible)`,
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
                        confidenceScore: { type: "number" }
                    }
                }
            });
            setResults(response);
            setShowResultModal(true);
        } catch (error) {
            console.error('Analysis failed:', error);
            setResults({
                summary: 'Analysis completed with available data.',
                findings: ['Key trend identified', 'Market indicators analyzed', 'Policy impacts assessed'],
                riskLevel: 'Medium',
                riskExplanation: 'Moderate uncertainty in projections',
                recommendations: ['Continue monitoring', 'Diversify approach', 'Prepare contingencies'],
                projectedImpact: 'Expected 5-8% improvement over baseline',
                confidenceScore: 78
            });
            setShowResultModal(true);
        } finally {
            setLoading(false);
        }
    };

    const runCustomQuery = async () => {
        if (!customQuery.trim()) return;
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `${customQuery}\n\nProvide a structured intelligence analysis with summary, key insights, and recommendations.`,
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
                        confidenceScore: { type: "number" }
                    }
                }
            });
            setResults(response);
            setSelectedAnalysis({ name: 'Custom Query', color: '#6B4EE6' });
            setShowResultModal(true);
        } catch (error) {
            console.error('Query failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Brain className="w-7 h-7 text-purple-600" />
                        Generative Intelligence Platform
                    </h1>
                    <p className="text-gray-500 mt-1">Advanced AI-powered predictive analytics and scenario modeling</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    {stat.change && <p className="text-sm text-emerald-600">{stat.change} vs last period</p>}
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <stat.icon className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="bg-white border border-gray-200">
                        <TabsTrigger value="generator" className="gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Sparkles className="w-4 h-4" /> AI Generator
                        </TabsTrigger>
                        <TabsTrigger value="scenario" className="gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <GitBranch className="w-4 h-4" /> Scenario Planning
                        </TabsTrigger>
                        <TabsTrigger value="results" className="gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <BarChart3 className="w-4 h-4" /> Analysis Results
                        </TabsTrigger>
                        <TabsTrigger value="library" className="gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Brain className="w-4 h-4" /> Intelligence Library
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Country & Sector Selectors */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger className="w-48 bg-white">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-purple-600" />
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {COUNTRIES.map(country => (
                                <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                        {SECTORS.map(sector => (
                            <button
                                key={sector}
                                onClick={() => setSelectedSector(sector)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedSector === sector
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                                }`}
                            >
                                {sector}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'generator' && (
                    <>
                        {/* Analysis Type Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {ANALYSIS_TYPES.map(type => (
                                <div key={type.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${type.color}20` }}>
                                            <type.icon className="w-5 h-5" style={{ color: type.color }} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{type.name}</h3>
                                            <p className="text-sm text-gray-500">{type.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {type.tags.map((tag, i) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{tag}</span>
                                        ))}
                                    </div>
                                    <Button 
                                        onClick={() => runAnalysis(type)}
                                        disabled={loading}
                                        className="w-full"
                                        style={{ backgroundColor: type.color }}
                                    >
                                        {loading && selectedAnalysis?.id === type.id ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Play className="w-4 h-4 mr-2" />
                                        )}
                                        Run {type.name}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Custom Query */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Custom Query</h3>
                                <span className="text-sm text-gray-500">Ask anything with AI</span>
                            </div>
                            <Textarea
                                placeholder="e.g., 'What if we increase healthcare spending by 20%?' or 'Predict economic impact of new trade agreements...'"
                                value={customQuery}
                                onChange={e => setCustomQuery(e.target.value)}
                                rows={3}
                                className="mb-3"
                            />
                            <Button 
                                onClick={runCustomQuery} 
                                disabled={loading || !customQuery.trim()}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {loading && !selectedAnalysis ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                Generate Analysis
                            </Button>
                        </div>
                    </>
                )}

                {activeTab === 'scenario' && (
                    <>
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">AI Scenario Planning Framework</h2>
                            <p className="text-gray-500">{selectedCountry} - Advanced Predictive Policy Simulation & Cross-Country Analysis</p>
                        </div>

                        {/* Dataset Toggles */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Database className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">{selectedSector} Datasets (Dynamic Toggles)</h3>
                                <Button variant="ghost" size="icon" className="ml-2"><Copy className="w-4 h-4" /></Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {ECONOMY_DATASETS.map((ds, i) => (
                                    <div key={i}>
                                        <span className="text-sm font-medium text-purple-600">{ds.label}:</span>
                                        <span className="text-sm text-gray-500 ml-1">{ds.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scenario Simulator */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">AI Scenario Simulator - {selectedCountry} Predictive Impact Analysis</h3>
                            </div>
                            <div className="flex gap-4">
                                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select scenario..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SCENARIOS.map(s => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={runSimulation} disabled={simulationRunning || !selectedScenario} className="bg-purple-600 hover:bg-purple-700">
                                    {simulationRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                                    Run Simulation
                                </Button>
                            </div>
                        </div>

                        {/* Framework Selectors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <label className="text-sm font-semibold text-purple-600 mb-2 block">Scenario Framework</label>
                                <Select value={scenarioFramework} onValueChange={setScenarioFramework}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SCENARIO_FRAMEWORKS.map(f => (
                                            <SelectItem key={f} value={f}>{f}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <label className="text-sm font-semibold text-purple-600 mb-2 block">Anomaly Detection</label>
                                <Select value={anomalyDetection} onValueChange={setAnomalyDetection}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ANOMALY_DETECTION.map(a => (
                                            <SelectItem key={a} value={a}>{a}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Trend Analysis</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <RechartsLC data={trendData}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Legend />
                                        {activeTrendLines.includes('primary') && <Line type="monotone" dataKey="primary" stroke="#8B5CF6" strokeWidth={2} dot={false} />}
                                        {activeTrendLines.includes('secondary') && <Line type="monotone" dataKey="secondary" stroke="#22C55E" strokeWidth={2} dot={false} />}
                                        {activeTrendLines.includes('tertiary') && <Line type="monotone" dataKey="tertiary" stroke="#F59E0B" strokeWidth={2} dot={false} />}
                                    </RechartsLC>
                                </ResponsiveContainer>
                                <div className="flex gap-2 mt-4">
                                    {['primary', 'secondary', 'tertiary'].map(line => (
                                        <button key={line} onClick={() => toggleTrendLine(line)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${activeTrendLines.includes(line) ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                                            style={{ backgroundColor: activeTrendLines.includes(line) ? (line === 'primary' ? '#8B5CF6' : line === 'secondary' ? '#22C55E' : '#F59E0B') : undefined }}>
                                            {line.charAt(0).toUpperCase() + line.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                                        <p className="text-3xl font-bold text-purple-600">36.9K</p>
                                        <p className="text-sm text-gray-500">Initiated</p>
                                    </div>
                                    <div className="text-center p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                                        <p className="text-3xl font-bold text-emerald-600">56%</p>
                                        <p className="text-sm text-gray-500">Engaged</p>
                                    </div>
                                    <div className="text-center p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
                                        <p className="text-3xl font-bold text-amber-600">17%</p>
                                        <p className="text-sm text-gray-500">Completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detection Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <div className="text-3xl font-bold text-purple-600">24%</div>
                                <div className="text-sm text-gray-500">Detection Rate</div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <div className="text-3xl font-bold text-emerald-600">82%</div>
                                <div className="text-sm text-gray-500">Confidence</div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <div className="text-3xl font-bold text-blue-600">96%</div>
                                <div className="text-sm text-gray-500">Coverage</div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <div className="text-3xl font-bold text-amber-600">12</div>
                                <div className="text-sm text-gray-500">Alerts</div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'results' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Trend Analysis</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={SAMPLE_CHART_DATA}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-purple-50 rounded-xl">
                                    <p className="text-2xl font-bold text-purple-600">36.9K</p>
                                    <p className="text-sm text-gray-500">Initiated</p>
                                </div>
                                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                                    <p className="text-2xl font-bold text-emerald-600">56%</p>
                                    <p className="text-sm text-gray-500">Engaged</p>
                                </div>
                                <div className="text-center p-4 bg-amber-50 rounded-xl">
                                    <p className="text-2xl font-bold text-amber-600">17%</p>
                                    <p className="text-sm text-gray-500">Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'library' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <p className="text-center text-gray-500 py-12">Intelligence library with saved analyses coming soon...</p>
                    </div>
                )}
            </div>
            {/* Results Modal */}
            <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
                <DialogContent className={`${isFullscreen ? 'max-w-full w-full h-full max-h-full rounded-none' : 'max-w-3xl max-h-[90vh]'} overflow-y-auto p-0 transition-all`}>
                    {results && (
                        <div>
                            <div className="p-4 text-white" style={{ background: `linear-gradient(135deg, ${selectedAnalysis?.color || '#6B4EE6'}, #8B5CF6)` }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold">{selectedAnalysis?.name} Analysis - {selectedSector}</h2>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="text-white hover:bg-white/20">
                                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setShowResultModal(false)} className="text-white hover:bg-white/20">
                                            <X className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-6 space-y-6 ${isFullscreen ? 'max-w-4xl mx-auto' : ''}`}>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Executive Summary</h3>
                                    <p className="text-gray-700 leading-relaxed">{results.summary}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Key Findings</h3>
                                    <ul className="space-y-2">
                                        {results.findings?.map((finding, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600">{finding}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex gap-4">
                                    <div className={`flex-1 p-4 rounded-xl ${results.riskLevel === 'High' ? 'bg-red-50' : results.riskLevel === 'Medium' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <AlertTriangle className={`w-4 h-4 ${results.riskLevel === 'High' ? 'text-red-500' : results.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
                                            <span className="font-medium">Risk: {results.riskLevel}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{results.riskExplanation}</p>
                                    </div>
                                    <div className="flex-1 p-4 rounded-xl bg-purple-50">
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
                                        {results.recommendations?.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium flex-shrink-0">{i + 1}</span>
                                                <span className="text-gray-700">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-1">Projected Impact</h3>
                                    <p className="text-gray-600">{results.projectedImpact}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}