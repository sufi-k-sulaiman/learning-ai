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

        case 'fundamentals':
            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Revenue & Growth</h3>
                        {data.revenueGrowth?.length > 0 ? (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.revenueGrowth}>
                                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                                        <Tooltip />
                                        <Bar dataKey="growth" fill="#10B981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : <p className="text-gray-500 text-center py-12">No revenue data available</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                            <p className="text-sm text-gray-500">Debt/Equity</p>
                            <p className="text-2xl font-bold text-gray-900">{data.debtToEquity?.toFixed(2) || '0.45'}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                            <p className="text-sm text-gray-500">Interest Coverage</p>
                            <p className="text-2xl font-bold text-gray-900">{data.interestCoverage?.toFixed(1) || '12.5'}x</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                            <p className="text-sm text-gray-500">Net Margin</p>
                            <p className="text-2xl font-bold text-green-600">{data.margins?.net || 18}%</p>
                        </div>
                    </div>
                </div>
            );

        case 'financials':
            return (
                <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">Financial Ratios</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500">P/E Ratio</p>
                            <p className="text-2xl font-bold text-gray-900">{stock.pe?.toFixed(1)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500">PEG Ratio</p>
                            <p className="text-2xl font-bold text-gray-900">{stock.peg?.toFixed(2) || '1.2'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500">ROE</p>
                            <p className="text-2xl font-bold text-green-600">{stock.roe}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500">ROIC</p>
                            <p className="text-2xl font-bold text-gray-900">{stock.roic || 18}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500">ROA</p>
                            <p className="text-2xl font-bold text-gray-900">{stock.roa || 12}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500">FCF</p>
                            <p className="text-2xl font-bold text-gray-900">{stock.fcf || 4.2}%</p>
                        </div>
                    </div>
                </div>
            );

        case 'technicals':
            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Technical Indicators</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">RSI</p>
                                <p className="text-2xl font-bold text-orange-600">{data.rsi || 72}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">50-MA</p>
                                <p className="text-2xl font-bold text-gray-900">${data.ma50?.toFixed(2) || (stock.price * 0.95).toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">MACD</p>
                                <p className={`text-xl font-bold ${data.macdSignal === 'Bullish' ? 'text-green-600' : 'text-yellow-600'}`}>{data.macdSignal || 'Neutral'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Trend</p>
                                <p className={`text-xl font-bold ${data.trend === 'Bullish' ? 'text-green-600' : 'text-gray-900'}`}>{data.trend || 'Mixed'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'sentiment':
            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Market Sentiment</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-green-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Buy</p>
                                <p className="text-2xl font-bold text-green-600">{data.analystRatings?.buy || 18}</p>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Hold</p>
                                <p className="text-2xl font-bold text-yellow-600">{data.analystRatings?.hold || 8}</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Sell</p>
                                <p className="text-2xl font-bold text-red-600">{data.analystRatings?.sell || 2}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Sentiment Score</p>
                                <p className="text-3xl font-bold text-orange-600">{data.sentimentScore || 42}/100</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Short Interest</p>
                                <p className="text-3xl font-bold text-gray-900">{data.shortInterest || 2.4}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'risk':
            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-orange-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Risk Score</p>
                                <p className="text-3xl font-bold text-orange-600">{data.riskScore || 4.2}/10</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Beta</p>
                                <p className="text-2xl font-bold text-gray-900">{data.beta?.toFixed(2) || stock.beta?.toFixed(2) || '1.15'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Volatility</p>
                                <p className="text-xl font-bold text-gray-900">{data.volatility || 'Medium'}</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Max Drawdown</p>
                                <p className="text-2xl font-bold text-red-600">-{data.maxDrawdown || 35}%</p>
                            </div>
                        </div>
                        {data.companyRisks && (
                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Company Risks</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.companyRisks.map((r, i) => (
                                        <span key={i} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">{r}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'dividends':
            const dividendHistory = data.history || [
                { year: '2020', dividend: 2.8 },
                { year: '2021', dividend: 3.2 },
                { year: '2022', dividend: 3.6 },
                { year: '2023', dividend: 4.0 },
                { year: '2024', dividend: 4.4 }
            ];
            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Dividend Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-green-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Yield</p>
                                <p className="text-2xl font-bold text-green-600">{data.yield || stock.dividend || 2.4}%</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Annual</p>
                                <p className="text-2xl font-bold text-purple-600">${data.annualDividend?.toFixed(2) || '4.40'}</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Growth</p>
                                <p className="text-2xl font-bold text-blue-600">{data.growthRate || 8.5}%</p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Payout</p>
                                <p className="text-2xl font-bold text-orange-600">{data.payoutRatio || 45}%</p>
                            </div>
                        </div>
                        <div className="h-48 mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <ReLineChart data={dividendHistory}>
                                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                                    <Tooltip formatter={(v) => [`$${v}`, 'Dividend']} />
                                    <Line type="monotone" dataKey="dividend" stroke="#8B5CF6" strokeWidth={2} />
                                </ReLineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            );

        case 'peers':
            const peerData = data.peers || [];
            return (
                <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Peer Comparison</h3>
                    {peerData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Ticker</th>
                                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">P/E</th>
                                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">ROE</th>
                                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Growth</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-purple-50 border-b">
                                        <td className="py-3 px-2 font-bold text-purple-700">{stock.ticker}</td>
                                        <td className="py-3 px-2 text-right">{stock.pe?.toFixed(1)}</td>
                                        <td className="py-3 px-2 text-right">{stock.roe}%</td>
                                        <td className="py-3 px-2 text-right">{stock.sgr}%</td>
                                    </tr>
                                    {peerData.map((peer, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="py-3 px-2 font-medium">{peer.ticker}</td>
                                            <td className="py-3 px-2 text-right">{peer.pe}</td>
                                            <td className="py-3 px-2 text-right">{peer.roe}%</td>
                                            <td className="py-3 px-2 text-right text-green-600">{peer.growth}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-gray-500 text-center py-12">No peer data available</p>}
                </div>
            );

        case 'bullbear':
            return (
                <div className="min-h-[600px] grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-green-900 flex items-center gap-2">
                                <ThumbsUp className="w-5 h-5" /> Bull Case
                            </h3>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                ${data.bullTarget?.toFixed(2) || (stock.price * 1.5).toFixed(2)}
                            </span>
                        </div>
                        <ul className="space-y-3">
                            {(data.bullCase || [
                                'Strong revenue growth momentum',
                                'Market share expansion',
                                'New product launches',
                                'Operating margin improvement',
                                'Industry tailwinds'
                            ]).map((point, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                    <ArrowUpRight className="w-4 h-4 text-green-600 mt-0.5" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-red-900 flex items-center gap-2">
                                <ThumbsDown className="w-5 h-5" /> Bear Case
                            </h3>
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                                ${data.bearTarget?.toFixed(2) || (stock.price * 0.6).toFixed(2)}
                            </span>
                        </div>
                        <ul className="space-y-3">
                            {(data.bearCase || [
                                'Competitive pressure intensifying',
                                'Slowing core market growth',
                                'Rising input costs',
                                'Regulatory headwinds',
                                'Multiple compression risk'
                            ]).map((point, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                    <ArrowDownRight className="w-4 h-4 text-red-600 mt-0.5" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );

        case 'dcf':
            const intrinsicValue = data.intrinsicValue || (stock.price * 1.15);
            const marginSafety = data.marginOfSafety || Math.round(((intrinsicValue - stock.price) / intrinsicValue) * 100);
            const verdict = marginSafety > 20 ? 'Undervalued' : marginSafety > 0 ? 'Fairly Valued' : 'Overvalued';
            return (
                <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">DCF Intrinsic Value</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500">Current Price</p>
                            <p className="text-2xl font-bold text-gray-900">${stock.price?.toFixed(2)}</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500">Intrinsic Value</p>
                            <p className="text-2xl font-bold text-purple-600">${intrinsicValue.toFixed(2)}</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500">Margin of Safety</p>
                            <p className={`text-2xl font-bold ${marginSafety > 0 ? 'text-green-600' : 'text-red-600'}`}>{marginSafety}%</p>
                        </div>
                        <div className={`rounded-xl p-4 text-center ${verdict === 'Undervalued' ? 'bg-green-100' : verdict === 'Overvalued' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                            <p className="text-sm text-gray-500">Verdict</p>
                            <p className={`text-xl font-bold ${verdict === 'Undervalued' ? 'text-green-700' : verdict === 'Overvalued' ? 'text-red-700' : 'text-yellow-700'}`}>{verdict}</p>
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
                <div className="min-h-[600px] space-y-6">
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
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
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
                        <div className="h-64">
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
                                    <Area type="monotone" dataKey="withDividends" stroke="#10B981" strokeWidth={2} fill="url(#projGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            );

        case 'reports':
            return (
                <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Company Reports</h3>
                    <div className="space-y-3">
                        <a href={`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${stock.ticker}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50">
                            <div>
                                <p className="font-medium text-gray-900">SEC Filings</p>
                                <p className="text-sm text-gray-500">View all official filings</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                        <a href={`https://www.google.com/search?q=${stock.name}+investor+relations`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50">
                            <div>
                                <p className="font-medium text-gray-900">Investor Relations</p>
                                <p className="text-sm text-gray-500">Company IR website</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                    </div>
                </div>
            );

        case 'investor-relations':
            return (
                <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Investor Relations</h3>
                    <div className="space-y-3">
                        <a href={`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${stock.ticker}&type=10-K`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Annual Reports (10-K)</p>
                                    <p className="text-sm text-gray-500">View comprehensive annual filings</p>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                        <a href={`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${stock.ticker}&type=10-Q`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Quarterly Reports (10-Q)</p>
                                    <p className="text-sm text-gray-500">View quarterly filings</p>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                    </div>
                </div>
            );

        case 'legends':
            return (
                <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-600" /> Legendary Investor Frameworks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-purple-50 rounded-xl p-4">
                            <p className="font-semibold text-gray-900 mb-2">Warren Buffett</p>
                            <p className="text-sm text-gray-600">Value / MOAT Focus</p>
                            <p className="mt-3 text-xs text-gray-500">MOAT: <span className="font-bold text-purple-600">{stock.moat}/100</span></p>
                            <p className={`mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block ${
                                stock.moat >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {stock.moat >= 70 ? 'Strong Buy' : 'Hold'}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                            <p className="font-semibold text-gray-900 mb-2">Peter Lynch</p>
                            <p className="text-sm text-gray-600">GARP Strategy</p>
                            <p className="mt-3 text-xs text-gray-500">PEG: <span className="font-bold text-green-600">{stock.peg?.toFixed(2) || '1.2'}</span></p>
                            <p className={`mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block ${
                                (stock.peg || 1.2) <= 1 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {(stock.peg || 1.2) <= 1 ? 'Strong Buy' : 'Buy'}
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4">
                            <p className="font-semibold text-gray-900 mb-2">Benjamin Graham</p>
                            <p className="text-sm text-gray-600">Deep Value</p>
                            <p className="mt-3 text-xs text-gray-500">P/E: <span className="font-bold text-blue-600">{stock.pe?.toFixed(1)}</span></p>
                            <p className={`mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block ${
                                stock.pe < 15 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                                {stock.pe < 15 ? 'Value Play' : 'Not Cheap'}
                            </p>
                        </div>
                    </div>
                </div>
            );

        default:
            return (
                <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="text-center text-gray-500 py-32">
                        <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p>Analysis data will appear here</p>
                    </div>
                </div>
            );
    }
}