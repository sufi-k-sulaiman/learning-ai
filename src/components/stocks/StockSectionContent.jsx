import React from 'react';
import { TrendingUp, TrendingDown, Shield, Sparkles, AlertTriangle, Target, LineChart, Calculator, ThumbsUp, ThumbsDown, ArrowUpRight, ArrowDownRight, Brain, Percent, Users, Zap, Info, Building, Globe, FileText, Calendar, DollarSign, Play, Download, ExternalLink, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line } from 'recharts';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

function MoatBar({ label, value, color = '#8B5CF6' }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-32">{label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
            </div>
            <span className="text-sm font-medium text-gray-700 w-12 text-right">{value}%</span>
        </div>
    );
}

export default function StockSectionContent({ 
    activeNav, 
    stock, 
    data, 
    priceChartPeriod, 
    setPriceChartPeriod,
    investmentAmount,
    setInvestmentAmount,
    yearsToHold,
    setYearsToHold,
    expectedReturn,
    setExpectedReturn,
    activeReportTab,
    setActiveReportTab
}) {
    const isPositive = stock.change >= 0;

    // Simulator calculations
    const calculateFutureValue = () => {
        const shares = investmentAmount / stock.price;
        const futurePrice = stock.price * Math.pow(1 + expectedReturn / 100, yearsToHold);
        const futureValue = shares * futurePrice;
        const annualDividend = (stock.dividend || 2) * shares;
        const totalDividends = annualDividend * yearsToHold;
        return { 
            shares: shares.toFixed(2), 
            futurePrice: futurePrice.toFixed(2), 
            futureValue: futureValue.toFixed(2), 
            profit: (futureValue - investmentAmount).toFixed(2),
            annualDividend: annualDividend.toFixed(2),
            totalDividends: totalDividends.toFixed(2),
            totalReturn: (futureValue + totalDividends - investmentAmount).toFixed(2)
        };
    };

    switch (activeNav) {
        case 'overview':
            const filteredPriceData = data.priceHistory?.map(point => ({
                month: point.time,
                price: point.price
            })) || [];
            
            const startPrice = filteredPriceData[0]?.price || stock.price * 0.8;
            const highPrice = Math.max(...(filteredPriceData.map(p => p.price).concat([stock.price])));
            const lowPrice = Math.min(...(filteredPriceData.map(p => p.price).concat([stock.price])));
            
            return (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Company Overview</h3>
                        <p className="text-gray-600 mb-4">{data.description || `${stock.name} is a leading company in the ${stock.sector} sector.`}</p>
                        {data.advantages && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Competitive Advantages</h4>
                                <ul className="space-y-1">
                                    {data.advantages.map((adv, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                                            {adv}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    {filteredPriceData.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Price History</h3>
                                <div className="flex gap-1">
                                    {['24H', '1W', '3M', '6M', '12M', '36M'].map(period => (
                                        <button
                                            key={period}
                                            onClick={() => setPriceChartPeriod(period)}
                                            className={`px-2 py-1 text-xs rounded-lg ${
                                                priceChartPeriod === period ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={filteredPriceData}>
                                        <defs>
                                            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                                        <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Price']} />
                                        <Area type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={2} fill="url(#priceGrad)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                <div className="bg-blue-50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500">Start</p>
                                    <p className="text-lg font-bold text-blue-600">${startPrice.toFixed(2)}</p>
                                </div>
                                <div className="bg-green-50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500">High</p>
                                    <p className="text-lg font-bold text-green-600">${highPrice.toFixed(2)}</p>
                                </div>
                                <div className="bg-red-50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500">Low</p>
                                    <p className="text-lg font-bold text-red-600">${lowPrice.toFixed(2)}</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500">Current</p>
                                    <p className="text-lg font-bold text-purple-600">${stock.price?.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-purple-600" />
                                <span className="text-sm text-gray-600">MOAT</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stock.moat}/100</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">ROE</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{stock.roe}%</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-gray-600">Z-Score</span>
                            </div>
                            <p className={`text-2xl font-bold ${stock.zscore >= 3 ? 'text-green-600' : 'text-yellow-600'}`}>{stock.zscore?.toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">P/E</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stock.pe?.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
            );

        case 'moat':
            return (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">MOAT Breakdown</h3>
                    <div className="space-y-3 mb-6">
                        <MoatBar label="Brand Power" value={data.moatBreakdown?.brandPower || 50} />
                        <MoatBar label="Switching Costs" value={data.moatBreakdown?.switchingCosts || 50} color="#10B981" />
                        <MoatBar label="Network Effects" value={data.moatBreakdown?.networkEffects || 50} />
                        <MoatBar label="Cost Advantages" value={data.moatBreakdown?.costAdvantages || 50} color="#F59E0B" />
                        <MoatBar label="Scale Advantage" value={data.moatBreakdown?.scaleAdvantage || 50} color="#3B82F6" />
                        <MoatBar label="Regulatory Moat" value={data.moatBreakdown?.regulatoryMoat || 50} color="#EC4899" />
                    </div>
                    {data.thesis && (
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Investment Thesis</h4>
                            <p className="text-sm text-gray-700">{data.thesis}</p>
                        </div>
                    )}
                    {data.advantages && (
                        <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Key Advantages</h4>
                            <ul className="space-y-2">
                                {data.advantages.map((adv, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                        {adv}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );

        case 'valuation':
            return (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Valuation Metrics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-purple-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Fair Value</p>
                                <p className="text-2xl font-bold text-purple-600">${data.fairValue?.toFixed(2) || (stock.price * 1.1).toFixed(2)}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Margin of Safety</p>
                                <p className="text-2xl font-bold text-green-600">{data.marginOfSafety || 8}%</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Grade</p>
                                <p className="text-2xl font-bold text-gray-900">{data.grade || 'B+'}</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Sector P/E</p>
                                <p className="text-2xl font-bold text-blue-600">{data.sectorAvgPE?.toFixed(1) || '22.0'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'simulator':
            const simResult = calculateFutureValue();
            const projectionData = Array.from({ length: yearsToHold + 1 }, (_, i) => ({
                year: `Y${i}`,
                value: investmentAmount * Math.pow(1 + expectedReturn / 100, i),
                withDividends: investmentAmount * Math.pow(1 + expectedReturn / 100, i) + ((stock.dividend || 2) * (investmentAmount / stock.price) * i)
            }));
            
            return (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Calculator className="w-5 h-5 text-purple-600" />
                            <h3 className="font-semibold text-gray-900">Investment Simulator</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Investment Amount</label>
                                <Input type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} min={100} max={4000000} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Years: {yearsToHold}</label>
                                <Slider value={[yearsToHold]} onValueChange={(v) => setYearsToHold(v[0])} min={1} max={30} step={1} className="mt-4" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Return: {expectedReturn}%</label>
                                <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={-20} max={50} step={1} className="mt-4" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-500">Shares</p>
                                <p className="text-xl font-bold text-gray-900">{simResult.shares}</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-500">Future Price</p>
                                <p className="text-xl font-bold text-blue-600">${simResult.futurePrice}</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-500">Future Value</p>
                                <p className="text-xl font-bold text-purple-600">${Number(simResult.futureValue).toLocaleString()}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-500">Dividends</p>
                                <p className="text-xl font-bold text-green-600">${Number(simResult.totalDividends).toLocaleString()}</p>
                            </div>
                            <div className={`rounded-xl p-4 text-center ${Number(simResult.totalReturn) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                <p className="text-xs text-gray-500">Total Return</p>
                                <p className={`text-xl font-bold ${Number(simResult.totalReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {Number(simResult.totalReturn) >= 0 ? '+' : ''}${Number(simResult.totalReturn).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="h-64 mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={projectionData}>
                                    <defs>
                                        <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                                    <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                                    <Area type="monotone" dataKey="withDividends" stroke="#10B981" strokeWidth={2} fill="url(#projGrad)" name="With Dividends" />
                                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} fill="none" name="Capital Only" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            );

        default:
            return (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="text-center text-gray-500 py-20">
                        <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p>Analysis data will appear here</p>
                    </div>
                </div>
            );
    }
}