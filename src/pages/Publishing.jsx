import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mic, Menu, ChevronLeft, Home, FileText, Users, Settings, HelpCircle, BookOpen, Loader2 } from "lucide-react";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/868a98750_1cPublishing-logo.png";

export default function Publishing() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    // Fetch suggestions from LLM with internet context
    const fetchSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }
        
        setIsLoadingSuggestions(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Given the search query "${query}" for a publishing platform, suggest 5 relevant search completions or related topics. Focus on publishing, books, authors, content management, and related topics. Return only the suggestions.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        suggestions: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setSuggestions(response.suggestions || []);
            setShowSuggestions(true);
        } catch (err) {
            console.error('Failed to fetch suggestions:', err);
            setSuggestions([]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        if (searchQuery.length > 0) {
            setShowSuggestions(true);
            debounceRef.current = setTimeout(() => {
                fetchSuggestions(searchQuery);
            }, 500);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
        
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
            };
            recognition.onerror = () => setIsListening(false);

            recognition.start();
        } else {
            alert('Voice search is not supported in this browser.');
        }
    };

    const menuItems = [
        { icon: Home, label: "Dashboard", href: "#" },
        { icon: BookOpen, label: "Publications", href: "#" },
        { icon: FileText, label: "Documents", href: "#" },
        { icon: Users, label: "Authors", href: "#" },
        { icon: Settings, label: "Settings", href: "#" },
        { icon: HelpCircle, label: "Help", href: "#" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hover:bg-gray-100"
                            style={{ color: '#6B4EE6' }}
                        >
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <span className="text-xl font-bold" style={{ color: '#6B4EE6' }}>1cPublishing</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div ref={searchRef} className="flex-1 max-w-2xl mx-8 relative">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search publications, authors, documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery && setShowSuggestions(true)}
                                className="w-full pl-12 pr-12 py-6 text-lg rounded-full border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleVoiceSearch}
                                className={`absolute right-2 rounded-full ${isListening ? 'text-red-500 animate-pulse' : ''}`}
                                style={{ color: isListening ? undefined : '#6B4EE6' }}
                            >
                                <Mic className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                                {isLoadingSuggestions ? (
                                    <div className="px-4 py-3 flex items-center gap-3 text-gray-500">
                                        <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#6B4EE6' }} />
                                        <span>Finding suggestions...</span>
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSearchQuery(suggestion);
                                                setShowSuggestions(false);
                                            }}
                                            className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-700 hover:bg-purple-50"
                                        >
                                            <Search className="w-4 h-4" style={{ color: '#6B4EE6' }} />
                                            {suggestion}
                                        </button>
                                    ))
                                ) : searchQuery.length >= 2 ? (
                                    <div className="px-4 py-3 text-gray-500">No suggestions found</div>
                                ) : (
                                    <div className="px-4 py-3 text-gray-500">Type at least 2 characters...</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-32" /> {/* Spacer for balance */}
                </div>
            </header>

            <div className="flex flex-1">
                {/* Left Sidebar */}
                <aside 
                    className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}
                >
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                            >
                                <item.icon className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                                <span className="font-medium">{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to 1cPublishing</h1>
                        <p className="mb-8 text-gray-600">Your comprehensive publishing management platform.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow" style={{ borderLeft: '4px solid #6B4EE6' }}>
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#6B4EE6' }}>
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold mb-2 text-gray-800">Content Block {i}</h3>
                                    <p className="text-sm text-gray-500">Dynamic content will be displayed here based on your data.</p>
                                    <Button className="mt-4 text-white" style={{ backgroundColor: '#6B4EE6' }}>
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="py-8 mt-auto bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain" />
                            <span className="font-semibold" style={{ color: '#6B4EE6' }}>1cPublishing</span>
                        </div>
                        
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Contact Us</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Governance</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Cookie Policy</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Terms of Use</a>
                        </nav>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} 1cPublishing. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}