import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Award, DollarSign, FileText, Loader2, TrendingUp, Shield, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line } from 'recharts';
import PageMeta from '@/components/PageMeta';

export default function StockComparison() {
    const navigate = useNavigate();
    const [tickers, setTickers] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('legends');
    const [expandedLegend, setExpandedLegend] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tickersParam = params.get('tickers');
        if (tickersParam) {
            const tickerList = tickersParam.split(',').map(t => t.trim().toUpperCase());
            setTickers(tickerList);
            loadStocksData(tickerList);
        }
    }, []);

    const loadStocksData = async (tickerList) => {
        setLoading(true);
        try {
            const promises = tickerList.map(ticker => 
                base44.integrations.Core.InvokeLLM({
                    prompt: `Provide REAL, CURRENT stock market data for ${ticker}. Return: ticker, name, sector, industry, marketCap, price, change (%), volume, moat (0-100), roe (%), roic (%), roa (%), pe, peg, zscore, eps, dividend (%), sgr (%), beta, fcf, eva, aiRating (0-100)`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            ticker: { type: "string" },
                            name: { type: "string" },
                            sector: { type: "string" },
                            industry: { type: "string" },
                            marketCap: { type: "string" },
                            price: { type: "number" },
                            change: { type: "number" },
                            volume: { type: "string" },
                            moat: { type: "number" },
                            roe: { type: "number" },
                            roic: { type: "number" },
                            roa: { type: "number" },
                            pe: { type: "number" },
                            peg: { type: "number" },
                            zscore: { type: "number" },
                            eps: { type: "number" },
                            dividend: { type: "number" },
                            sgr: { type: "number" },
                            beta: { type: "number" },
                            fcf: { type: "number" },
                            eva: { type: "number" },
                            aiRating: { type: "number" }
                        }
                    }
                })
            );

            const results = await Promise.all(promises);
            setStocks(results);
        } catch (error) {
            console.error('Error loading stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    const legendaryFrameworks = [
        { name: 'Warren Buffett', metrics: ['moat', 'roe'], weights: { moat: 0.6, roe: 0.4 }, targets: { moat: 70, roe: 15 } },
        { name: 'Peter Lynch', metrics: ['peg', 'sgr'], weights: { peg: 0.5, sgr: 0.5 }, targets: { peg: 1, sgr: 15 }, inverse: { peg: true } },
        { name: 'Benjamin Graham', metrics: ['pe', 'zscore'], weights: { pe: 0.5, zscore: 0.5 }, targets: { pe: 15, zscore: 3 }, inverse: { pe: true } },
        { name: 'Joel Greenblatt', metrics: ['roic', 'pe'], weights: { roic: 0.6, pe: 0.4 }, targets: { roic: 15, pe: 20 }, inverse: { pe: true } },
    ];

    const calculateFrameworkScore = (stock, framework) => {
        let score = 0;
        framework.metrics.forEach(metric => {
            const value = stock[metric] || 0;
            const target = framework.targets[metric];
            const isInverse = framework.inverse?.[metric];
            const weight = framework.weights[metric];
            
            const metricScore = isInverse ? 
                Math.max(0, 100 - ((value / target) * 100)) : 
                Math.min(100, (value / target) * 100);
            
            score += metricScore * weight;
        });
        return Math.round(score);
    };

    const renderLegendsComparison = () => {
        const radarData = stocks.map(stock => {
            const scores = {};
            legendaryFrameworks.forEach(framework => {
                scores[framework.name.split(' ')[1] || framework.name] = calculateFrameworkScore(stock, framework);
            });
            return { ticker: stock.ticker, ...scores };
        });

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Framework Alignment Comparison</h3>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={legendaryFrameworks.map(f => {
                                const data = { framework: f.name.split(' ')[1] || f.name };
                                stocks.forEach(stock => {
                                    data[stock.ticker] = calculateFrameworkScore(stock, f);
                                });
                                return data;
                            })}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="framework" tick={{ fontSize: 11 }} />
                                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                                {stocks.map((stock, i) => (
                                    <Radar 
                                        key={stock.ticker}
                                        name={stock.ticker} 
                                        dataKey={stock.ticker} 
                                        stroke={['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'][i]} 
                                        fill={['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'][i]} 
                                        fillOpacity={0.3} 
                                    />
                                ))}
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {legendaryFrameworks.map((framework, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-200">
                        <button
                            onClick={() => setExpandedLegend(expandedLegend === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-6 hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <Award className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                            </div>
                            {expandedLegend === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        
                        {expandedLegend === idx && (
                            <div className="px-6 pb-6 space-y-4">
                                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${stocks.length}, 1fr)` }}>
                                    {stocks.map((stock, i) => {
                                        const score = calculateFrameworkScore(stock, framework);
                                        return (
                                            <div key={stock.ticker} className="bg-gray-50 rounded-xl p-4">
                                                <div className="text-center mb-4">
                                                    <p className="text-sm font-bold text-gray-900">{stock.ticker}</p>
                                                    <p className="text-3xl font-bold text-purple-600 mt-2">{score}</p>
                                                    <p className="text-xs text-gray-500">Framework Score</p>
                                                </div>
                                                <div className="space-y-3">
                                                    {framework.metrics.map(metric => {
                                                        const value = stock[metric] || 0;
                                                        const target = framework.targets[metric];
                                                        const isInverse = framework.inverse?.[metric];
                                                        const meetsTarget = isInverse ? value < target : value >= target;
                                                        
                                                        return (
                                                            <div key={metric}>
                                                                <div className="flex justify-between text-xs mb-1">
                                                                    <span className="text-gray-600">{metric.toUpperCase()}</span>
                                                                    <span className={`font-bold ${meetsTarget ? 'text-green-600' : 'text-orange-600'}`}>
                                                                        {typeof value === 'number' ? value.toFixed(1) : value}
                                                                    </span>
                                                                </div>
                                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div 
                                                                        className={`h-full rounded-full ${meetsTarget ? 'bg-green-500' : 'bg-orange-500'}`}
                                                                        style={{ width: `${Math.min((value / (target * 2)) * 100, 100)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderFinancialsComparison = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Key Metrics Comparison</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Metric</th>
                                {stocks.map(stock => (
                                    <th key={stock.ticker} className="text-center py-3 px-4 text-sm font-bold text-purple-600">{stock.ticker}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {['Price', 'Change %', 'P/E', 'ROE %', 'MOAT', 'Z-Score', 'Dividend %', 'Beta'].map((metric, i) => {
                                const keys = ['price', 'change', 'pe', 'roe', 'moat', 'zscore', 'dividend', 'beta'];
                                const key = keys[i];
                                return (
                                    <tr key={metric} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-700">{metric}</td>
                                        {stocks.map(stock => {
                                            const value = stock[key];
                                            const allValues = stocks.map(s => s[key] || 0);
                                            const isBest = value === Math.max(...allValues) && key !== 'pe' && key !== 'beta';
                                            const isWorst = value === Math.min(...allValues) && (key === 'pe' || key === 'beta');
                                            
                                            return (
                                                <td key={stock.ticker} className={`py-3 px-4 text-center font-bold ${
                                                    isBest || isWorst ? 'text-green-600 bg-green-50' : 'text-gray-900'
                                                }`}>
                                                    {typeof value === 'number' ? value.toFixed(2) : value || 'N/A'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Visual Comparison</h3>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { metric: 'MOAT', ...stocks.reduce((acc, s) => ({ ...acc, [s.ticker]: s.moat }), {}) },
                            { metric: 'ROE', ...stocks.reduce((acc, s) => ({ ...acc, [s.ticker]: s.roe }), {}) },
                            { metric: 'Z-Score', ...stocks.reduce((acc, s) => ({ ...acc, [s.ticker]: s.zscore * 20 }), {}) },
                            { metric: 'Growth', ...stocks.reduce((acc, s) => ({ ...acc, [s.ticker]: s.sgr }), {}) }
                        ]}>
                            <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            {stocks.map((stock, i) => (
                                <Bar 
                                    key={stock.ticker} 
                                    dataKey={stock.ticker} 
                                    fill={['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'][i]} 
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderNewsComparison = () => (
        <div className="space-y-6">
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${stocks.length}, 1fr)` }}>
                {stocks.map(stock => (
                    <div key={stock.ticker} className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="mb-4">
                            <h3 className="font-bold text-gray-900 text-lg">{stock.ticker}</h3>
                            <p className="text-sm text-gray-500">{stock.name}</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Current Price</p>
                                <p className="text-2xl font-bold text-gray-900">${stock.price?.toFixed(2)}</p>
                                <p className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}%
                                </p>
                            </div>

                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Sector</p>
                                <p className="text-sm font-medium text-gray-900">{stock.sector}</p>
                                <p className="text-xs text-gray-500">{stock.industry}</p>
                            </div>

                            <div className="p-3 bg-green-50 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Market Cap</p>
                                <p className="text-lg font-bold text-gray-900">${stock.marketCap}B</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Risk Metrics</h3>
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${stocks.length}, 1fr)` }}>
                    {stocks.map(stock => (
                        <div key={stock.ticker} className="space-y-3">
                            <p className="font-bold text-gray-900 text-center">{stock.ticker}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Beta</span>
                                    <span className="font-bold">{stock.beta?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Z-Score</span>
                                    <span className="font-bold">{stock.zscore?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">AI Rating</span>
                                    <span className="font-bold">{stock.aiRating}/100</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <PageMeta 
                title="Stock Comparison - AI Analysis"
                description="Compare multiple stocks across legendary investment frameworks, financials, and market data."
            />
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => navigate(createPageUrl('Markets'))}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Markets
                                </Button>
                                <h1 className="text-2xl font-bold text-gray-900">Stock Comparison</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                {stocks.map(stock => (
                                    <div key={stock.ticker} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg font-bold">
                                        {stock.ticker}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {[
                                { id: 'legends', label: 'Legends', icon: Award },
                                { id: 'financials', label: 'Financials', icon: DollarSign },
                                { id: 'news', label: 'News & Events', icon: FileText }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeTab === tab.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {activeTab === 'legends' && renderLegendsComparison()}
                    {activeTab === 'financials' && renderFinancialsComparison()}
                    {activeTab === 'news' && renderNewsComparison()}
                </div>
            </div>
        </>
    );
}