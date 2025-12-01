import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Sun, Cloud, CloudRain, Wind, Thermometer, Droplets, Eye, 
    BookOpen, GraduationCap, Lightbulb, Globe, Calendar, Heart,
    ChevronRight, Home, Loader2, TrendingUp, BarChart3, Shield,
    Leaf, Snowflake, Flower2, TreeDeciduous, Clock, MapPin,
    AlertTriangle, Activity, Search, Filter, Sparkles, Quote
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const SEASONS = {
    spring: { name: 'Spring', icon: Flower2, color: '#22C55E', gradient: 'from-green-500 to-emerald-500' },
    summer: { name: 'Summer', icon: Sun, color: '#F59E0B', gradient: 'from-amber-500 to-orange-500' },
    autumn: { name: 'Autumn', icon: TreeDeciduous, color: '#EA580C', gradient: 'from-orange-500 to-red-500' },
    winter: { name: 'Winter', icon: Snowflake, color: '#3B82F6', gradient: 'from-blue-500 to-cyan-500' }
};

const TABS = [
    { id: 'forecast', label: 'Forecast', icon: Cloud },
    { id: 'encyclopedia', label: 'Encyclopedia', icon: BookOpen },
    { id: 'education', label: 'Learn', icon: GraduationCap },
    { id: 'wisdom', label: 'Wisdom', icon: Lightbulb },
    { id: 'charts', label: 'Analytics', icon: BarChart3 }
];

const DEPTH_FILTERS = ['Quick Glance', 'Standard', 'Deep Dive'];
const INTEREST_FILTERS = ['Science', 'Travel', 'Health', 'Sustainability'];

function Breadcrumb({ items }) {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            {index === 0 && <Home className="w-4 h-4" />}
                            {item.label}
                        </Link>
                    ) : (
                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-amber-600 font-medium bg-amber-50">
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

function WeatherWisdomQuote({ quote, source }) {
    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
                <Quote className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                    <p className="text-gray-700 italic">"{quote}"</p>
                    <p className="text-sm text-amber-600 mt-1">— {source}</p>
                </div>
            </div>
        </div>
    );
}

