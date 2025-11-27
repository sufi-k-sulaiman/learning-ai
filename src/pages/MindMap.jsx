import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Brain, Search, Loader2, Sparkles, ArrowLeft, Network } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import KeywordCard from '../components/mindmap/KeywordCard';
import LearnMoreModal from '../components/mindmap/LearnMoreModal';

export default function MindMapPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [centerKeyword, setCenterKeyword] = useState(null);
    const [relatedKeywords, setRelatedKeywords] = useState([]);
    const [history, setHistory] = useState([]);
    const [selectedKeyword, setSelectedKeyword] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleSearch = async (topic) => {
        if (!topic?.trim()) return;
        setLoading(true);
        
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `For the topic "${topic}", generate a central keyword and 6-8 closely related keywords for knowledge exploration. Each keyword should have a name and a brief description (1-2 sentences).`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        central: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                description: { type: "string" }
                            }
                        },
                        related: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            if (centerKeyword) {
                setHistory(prev => [...prev, { center: centerKeyword, related: relatedKeywords }]);
            }
            
            setCenterKeyword(response.central);
            setRelatedKeywords(response.related || []);
            setSearchTerm('');
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExplore = (keyword) => {
        handleSearch(keyword.name);
    };

    const handleLearnMore = (keyword) => {
        setSelectedKeyword(keyword);
        setShowModal(true);
    };

    const handleBack = () => {
        if (history.length > 0) {
            const previous = history[history.length - 1];
            setCenterKeyword(previous.center);
            setRelatedKeywords(previous.related);
            setHistory(prev => prev.slice(0, -1));
        }
    };

    const handleReset = () => {
        setCenterKeyword(null);
        setRelatedKeywords([]);
        setHistory([]);
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                            <Brain className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">MindMap</h1>
                            <p className="text-white/80">Explore knowledge through connected concepts</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
                    <div className="flex gap-3">
                        {history.length > 0 && (
                            <Button variant="outline" onClick={handleBack} className="shrink-0">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        )}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search any topic to explore (e.g., Artificial Intelligence, Quantum Physics, Renaissance Art)"
                                className="pl-10"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(searchTerm); }}
                            />
                        </div>
                        <Button
                            onClick={() => handleSearch(searchTerm)}
                            disabled={loading || !searchTerm.trim()}
                            className="bg-purple-600 hover:bg-purple-700 gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Explore
                        </Button>
                    </div>
                </div>

                {/* Content */}
                {!centerKeyword && !loading ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
                            <Network className="w-10 h-10 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Your Knowledge Journey</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Search for any topic and discover related concepts. Click "Explore" to dive deeper or "Learn" for comprehensive insights.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Machine Learning', 'Climate Change', 'Renaissance', 'Blockchain', 'Neuroscience'].map(topic => (
                                <Button
                                    key={topic}
                                    variant="outline"
                                    onClick={() => handleSearch(topic)}
                                    className="rounded-full"
                                >
                                    {topic}
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : loading ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Discovering related concepts...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Center Keyword */}
                        {centerKeyword && (
                            <KeywordCard
                                keyword={centerKeyword}
                                index={0}
                                isCenter={true}
                                onExplore={handleExplore}
                                onLearnMore={handleLearnMore}
                            />
                        )}

                        {/* Related Keywords Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Related Concepts</h3>
                                <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-500">
                                    Start Over
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {relatedKeywords.map((keyword, i) => (
                                    <KeywordCard
                                        key={i}
                                        keyword={keyword}
                                        index={i + 1}
                                        onExplore={handleExplore}
                                        onLearnMore={handleLearnMore}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Breadcrumb / Path */}
                        {history.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                                <span>Path:</span>
                                {history.map((h, i) => (
                                    <React.Fragment key={i}>
                                        <span className="text-purple-600">{h.center.name}</span>
                                        <span>→</span>
                                    </React.Fragment>
                                ))}
                                <span className="font-medium text-gray-900">{centerKeyword?.name}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Learn More Modal */}
            <LearnMoreModal
                keyword={selectedKeyword}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
}