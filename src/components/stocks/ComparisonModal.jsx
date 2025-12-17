import React, { useState } from 'react';
import { X, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ComparisonModal({ isOpen, onClose, currentTicker }) {
    const navigate = useNavigate();
    const [tickers, setTickers] = useState([currentTicker]);
    const [newTicker, setNewTicker] = useState('');

    const addTicker = () => {
        const ticker = newTicker.trim().toUpperCase();
        if (ticker && !tickers.includes(ticker) && tickers.length < 5) {
            setTickers([...tickers, ticker]);
            setNewTicker('');
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
                    <div className="flex gap-2">
                        <Input
                            value={newTicker}
                            onChange={(e) => setNewTicker(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTicker()}
                            placeholder="Enter ticker (e.g., AAPL)"
                            className="flex-1"
                        />
                        <Button onClick={addTicker} disabled={tickers.length >= 5}>
                            <Plus className="w-4 h-4" />
                        </Button>
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