import React, { useState, useEffect } from 'react';
import PageMeta from '@/components/PageMeta';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, FileText, Sparkles, Radio, Brain, Settings, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PageLayout from '@/components/PageLayout';
import { base44 } from '@/api/base44Client';

const PAGES = [
    { name: 'AI Hub', href: createPageUrl('AIHub'), icon: Sparkles, description: 'Your all-in-one AI assistant', color: '#6B4EE6' },
    { name: 'SearchPods', href: createPageUrl('SearchPods'), icon: Radio, description: 'AI-generated podcasts', color: '#3B82F6' },
    { name: 'MindMap', href: createPageUrl('MindMap'), icon: Brain, description: 'Knowledge visualization', color: '#EC4899' },
    { name: 'Resume Builder', href: createPageUrl('ResumeBuilder'), icon: FileText, description: 'Professional resume generator', color: '#10B981' },
    { name: 'Settings', href: createPageUrl('Settings'), icon: Settings, description: 'Customize your experience', color: '#6B7280' },
];

export default function SearchResults() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q) {
            setQuery(q);
            performSearch(q);
        }
    }, []);

    const performSearch = async (searchQuery) => {
        setIsLoading(true);
        try {
            // Filter pages that match
            const matchedPages = PAGES.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Get AI-powered suggestions
            const aiResponse = await base44.integrations.Core.InvokeLLM({
                prompt: `User searched for "${searchQuery}". Suggest relevant topics, actions, and content. Keep responses concise.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        suggestions: { type: "array", items: { type: "string" } },
                        relatedTopics: { type: "array", items: { type: "string" } },
                        quickAnswer: { type: "string" }
                    }
                }
            });

            setResults({
                pages: matchedPages,
                suggestions: aiResponse?.suggestions || [],
                relatedTopics: aiResponse?.relatedTopics || [],
                quickAnswer: aiResponse?.quickAnswer
            });
        } catch (error) {
            console.error('Search error:', error);
            setResults({ pages: PAGES, suggestions: [], relatedTopics: [], quickAnswer: null });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (newQuery) => {
        setQuery(newQuery);
        performSearch(newQuery);
        window.history.pushState({}, '', `${createPageUrl('SearchResults')}?q=${encodeURIComponent(newQuery)}`);
    };

    return (
        <>
            <PageMeta 
                title="Search Results"
                description="AI-powered search results with intelligent suggestions and related topics across all platform features."
                keywords="search, AI search, intelligent search, search results, platform search"
            />
            <PageLayout activePage="" onSearch={handleSearch} searchPlaceholder="Search anything..." showSearch={true}>
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link to={createPageUrl('Home')}>
                        <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                        {query && <p className="text-gray-500">Results for "{query}"</p>}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    </div>
                ) : results ? (
                    <div className="space-y-8">
                        {/* Quick Answer */}
                        {results.quickAnswer && (
                            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    <h2 className="font-semibold text-purple-900">AI Answer</h2>
                                </div>
                                <p className="text-gray-700">{results.quickAnswer}</p>
                            </div>
                        )}

                        {/* Matched Pages */}
                        {results.pages?.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pages</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {results.pages.map((page, i) => (
                                        <Link key={i} to={page.href} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${page.color}15` }}>
                                                <page.icon className="w-6 h-6" style={{ color: page.color }} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{page.name}</h3>
                                                <p className="text-sm text-gray-500">{page.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        {results.suggestions?.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Suggestions</h2>
                                <div className="flex flex-wrap gap-2">
                                    {results.suggestions.map((suggestion, i) => (
                                        <button key={i} onClick={() => handleSearch(suggestion)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-all">
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Topics */}
                        {results.relatedTopics?.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Topics</h2>
                                <div className="space-y-2">
                                    {results.relatedTopics.map((topic, i) => (
                                        <button key={i} onClick={() => handleSearch(topic)} className="flex items-center gap-3 w-full p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-left">
                                            <Search className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700">{topic}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Enter a search query to find content</p>
                    </div>
                )}
            </div>
        </PageLayout>
        </>
    );
}