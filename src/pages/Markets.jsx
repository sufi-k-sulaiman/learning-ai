import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Search, RefreshCw, TrendingUp, TrendingDown, Shield, 
    Zap, DollarSign, BarChart3, Activity, Sparkles, 
    ChevronDown, X, Filter, Loader2, Menu, ChevronLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOGO_URL, menuItems, footerLinks } from '../components/NavigationConfig';
import StockCard from '../components/markets/StockCard';
import StockTicker from '../components/markets/StockTicker';
import FilterChips from '../components/markets/FilterChips';
import StockDetailModal from '../components/markets/StockDetailModal';

const PRESET_FILTERS = [
    { id: 'all', label: 'All Stocks', icon: BarChart3 },
    { id: 'wide-moats', label: 'Wide Moats', icon: Shield },
    { id: 'undervalued', label: 'Undervalued', icon: DollarSign },
    { id: 'high-growth', label: 'High Growth', icon: TrendingUp },
    { id: 'top-movers', label: 'Top Movers', icon: Activity },
];

const FILTER_OPTIONS = {
    moat: { label: 'MOAT', options: ['Any', '70+', '60+', '50+'] },
    roe: { label: 'ROE', options: ['Any', '20%+', '15%+', '10%+'] },
    pe: { label: 'P/E', options: ['Any', '<15', '<20', '<30'] },
    zscore: { label: 'Z-Score', options: ['Any', '3+', '2.5+', '2+'] },
};

