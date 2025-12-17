import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PageMeta from '@/components/PageMeta';
import { base44 } from '@/api/base44Client';
import { 
    X, Star, TrendingUp, TrendingDown, Eye, DollarSign, BarChart3, 
    LineChart, Activity, Brain, Shield, AlertTriangle, List, 
    Sparkles, ChevronRight, Info, Loader2, Target, Zap, Building,
    Users, Globe, Calendar, FileText, PieChart, Percent, ArrowUpRight, ArrowDownRight,
    Calculator, ThumbsUp, ThumbsDown, Download, ExternalLink, Play, ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line } from 'recharts';
import { Award } from 'lucide-react';
import StockSectionContent from '@/components/stocks/StockSectionContent';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'moat', label: 'MOAT Analysis', icon: Shield },
    { id: 'valuation', label: 'Valuation', icon: BarChart3 },
    { id: 'simulator', label: 'Simulator', icon: Target },
    { id: 'dcf', label: 'DCF Calculator', icon: Activity },
    { id: 'bullbear', label: 'Bull/Bear Case', icon: TrendingUp },
    { id: 'fundamentals', label: 'Fundamentals', icon: LineChart },
    { id: 'financials', label: 'Financials', icon: Activity },
    { id: 'technicals', label: 'Technicals', icon: TrendingUp },
    { id: 'sentiment', label: 'Sentiment', icon: Brain },
    { id: 'risk', label: 'Risk & Macro', icon: AlertTriangle },
    { id: 'dividends', label: 'Dividends', icon: Percent },
    { id: 'peers', label: 'Peers', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'investor-relations', label: 'Investor Relations', icon: Building },
    { id: 'legends', label: 'Legends', icon: Award },
];

const CHART_COLORS = ['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#EC4899'];

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

