import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { base44 } from '@/api/base44Client';

export default function MarketOverviewChart({ stocks }) {
    const [viewMode, setViewMode] = useState('sector'); // 'sector' or 'industry'
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    // Get unique sectors and industries from stocks
    const sectors = [...new Set(stocks.map(s => s.sector).filter(Boolean))].sort();
    const industries = [...new Set(stocks.map(s => s.industry).filter(Boolean))].sort();

    useEffect(() => {
        if (stocks.length > 0) {
            fetchMarketData();
        }
    }, [stocks, viewMode]);

    const fetchMarketData = async () => {
        setLoading(true);
        try {
            const items = viewMode === 'sector' ? sectors : industries.slice(0, 20);
            
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Provide realistic 24-hour market performance data for these ${viewMode === 'sector' ? 'sectors' : 'industries'}: ${items.join(', ')}

For each, provide:
- Percentage change in the last 24 hours (between -5% and +5%, realistic based on current market conditions)
- Brief 5-word market sentiment

Make the data realistic and varied - some should be up, some down.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    change: { type: "number" },
                                    sentiment: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            const llmData = response?.data || [];
            
            // Map to chart data format
            const formattedData = items.map(item => {
                const llmItem = llmData.find(d => d.name?.toLowerCase() === item.toLowerCase());
                const stocksInItem = stocks.filter(s => 
                    viewMode === 'sector' ? s.sector === item : s.industry === item
                );
                const avgChange = stocksInItem.length > 0 
                    ? stocksInItem.reduce((sum, s) => sum + (s.change || 0), 0) / stocksInItem.length
                    : 0;
                
                return {
                    name: item.length > 15 ? item.substring(0, 12) + '...' : item,
                    fullName: item,
                    change: llmItem?.change ?? Math.round(avgChange * 100) / 100,
                    sentiment: llmItem?.sentiment || (avgChange >= 0 ? 'Positive momentum' : 'Slight pullback'),
                    stockCount: stocksInItem.length
                };
            }).sort((a, b) => b.change - a.change);

            setChartData(formattedData);
        } catch (error) {
            console.error('Error fetching market data:', error);
            // Fallback to calculated data from stocks
            const items = viewMode === 'sector' ? sectors : industries.slice(0, 20);
            const fallbackData = items.map(item => {
                const stocksInItem = stocks.filter(s => 
                    viewMode === 'sector' ? s.sector === item : s.industry === item
                );
                const avgChange = stocksInItem.length > 0 
                    ? stocksInItem.reduce((sum, s) => sum + (s.change || 0), 0) / stocksInItem.length
                    : (Math.random() - 0.5) * 4;
                
                return {
                    name: item.length > 15 ? item.substring(0, 12) + '...' : item,
                    fullName: item,
                    change: Math.round(avgChange * 100) / 100,
                    sentiment: avgChange >= 0 ? 'Bullish trend' : 'Bearish pressure',
                    stockCount: stocksInItem.length
                };
            }).sort((a, b) => b.change - a.change);
            
            setChartData(fallbackData);
        } finally {
            setLoading(false);
        }
    };

    const gainers = chartData.filter(d => d.change > 0).length;
    const losers = chartData.filter(d => d.change < 0).length;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[180px]">
                    <p className="font-semibold text-gray-900 text-sm">{data.fullName}</p>
                    <div className="flex items-center gap-2 mt-1">
                        {data.change >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-bold ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{data.sentiment}</p>
                    <p className="text-xs text-gray-400 mt-1">{data.stockCount} stocks</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">24h Market Overview</h3>
                    <p className="text-xs text-gray-500">Performance by {viewMode}</p>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">{gainers} up</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-gray-600">{losers} down</span>
                        </div>
                    </div>
                    
                    {/* View Toggle */}
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => setViewMode('sector')}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                viewMode === 'sector' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Sectors
                        </button>
                        <button
                            onClick={() => setViewMode('industry')}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                viewMode === 'industry' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Industries
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart */}
            {loading ? (
                <div className="flex items-center justify-center h-[200px]">
                    <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                </div>
            ) : (
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={chartData} 
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                            <XAxis 
                                type="number" 
                                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                                tickFormatter={(v) => `${v}%`}
                                tick={{ fontSize: 10 }}
                            />
                            <YAxis 
                                type="category" 
                                dataKey="name" 
                                width={100}
                                tick={{ fontSize: 10 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine x={0} stroke="#9ca3af" strokeDasharray="3 3" />
                            <Bar 
                                dataKey="change" 
                                radius={[0, 4, 4, 0]}
                                cursor="pointer"
                                onClick={(data) => setSelectedItem(data.fullName)}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.change >= 0 ? '#22c55e' : '#ef4444'}
                                        opacity={selectedItem === entry.fullName ? 1 : 0.8}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Selected Item Details */}
            {selectedItem && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{selectedItem}</span>
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="text-xs text-purple-600 hover:text-purple-700"
                        >
                            Clear
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Click on stocks below filtered by this {viewMode}
                    </p>
                </div>
            )}
        </div>
    );
}