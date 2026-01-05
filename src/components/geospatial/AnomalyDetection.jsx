import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import { 
    Activity, AlertTriangle, Brain, Cpu, BarChart3, TrendingUp, Zap,
    Search, Target, Layers, GitBranch, Loader2, Play, ChevronRight,
    AlertCircle, CheckCircle, Info, ArrowRight, PieChart
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, AreaChart, Area, LineChart, Line, BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#06B6D4', '#84CC16'];

const ANOMALY_METHODS = [
    { id: 'lof', name: 'Local Outlier Factor (LOF)', icon: Target, color: '#3B82F6', category: 'density', description: 'Density-based local outlier detection' },
    { id: 'isolation-forest', name: 'Isolation Forest', icon: GitBranch, color: '#10B981', category: 'tree', description: 'Tree-based anomaly isolation' },
    { id: 'elliptic', name: 'Robust Covariance', icon: Layers, color: '#8B5CF6', category: 'statistical', description: 'Elliptic envelope for Gaussian data' },
    { id: 'ocsvm', name: 'One-Class SVM', icon: Target, color: '#F59E0B', category: 'ml', description: 'Support vector machine for novelty detection' },
    { id: 'ocsvm-sgd', name: 'One-Class SVM with SGD', icon: Zap, color: '#EF4444', category: 'ml', description: 'Scalable SVM with stochastic gradient descent' },
    { id: 'kmeans', name: 'K-Means Clustering', icon: PieChart, color: '#EC4899', category: 'clustering', description: 'Distance-based cluster anomaly detection' },
    { id: 'abod', name: 'Angle-Based (ABOD)', icon: Activity, color: '#06B6D4', category: 'angle', description: 'Angle-based outlier detection' },
    { id: 'lstm', name: 'LSTM Neural Network', icon: Brain, color: '#84CC16', category: 'deep-learning', description: 'Long short-term memory for sequences' },
    { id: 'autoencoder', name: 'Autoencoders', icon: Cpu, color: '#F97316', category: 'deep-learning', description: 'Reconstruction error-based detection' },
    { id: 'vae', name: 'Variational Autoencoders', icon: Brain, color: '#14B8A6', category: 'deep-learning', description: 'Probabilistic latent space anomalies' },
    { id: 'gmm', name: 'Gaussian Mixture Models', icon: BarChart3, color: '#A855F7', category: 'statistical', description: 'Probabilistic clustering for anomalies' },
    { id: 'pca', name: 'Principal Component Analysis', icon: TrendingUp, color: '#0EA5E9', category: 'dimensionality', description: 'Reconstruction error in reduced space' },
    { id: 'arima', name: 'ARIMA-based Detection', icon: Activity, color: '#D946EF', category: 'time-series', description: 'Time series forecasting residuals' },
    { id: 'shesd', name: 'Seasonal Hybrid ESD', icon: TrendingUp, color: '#22C55E', category: 'time-series', description: 'Twitter\'s seasonal anomaly detection' },
    { id: 'spc', name: 'Statistical Process Control', icon: BarChart3, color: '#EAB308', category: 'statistical', description: 'Control charts and limits' },
    { id: 'ets', name: 'Exponential Smoothing', icon: Activity, color: '#64748B', category: 'time-series', description: 'Smoothing-based anomaly detection' }
];

const DATA_DOMAINS = [
    { id: 'infrastructure', name: 'Infrastructure Data' },
    { id: 'economic', name: 'Economic Indicators' },
    { id: 'demographic', name: 'Demographic Patterns' },
    { id: 'environmental', name: 'Environmental Metrics' },
    { id: 'trade', name: 'Trade & Commerce' },
    { id: 'energy', name: 'Energy Systems' }
];

const CATEGORIES = [
    { id: 'all', name: 'All Methods' },
    { id: 'statistical', name: 'Statistical' },
    { id: 'ml', name: 'Machine Learning' },
    { id: 'deep-learning', name: 'Deep Learning' },
    { id: 'time-series', name: 'Time Series' },
    { id: 'clustering', name: 'Clustering' }
];

export default function AnomalyDetection({ selectedCountries = [] }) {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedDomain, setSelectedDomain] = useState('infrastructure');
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredMethods = activeCategory === 'all' 
        ? ANOMALY_METHODS 
        : ANOMALY_METHODS.filter(m => m.category === activeCategory);

    const [showWarning, setShowWarning] = useState(false);

    const runAnomalyDetection = async (method) => {
        if (selectedCountries.length === 0) {
            setShowWarning(true);
            return;
        }
        setShowWarning(false);
        
        setSelectedMethod(method);
        setLoading(true);
        setAnalysisData(null);

        const countriesStr = selectedCountries.join(', ');
        const domain = DATA_DOMAINS.find(d => d.id === selectedDomain)?.name || 'Infrastructure';

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Perform anomaly detection analysis on ${domain} data for ${countriesStr} using the ${method.name} method.
                
                Simulate realistic anomaly detection results including:
                1. Detected anomalies with severity levels
                2. Normal vs anomalous data distribution
                3. Key metrics and thresholds
                4. Root cause analysis
                5. Recommendations
                
                Return JSON with:
                - summary (markdown analysis of findings)
                - anomalyCount (number)
                - normalCount (number)
                - anomalyRate (percentage string)
                - anomalies (array of {id, metric, value, severity: 'critical'|'high'|'medium'|'low', description, country})
                - scatterData (array of 20 points with {x, y, anomaly: boolean} for visualization)
                - timeSeriesData (array of 12 monthly points with {month, value, threshold, isAnomaly})
                - severityDistribution (array of {severity, count})
                - recommendations (array of strings)`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        summary: { type: "string" },
                        anomalyCount: { type: "number" },
                        normalCount: { type: "number" },
                        anomalyRate: { type: "string" },
                        anomalies: { type: "array", items: { type: "object" } },
                        scatterData: { type: "array", items: { type: "object" } },
                        timeSeriesData: { type: "array", items: { type: "object" } },
                        severityDistribution: { type: "array", items: { type: "object" } },
                        recommendations: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setAnalysisData(response);
        } catch (error) {
            console.error('Anomaly detection failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            critical: 'bg-red-100 text-red-700 border-red-200',
            high: 'bg-orange-100 text-orange-700 border-orange-200',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            low: 'bg-blue-100 text-blue-700 border-blue-200'
        };
        return colors[severity] || colors.medium;
    };

    const getSeverityIcon = (severity) => {
        if (severity === 'critical' || severity === 'high') return <AlertTriangle className="w-4 h-4" />;
        if (severity === 'medium') return <AlertCircle className="w-4 h-4" />;
        return <Info className="w-4 h-4" />;
    };

    return (
        <div className="space-y-6">
            {/* Domain Selection */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Data Domain:</span>
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {DATA_DOMAINS.map(domain => (
                                <SelectItem key={domain.id} value={domain.id}>{domain.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeCategory === cat.id 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredMethods.map(method => (
                    <div
                        key={method.id}
                        className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                            selectedMethod?.id === method.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => runAnomalyDetection(method)}
                    >
                        <div className="flex items-start gap-3">
                            <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${method.color}15` }}
                            >
                                <method.icon className="w-5 h-5" style={{ color: method.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm">{method.name}</h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{method.description}</p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">{method.category}</span>
                            <Play className="w-4 h-4 text-purple-600" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Analysis Results */}
            {loading && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Running {selectedMethod?.name} on {selectedDomain} data...</p>
                </div>
            )}

            {!loading && analysisData && selectedMethod && (
                <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <p className="text-sm text-gray-600">Anomalies Detected</p>
                            <p className="text-3xl font-bold text-red-600">{analysisData.anomalyCount || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <p className="text-sm text-gray-600">Normal Points</p>
                            <p className="text-3xl font-bold text-emerald-600">{analysisData.normalCount || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <p className="text-sm text-gray-600">Anomaly Rate</p>
                            <p className="text-3xl font-bold text-amber-600">{analysisData.anomalyRate || '0%'}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <p className="text-sm text-gray-600">Method Used</p>
                            <p className="text-lg font-bold text-purple-600">{selectedMethod.name}</p>
                        </div>
                    </div>

                    {/* Visualizations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Scatter Plot */}
                        {analysisData.scatterData?.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h4 className="font-semibold text-gray-900 mb-4">Anomaly Distribution</h4>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart>
                                            <XAxis dataKey="x" fontSize={10} />
                                            <YAxis dataKey="y" fontSize={10} />
                                            <Tooltip />
                                            <Scatter 
                                                data={analysisData.scatterData.filter(d => !d.anomaly)} 
                                                fill="#10B981" 
                                                name="Normal"
                                            />
                                            <Scatter 
                                                data={analysisData.scatterData.filter(d => d.anomaly)} 
                                                fill="#EF4444" 
                                                name="Anomaly"
                                            />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Time Series */}
                        {analysisData.timeSeriesData?.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h4 className="font-semibold text-gray-900 mb-4">Time Series Analysis</h4>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={analysisData.timeSeriesData}>
                                            <XAxis dataKey="month" fontSize={10} />
                                            <YAxis fontSize={10} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
                                            <Line type="monotone" dataKey="threshold" stroke="#EF4444" strokeDasharray="5 5" strokeWidth={1} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Severity Distribution */}
                    {analysisData.severityDistribution?.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h4 className="font-semibold text-gray-900 mb-4">Severity Distribution</h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analysisData.severityDistribution} layout="vertical">
                                        <XAxis type="number" fontSize={10} />
                                        <YAxis type="category" dataKey="severity" fontSize={10} width={80} />
                                        <Tooltip />
                                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                            {analysisData.severityDistribution.map((entry, index) => {
                                                const colors = { critical: '#EF4444', high: '#F97316', medium: '#EAB308', low: '#3B82F6' };
                                                return <Cell key={index} fill={colors[entry.severity] || COLORS[index]} />;
                                            })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Detected Anomalies List */}
                    {analysisData.anomalies?.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h4 className="font-semibold text-gray-900 mb-4">Detected Anomalies</h4>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {analysisData.anomalies.map((anomaly, i) => (
                                    <div key={i} className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                {getSeverityIcon(anomaly.severity)}
                                                <div>
                                                    <p className="font-medium">{anomaly.metric}</p>
                                                    <p className="text-sm opacity-80">{anomaly.description}</p>
                                                    {anomaly.country && (
                                                        <p className="text-xs mt-1 opacity-60">Country: {anomaly.country}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold">{anomaly.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h4 className="font-semibold text-gray-900 mb-3">Analysis Summary</h4>
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{analysisData.summary || ''}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Recommendations */}
                    {analysisData.recommendations?.length > 0 && (
                        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
                            <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Recommendations
                            </h4>
                            <div className="space-y-2">
                                {analysisData.recommendations.map((rec, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                                        <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{rec}</span>
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
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Detection Method</h3>
                    <p className="text-sm text-gray-500">Click on any anomaly detection method above to analyze {selectedDomain} data for {selectedCountries.join(', ')}</p>
                </div>
            )}

            {selectedCountries.length === 0 && (
                <div className={`rounded-xl border p-6 text-center ${showWarning ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                    <AlertTriangle className={`w-10 h-10 mx-auto mb-3 ${showWarning ? 'text-red-500' : 'text-amber-500'}`} />
                    <p className={showWarning ? 'text-red-700 font-medium' : 'text-amber-700'}>
                        {showWarning ? 'Please select a country first to run detection' : 'Please select a country from the header dropdown to run anomaly detection'}
                    </p>
                </div>
            )}
        </div>
    );
}