function ForecastView({ depth, interest }) {
    const [loading, setLoading] = useState(true);
    const [forecast, setForecast] = useState(null);

    useEffect(() => {
        fetchForecast();
    }, [depth, interest]);

    const fetchForecast = async () => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate a weather forecast with ${depth} detail level focused on ${interest} interests. Include:
1. Current conditions summary (temperature, humidity, wind, conditions)
2. Today's forecast with explanation of WHY the weather is happening
3. 7-day outlook with brief daily summaries
4. Weather phenomenon encyclopedia entry for today's main condition
5. One sentence weather summary
6. ${interest}-specific recommendations`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        current: {
                            type: "object",
                            properties: {
                                temperature: { type: "number" },
                                humidity: { type: "number" },
                                windSpeed: { type: "number" },
                                condition: { type: "string" },
                                feelsLike: { type: "number" }
                            }
                        },
                        todayExplanation: { type: "string" },
                        oneSentence: { type: "string" },
                        weeklyForecast: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    day: { type: "string" },
                                    high: { type: "number" },
                                    low: { type: "number" },
                                    condition: { type: "string" },
                                    precipitation: { type: "number" }
                                }
                            }
                        },
                        encyclopediaEntry: {
                            type: "object",
                            properties: {
                                term: { type: "string" },
                                definition: { type: "string" },
                                causes: { type: "string" },
                                globalExamples: { type: "array", items: { type: "string" } }
                            }
                        },
                        recommendations: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setForecast(response);
        } catch (error) {
            console.error('Failed to fetch forecast:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
                <p className="text-gray-500">Loading forecast...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* One Sentence Summary */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                <p className="text-lg font-medium">{forecast?.oneSentence || 'Weather data loading...'}</p>
            </div>

            {/* Current Conditions */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { icon: Thermometer, label: 'Temperature', value: `${forecast?.current?.temperature || 72}°F`, sub: `Feels ${forecast?.current?.feelsLike || 70}°F` },
                    { icon: Droplets, label: 'Humidity', value: `${forecast?.current?.humidity || 65}%`, sub: 'Relative' },
                    { icon: Wind, label: 'Wind', value: `${forecast?.current?.windSpeed || 8} mph`, sub: 'NW' },
                    { icon: Sun, label: 'UV Index', value: '6', sub: 'High' },
                    { icon: Eye, label: 'Visibility', value: '10 mi', sub: 'Clear' }
                ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                        <item.icon className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* Why This Weather */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Understanding Today's Weather
                </h3>
                <p className="text-gray-700 leading-relaxed">{forecast?.todayExplanation}</p>
            </div>

            {/* 7-Day Forecast */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">7-Day Outlook</h3>
                <div className="grid grid-cols-7 gap-2">
                    {(forecast?.weeklyForecast || []).slice(0, 7).map((day, i) => (
                        <div key={i} className="text-center p-3 rounded-lg hover:bg-gray-50">
                            <p className="text-sm font-medium text-gray-600">{day.day}</p>
                            <Cloud className="w-8 h-8 mx-auto my-2 text-gray-400" />
                            <p className="text-sm font-bold text-gray-900">{day.high}°</p>
                            <p className="text-xs text-gray-400">{day.low}°</p>
                            <p className="text-xs text-blue-500 mt-1">{day.precipitation}%</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Encyclopedia Entry */}
            {forecast?.encyclopediaEntry && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Encyclopedia: {forecast.encyclopediaEntry.term}
                    </h3>
                    <p className="text-blue-800 mb-3">{forecast.encyclopediaEntry.definition}</p>
                    <p className="text-sm text-blue-700"><strong>Causes:</strong> {forecast.encyclopediaEntry.causes}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {forecast.encyclopediaEntry.globalExamples?.map((ex, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{ex}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    {interest} Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {forecast?.recommendations?.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs flex-shrink-0">✓</div>
                            <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EncyclopediaView({ onSelectTopic }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate a weather encyclopedia with 12 entries covering: cloud types, pressure systems, precipitation types, wind patterns, temperature phenomena, and seasonal events. Each entry should have a title, brief description, and category.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        entries: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    category: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setEntries(response?.entries || []);
        } catch (error) {
            console.error('Failed to fetch encyclopedia:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEntries = entries.filter(e => 
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = [...new Set(entries.map(e => e.category))];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-500">Loading encyclopedia...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                    placeholder="Search weather phenomena..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12"
                />
            </div>

            {categories.map(category => (
                <div key={category}>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEntries.filter(e => e.category === category).map((entry, i) => (
                            <div 
                                key={i}
                                onClick={() => onSelectTopic(entry)}
                                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-blue-200 cursor-pointer transition-all group"
                            >
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">{entry.title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{entry.description}</p>
                                <ChevronRight className="w-5 h-5 text-gray-400 mt-2 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function EducationView() {
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [moduleContent, setModuleContent] = useState(null);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 6 educational weather modules covering: 1) How weather forms, 2) Cloud identification, 3) Understanding forecasts, 4) Severe weather, 5) Climate vs Weather, 6) Historical weather events. Include title, description, difficulty level, and duration.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        modules: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    difficulty: { type: "string" },
                                    duration: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setModules(response?.modules || []);
        } catch (error) {
            console.error('Failed to fetch modules:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadModuleContent = async (module) => {
        setSelectedModule(module);
        setModuleContent(null);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Create detailed educational content for "${module.title}". Include: introduction, 5 key concepts with explanations, a historical case study, 3 quiz questions with answers, and a summary.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        introduction: { type: "string" },
                        keyConcepts: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    explanation: { type: "string" }
                                }
                            }
                        },
                        caseStudy: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                lessons: { type: "array", items: { type: "string" } }
                            }
                        },
                        quiz: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    question: { type: "string" },
                                    options: { type: "array", items: { type: "string" } },
                                    correctIndex: { type: "number" }
                                }
                            }
                        },
                        summary: { type: "string" }
                    }
                }
            });
            setModuleContent(response);
        } catch (error) {
            console.error('Failed to load module:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
                <p className="text-gray-500">Loading educational modules...</p>
            </div>
        );
    }

    if (selectedModule) {
        return (
            <div className="space-y-6">
                <Button variant="outline" onClick={() => setSelectedModule(null)} className="mb-4">
                    ← Back to Modules
                </Button>
                
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                    <p className="text-sm text-white/70 mb-1">{selectedModule.difficulty} • {selectedModule.duration}</p>
                    <h2 className="text-2xl font-bold">{selectedModule.title}</h2>
                </div>

                {!moduleContent ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-green-500 mb-3" />
                        <p className="text-gray-500">Loading lesson...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Introduction</h3>
                            <p className="text-gray-700">{moduleContent.introduction}</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Key Concepts</h3>
                            {moduleContent.keyConcepts?.map((concept, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                                    <div className="flex items-start gap-4">
                                        <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">{concept.title}</h4>
                                            <p className="text-gray-600 text-sm">{concept.explanation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {moduleContent.caseStudy && (
                            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Case Study: {moduleContent.caseStudy.title}
                                </h3>
                                <p className="text-amber-800 mb-3">{moduleContent.caseStudy.description}</p>
                                <div className="space-y-2">
                                    {moduleContent.caseStudy.lessons?.map((lesson, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <span className="text-amber-600">•</span>
                                            <p className="text-sm text-amber-700">{lesson}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                            <p className="text-gray-700">{moduleContent.summary}</p>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, i) => (
                <div 
                    key={i}
                    onClick={() => loadModuleContent(module)}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-green-200 cursor-pointer transition-all group"
                >
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-600 mb-2">{module.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{module.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">{module.difficulty}</span>
                        <span>{module.duration}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function WisdomView() {
    const [loading, setLoading] = useState(true);
    const [wisdom, setWisdom] = useState(null);

    useEffect(() => {
        fetchWisdom();
    }, []);

    const fetchWisdom = async () => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate weather wisdom content including:
1. Daily lifestyle recommendations for current season
2. Health insights (allergies, UV, air quality tips)
3. Sustainability tips related to weather
4. Safety wisdom for seasonal conditions
5. Cultural weather proverbs from around the world (5 different cultures)
6. Philosophical reflection on weather and nature`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        lifestyle: { type: "array", items: { type: "string" } },
                        health: { type: "array", items: { type: "string" } },
                        sustainability: { type: "array", items: { type: "string" } },
                        safety: { type: "array", items: { type: "string" } },
                        proverbs: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    proverb: { type: "string" },
                                    culture: { type: "string" },
                                    meaning: { type: "string" }
                                }
                            }
                        },
                        reflection: { type: "string" }
                    }
                }
            });
            setWisdom(response);
        } catch (error) {
            console.error('Failed to fetch wisdom:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
                <p className="text-gray-500">Gathering wisdom...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Philosophical Reflection */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white">
                <Sparkles className="w-8 h-8 mb-3 text-white/80" />
                <p className="text-lg leading-relaxed">{wisdom?.reflection}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lifestyle */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-amber-500" />
                        Lifestyle Guidance
                    </h3>
                    <div className="space-y-3">
                        {wisdom?.lifestyle?.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                                <span className="text-amber-500">☀️</span>
                                <p className="text-sm text-gray-700">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Health */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Health Insights
                    </h3>
                    <div className="space-y-3">
                        {wisdom?.health?.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                <span className="text-red-500">❤️</span>
                                <p className="text-sm text-gray-700">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sustainability */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-500" />
                        Sustainability Tips
                    </h3>
                    <div className="space-y-3">
                        {wisdom?.sustainability?.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                <span className="text-green-500">🌱</span>
                                <p className="text-sm text-gray-700">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Safety */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        Safety Wisdom
                    </h3>
                    <div className="space-y-3">
                        {wisdom?.safety?.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <span className="text-blue-500">🛡️</span>
                                <p className="text-sm text-gray-700">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cultural Proverbs */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-500" />
                    Weather Wisdom Around the World
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wisdom?.proverbs?.map((item, i) => (
                        <div key={i} className="p-4 bg-purple-50 rounded-xl">
                            <p className="font-medium text-purple-900 italic">"{item.proverb}"</p>
                            <p className="text-sm text-purple-600 mt-1">— {item.culture}</p>
                            <p className="text-xs text-gray-600 mt-2">{item.meaning}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ChartsView() {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate weather analytics data including:
1. Hourly temperature for next 24 hours
2. Weekly precipitation probability
3. Monthly temperature comparison (this year vs last year)
4. Air quality components breakdown
5. Seasonal comparison data`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        hourlyTemp: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    hour: { type: "string" },
                                    temp: { type: "number" }
                                }
                            }
                        },
                        weeklyPrecip: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    day: { type: "string" },
                                    probability: { type: "number" }
                                }
                            }
                        },
                        monthlyComparison: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    month: { type: "string" },
                                    thisYear: { type: "number" },
                                    lastYear: { type: "number" }
                                }
                            }
                        },
                        airQuality: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    component: { type: "string" },
                                    value: { type: "number" }
                                }
                            }
                        }
                    }
                }
            });
            setChartData(response);
        } catch (error) {
            console.error('Failed to fetch chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-500">Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Temperature Trend */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">24-Hour Temperature Trend</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData?.hourlyTemp}>
                            <defs>
                                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="temp" stroke="#F59E0B" fill="url(#tempGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Precipitation Probability */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Weekly Precipitation Probability</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData?.weeklyPrecip}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="probability" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Year-over-Year Comparison */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Temperature: This Year vs Last Year</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData?.monthlyComparison}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="thisYear" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="lastYear" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6 mt-3 text-sm">
                        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> This Year</span>
                        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-400 rounded-full"></span> Last Year</span>
                    </div>
                </div>

                {/* Air Quality */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Air Quality Components</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData?.airQuality} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" tick={{ fontSize: 10 }} />
                            <YAxis dataKey="component" type="category" tick={{ fontSize: 10 }} width={60} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function TopicDetailView({ topic, onBack }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchTopicData();
    }, [topic]);

    const fetchTopicData = async () => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Provide comprehensive encyclopedia entry for "${topic.title}". Include:
1. Full definition and explanation
2. Scientific causes and mechanisms
3. Global examples and variations
4. Historical significance
5. Impact on daily life
6. Related phenomena
7. Fun facts`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        definition: { type: "string" },
                        causes: { type: "string" },
                        globalExamples: { type: "array", items: { type: "string" } },
                        history: { type: "string" },
                        dailyImpact: { type: "string" },
                        relatedPhenomena: { type: "array", items: { type: "string" } },
                        funFacts: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setData(response);
        } catch (error) {
            console.error('Failed to fetch topic:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-500">Loading encyclopedia entry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <p className="text-sm text-white/70 mb-1">{topic.category}</p>
                <h2 className="text-2xl font-bold">{topic.title}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Definition</h3>
                        <p className="text-gray-700 leading-relaxed">{data?.definition}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Scientific Causes</h3>
                        <p className="text-gray-700 leading-relaxed">{data?.causes}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Historical Significance</h3>
                        <p className="text-gray-700 leading-relaxed">{data?.history}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Impact on Daily Life</h3>
                        <p className="text-gray-700 leading-relaxed">{data?.dailyImpact}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
                        <h3 className="font-semibold text-blue-900 mb-3">Global Examples</h3>
                        <div className="space-y-2">
                            {data?.globalExamples?.map((ex, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <Globe className="w-4 h-4 text-blue-500 mt-0.5" />
                                    <p className="text-sm text-blue-800">{ex}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-3">Related Phenomena</h3>
                        <div className="flex flex-wrap gap-2">
                            {data?.relatedPhenomena?.map((item, i) => (
                                <span key={i} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">{item}</span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                        <h3 className="font-semibold text-amber-900 mb-3">Fun Facts</h3>
                        <div className="space-y-2">
                            {data?.funFacts?.map((fact, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />
                                    <p className="text-sm text-amber-800">{fact}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Seasons() {
    useEffect(() => {
        document.title = 'Seasons - Weather Intelligence & Wisdom';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Comprehensive weather understanding through forecasts, encyclopedia, education, and wisdom.');
    }, []);

    const [activeTab, setActiveTab] = useState('forecast');
    const [depth, setDepth] = useState('Standard');
    const [interest, setInterest] = useState('Science');
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [dailyQuote] = useState({
        quote: "Climate is what we expect, weather is what we get.",
        source: "Mark Twain"
    });

    const breadcrumbItems = [
        { label: 'Intelligence', href: createPageUrl('Intelligence') },
        { label: 'Forces & Cycles', href: createPageUrl('Intelligence') + '?category=Forces_Cycles' },
        { label: 'Seasons' }
    ];
    if (selectedTopic) {
        breadcrumbItems.push({ label: selectedTopic.title });
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <Sun className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Seasons</h1>
                                <p className="text-white/80 text-sm">Weather Intelligence & Wisdom</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {Object.values(SEASONS).map((season, i) => (
                                <div key={i} className="text-center">
                                    <season.icon className="w-6 h-6 mx-auto text-white/80" />
                                    <p className="text-xs text-white/60 mt-1">{season.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Daily Quote */}
                <WeatherWisdomQuote quote={dailyQuote.quote} source={dailyQuote.source} />

                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                {selectedTopic ? (
                    <TopicDetailView topic={selectedTopic} onBack={() => setSelectedTopic(null)} />
                ) : (
                    <>
                        {/* Filters */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Depth:</span>
                                    <div className="flex gap-1">
                                        {DEPTH_FILTERS.map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setDepth(d)}
                                                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                                                    depth === d ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Interest:</span>
                                    <div className="flex gap-1">
                                        {INTEREST_FILTERS.map(i => (
                                            <button
                                                key={i}
                                                onClick={() => setInterest(i)}
                                                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                                                    interest === i ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {i}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                        activeTab === tab.id 
                                            ? 'bg-amber-500 text-white' 
                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        {activeTab === 'forecast' && <ForecastView depth={depth} interest={interest} />}
                        {activeTab === 'encyclopedia' && <EncyclopediaView onSelectTopic={setSelectedTopic} />}
                        {activeTab === 'education' && <EducationView />}
                        {activeTab === 'wisdom' && <WisdomView />}
                        {activeTab === 'charts' && <ChartsView />}
                    </>
                )}
            </div>
        </div>
    );
}