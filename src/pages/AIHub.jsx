import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Globe, Paperclip, Mic, AudioLines, Sparkles, Bot, Lightbulb, FileText, Image, Loader2, X, ExternalLink, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from 'react-markdown';

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/868a98750_1cPublishing-logo.png";

const AI_MODELS = [
    { id: 'qwirey', name: 'Qwirey', icon: null, isLogo: true, description: 'All-in-one AI assistant', color: '#6B4EE6' },
    { id: 'gpt4', name: 'GPT-4o', icon: Bot, description: 'Advanced reasoning', color: '#10A37F' },
    { id: 'claude', name: 'Claude', icon: Sparkles, description: 'Thoughtful analysis', color: '#CC785C' },
    { id: 'gemini', name: 'Gemini', icon: Lightbulb, description: 'Multimodal AI', color: '#4285F4' },
];

export default function AIHub() {
    const [query, setQuery] = useState('');
    const [selectedModel, setSelectedModel] = useState('qwirey');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const handleVoiceInput = () => {
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice input not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e) => {
            const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
            setQuery(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    const handleSubmit = async () => {
        if (!query.trim() || isLoading) return;
        
        setIsLoading(true);
        setResults({ query, loading: true, text: '', images: [], documents: [], suggestions: [] });

        try {
            // Run all AI tasks in parallel for Qwirey
            const [textResponse, imagesResponse, webResponse] = await Promise.all([
                // Main AI response with web context
                base44.integrations.Core.InvokeLLM({
                    prompt: `You are Qwirey, an advanced AI assistant. Provide a comprehensive, well-structured response to: "${query}". 
                    Include relevant insights, explanations, and actionable information. Use markdown formatting.`,
                    add_context_from_internet: true
                }),
                
                // Generate 4 related images
                Promise.all([
                    base44.integrations.Core.GenerateImage({ prompt: `${query} - professional visualization style 1` }),
                    base44.integrations.Core.GenerateImage({ prompt: `${query} - creative artistic style 2` }),
                    base44.integrations.Core.GenerateImage({ prompt: `${query} - infographic style 3` }),
                    base44.integrations.Core.GenerateImage({ prompt: `${query} - modern design style 4` })
                ]).catch(() => []),

                // Get structured web data
                base44.integrations.Core.InvokeLLM({
                    prompt: `Search for information about: "${query}". Find relevant documents, articles, and resources.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            documents: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        title: { type: "string" },
                                        description: { type: "string" },
                                        type: { type: "string" },
                                        source: { type: "string" }
                                    }
                                }
                            },
                            suggestions: {
                                type: "array",
                                items: { type: "string" }
                            }
                        }
                    }
                })
            ]);

            setResults({
                query,
                loading: false,
                text: textResponse || '',
                images: imagesResponse?.filter(img => img?.url).map(img => img.url) || [],
                documents: webResponse?.documents || [],
                suggestions: webResponse?.suggestions || []
            });

        } catch (error) {
            console.error('AI Hub error:', error);
            setResults({
                query,
                loading: false,
                text: 'Sorry, there was an error processing your request. Please try again.',
                images: [],
                documents: [],
                suggestions: []
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const clearResults = () => {
        setResults(null);
        setQuery('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={LOGO_URL} alt="Qwirey" className="h-10 w-10" />
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: '#6B4EE6' }}>AI Hub</h1>
                            <p className="text-xs text-gray-500">Powered by Qwirey</p>
                        </div>
                    </div>
                    
                    {/* Model Selector */}
                    <div className="flex items-center gap-2">
                        {AI_MODELS.map(model => (
                            <button
                                key={model.id}
                                onClick={() => setSelectedModel(model.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                                    selectedModel === model.id 
                                        ? 'bg-purple-100 ring-2 ring-purple-500' 
                                        : 'hover:bg-gray-100'
                                }`}
                                title={model.description}
                            >
                                {model.isLogo ? (
                                    <img src={LOGO_URL} alt={model.name} className="w-5 h-5" />
                                ) : (
                                    <model.icon className="w-5 h-5" style={{ color: model.color }} />
                                )}
                                <span className="text-sm font-medium hidden md:inline">{model.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Search Input */}
                <div className={`transition-all duration-500 ${results ? 'mb-8' : 'mt-20'}`}>
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-4">
                        <Textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything. Type @ for mentions."
                            className="w-full border-0 resize-none text-lg focus:ring-0 min-h-[60px] max-h-[200px]"
                            rows={2}
                        />
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-lg hover:bg-purple-100"
                                    style={{ backgroundColor: selectedModel === 'qwirey' ? '#E0E7FF' : 'transparent' }}
                                >
                                    <Search className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100">
                                    <X className="w-5 h-5 text-gray-500" style={{ transform: 'rotate(45deg)' }} />
                                </Button>
                                <div className="w-px h-6 bg-gray-200 mx-1" />
                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100">
                                    <Lightbulb className="w-5 h-5 text-gray-500" />
                                </Button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100">
                                    <Globe className="w-5 h-5 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100">
                                    <Paperclip className="w-5 h-5 text-gray-500" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={`rounded-lg ${isListening ? 'bg-red-100' : 'hover:bg-gray-100'}`}
                                    onClick={handleVoiceInput}
                                >
                                    <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!query.trim() || isLoading}
                                    className="rounded-lg text-white px-4"
                                    style={{ backgroundColor: '#6B4EE6' }}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <AudioLines className="w-5 h-5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {!results && (
                        <p className="text-center text-gray-500 mt-4">
                            Press Enter or click the button to Qwirey
                        </p>
                    )}
                </div>

                {/* Results Canvas */}
                {results && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Query Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={LOGO_URL} alt="Qwirey" className="w-8 h-8" />
                                <div>
                                    <p className="text-sm text-gray-500">You asked:</p>
                                    <p className="font-medium text-gray-800">{results.query}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={clearResults}>
                                <X className="w-4 h-4 mr-1" /> Clear
                            </Button>
                        </div>

                        {/* Main Response */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                                <h2 className="font-semibold text-gray-800">Qwirey Response</h2>
                            </div>
                            
                            {results.loading ? (
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            ) : (
                                <div className="prose prose-gray max-w-none">
                                    <ReactMarkdown>{results.text}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {/* Generated Images */}
                        {results.images?.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Image className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                                    <h2 className="font-semibold text-gray-800">Generated Visuals</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {results.images.map((url, i) => (
                                        <div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                                            <img src={url} alt={`Generated ${i+1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full">
                                                    <ExternalLink className="w-4 h-4 text-gray-700" />
                                                </a>
                                                <a href={url} download className="p-2 bg-white rounded-full">
                                                    <Download className="w-4 h-4 text-gray-700" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Documents Found */}
                        {results.documents?.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                                    <h2 className="font-semibold text-gray-800">Related Resources</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {results.documents.map((doc, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E0E7FF' }}>
                                                    <FileText className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-800 truncate">{doc.title}</h3>
                                                    <p className="text-sm text-gray-500 line-clamp-2">{doc.description}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{doc.type}</span>
                                                        <span className="text-xs text-gray-400">{doc.source}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggested Prompts */}
                        {results.suggestions?.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Lightbulb className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                                    <h2 className="font-semibold text-gray-800">Continue Exploring</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {results.suggestions.map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setQuery(suggestion)}
                                            className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-all"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}