export default function StockDetail() {
    const navigate = useNavigate();
    const [stock, setStock] = useState(null);
    const [activeNav, setActiveNav] = useState('overview');
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [sectionData, setSectionData] = useState({});
    const [loadingSection, setLoadingSection] = useState(null);
    const [investmentAmount, setInvestmentAmount] = useState(10000);
    const [yearsToHold, setYearsToHold] = useState(5);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [activeReportTab, setActiveReportTab] = useState('annual');
    const [priceChartPeriod, setPriceChartPeriod] = useState('36M');

    // Get stock ticker from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ticker = params.get('ticker');
        if (ticker) {
            loadStockData(ticker);
        }
    }, []);

    const loadStockData = async (ticker) => {
        try {
            // Call AI to get stock data
            const response = await base44.integrations.Core.InvokeLLM({
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
            });
            setStock(response);
        } catch (error) {
            console.error('Error loading stock:', error);
        }
    };

    useEffect(() => {
        if (stock) {
            setSectionData({});
            setActiveNav('overview');
            setPriceChartPeriod('36M');
        }
    }, [stock?.ticker]);

    useEffect(() => {
        if (stock) {
            loadSectionData(activeNav);
        }
    }, [activeNav, stock?.ticker]);

    useEffect(() => {
        if (stock && activeNav === 'overview') {
            loadSectionData('overview');
        }
    }, [priceChartPeriod]);

    const loadSectionData = async (section) => {
        if (!stock) return;
        
        setLoadingSection(section);
        
        try {
            let prompt = '';
            let schema = {};

            switch (section) {
                case 'overview':
                    const periodDescriptions = {
                        '24H': 'hourly price data for the last 24 hours (24 data points)',
                        '72H': 'hourly price data for the last 72 hours (72 data points)',
                        '1W': 'daily price data for the last 7 days (7 data points)',
                        '3M': 'weekly price data for the last 3 months (12 data points)',
                        '6M': 'weekly price data for the last 6 months (24 data points)',
                        '12M': 'monthly price data for the last 12 months (12 data points)',
                        '24M': 'monthly price data for the last 24 months (24 data points)',
                        '36M': 'monthly price data for the last 36 months (36 data points)'
                    };
                    const periodDesc = periodDescriptions[priceChartPeriod] || periodDescriptions['36M'];
                    
                    prompt = `Provide data for ${stock.ticker}: company description, competitive advantages (3), revenue streams (3), latest developments (3), real historical price data for "${priceChartPeriod}": ${periodDesc}, MOAT analysis (brand power, switching costs, network effects, cost advantages, intangibles 0-100 each), investment thesis`;
                    schema = {
                        type: "object",
                        properties: {
                            description: { type: "string" },
                            advantages: { type: "array", items: { type: "string" } },
                            revenueStreams: { type: "array", items: { type: "string" } },
                            developments: { type: "array", items: { type: "string" } },
                            priceHistory: { type: "array", items: { type: "object", properties: { time: { type: "string" }, price: { type: "number" } } } },
                            moatBreakdown: { type: "object", properties: { brandPower: { type: "number" }, switchingCosts: { type: "number" }, networkEffects: { type: "number" }, costAdvantages: { type: "number" }, intangibles: { type: "number" } } },
                            thesis: { type: "string" }
                        }
                    };
                    break;

                case 'moat':
                    prompt = `MOAT analysis for ${stock.ticker}: scores 0-100 for brand power, switching costs, network effects, cost advantages, scale advantage, regulatory moat. Competitive position, 5 advantages, thesis`;
                    schema = {
                        type: "object",
                        properties: {
                            moatBreakdown: { type: "object", properties: { brandPower: { type: "number" }, switchingCosts: { type: "number" }, networkEffects: { type: "number" }, costAdvantages: { type: "number" }, scaleAdvantage: { type: "number" }, regulatoryMoat: { type: "number" } } },
                            position: { type: "string" },
                            advantages: { type: "array", items: { type: "string" } },
                            thesis: { type: "string" }
                        }
                    };
                    break;

                case 'valuation':
                    prompt = `Valuation for ${stock.ticker}: fair value, margin of safety %, sector average P/E, grade A-F, 5 comparable companies with P/E, 5-year historical P/E trend`;
                    schema = {
                        type: "object",
                        properties: {
                            fairValue: { type: "number" },
                            comparables: { type: "array", items: { type: "object", properties: { ticker: { type: "string" }, pe: { type: "number" } } } },
                            historicalPE: { type: "array", items: { type: "object", properties: { year: { type: "string" }, pe: { type: "number" } } } },
                            sectorAvgPE: { type: "number" },
                            marginOfSafety: { type: "number" },
                            grade: { type: "string" }
                        }
                    };
                    break;

                case 'fundamentals':
                    prompt = `Fundamentals for ${stock.ticker}: 5-year revenue growth with yearly data, earnings growth, profit margins (gross, operating, net %), debt-to-equity, interest coverage`;
                    schema = {
                        type: "object",
                        properties: {
                            revenueGrowth: { type: "array", items: { type: "object", properties: { year: { type: "string" }, growth: { type: "number" }, revenue: { type: "number" } } } },
                            margins: { type: "object", properties: { gross: { type: "number" }, operating: { type: "number" }, net: { type: "number" } } },
                            debtToEquity: { type: "number" },
                            interestCoverage: { type: "number" }
                        }
                    };
                    break;

                case 'technicals':
                    prompt = `Technical analysis for ${stock.ticker}: trend, support/resistance levels, moving averages (50,100,200), RSI, MACD signal, volume trend`;
                    schema = {
                        type: "object",
                        properties: {
                            trend: { type: "string" },
                            support: { type: "array", items: { type: "number" } },
                            resistance: { type: "array", items: { type: "number" } },
                            ma50: { type: "number" },
                            rsi: { type: "number" },
                            macdSignal: { type: "string" },
                            volumeTrend: { type: "string" }
                        }
                    };
                    break;

                case 'sentiment':
                    prompt = `Sentiment for ${stock.ticker}: sentiment score 0-100, analyst ratings (buy/hold/sell counts), institutional changes, insider activity, short interest %`;
                    schema = {
                        type: "object",
                        properties: {
                            sentimentScore: { type: "number" },
                            analystRatings: { type: "object", properties: { buy: { type: "number" }, hold: { type: "number" }, sell: { type: "number" } } },
                            institutionalChange: { type: "string" },
                            insiderActivity: { type: "string" },
                            shortInterest: { type: "number" }
                        }
                    };
                    break;

                case 'risk':
                    prompt = `Risk for ${stock.ticker}: risk score 1-10, volatility, beta, max drawdown, company risks, macro risks, sharpe ratio`;
                    schema = {
                        type: "object",
                        properties: {
                            riskScore: { type: "number" },
                            volatility: { type: "string" },
                            beta: { type: "number" },
                            maxDrawdown: { type: "number" },
                            companyRisks: { type: "array", items: { type: "string" } },
                            macroRisks: { type: "array", items: { type: "string" } },
                            sharpeRatio: { type: "number" }
                        }
                    };
                    break;

                case 'dividends':
                    prompt = `Dividends for ${stock.ticker}: yield %, annual dividend, growth rate, payout ratio, ex-dividend date, 5-year history, safety score`;
                    schema = {
                        type: "object",
                        properties: {
                            yield: { type: "number" },
                            annualDividend: { type: "number" },
                            growthRate: { type: "number" },
                            payoutRatio: { type: "number" },
                            exDividendDate: { type: "string" },
                            history: { type: "array", items: { type: "object", properties: { year: { type: "string" }, dividend: { type: "number" } } } },
                            safetyScore: { type: "number" }
                        }
                    };
                    break;

                case 'peers':
                    prompt = `Peers for ${stock.ticker}: 5 competitors with ticker, name, market cap, P/E, ROE, growth %. Industry averages, competitive advantages, market share %`;
                    schema = {
                        type: "object",
                        properties: {
                            peers: { type: "array", items: { type: "object", properties: { ticker: { type: "string" }, name: { type: "string" }, marketCap: { type: "string" }, pe: { type: "number" }, roe: { type: "number" }, growth: { type: "number" } } } },
                            industryAvg: { type: "object", properties: { pe: { type: "number" }, roe: { type: "number" }, growth: { type: "number" } } },
                            advantages: { type: "array", items: { type: "string" } },
                            marketShare: { type: "number" }
                        }
                    };
                    break;

                case 'bullbear':
                    prompt = `Bull/bear for ${stock.ticker}: 5 bull points, 5 bear points, bull target price, bear target price, bull/bear probabilities %`;
                    schema = {
                        type: "object",
                        properties: {
                            bullCase: { type: "array", items: { type: "string" } },
                            bearCase: { type: "array", items: { type: "string" } },
                            bullTarget: { type: "number" },
                            bearTarget: { type: "number" },
                            bullProbability: { type: "number" },
                            bearProbability: { type: "number" }
                        }
                    };
                    break;

                case 'dcf':
                    prompt = `DCF for ${stock.ticker}: intrinsic value, margin of safety %, verdict, price targets (low/mid/high), assumptions (growth/discount/terminal rates)`;
                    schema = {
                        type: "object",
                        properties: {
                            intrinsicValue: { type: "number" },
                            marginOfSafety: { type: "number" },
                            verdict: { type: "string" },
                            priceTargets: { type: "object", properties: { low: { type: "number" }, mid: { type: "number" }, high: { type: "number" } } },
                            assumptions: { type: "object", properties: { growthRate: { type: "number" }, discountRate: { type: "number" }, terminalGrowth: { type: "number" } } }
                        }
                    };
                    break;

                default:
                    return;
            }

            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `${prompt}\n\nIMPORTANT: Provide SPECIFIC data for ${stock.ticker}.`,
                add_context_from_internet: true,
                response_json_schema: schema
            });

            setSectionData(prev => ({ ...prev, [section]: response }));
        } catch (error) {
            console.error('Error loading section data:', error);
        } finally {
            setLoadingSection(null);
        }
    };

    if (!stock) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    const isPositive = stock.change >= 0;
    const data = sectionData[activeNav] || {};

    return (
        <>
            <PageMeta 
                title={`${stock.ticker} - ${stock.name} Stock Analysis`}
                description={`Comprehensive AI-powered analysis for ${stock.name} (${stock.ticker}). View fundamentals, technicals, valuation, and investment insights.`}
                keywords={`${stock.ticker}, ${stock.name}, stock analysis, ${stock.sector}, ${stock.industry}`}
            />
            <div className="min-h-screen bg-gray-50">
                {/* Header with Back Button */}
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
                                    Back
                                </Button>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-gray-900">{stock.ticker}</span>
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-lg font-medium">{stock.name}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{stock.sector} • {stock.industry}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-gray-900">${stock.price?.toFixed(2)}</span>
                                    <span className={`ml-2 text-lg font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        {isPositive ? '+' : ''}{stock.change?.toFixed(2)}%
                                    </span>
                                </div>
                                <Button 
                                    onClick={() => setIsWatchlisted(!isWatchlisted)}
                                    className={`${isWatchlisted ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                                >
                                    <Star className={`w-4 h-4 mr-2 ${isWatchlisted ? 'fill-white' : ''}`} />
                                    {isWatchlisted ? 'Watching' : 'Watchlist'}
                                </Button>
                            </div>
                        </div>

                        {/* Top Navigation Menu - 2 Rows */}
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-1">
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
                                    className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                                        activeNav === item.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <item.icon className="w-3.5 h-3.5" />
                                    <span className="hidden md:inline">{item.label}</span>
                                    {loadingSection === item.id && <Loader2 className="w-3 h-3 animate-spin" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {loadingSection === activeNav ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                            <p className="text-gray-600">Loading {activeNav} data with AI...</p>
                        </div>
                    ) : sectionData[activeNav] ? (
                        <StockSectionContent 
                            activeNav={activeNav}
                            stock={stock}
                            data={sectionData[activeNav]}
                            priceChartPeriod={priceChartPeriod}
                            setPriceChartPeriod={setPriceChartPeriod}
                            investmentAmount={investmentAmount}
                            setInvestmentAmount={setInvestmentAmount}
                            yearsToHold={yearsToHold}
                            setYearsToHold={setYearsToHold}
                            expectedReturn={expectedReturn}
                            setExpectedReturn={setExpectedReturn}
                            activeReportTab={activeReportTab}
                            setActiveReportTab={setActiveReportTab}
                        />
                    ) : (
                        <div className="text-center text-gray-500 py-20">
                            <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p>Click a section above to load analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}