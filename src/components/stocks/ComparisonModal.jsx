import React, { useState } from 'react';
import { X, Plus, Trash2, ArrowRight, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const ALL_TICKERS = [
    { ticker: 'AAPL', name: 'Apple Inc.' }, { ticker: 'MSFT', name: 'Microsoft Corporation' }, { ticker: 'GOOGL', name: 'Alphabet Inc.' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.' }, { ticker: 'NVDA', name: 'NVIDIA Corporation' }, { ticker: 'META', name: 'Meta Platforms Inc.' },
    { ticker: 'TSLA', name: 'Tesla Inc.' }, { ticker: 'BRK.B', name: 'Berkshire Hathaway' }, { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
    { ticker: 'V', name: 'Visa Inc.' }, { ticker: 'JNJ', name: 'Johnson & Johnson' }, { ticker: 'WMT', name: 'Walmart Inc.' },
    { ticker: 'PG', name: 'Procter & Gamble' }, { ticker: 'MA', name: 'Mastercard Inc.' }, { ticker: 'HD', name: 'Home Depot Inc.' },
    { ticker: 'XOM', name: 'Exxon Mobil Corp.' }, { ticker: 'CVX', name: 'Chevron Corp.' }, { ticker: 'BAC', name: 'Bank of America' },
    { ticker: 'ABBV', name: 'AbbVie Inc.' }, { ticker: 'KO', name: 'Coca-Cola Company' }, { ticker: 'PEP', name: 'PepsiCo Inc.' },
    { ticker: 'COST', name: 'Costco Wholesale' }, { ticker: 'MRK', name: 'Merck & Co.' }, { ticker: 'TMO', name: 'Thermo Fisher Scientific' },
    { ticker: 'AVGO', name: 'Broadcom Inc.' }, { ticker: 'CSCO', name: 'Cisco Systems' }, { ticker: 'ACN', name: 'Accenture plc' },
    { ticker: 'ADBE', name: 'Adobe Inc.' }, { ticker: 'CRM', name: 'Salesforce Inc.' }, { ticker: 'INTC', name: 'Intel Corporation' },
    { ticker: 'AMD', name: 'Advanced Micro Devices' }, { ticker: 'IBM', name: 'IBM Corporation' }, { ticker: 'ORCL', name: 'Oracle Corporation' },
    { ticker: 'QCOM', name: 'Qualcomm Inc.' }, { ticker: 'NOW', name: 'ServiceNow Inc.' }, { ticker: 'INTU', name: 'Intuit Inc.' },
    { ticker: 'SNOW', name: 'Snowflake Inc.' }, { ticker: 'PLTR', name: 'Palantir Technologies' }, { ticker: 'CRWD', name: 'CrowdStrike Holdings' },
    { ticker: 'NKE', name: 'Nike Inc.' }, { ticker: 'LOW', name: 'Lowes Companies' }, { ticker: 'SBUX', name: 'Starbucks Corporation' },
    { ticker: 'TGT', name: 'Target Corporation' }, { ticker: 'MCD', name: 'McDonalds Corporation' }, { ticker: 'DIS', name: 'Walt Disney Company' },
    { ticker: 'NFLX', name: 'Netflix Inc.' }, { ticker: 'PYPL', name: 'PayPal Holdings' }, { ticker: 'GS', name: 'Goldman Sachs' },
    { ticker: 'MS', name: 'Morgan Stanley' }, { ticker: 'AXP', name: 'American Express' }, { ticker: 'UNH', name: 'UnitedHealth Group' }
];

export default function ComparisonModal({ isOpen, onClose, currentTicker }) {
    const navigate = useNavigate();
    const [tickers, setTickers] = useState([currentTicker]);
    const [newTicker, setNewTicker] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInputChange = (value) => {
        setNewTicker(value);
        if (value.trim().length > 0) {
            const filtered = ALL_TICKERS.filter(t => 
                t.ticker.toLowerCase().includes(value.toLowerCase()) || 
                t.name.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 8);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const addTicker = (ticker) => {
        const tickerUpper = ticker.trim().toUpperCase();
        if (tickerUpper && !tickers.includes(tickerUpper) && tickers.length < 5) {
            setTickers([...tickers, tickerUpper]);
            setNewTicker('');
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const removeTicker = (ticker) => {
        setTickers(tickers.filter(t => t !== ticker));
    };

    const handleCompare = () => {
        if (tickers.length >= 2) {
            navigate(`${createPageUrl('StockComparison')}?tickers=${tickers.join(',')}`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Compare Stocks</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="relative">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    value={newTicker}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && suggestions.length > 0 && addTicker(suggestions[0].ticker)}
                                    placeholder="Search ticker or company name..."
                                    className="pl-10"
                                    onFocus={() => newTicker && setShowSuggestions(true)}
                                />
                            </div>
                            <Button onClick={() => addTicker(newTicker)} disabled={tickers.length >= 5}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-12 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                                {suggestions.map(suggestion => (
                                    <button
                                        key={suggestion.ticker}
                                        onClick={() => addTicker(suggestion.ticker)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-purple-50 text-left border-b border-gray-100 last:border-0"
                                    >
                                        <div>
                                            <p className="font-bold text-gray-900">{suggestion.ticker}</p>
                                            <p className="text-xs text-gray-500">{suggestion.name}</p>
                                        </div>
                                        <Plus className="w-4 h-4 text-purple-600" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        {tickers.map((ticker, i) => (
                            <div key={ticker} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-purple-600">{ticker}</span>
                                    {i === 0 && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Current</span>}
                                </div>
                                {tickers.length > 1 && (
                                    <Button variant="ghost" size="sm" onClick={() => removeTicker(ticker)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-sm text-gray-500">
                        Add {5 - tickers.length} more stock{5 - tickers.length !== 1 ? 's' : ''} (max 5 total)
                    </div>

                    <Button 
                        onClick={handleCompare} 
                        disabled={tickers.length < 2}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                        Compare {tickers.length} Stocks
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}