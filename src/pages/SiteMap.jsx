import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Globe, Sparkles, BarChart3, Gamepad2, Settings, Radio, Brain, 
    FileText, GraduationCap, ListTodo, StickyNote, Lightbulb, 
    ScrollText, Newspaper, Map, Mail
} from 'lucide-react';

const pages = [
    {
        name: 'Qwirey',
        icon: Sparkles,
        description: 'AI-powered chat interface for interacting with various language models including GPT-4, Claude, and Gemini.',
        keywords: 'AI chat, language models, GPT-4, Claude'
    },
    {
        name: 'MindMap',
        icon: Brain,
        description: 'AI neural networks create interactive knowledge trees to explore knowledge.',
        keywords: 'mind mapping, AI MindMap'
    },
    {
        name: 'SearchPods',
        icon: Radio,
        description: 'Search for and generate AI-powered audio podcasts on any topic.',
        keywords: 'AI podcasts, audio generation'
    },
    {
        name: 'Markets',
        icon: BarChart3,
        description: 'Stock market data with filtering, search capabilities, and detailed financial metrics.',
        keywords: 'stocks, market data, finance'
    },
    {
        name: 'News',
        icon: Newspaper,
        description: 'Latest news aggregation and AI-powered news summaries.',
        keywords: 'news, current events'
    },
    {
        name: 'Learning',
        icon: GraduationCap,
        description: 'Dynamic learning hub with AI-generated personalized learning islands and gamification.',
        keywords: 'education, learning, courses'
    },
    {
        name: 'Geospatial',
        icon: Globe,
        description: 'Dashboard for visualizing and analyzing geospatial intelligence data across regions.',
        keywords: 'geospatial, maps, analytics'
    },
    {
        name: 'Intelligence',
        icon: Lightbulb,
        description: 'AI-powered analytics and decision-making tools for forecasting and scenario building.',
        keywords: 'analytics, AI intelligence, forecasting'
    },
    {
        name: 'ResumeBuilder',
        icon: FileText,
        description: 'Create, analyze, and export professional resumes with AI assistance and ATS compatibility.',
        keywords: 'resume, CV, job application'
    },
    {
        name: 'Tasks',
        icon: ListTodo,
        description: 'Task management with drag-and-drop organization and visual data representation.',
        keywords: 'tasks, productivity, todo'
    },
    {
        name: 'Notes',
        icon: StickyNote,
        description: 'AI-powered note-taking with rich text editing and AI assistance for text and image generation.',
        keywords: 'notes, writing, AI assistant'
    },
    {
        name: 'Games',
        icon: Gamepad2,
        description: 'Educational arcade games including Space Battle and Word Shooter for gamified learning.',
        keywords: 'games, education, arcade'
    },
    {
        name: 'Settings',
        icon: Settings,
        description: 'Personalized control for usability, simplify customization, and empower every user experience.',
        keywords: 'usability, accessibility'
    },
    {
        name: 'TermsOfUse',
        icon: ScrollText,
        description: 'Terms of use, licensing, data usage policies, and legal information for 1cPublishing.',
        keywords: 'terms, legal, policies'
    },
    {
        name: 'ContactUs',
        icon: Mail,
        description: 'Contact form for sales inquiries, feedback, and support requests.',
        keywords: 'contact, support, feedback'
    },
    {
        name: 'SiteMap',
        icon: Map,
        description: 'Complete listing of all pages and their descriptions for easy navigation.',
        keywords: 'sitemap, navigation, pages'
    }
];

export default function SiteMap() {
    useEffect(() => {
        document.title = 'Site Map - 1cPublishing';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Complete listing of all pages and their descriptions for easy navigation.');
        document.querySelector('meta[name="keywords"]')?.setAttribute('content', 'sitemap, navigation, pages');
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Map className="w-8 h-8 text-purple-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Site Map</h1>
                </div>
                <p className="text-gray-500">Complete listing of all pages and features</p>
            </div>

            <div className="space-y-3">
                {pages.map((page) => {
                    const Icon = page.icon;
                    return (
                        <Link
                            key={page.name}
                            to={createPageUrl(page.name)}
                            className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                                    <Icon className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                        {page.name.replace(/([A-Z])/g, ' $1').trim()}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        <span className="font-medium">Keywords:</span> {page.keywords}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}