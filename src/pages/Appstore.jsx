import React from 'react';
import { ExternalLink, Smartphone, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Appstore() {
    React.useEffect(() => {
        document.title = 'App Store - Download Our Mobile Apps';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Download our AI-powered mobile applications for iOS. SearchPods, Neural MindMap, and RoutineOps.');
        document.querySelector('meta[name="keywords"]')?.setAttribute('content', 'iOS apps, mobile apps, AI apps, SearchPods, MindMap, RoutineOps');
    }, []);

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
            thumbnail: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/4020f05d1_image.png',
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
        }
    ];

    return (
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
                        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row">
                                {/* App Thumbnail - Left Side */}
                                <div className={`md:w-1/3 h-64 md:h-auto bg-gradient-to-br ${app.color} flex items-center justify-center overflow-hidden`}>
                                    <img 
                                        src={app.thumbnail} 
                                        alt={`${app.name} screenshot`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* App Info - Right Side */}
                                <div className="md:w-2/3 p-6 flex flex-col">
                                    {/* Logo and Title */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <img 
                                            src={app.logo} 
                                            alt={`${app.name} logo`}
                                            className="w-16 h-16 rounded-2xl shadow-md flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900">{app.name}</h3>
                                            <p className="text-sm font-medium text-gray-500">{app.tagline}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-4 leading-relaxed flex-1">{app.description}</p>

                                    {/* Features */}
                                    <div className="mb-4">
                                        <ul className="grid grid-cols-2 gap-2">
                                            {app.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
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
                                        className="block"
                                    >
                                        <Button className={`w-full bg-gradient-to-r ${app.color} hover:opacity-90 text-white font-semibold py-3`}>
                                            <Download className="w-4 h-4 mr-2" />
                                            Download on App Store
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
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
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
    );
}