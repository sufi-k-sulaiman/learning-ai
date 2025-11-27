import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronLeft, Menu, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LOGO_URL } from '../NavigationConfig';

export default function Header({ title, sidebarOpen, setSidebarOpen, children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(createPageUrl('Search') + `?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm h-[72px]">
            <div className="flex items-center justify-between px-4 h-full gap-4">
                <div className="flex items-center gap-4 flex-shrink-0">
                    <Link to={createPageUrl('Home')} className="flex items-center gap-3 hover:opacity-80">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-gray-900">1cPublishing</span>
                            {title && <p className="text-xs font-medium text-purple-600">{title}</p>}
                        </div>
                    </Link>
                    {setSidebarOpen && (
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-100">
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-purple-600" /> : <Menu className="w-5 h-5 text-purple-600" />}
                        </Button>
                    )}
                </div>

                {/* Centered Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search anything..."
                            className="w-full h-12 pl-5 pr-14 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-gray-700 placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-colors"
                        >
                            <Search className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </form>

                <div className="flex-shrink-0">
                    {children}
                </div>
            </div>
        </header>
    );
}