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

            // Use same prompts and schemas from modal
            // ... (copy all the switch cases from the modal)

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
                <div className="flex flex-col md:flex-row h-full">
                    {/* Back Button - Mobile */}
                    <div className="md:hidden bg-white border-b border-gray-200 p-3 flex items-center justify-between sticky top-0 z-20">
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate(createPageUrl('Markets'))} className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="w-5 h-5 text-gray-500" />
                            </button>
                            <span className="text-lg font-bold text-gray-900">{stock.ticker}</span>
                            <span className="text-lg font-bold text-gray-900">${stock.price?.toFixed(2)}</span>
                            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {isPositive ? '+' : ''}{stock.change?.toFixed(2)}%
                            </span>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden bg-white border-b border-gray-200 p-2">
                        <div className="flex flex-wrap gap-1">
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
                                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                                        activeNav === item.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    <item.icon className="w-3 h-3" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Left Sidebar - Desktop */}
                    <div className="hidden md:flex w-52 bg-white border-r border-gray-200 flex-col sticky top-0 h-screen">
                        <div className="p-4 border-b border-gray-200">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => navigate(createPageUrl('Markets'))}
                                className="w-full mb-3 gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Markets
                            </Button>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl font-bold text-gray-900">{stock.ticker}</span>
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">US</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{stock.name}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">${stock.price?.toFixed(2)}</span>
                                <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? '+' : ''}{stock.change?.toFixed(2)}%
                                </span>
                            </div>
                            <Button 
                                onClick={() => setIsWatchlisted(!isWatchlisted)}
                                className={`w-full mt-3 ${isWatchlisted ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                                <Star className={`w-4 h-4 mr-2 ${isWatchlisted ? 'fill-white' : ''}`} />
                                {isWatchlisted ? 'Watching' : 'Add to Watchlist'}
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Navigation</p>
                            <nav className="px-2">
                                {NAV_ITEMS.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveNav(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                            activeNav === item.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                        {loadingSection === item.id && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="hidden md:flex sticky top-0 bg-white border-b border-gray-200 px-6 py-4 items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold text-gray-900 capitalize">{activeNav.replace('-', ' ')}</h2>
                                <span className="text-sm text-gray-500">
                                    MCap: ${stock.marketCap}B • Vol: {stock.volume}
                                </span>
                            </div>
                        </div>

                        <div className="p-3 md:p-6">
                            {loadingSection === activeNav ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                                    <p className="text-gray-600">Loading {activeNav} data with AI...</p>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-20">
                                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p>Section content will load here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}