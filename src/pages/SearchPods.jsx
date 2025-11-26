import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { 
    Search, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
    Sparkles, Home, FileText, Users, Settings, HelpCircle, BookOpen,
    Menu, ChevronLeft, Loader2, X, RefreshCw, Clock, Mic, ChevronRight,
    Radio, Headphones, List, Grid, Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/868a98750_1cPublishing-logo.png";

const VOICE_OPTIONS = [
    { id: 'alloy', name: 'Alloy', description: 'Neutral & balanced' },
    { id: 'echo', name: 'Echo', description: 'Warm & natural' },
    { id: 'fable', name: 'Fable', description: 'British accent' },
    { id: 'onyx', name: 'Onyx', description: 'Deep & authoritative' },
    { id: 'nova', name: 'Nova', description: 'Friendly & upbeat' },
    { id: 'shimmer', name: 'Shimmer', description: 'Soft & gentle' },
];

const DURATION_OPTIONS = [
    { id: 'short', label: '4-5 mins', minutes: 5 },
    { id: 'medium', label: '10-15 mins', minutes: 12 },
    { id: 'long', label: '20-30 mins', minutes: 25 },
];

export default function SearchPods() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [subTopics, setSubTopics] = useState([]);
    const [isLoadingTopics, setIsLoadingTopics] = useState(true);
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [generationSteps, setGenerationSteps] = useState([]);
    const [currentPod, setCurrentPod] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [currentCaption, setCurrentCaption] = useState('');
    const [captionIndex, setCaptionIndex] = useState(0);
    const [selectedVoice, setSelectedVoice] = useState('nova');
    const [selectedDuration, setSelectedDuration] = useState('medium');
    const [viewMode, setViewMode] = useState('grid');
    const [equalizerBars, setEqualizerBars] = useState([30, 50, 70, 40, 60, 80, 45, 55, 65, 35]);
    
    const audioRef = useRef(null);
    const captionIntervalRef = useRef(null);

    const menuItems = [
        { icon: Radio, label: "SearchPods", href: createPageUrl('SearchPods'), active: true },
        { icon: Sparkles, label: "AI Hub", href: createPageUrl('AIHub') },
        { icon: Home, label: "Dashboard", href: createPageUrl('Home') },
        { icon: BookOpen, label: "Publications", href: "#" },
        { icon: FileText, label: "Documents", href: "#" },
        { icon: Users, label: "Authors", href: "#" },
        { icon: Settings, label: "Settings", href: "#" },
        { icon: HelpCircle, label: "Help", href: "#" },
    ];

    useEffect(() => {
        loadInitialTopics();
    }, []);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setEqualizerBars(prev => prev.map(() => Math.random() * 80 + 20));
            }, 150);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    const loadInitialTopics = async () => {
        setIsLoadingTopics(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 8 trending and interesting podcast topics for an AI-powered search podcast platform. 
                Topics should be diverse: technology, science, history, culture, business, health, entertainment, world events.
                For each topic provide a catchy title and brief description.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        topics: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    category: { type: "string" },
                                    duration: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            const topicsWithImages = await Promise.all(
                (response?.topics || []).slice(0, 8).map(async (topic, index) => {
                    try {
                        const imageRes = await base44.integrations.Core.GenerateImage({
                            prompt: `Podcast thumbnail for "${topic.title}" - modern, vibrant, professional podcast cover art style`
                        });
                        return { ...topic, id: index, thumbnail: imageRes?.url };
                    } catch {
                        return { ...topic, id: index, thumbnail: null };
                    }
                })
            );

            setTopics(topicsWithImages);
        } catch (error) {
            console.error('Error loading topics:', error);
        } finally {
            setIsLoadingTopics(false);
        }
    };

    const loadSubTopics = async (topic) => {
        setSelectedTopic(topic);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 6 related subtopics for the podcast topic: "${topic.title}". 
                These should be specific angles or aspects that would make interesting podcast episodes.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        subtopics: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    angle: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            const subTopicsWithImages = await Promise.all(
                (response?.subtopics || []).slice(0, 6).map(async (sub, index) => {
                    try {
                        const imageRes = await base44.integrations.Core.GenerateImage({
                            prompt: `Podcast thumbnail for "${sub.title}" - ${topic.category} theme, modern podcast cover`
                        });
                        return { ...sub, id: index, thumbnail: imageRes?.url, parentTopic: topic.title };
                    } catch {
                        return { ...sub, id: index, thumbnail: null, parentTopic: topic.title };
                    }
                })
            );

            setSubTopics(subTopicsWithImages);
        } catch (error) {
            console.error('Error loading subtopics:', error);
        }
    };

    const generateSearchPod = async (query) => {
        setShowPlayerModal(true);
        setGenerationStep(0);
        setCurrentPod(null);
        setCurrentCaption('');
        setCaptionIndex(0);

        const durationConfig = DURATION_OPTIONS.find(d => d.id === selectedDuration);
        const targetMinutes = durationConfig?.minutes || 12;

        const steps = [
            { label: 'Researching topic...', icon: Search },
            { label: 'Gathering information...', icon: FileText },
            { label: 'Writing script...', icon: BookOpen },
            { label: 'Generating audio...', icon: Headphones },
            { label: 'Creating visuals...', icon: Sparkles },
            { label: 'Finalizing podcast...', icon: Radio },
        ];
        setGenerationSteps(steps);

        try {
            // Step 1: Research
            setGenerationStep(1);
            const research = await base44.integrations.Core.InvokeLLM({
                prompt: `Research and provide comprehensive information about: "${query}". 
                Include latest facts, statistics, expert opinions, and interesting angles.
                This will be used for a ${targetMinutes} minute podcast episode.`,
                add_context_from_internet: true
            });

            // Step 2: Gather info
            setGenerationStep(2);
            await new Promise(r => setTimeout(r, 1000));

            // Step 3: Write script
            setGenerationStep(3);
            const scriptResponse = await base44.integrations.Core.InvokeLLM({
                prompt: `Write a detailed podcast script about "${query}" that is approximately ${targetMinutes} minutes long when read aloud.
                
                Requirements:
                - Engaging introduction with a hook
                - Well-structured content with clear sections
                - Interesting facts and insights
                - Natural conversational tone
                - Strong conclusion with key takeaways
                - Include timestamps for each section
                
                Research context: ${research}
                
                Format the script with [SECTION] markers and estimated timestamps.
                Also provide caption segments (sentences) for live captioning.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        fullScript: { type: "string" },
                        sections: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    timestamp: { type: "string" },
                                    content: { type: "string" }
                                }
                            }
                        },
                        captions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    text: { type: "string" },
                                    startTime: { type: "number" }
                                }
                            }
                        },
                        suggestedTopics: {
                            type: "array",
                            items: { type: "string" }
                        }
                    }
                }
            });

            // Step 4: Generate audio (simulated - in real app would use TTS API)
            setGenerationStep(4);
            await new Promise(r => setTimeout(r, 2000));

            // Step 5: Create visuals
            setGenerationStep(5);
            const thumbnailRes = await base44.integrations.Core.GenerateImage({
                prompt: `Professional podcast cover art for "${query}" - modern, vibrant, eye-catching design`
            });

            // Step 6: Finalize
            setGenerationStep(6);
            await new Promise(r => setTimeout(r, 500));

            const pod = {
                title: scriptResponse?.title || query,
                query,
                script: scriptResponse?.fullScript || research,
                sections: scriptResponse?.sections || [],
                captions: scriptResponse?.captions || [],
                suggestedTopics: scriptResponse?.suggestedTopics || [],
                thumbnail: thumbnailRes?.url,
                duration: targetMinutes * 60,
                voice: selectedVoice,
                createdAt: new Date().toISOString()
            };

            setCurrentPod(pod);
            setDuration(pod.duration);
            setGenerationStep(7); // Complete

            // Auto-play
            setTimeout(() => {
                startPlayback(pod);
            }, 500);

        } catch (error) {
            console.error('Error generating pod:', error);
            setGenerationStep(-1); // Error state
        }
    };

    const startPlayback = (pod) => {
        setIsPlaying(true);
        setCurrentTime(0);
        
        // Simulate audio playback with captions
        const captions = pod.captions?.length > 0 
            ? pod.captions 
            : pod.script.split(/[.!?]+/).filter(s => s.trim()).map((text, i) => ({
                text: text.trim(),
                startTime: i * 5
            }));

        let timeElapsed = 0;
        captionIntervalRef.current = setInterval(() => {
            timeElapsed += 1;
            setCurrentTime(timeElapsed);

            // Update caption based on time
            const currentCaptionObj = captions.find((c, i) => {
                const nextCaption = captions[i + 1];
                return timeElapsed >= c.startTime && (!nextCaption || timeElapsed < nextCaption.startTime);
            });
            
            if (currentCaptionObj) {
                setCurrentCaption(currentCaptionObj.text);
            }

            if (timeElapsed >= pod.duration) {
                clearInterval(captionIntervalRef.current);
                setIsPlaying(false);
            }
        }, 1000);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            clearInterval(captionIntervalRef.current);
            setIsPlaying(false);
        } else if (currentPod) {
            startPlayback(currentPod);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            generateSearchPod(searchQuery);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const closePlayer = () => {
        clearInterval(captionIntervalRef.current);
        setShowPlayerModal(false);
        setIsPlaying(false);
        setCurrentPod(null);
    };

    // Braille animation dots
    const BrailleAnimation = ({ isActive }) => {
        const [dots, setDots] = useState(Array(6).fill(false));
        
        useEffect(() => {
            if (isActive) {
                const interval = setInterval(() => {
                    setDots(prev => prev.map(() => Math.random() > 0.5));
                }, 200);
                return () => clearInterval(interval);
            }
        }, [isActive]);

        return (
            <div className="grid grid-cols-2 gap-1 p-2">
                {dots.map((active, i) => (
                    <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-all duration-150 ${
                            active ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

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
                        >
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-purple-600" /> : <Menu className="w-5 h-5 text-purple-600" />}
                        </Button>
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <div>
                                <span className="text-xl font-bold text-black">1cPublishing</span>
                                <p className="text-xs text-purple-600 font-medium">AI Powered</p>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for any topic to generate a SearchPod..."
                                className="pl-12 pr-4 py-3 rounded-full border-gray-200 focus:border-purple-500"
                            />
                        </div>
                    </form>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        >
                            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex-shrink-0`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    item.active 
                                        ? 'bg-purple-100 text-purple-700' 
                                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                }`}
                            >
                                <item.icon className="w-5 h-5" style={{ color: '#6B4EE6' }} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Voice & Duration Settings */}
                    <div className="p-4 border-t border-gray-200">
                        <h3 className="font-medium text-gray-700 mb-3">Podcast Settings</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Voice</label>
                                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VOICE_OPTIONS.map(voice => (
                                            <SelectItem key={voice.id} value={voice.id}>
                                                <div>
                                                    <div className="font-medium">{voice.name}</div>
                                                    <div className="text-xs text-gray-500">{voice.description}</div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Duration</label>
                                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DURATION_OPTIONS.map(dur => (
                                            <SelectItem key={dur.id} value={dur.id}>
                                                {dur.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 bg-gray-50 overflow-auto">
                    {/* Topics Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Trending Topics</h2>
                            <Button 
                                variant="outline" 
                                onClick={loadInitialTopics}
                                disabled={isLoadingTopics}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingTopics ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>

                        {isLoadingTopics ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' 
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' 
                                : 'space-y-4'
                            }>
                                {topics.map((topic) => (
                                    <div
                                        key={topic.id}
                                        onClick={() => loadSubTopics(topic)}
                                        className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 ${
                                            viewMode === 'list' ? 'flex' : ''
                                        }`}
                                    >
                                        <div className={`${viewMode === 'list' ? 'w-32 h-24' : 'aspect-video'} bg-gradient-to-br from-purple-500 to-blue-500 relative`}>
                                            {topic.thumbnail && (
                                                <img src={topic.thumbnail} alt={topic.title} className="w-full h-full object-cover" />
                                            )}
                                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs">
                                                {topic.category}
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{topic.title}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">{topic.description}</p>
                                            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                <span>{topic.duration || '10-15 mins'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Subtopics Section */}
                    {selectedTopic && (
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Button variant="ghost" size="icon" onClick={() => setSelectedTopic(null)}>
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <h2 className="text-2xl font-bold text-gray-800">{selectedTopic.title}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subTopics.map((sub) => (
                                    <div
                                        key={sub.id}
                                        onClick={() => generateSearchPod(sub.title)}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                                    >
                                        <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-500 relative">
                                            {sub.thumbnail && (
                                                <img src={sub.thumbnail} alt={sub.title} className="w-full h-full object-cover" />
                                            )}
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <Play className="w-12 h-12 text-white" fill="white" />
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-800 mb-1">{sub.title}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">{sub.description}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Generate More Card */}
                                <div
                                    onClick={() => loadSubTopics(selectedTopic)}
                                    className="bg-purple-50 rounded-2xl border-2 border-dashed border-purple-300 flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors min-h-[200px]"
                                >
                                    <div className="text-center">
                                        <Plus className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                                        <span className="font-medium text-purple-700">Generate More</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Player Modal */}
            <Dialog open={showPlayerModal} onOpenChange={closePlayer}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                    {generationStep < 7 && generationStep > 0 ? (
                        // Generation Progress
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-center mb-8">Generating Your SearchPod</h2>
                            <div className="space-y-4">
                                {generationSteps.map((step, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                            generationStep > index + 1 
                                                ? 'bg-green-500 text-white' 
                                                : generationStep === index + 1
                                                    ? 'bg-purple-500 text-white animate-pulse'
                                                    : 'bg-gray-200 text-gray-400'
                                        }`}>
                                            {generationStep > index + 1 ? '✓' : <step.icon className="w-5 h-5" />}
                                        </div>
                                        <span className={`font-medium ${generationStep >= index + 1 ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                        {generationStep === index + 1 && (
                                            <Loader2 className="w-5 h-5 animate-spin text-purple-500 ml-auto" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Progress value={(generationStep / generationSteps.length) * 100} className="mt-8" />
                        </div>
                    ) : currentPod ? (
                        // Player View
                        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
                            {/* Thumbnail & Title */}
                            <div className="relative h-64">
                                {currentPod.thumbnail && (
                                    <img src={currentPod.thumbnail} alt={currentPod.title} className="w-full h-full object-cover opacity-50" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent" />
                                <div className="absolute bottom-4 left-6 right-6">
                                    <h2 className="text-2xl font-bold mb-2">{currentPod.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-purple-200">
                                        <span><Clock className="w-4 h-4 inline mr-1" />{formatTime(duration)}</span>
                                        <span><Mic className="w-4 h-4 inline mr-1" />{VOICE_OPTIONS.find(v => v.id === currentPod.voice)?.name}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 right-4 text-white hover:bg-white/20"
                                    onClick={closePlayer}
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            {/* Equalizer */}
                            <div className="px-6 py-4 flex items-end justify-center gap-1 h-20 bg-black/20">
                                {equalizerBars.map((height, i) => (
                                    <div
                                        key={i}
                                        className="w-2 bg-purple-400 rounded-t transition-all duration-150"
                                        style={{ height: isPlaying ? `${height}%` : '20%' }}
                                    />
                                ))}
                            </div>

                            {/* Live Caption */}
                            <div className="px-6 py-6 bg-black/30 min-h-[100px] flex items-center justify-center">
                                <div className="flex items-center gap-4">
                                    <BrailleAnimation isActive={isPlaying} />
                                    <p className="text-lg text-center max-w-2xl leading-relaxed">
                                        {currentCaption || 'Starting podcast...'}
                                    </p>
                                    <BrailleAnimation isActive={isPlaying} />
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="px-6 py-2">
                                <Slider
                                    value={[currentTime]}
                                    max={duration}
                                    step={1}
                                    onValueChange={([val]) => setCurrentTime(val)}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-purple-300 mt-1">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="px-6 py-6 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white hover:bg-white/20"
                                        onClick={() => setIsMuted(!isMuted)}
                                    >
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </Button>
                                    <Slider
                                        value={[isMuted ? 0 : volume]}
                                        max={100}
                                        onValueChange={([val]) => { setVolume(val); setIsMuted(false); }}
                                        className="w-24"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                        <SkipBack className="w-6 h-6" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="w-16 h-16 rounded-full bg-white text-purple-900 hover:bg-purple-100"
                                        onClick={togglePlayPause}
                                    >
                                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                        <SkipForward className="w-6 h-6" />
                                    </Button>
                                </div>

                                <div className="w-32" />
                            </div>

                            {/* Suggested Topics */}
                            {currentPod.suggestedTopics?.length > 0 && (
                                <div className="px-6 py-4 border-t border-white/10">
                                    <h3 className="text-sm font-medium text-purple-300 mb-3">Continue Listening</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentPod.suggestedTopics.map((topic, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { closePlayer(); generateSearchPod(topic); }}
                                                className="px-3 py-1.5 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
                                            >
                                                {topic}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Footer */}
            <footer className="py-6 bg-white border-t border-gray-200">
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
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                        © 2025 1cPublishing.com
                    </div>
                </div>
            </footer>
        </div>
    );
}