// Stock data - generated locally for instant display
const STOCK_DATA = [
    { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics', marketCap: '2890' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software', marketCap: '2780' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Services', marketCap: '1720' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', industry: 'E-Commerce', marketCap: '1540' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors', marketCap: '1180' },
    { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Social Media', marketCap: '890' },
    { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', industry: 'Electric Vehicles', marketCap: '780' },
    { ticker: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Finance', industry: 'Conglomerate', marketCap: '750' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Finance', industry: 'Banking', marketCap: '520' },
    { ticker: 'V', name: 'Visa Inc.', sector: 'Finance', industry: 'Payments', marketCap: '480' },
    { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '420' },
    { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer', industry: 'Retail', marketCap: '410' },
    { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer', industry: 'Consumer Goods', marketCap: '380' },
    { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Finance', industry: 'Payments', marketCap: '390' },
    { ticker: 'HD', name: 'Home Depot Inc.', sector: 'Consumer', industry: 'Home Improvement', marketCap: '340' },
    { ticker: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', industry: 'Oil & Gas', marketCap: '460' },
    { ticker: 'CVX', name: 'Chevron Corp.', sector: 'Energy', industry: 'Oil & Gas', marketCap: '290' },
    { ticker: 'BAC', name: 'Bank of America', sector: 'Finance', industry: 'Banking', marketCap: '270' },
    { ticker: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '280' },
    { ticker: 'KO', name: 'Coca-Cola Company', sector: 'Consumer', industry: 'Beverages', marketCap: '260' },
    { ticker: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer', industry: 'Beverages', marketCap: '230' },
    { ticker: 'COST', name: 'Costco Wholesale', sector: 'Consumer', industry: 'Retail', marketCap: '250' },
    { ticker: 'MRK', name: 'Merck & Co.', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '270' },
    { ticker: 'TMO', name: 'Thermo Fisher Scientific', sector: 'Healthcare', industry: 'Life Sciences', marketCap: '210' },
    { ticker: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology', industry: 'Semiconductors', marketCap: '360' },
    { ticker: 'CSCO', name: 'Cisco Systems', sector: 'Technology', industry: 'Networking', marketCap: '220' },
    { ticker: 'ACN', name: 'Accenture plc', sector: 'Technology', industry: 'IT Services', marketCap: '200' },
    { ticker: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', industry: 'Software', marketCap: '240' },
    { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', industry: 'Cloud Software', marketCap: '250' },
    { ticker: 'INTC', name: 'Intel Corporation', sector: 'Technology', industry: 'Semiconductors', marketCap: '180' },
    { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', industry: 'Semiconductors', marketCap: '220' },
    { ticker: 'IBM', name: 'IBM Corporation', sector: 'Technology', industry: 'IT Services', marketCap: '150' },
    { ticker: 'ORCL', name: 'Oracle Corporation', sector: 'Technology', industry: 'Software', marketCap: '310' },
    { ticker: 'QCOM', name: 'Qualcomm Inc.', sector: 'Technology', industry: 'Semiconductors', marketCap: '170' },
    { ticker: 'NOW', name: 'ServiceNow Inc.', sector: 'Technology', industry: 'Cloud Software', marketCap: '150' },
    { ticker: 'INTU', name: 'Intuit Inc.', sector: 'Technology', industry: 'Software', marketCap: '170' },
    { ticker: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology', industry: 'Cloud Data', marketCap: '65' },
    { ticker: 'PLTR', name: 'Palantir Technologies', sector: 'Technology', industry: 'Data Analytics', marketCap: '45' },
    { ticker: 'CRWD', name: 'CrowdStrike Holdings', sector: 'Technology', industry: 'Cybersecurity', marketCap: '72' },
    { ticker: 'NKE', name: 'Nike Inc.', sector: 'Consumer', industry: 'Apparel', marketCap: '150' },
    { ticker: 'LOW', name: 'Lowes Companies', sector: 'Consumer', industry: 'Home Improvement', marketCap: '130' },
    { ticker: 'SBUX', name: 'Starbucks Corporation', sector: 'Consumer', industry: 'Restaurants', marketCap: '105' },
    { ticker: 'TGT', name: 'Target Corporation', sector: 'Consumer', industry: 'Retail', marketCap: '72' },
    { ticker: 'MCD', name: 'McDonalds Corporation', sector: 'Consumer', industry: 'Restaurants', marketCap: '205' },
    { ticker: 'DIS', name: 'Walt Disney Company', sector: 'Media', industry: 'Entertainment', marketCap: '175' },
    { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Media', industry: 'Streaming', marketCap: '195' },
    { ticker: 'PYPL', name: 'PayPal Holdings', sector: 'Finance', industry: 'Fintech', marketCap: '68' },
    { ticker: 'GS', name: 'Goldman Sachs', sector: 'Finance', industry: 'Investment Banking', marketCap: '135' },
    { ticker: 'MS', name: 'Morgan Stanley', sector: 'Finance', industry: 'Investment Banking', marketCap: '150' },
    { ticker: 'AXP', name: 'American Express', sector: 'Finance', industry: 'Credit Services', marketCap: '165' },
    { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', industry: 'Health Insurance', marketCap: '480' },
    { ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '160' },
    { ticker: 'LLY', name: 'Eli Lilly and Company', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '550' },
    { ticker: 'AMGN', name: 'Amgen Inc.', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '150' },
    { ticker: 'GILD', name: 'Gilead Sciences', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '100' },
    { ticker: 'BMY', name: 'Bristol-Myers Squibb', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '95' },
    { ticker: 'REGN', name: 'Regeneron Pharmaceuticals', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '95' },
    { ticker: 'VRTX', name: 'Vertex Pharmaceuticals', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '110' },
    { ticker: 'MRNA', name: 'Moderna Inc.', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '45' },
    { ticker: 'BA', name: 'Boeing Company', sector: 'Industrials', industry: 'Aerospace', marketCap: '130' },
    { ticker: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials', industry: 'Machinery', marketCap: '160' },
    { ticker: 'GE', name: 'General Electric', sector: 'Industrials', industry: 'Conglomerate', marketCap: '180' },
    { ticker: 'MMM', name: '3M Company', sector: 'Industrials', industry: 'Conglomerate', marketCap: '55' },
    { ticker: 'UPS', name: 'United Parcel Service', sector: 'Industrials', industry: 'Logistics', marketCap: '110' },
    { ticker: 'DE', name: 'Deere & Company', sector: 'Industrials', industry: 'Machinery', marketCap: '120' },
    { ticker: 'LMT', name: 'Lockheed Martin', sector: 'Industrials', industry: 'Defense', marketCap: '120' },
    { ticker: 'RTX', name: 'RTX Corporation', sector: 'Industrials', industry: 'Aerospace & Defense', marketCap: '140' },
    { ticker: 'HON', name: 'Honeywell International', sector: 'Industrials', industry: 'Conglomerate', marketCap: '130' },
    { ticker: 'UNP', name: 'Union Pacific', sector: 'Industrials', industry: 'Railroads', marketCap: '140' },
    { ticker: 'NEE', name: 'NextEra Energy', sector: 'Utilities', industry: 'Electric Utilities', marketCap: '150' },
    { ticker: 'DUK', name: 'Duke Energy', sector: 'Utilities', industry: 'Electric Utilities', marketCap: '80' },
    { ticker: 'SO', name: 'Southern Company', sector: 'Utilities', industry: 'Electric Utilities', marketCap: '85' },
    { ticker: 'T', name: 'AT&T Inc.', sector: 'Telecom', industry: 'Telecommunications', marketCap: '120' },
    { ticker: 'VZ', name: 'Verizon Communications', sector: 'Telecom', industry: 'Telecommunications', marketCap: '170' },
    { ticker: 'TMUS', name: 'T-Mobile US', sector: 'Telecom', industry: 'Telecommunications', marketCap: '200' },
    { ticker: 'COP', name: 'ConocoPhillips', sector: 'Energy', industry: 'Oil & Gas', marketCap: '130' },
    { ticker: 'EOG', name: 'EOG Resources', sector: 'Energy', industry: 'Oil & Gas', marketCap: '70' },
    { ticker: 'SLB', name: 'Schlumberger', sector: 'Energy', industry: 'Oil Services', marketCap: '65' },
    { ticker: 'LIN', name: 'Linde plc', sector: 'Materials', industry: 'Industrial Gases', marketCap: '200' },
    { ticker: 'APD', name: 'Air Products', sector: 'Materials', industry: 'Industrial Gases', marketCap: '65' },
    { ticker: 'SHW', name: 'Sherwin-Williams', sector: 'Materials', industry: 'Paints & Coatings', marketCap: '85' },
    { ticker: 'FCX', name: 'Freeport-McMoRan', sector: 'Materials', industry: 'Copper Mining', marketCap: '55' },
    { ticker: 'NEM', name: 'Newmont Corporation', sector: 'Materials', industry: 'Gold Mining', marketCap: '45' },
    { ticker: 'AMT', name: 'American Tower', sector: 'Real Estate', industry: 'REITs', marketCap: '95' },
    { ticker: 'PLD', name: 'Prologis Inc.', sector: 'Real Estate', industry: 'Industrial REITs', marketCap: '110' },
    { ticker: 'CCI', name: 'Crown Castle', sector: 'Real Estate', industry: 'REITs', marketCap: '45' },
    { ticker: 'EQIX', name: 'Equinix Inc.', sector: 'Real Estate', industry: 'Data Center REITs', marketCap: '75' },
    { ticker: 'SPG', name: 'Simon Property Group', sector: 'Real Estate', industry: 'Retail REITs', marketCap: '50' },
    { ticker: 'WFC', name: 'Wells Fargo', sector: 'Finance', industry: 'Banking', marketCap: '180' },
    { ticker: 'C', name: 'Citigroup Inc.', sector: 'Finance', industry: 'Banking', marketCap: '95' },
    { ticker: 'SCHW', name: 'Charles Schwab', sector: 'Finance', industry: 'Brokerage', marketCap: '120' },
    { ticker: 'BLK', name: 'BlackRock Inc.', sector: 'Finance', industry: 'Asset Management', marketCap: '115' },
    { ticker: 'SPGI', name: 'S&P Global', sector: 'Finance', industry: 'Financial Data', marketCap: '130' },
    { ticker: 'CME', name: 'CME Group', sector: 'Finance', industry: 'Exchanges', marketCap: '75' },
    { ticker: 'ICE', name: 'Intercontinental Exchange', sector: 'Finance', industry: 'Exchanges', marketCap: '70' },
    { ticker: 'AMAT', name: 'Applied Materials', sector: 'Technology', industry: 'Semiconductor Equipment', marketCap: '140' },
    { ticker: 'MU', name: 'Micron Technology', sector: 'Technology', industry: 'Memory Chips', marketCap: '95' },
    { ticker: 'LRCX', name: 'Lam Research', sector: 'Technology', industry: 'Semiconductor Equipment', marketCap: '95' },
    { ticker: 'ADI', name: 'Analog Devices', sector: 'Technology', industry: 'Semiconductors', marketCap: '100' },
    { ticker: 'TXN', name: 'Texas Instruments', sector: 'Technology', industry: 'Semiconductors', marketCap: '165' },
    { ticker: 'PANW', name: 'Palo Alto Networks', sector: 'Technology', industry: 'Cybersecurity', marketCap: '100' },
    { ticker: 'FTNT', name: 'Fortinet Inc.', sector: 'Technology', industry: 'Cybersecurity', marketCap: '55' },
    { ticker: 'ZS', name: 'Zscaler Inc.', sector: 'Technology', industry: 'Cybersecurity', marketCap: '28' },
    { ticker: 'DDOG', name: 'Datadog Inc.', sector: 'Technology', industry: 'Cloud Monitoring', marketCap: '38' },
    { ticker: 'NET', name: 'Cloudflare Inc.', sector: 'Technology', industry: 'Cloud Services', marketCap: '28' },
    { ticker: 'WDAY', name: 'Workday Inc.', sector: 'Technology', industry: 'HR Software', marketCap: '60' },
    { ticker: 'TEAM', name: 'Atlassian Corp.', sector: 'Technology', industry: 'Software', marketCap: '45' },
    { ticker: 'MDB', name: 'MongoDB Inc.', sector: 'Technology', industry: 'Database', marketCap: '25' },
    { ticker: 'SHOP', name: 'Shopify Inc.', sector: 'Technology', industry: 'E-Commerce Platform', marketCap: '95' },
    { ticker: 'SQ', name: 'Block Inc.', sector: 'Finance', industry: 'Fintech', marketCap: '42' },
    { ticker: 'UBER', name: 'Uber Technologies', sector: 'Technology', industry: 'Ride-sharing', marketCap: '145' },
    { ticker: 'ABNB', name: 'Airbnb Inc.', sector: 'Consumer', industry: 'Travel', marketCap: '85' },
    { ticker: 'BKNG', name: 'Booking Holdings', sector: 'Consumer', industry: 'Travel', marketCap: '130' },
    { ticker: 'MAR', name: 'Marriott International', sector: 'Consumer', industry: 'Hotels', marketCap: '70' },
    { ticker: 'HLT', name: 'Hilton Worldwide', sector: 'Consumer', industry: 'Hotels', marketCap: '55' },
    { ticker: 'CMG', name: 'Chipotle Mexican Grill', sector: 'Consumer', industry: 'Restaurants', marketCap: '75' },
    { ticker: 'YUM', name: 'Yum! Brands', sector: 'Consumer', industry: 'Restaurants', marketCap: '38' },
    { ticker: 'DPZ', name: 'Dominos Pizza', sector: 'Consumer', industry: 'Restaurants', marketCap: '15' },
    { ticker: 'LULU', name: 'Lululemon Athletica', sector: 'Consumer', industry: 'Apparel', marketCap: '45' },
    { ticker: 'ETSY', name: 'Etsy Inc.', sector: 'Consumer', industry: 'E-Commerce', marketCap: '8' },
    { ticker: 'EA', name: 'Electronic Arts', sector: 'Media', industry: 'Video Games', marketCap: '38' },
    { ticker: 'TTWO', name: 'Take-Two Interactive', sector: 'Media', industry: 'Video Games', marketCap: '28' },
    { ticker: 'RBLX', name: 'Roblox Corp.', sector: 'Media', industry: 'Gaming Platform', marketCap: '28' },
    { ticker: 'SPOT', name: 'Spotify Technology', sector: 'Media', industry: 'Music Streaming', marketCap: '65' },
    { ticker: 'COIN', name: 'Coinbase Global', sector: 'Finance', industry: 'Cryptocurrency', marketCap: '45' },
    { ticker: 'HOOD', name: 'Robinhood Markets', sector: 'Finance', industry: 'Brokerage', marketCap: '18' },
    { ticker: 'GM', name: 'General Motors', sector: 'Automotive', industry: 'Automobiles', marketCap: '55' },
    { ticker: 'F', name: 'Ford Motor Company', sector: 'Automotive', industry: 'Automobiles', marketCap: '45' },
    { ticker: 'RIVN', name: 'Rivian Automotive', sector: 'Automotive', industry: 'Electric Vehicles', marketCap: '15' },
    { ticker: 'LCID', name: 'Lucid Group', sector: 'Automotive', industry: 'Electric Vehicles', marketCap: '8' },
    { ticker: 'FDX', name: 'FedEx Corporation', sector: 'Industrials', industry: 'Logistics', marketCap: '65' },
    { ticker: 'CSX', name: 'CSX Corporation', sector: 'Industrials', industry: 'Railroads', marketCap: '65' },
    { ticker: 'NSC', name: 'Norfolk Southern', sector: 'Industrials', industry: 'Railroads', marketCap: '50' },
    { ticker: 'WM', name: 'Waste Management', sector: 'Industrials', industry: 'Waste Services', marketCap: '80' },
    { ticker: 'RSG', name: 'Republic Services', sector: 'Industrials', industry: 'Waste Services', marketCap: '55' },
    { ticker: 'ETN', name: 'Eaton Corporation', sector: 'Industrials', industry: 'Electrical Equipment', marketCap: '110' },
    { ticker: 'EMR', name: 'Emerson Electric', sector: 'Industrials', industry: 'Industrial Automation', marketCap: '60' },
    { ticker: 'ITW', name: 'Illinois Tool Works', sector: 'Industrials', industry: 'Machinery', marketCap: '75' },
    { ticker: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '190' },
    { ticker: 'DHR', name: 'Danaher Corporation', sector: 'Healthcare', industry: 'Life Sciences', marketCap: '180' },
    { ticker: 'MDT', name: 'Medtronic plc', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '105' },
    { ticker: 'SYK', name: 'Stryker Corporation', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '120' },
    { ticker: 'ISRG', name: 'Intuitive Surgical', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '145' },
    { ticker: 'BSX', name: 'Boston Scientific', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '85' },
    { ticker: 'EW', name: 'Edwards Lifesciences', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '45' },
    { ticker: 'DXCM', name: 'DexCom Inc.', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '30' },
    { ticker: 'CI', name: 'Cigna Group', sector: 'Healthcare', industry: 'Health Insurance', marketCap: '95' },
    { ticker: 'HUM', name: 'Humana Inc.', sector: 'Healthcare', industry: 'Health Insurance', marketCap: '45' },
    { ticker: 'CVS', name: 'CVS Health', sector: 'Healthcare', industry: 'Healthcare Services', marketCap: '75' },
    { ticker: 'MCK', name: 'McKesson Corporation', sector: 'Healthcare', industry: 'Healthcare Distribution', marketCap: '70' }
];

// Generate realistic stock metrics
function generateStockData(stockInfo) {
    const basePrice = 50 + Math.random() * 450;
    const change = (Math.random() - 0.5) * 10;
    const moat = 45 + Math.floor(Math.random() * 50);
    const roe = 8 + Math.floor(Math.random() * 30);
    const pe = 10 + Math.floor(Math.random() * 35);
    const zscore = 1.5 + Math.random() * 3;
    const sgr = 5 + Math.floor(Math.random() * 25);
    const eps = 1 + Math.random() * 15;
    const dividend = Math.random() * 4;
    const aiRating = 55 + Math.floor(Math.random() * 40);
    
    // Generate price history
    const history = [];
    let price = basePrice * 0.85;
    for (let i = 0; i < 20; i++) {
        price = price * (1 + (Math.random() - 0.48) * 0.03);
        history.push(Math.round(price * 100) / 100);
    }
    
    return {
        ...stockInfo,
        price: Math.round(basePrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        volume: `${(Math.random() * 50 + 5).toFixed(1)}M`,
        moat,
        sgr,
        roe,
        roic: roe - 2 + Math.floor(Math.random() * 5),
        roa: Math.floor(roe * 0.6),
        eps: Math.round(eps * 100) / 100,
        pe,
        peg: Math.round((pe / sgr) * 100) / 100,
        fcf: Math.floor(Math.random() * 5000) + 500,
        eva: 40 + Math.floor(Math.random() * 50),
        zscore: Math.round(zscore * 100) / 100,
        dividend: Math.round(dividend * 100) / 100,
        beta: Math.round((0.7 + Math.random() * 0.8) * 100) / 100,
        aiRating,
        history
    };
}

export default function Markets() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stocks, setStocks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activePreset, setActivePreset] = useState('all');
    const [filters, setFilters] = useState({
        market: 'All Markets',
        sector: 'All Sectors',
        industry: 'All Industries',
        moat: 'Any',
        roe: 'Any',
        pe: 'Any',
        zscore: 'Any',
    });
    const [selectedStock, setSelectedStock] = useState(null);
    const [showStockModal, setShowStockModal] = useState(false);

    useEffect(() => {
        const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Generate all stocks immediately on mount
    useEffect(() => {
        const generatedStocks = STOCK_DATA.map(generateStockData);
        setStocks(generatedStocks);
    }, []);

    const handleStockClick = (stock) => {
        setSelectedStock(stock);
        setShowStockModal(true);
    };

    const filteredStocks = useMemo(() => {
        let result = [...stocks];
        
        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(s => 
                s.ticker?.toLowerCase().includes(q) || 
                s.name?.toLowerCase().includes(q) ||
                s.sector?.toLowerCase().includes(q)
            );
        }

        // Preset filters
        if (activePreset === 'wide-moats') {
            result = result.filter(s => s.moat >= 70);
        } else if (activePreset === 'undervalued') {
            result = result.filter(s => s.pe < 20);
        } else if (activePreset === 'high-growth') {
            result = result.filter(s => s.sgr >= 15);
        } else if (activePreset === 'top-movers') {
            result = result.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
        }

        // Dropdown filters
        if (filters.moat !== 'Any') {
            const min = parseInt(filters.moat);
            result = result.filter(s => s.moat >= min);
        }
        if (filters.roe !== 'Any') {
            const min = parseInt(filters.roe);
            result = result.filter(s => s.roe >= min);
        }
        if (filters.pe !== 'Any') {
            const max = parseInt(filters.pe.replace('<', ''));
            result = result.filter(s => s.pe < max);
        }
        if (filters.zscore !== 'Any') {
            const min = parseFloat(filters.zscore);
            result = result.filter(s => s.zscore >= min);
        }
        if (filters.sector !== 'All Sectors') {
            result = result.filter(s => s.sector === filters.sector);
        }

        return result;
    }, [stocks, searchQuery, activePreset, filters]);

    const topMovers = useMemo(() => {
        return [...stocks]
            .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
            .slice(0, 20);
    }, [stocks]);

    const sectors = useMemo(() => {
        const uniqueSectors = [...new Set(stocks.map(s => s.sector).filter(Boolean))];
        return ['All Sectors', ...uniqueSectors.sort()];
    }, [stocks]);

    const clearFilters = () => {
        setFilters({
            market: 'All Markets',
            sector: 'All Sectors',
            industry: 'All Industries',
            moat: 'Any',
            roe: 'Any',
            pe: 'Any',
            zscore: 'Any',
        });
        setActivePreset('all');
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm h-[72px]">
                <div className="flex items-center justify-between px-4 h-full">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-100 md:hidden">
                            <Menu className="w-5 h-5 text-purple-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-100 hidden md:flex">
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-purple-600" /> : <Menu className="w-5 h-5 text-purple-600" />}
                        </Button>
                        <Link to={createPageUrl('Home')} className="flex items-center gap-3 hover:opacity-80">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-gray-900">1cPublishing</span>
                                <p className="text-xs font-medium text-purple-600">Ai Markets</p>
                            </div>
                        </Link>
                    </div>

                    <div className="flex-1 max-w-md mx-4 md:mx-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search stocks..."
                                className="pl-12 h-12 rounded-full border-gray-200 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 hidden md:block">
                        {stocks.length} stocks
                    </div>
                </div>

                <StockTicker stocks={topMovers} />
            </header>

            <div className="flex flex-1">
                {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

                <aside className={`${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex-shrink-0 fixed md:relative z-50 md:z-auto h-[calc(100vh-120px)] md:h-auto`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <Link key={index} to={item.href} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.label === 'Markets' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'}`}>
                                <item.icon className="w-5 h-5 text-purple-600" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 overflow-auto p-4 md:p-6">
                    {/* Preset Filters */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {PRESET_FILTERS.map(preset => (
                            <button
                                key={preset.id}
                                onClick={() => setActivePreset(preset.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                                    activePreset === preset.id
                                        ? 'bg-purple-600 text-white border-purple-600'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                                }`}
                            >
                                <preset.icon className="w-4 h-4" />
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    <FilterChips filters={filters} setFilters={setFilters} filterOptions={FILTER_OPTIONS} sectors={sectors} />

                    <div className="flex items-center justify-between mb-4 mt-6">
                        <p className="text-gray-600">
                            Showing <span className="font-bold text-gray-900">{filteredStocks.length}</span> of {stocks.length} stocks
                        </p>
                    </div>

                    {/* Stock Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredStocks.map((stock, i) => (
                            <StockCard key={stock.ticker || i} stock={stock} onClick={handleStockClick} />
                        ))}
                    </div>

                    {filteredStocks.length === 0 && (
                        <div className="text-center py-20">
                            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No stocks match your current filters</p>
                            <Button onClick={clearFilters} variant="outline">
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </main>
            </div>

            <footer className="py-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain grayscale" />
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            {footerLinks.map((link, i) => (
                                <a key={i} href={link.href} className="text-gray-600 hover:text-purple-600 transition-colors">{link.label}</a>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                        © 2025 1cPublishing.com
                    </div>
                </div>
            </footer>

            <StockDetailModal 
                stock={selectedStock} 
                isOpen={showStockModal} 
                onClose={() => setShowStockModal(false)} 
            />
        </div>
    );
}