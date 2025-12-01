import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ExternalLink, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function MultiSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await base44.functions.invoke('multiSearch', { query });
            setResults(response.data);
        } catch (err) {
            setError(err.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Multi-Search Test</h1>
                    <p className="text-gray-500">Test the multi-engine search backend function</p>
                </div>

                <div className="bg-white rounded-xl border p-4 mb-6">
                    <div className="flex gap-3">
                        <Input
                            placeholder="Enter search query..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={loading || !query.trim()} className="bg-purple-600 hover:bg-purple-700">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            <span className="ml-2">Search</span>
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Searching across multiple engines...</p>
                    </div>
                )}

                {results && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <span>Found {results.total_results} results for "{results.query}"</span>
                            <span>Engines: {results.engines_queried?.join(', ')}</span>
                        </div>

                        {results.results?.map((result, i) => (
                            <a
                                key={i}
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-white rounded-xl border p-4 hover:shadow-md hover:border-purple-200 transition-all"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <ExternalLink className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-purple-700 hover:underline line-clamp-1">{result.title}</h3>
                                        <p className="text-xs text-green-600 truncate mb-1">{result.url}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{result.snippet}</p>
                                        {result.source && (
                                            <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                                                {result.source}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}