import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronLeft, Menu, Search, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LOGO_URL, menuItems } from '../NavigationConfig';

const PAGES_WITHOUT_SEARCH = ['Qwirey', 'MindMap', 'Learning', 'News', 'SearchPods', 'Markets', 'Search'];

export default function Header({ title, sidebarOpen, setSidebarOpen, children, currentPage }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const hideSearch = PAGES_WITHOUT_SEARCH.includes(currentPage);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const pageSuggestions = menuItems
                .filter(item => item.label.toLowerCase().includes(query))
                .map(item => ({ type: 'page', label: item.label, href: item.href }));
            
            const topicSuggestions = [
                'AI trends', 'Technology news', 'Market analysis', 'Learning resources', 
                'Data visualization', 'Geospatial mapping', 'Task management'
            ].filter(s => s.toLowerCase().includes(query))
             .map(s => ({ type: 'topic', label: s }));

            setSuggestions([...pageSuggestions.slice(0, 3), ...topicSuggestions.slice(0, 3)]);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            navigate(createPageUrl('Search') + `?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setShowSuggestions(false);
        if (suggestion.type === 'page') {
            navigate(suggestion.href);
        } else {
            setSearchQuery(suggestion.label);
            navigate(createPageUrl('Search') + `?q=${encodeURIComponent(suggestion.label)}`);
        }
    };

    return (
        <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm h-[72px]">
            <div className="flex items-center justify-between px-4 h-full gap-4">
                <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Logo - hidden on mobile since it's in the sidebar */}
                    <Link to={createPageUrl('Intelligence')} className="hidden md:flex items-center gap-3 hover:opacity-80">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-gray-900">Agentic Ai</span>
                            <p className="text-x font-medium" style={{ color: '#6209e6' }}>1cPlatform - Demo</p>
                        </div>
                    </Link>
                    {setSidebarOpen && (
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-100">
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5" style={{ color: '#6209e6' }} /> : <Menu className="w-5 h-5" style={{ color: '#6209e6' }} />}
                        </Button>
                    )}
                </div>

                {/* Centered Search Bar - Hidden on specific pages */}
                {!hideSearch ? (
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto" ref={searchRef}>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={(e) => { 
                                    if (searchQuery) setShowSuggestions(true);
                                    e.target.style.borderColor = '#6209e6';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(98, 9, 230, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '';
                                    e.target.style.boxShadow = '';
                                }}
                                placeholder="Search anything..."
                                className="w-full h-12 pl-5 pr-14 rounded-full border border-gray-200 bg-gray-50 focus:bg-white outline-none transition-all text-gray-700 placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                                style={{ backgroundColor: '#6209e6' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5507C8'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6209e6'}
                            >
                                <Search className="w-4 h-4 text-white" />
                            </button>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50">
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleSuggestionClick(s)}
                                            className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3E8FF'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                                        >
                                            <Search className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700">{s.label}</span>
                                            {s.type === 'page' && (
                                                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ color: '#6209e6', backgroundColor: '#F3E8FF' }}>Page</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                ) : (
                    /* Mobile branding for pages without search */
                    <div className="flex-1 flex md:hidden justify-end mr-2">
                        <div className="text-right">
                            <span className="text-lg font-bold text-gray-900">1cPublishing</span>
                            <p className="text-x font-medium" style={{ color: '#6209e6' }}>Agentic Ai</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 flex-shrink-0">
                    <a 
                        href="https://1cplatform.com/Onboarding" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-2 px-8 py-3.5 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
                        style={{ backgroundColor: '#6209e6' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5507C8'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6209e6'}
                    >
                        Get started
                        <ArrowRight className="w-5 h-5" />
                    </a>
                    {children}
                </div>
            </div>
        </header>
    );
}