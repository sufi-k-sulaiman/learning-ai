import React, { useEffect } from 'react';
import PageMeta from '@/components/PageMeta';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Radio, Brain, BarChart3, GraduationCap, ListTodo, Lightbulb, StickyNote, Newspaper, Gamepad2, Globe, Smartphone } from "lucide-react";

const pages = [
    { name: 'Qwirey', page: 'Qwirey', icon: Sparkles, description: 'Your all-in-one Ai assistant, powered by Qwirey', color: '#6209e6', colorEnd: '#4f46e5' },
    { name: 'MindMap', page: 'MindMap', icon: Brain, description: 'Ai-powered knowledge visualization and exploration', color: '#db2777', colorEnd: '#e11d48' },
    { name: 'SearchPods', page: 'SearchPods', icon: Radio, description: 'Ai-generated podcasts on any topic with voice playback', color: '#2563eb', colorEnd: '#0891b2' },
    { name: 'News', page: 'News', icon: Newspaper, description: 'AI-powered news aggregator across topics', color: '#dc2626', colorEnd: '#ea580c' },
    { name: 'Learning', page: 'Learning', icon: GraduationCap, description: 'Navigate knowledge islands with progress tracking', color: '#059669', colorEnd: '#0d9488' },
    { name: 'Geospatial', page: 'Geospatial', icon: Globe, description: 'Global data intelligence across 18 domains', color: '#4f46e5', colorEnd: '#6209e6' },
    { name: 'Intelligence', page: 'Intelligence', icon: Lightbulb, description: 'AI predictive analytics and scenario modeling', color: '#4f46e5', colorEnd: '#6209e6' },
    { name: 'Games', page: 'Games', icon: Gamepad2, description: 'Learn while you play with Word Shooter', color: '#6209e6', colorEnd: '#db2777' },
    { name: 'Appstore', page: 'Appstore', icon: Smartphone, description: 'Download our AI-powered mobile apps', color: '#2563eb', colorEnd: '#6209e6' },
    { name: 'Tasks', page: 'Tasks', icon: ListTodo, description: 'Track initiatives across all departments', color: '#7c3aed', colorEnd: '#6209e6' },
    { name: 'Notes', page: 'Notes', icon: StickyNote, description: 'Rich text notes with Ai assistance', color: '#db2777', colorEnd: '#e11d48' },
];

export default function HomePage() {

    return (
        <>
            <PageMeta 
                title="Home - AI Platform"
                description="AI-powered platform with smart agents designed to boost productivity, efficiency, and growth across all domains."
                keywords="1cPublishing, AI platform, AI agents, productivity tools, smart automation"
            />
            <div className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">Welcome</h1>
                <p className="mb-6 md:mb-8 text-gray-600">Ai Powered Platform to boost productivity and make you smarter.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {pages.map((page) => (
                        <Link key={page.name} to={createPageUrl(page.page)} className="group">
                            <div 
                                className="rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 text-white h-full"
                                style={{ background: `linear-gradient(to bottom right, ${page.color}, ${page.colorEnd})` }}
                            >
                                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                    <page.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-xl mb-2">{page.name}</h3>
                                <p className="text-white/80 text-sm">{page.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}