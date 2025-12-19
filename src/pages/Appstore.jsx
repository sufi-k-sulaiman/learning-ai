import React from 'react';
import PageMeta from '@/components/PageMeta';
import { ExternalLink, Smartphone, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Appstore() {

    const apps = [
        {
            name: 'SearchPods',
            tagline: 'AI-Powered Podcast Discovery',
            description: 'Transform the way you discover podcasts with AI-generated audio content on any topic. SearchPods uses advanced AI to create personalized podcast episodes tailored to your interests, delivering knowledge in an engaging audio format wherever you go.',
            thumbnail: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/649241119_image.png',
            logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/438969435_Search-Pods-AppIcon1.png',
            link: 'https://apps.apple.com/app/searchpods/id6756348023',
            color: 'from-cyan-600 to-blue-600',
            features: ['AI-generated podcasts', 'Any topic on demand', 'Offline listening', 'Smart recommendations']
        },
        {
            name: 'Neural MindMap',
            tagline: 'Visual Knowledge Mapping',
            description: 'Organize your thoughts and ideas with AI-powered mind mapping. Neural MindMap helps you create beautiful, interactive mind maps that enhance learning, brainstorming, and project planning. Perfect for students, professionals, and creative thinkers.',
            thumbnail: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/364f2f68c_simulator_screenshot_2B094FB3-68CC-475D-BBE7-E9D329CC414F.png',
            logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/9dac35a9f_mindmap-AppIcon11.png',
            link: 'https://apps.apple.com/app/neural-mindmap/id6756198559',
            color: 'from-purple-600 to-pink-600',
            features: ['AI-powered suggestions', 'Beautiful visualizations', 'Real-time collaboration', 'Export & share']
        },
        {
            name: 'RoutineOps',
            tagline: 'Smart Daily Operations',
            description: 'Streamline your daily routines and boost productivity with intelligent task management. RoutineOps combines AI insights with intuitive design to help you build better habits, manage tasks efficiently, and achieve your goals consistently.',
            thumbnail: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/04ff8c071_image.png',
            logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/4034b8cf7_RoutineOPS-appicon.png',
            link: 'https://apps.apple.com/app/routineops/id6756257586',
            color: 'from-green-600 to-emerald-600',
            features: ['Smart scheduling', 'Habit tracking', 'AI productivity tips', 'Progress analytics']
        },
        {
            name: 'AI News Pro',
            tagline: 'Intelligent News Aggregation',
            description: 'Stay informed with AI-curated news from around the world. AI News Pro delivers personalized news feeds, real-time updates, and intelligent summaries to keep you connected to what matters most.',
            thumbnail: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/c92b3eabd_image.png',
            logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/438969435_Search-Pods-AppIcon1.png',
            link: 'https://apps.apple.com/us/app/ai-news-pro/id6756688599',
            color: 'from-red-600 to-orange-600',
            features: ['AI-curated news', 'Real-time updates', 'Smart summaries', 'Multi-category support']
        },
        {
            name: 'Notes AI Pro',
            tagline: 'Smart Note-Taking with AI',
            description: 'Transform your note-taking experience with AI-powered features. Notes AI Pro helps you create, organize, and enhance your notes with intelligent suggestions, code snippets, and image generation capabilities.',
            thumbnail: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/2df582115_image.png',
            logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/438969435_Search-Pods-AppIcon1.png',
            link: 'https://apps.apple.com/us/app/notes-ai-pro/id6756442195',
            color: 'from-purple-600 to-indigo-600',
            features: ['AI text generation', 'Image creation', 'Code snippets', 'Smart organization']
        }
    ];

    return (
        <>
            <PageMeta 
                title="App Store - Mobile Apps"
                description="Download our AI-powered mobile applications for iOS: SearchPods, Neural MindMap, and RoutineOps."
                keywords="iOS apps, mobile apps, AI apps, SearchPods, MindMap, RoutineOps, app store"
            />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Smartphone className="w-10 h-10 text-blue-600" />
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">App Store</h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Download our AI-powered mobile applications and enhance your productivity on the go
                    </p>
                </div>

                {/* Apps Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {apps.map((app, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                {/* Thumbnail - Left Side (full height on desktop, top on mobile) */}
                                <div className="w-full sm:w-48 flex-shrink-0">
                                    <div className="rounded-2xl overflow-hidden shadow-xl h-48 sm:h-full">
                                        <img 
                                            src={app.thumbnail} 
                                            alt={`${app.name} screenshot`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Content - Right Side */}
                                <div className="flex-1 flex flex-col">
                                    {/* Logo and Title */}
                                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                        <img 
                                            src={app.logo} 
                                            alt={`${app.name} logo`}
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-md flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{app.name}</h3>
                                            <p className="text-xs sm:text-sm font-medium text-gray-500">{app.tagline}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">{app.description}</p>

                                    {/* Features */}
                                    <div className="mb-3 sm:mb-4">
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {app.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <Star className="w-3 h-3 flex-shrink-0" style={{ color: '#6209e6', fill: '#6209e6' }} />
                                                    <span className="line-clamp-1">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Download Button */}
                                    <a 
                                        href={app.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block mt-auto"
                                    >
                                        <Button className="w-full text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base" style={{ backgroundColor: '#6209e6' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5507C8'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6209e6'}>
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Platform Info */}
                <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Smartphone className="w-8 h-8 text-gray-700" />
                        <h2 className="text-2xl font-bold text-gray-900">iOS Exclusive</h2>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        All our apps are currently available exclusively on the Apple App Store for iPhone and iPad. 
                        Requires iOS 14.0 or later for optimal performance.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" style={{ color: '#6209e6', fill: '#6209e6' }} />
                            Free to download
                        </span>
                        <span>•</span>
                        <span>Regular updates</span>
                        <span>•</span>
                        <span>AI-powered features</span>
                    </div>
                </div>
                </div>
                </div>
                </>
                );
                }