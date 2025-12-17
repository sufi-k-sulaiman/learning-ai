import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Plus, Trash2, ArrowRight, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ALL_TICKERS } from './StockTickerData';

export default function ComparisonModal({ isOpen, onClose, currentTicker }) {
    const navigate = useNavigate();
    const [tickers, setTickers] = useState([currentTicker]);
    const [newTicker, setNewTicker] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    const suggestions = useMemo(() => {
        if (!newTicker.trim()) return [];
        const query = newTicker.toLowerCase().trim();
        return ALL_TICKERS.filter(stock => 
            stock.ticker.toLowerCase().includes(query) || 
            stock.name.toLowerCase().includes(query)
        ).slice(0, 8);
    }, [newTicker]);

    useEffect(() => {
        setShowSuggestions(suggestions.length > 0 && newTicker.trim().length > 0);
        setSelectedIndex(0);
    }, [suggestions.length, newTicker]);

    const addTicker = (ticker = null) => {
        const tickerToAdd = ticker || newTicker.trim().toUpperCase();
        if (tickerToAdd && !tickers.includes(tickerToAdd) && tickers.length < 5) {
            setTickers([...tickers, tickerToAdd]);
            setNewTicker('');
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (suggestions[selectedIndex]) {
                addTicker(suggestions[selectedIndex].ticker);
            }
        } else if (e.key === 'Escape') {
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
                                    ref={inputRef}
                                    value={newTicker}
                                    onChange={(e) => setNewTicker(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                    placeholder="Search ticker or company name..."
                                    className="flex-1 pl-10"
                                />
                            </div>
                            <Button onClick={() => addTicker()} disabled={tickers.length >= 5}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {showSuggestions && suggestions.length > 0 && (
                            <div 
                                ref={suggestionsRef}
                                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                            >
                                {suggestions.map((stock, i) => (
                                    <button
                                        key={stock.ticker}
                                        onClick={() => addTicker(stock.ticker)}
                                        className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-0 ${
                                            i === selectedIndex ? 'bg-purple-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-purple-600">{stock.ticker}</span>
                                                <span className="text-sm text-gray-600 ml-2">{stock.name}</span>
                                            </div>
                                            <span className="text-xs text-gray-400">{stock.sector}</span>
                                        </div>
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