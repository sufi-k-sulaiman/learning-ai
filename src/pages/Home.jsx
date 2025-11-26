import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mic, MicOff, Menu, ChevronLeft, Home as HomeIcon, FileText, Users, Settings, HelpCircle, BookOpen, Loader2, Sparkles } from "lucide-react";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/868a98750_1cPublishing-logo.png";

export default function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const menuItems = [
        { icon: Sparkles, label: "AI Hub", href: createPageUrl('AIHub') },
        { icon: HomeIcon, label: "Dashboard", href: "#" },
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
                            <div>
                                <span className="text-xl font-bold text-black">1cPublishing</span>
                                <p className="text-xs font-medium" style={{ color: '#6B4EE6' }}>AI Powered</p>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8 relative">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search publications, authors, documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-6 text-lg rounded-full border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    <div className="w-32" />
                </div>
            </header>

            <div className="flex flex-1">
                {/* Left Sidebar */}
                <aside 
                    className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}
                >
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                            >
                                <item.icon className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to 1cPublishing</h1>
                        <p className="mb-8 text-gray-600">Your comprehensive publishing management platform.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* AI Hub Card - Featured */}
                            <Link to={createPageUrl('AIHub')} className="col-span-full">
                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center">
                                            <Sparkles className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl">AI Hub - Qwirey</h3>
                                            <p className="text-white/80">Your all-in-one AI assistant for content creation</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>

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
                            <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain grayscale" />
                        </div>
                        
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Contact Us</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Governance</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Cookie Policy</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Terms of Use</a>
                        </nav>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                        © 2025 1cPublishing.com
                    </div>
                </div>
            </footer>
        </div>
    );
}