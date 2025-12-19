import React, { useState, useEffect } from 'react';
import PageMeta from '@/components/PageMeta';
import { 
    Brain, Loader2, ChevronRight, Sparkles,
    Globe, Mountain, Leaf, Zap, Star, Home,
    Beaker, Calculator, FlaskConical, Users, Lightbulb, BookOpen, Atom, ExternalLink,
    Factory, Truck, ShoppingCart, Plane, Heart, Building, Cpu, Wheat, GraduationCap, Wrench,
    Clock, AlertCircle, Rocket, Network, Gamepad2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import GamifiedLearning from '@/components/intelligence/GamifiedLearning';

// Helper to extract domain from URL
const extractDomain = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        return urlObj.hostname.replace('www.', '');
    } catch {
        // Try to extract domain from malformed URLs
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/\?\s]+)/);
        return match ? match[1] : url;
    }
};

// Component to display source link nicely
const SourceLink = ({ source }) => {
    if (!source) return null;
    
    // Extract URL from various formats like "[domain](url)" or just "url"
    let url = source;
    let domain = source;
    
    // Handle markdown-style links [text](url)
    const markdownMatch = source.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (markdownMatch) {
        domain = markdownMatch[1];
        url = markdownMatch[2];
    } else {
        domain = extractDomain(source);
        url = source.startsWith('http') ? source : `https://${source}`;
    }
    
    // Clean up domain - remove www. and get just the main domain
    if (domain) {
        domain = domain.replace(/^www\./, '').split('/')[0];
    }
    
    if (!domain) return <span className="text-xs text-gray-400">{source}</span>;
    
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-purple-800 hover:text-purple-800 transition-colors px-2 py-1 bg-purple-50 hover:bg-purple-100 rounded-md"
            title={url}
        >
            {domain}
            <ExternalLink className="w-3 h-3" />
        </a>
    );
};

// Parse text and convert markdown links to clickable badges
const TextWithLinks = ({ text }) => {
    if (!text) return null;
    
    // Split text by markdown links pattern [text](url)
    const parts = [];
    let lastIndex = 0;
    const linkRegex = /\(\[([^\]]+)\]\(([^)]+)\)\)/g;
    let match;
    
    while ((match = linkRegex.exec(text)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
        }
        // Add the link
        parts.push({ type: 'link', domain: match[1], url: match[2] });
        lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.slice(lastIndex) });
    }
    
    // If no links found, return plain text
    if (parts.length === 0) {
        return <span>{text}</span>;
    }
    
    return (
        <span>
            {parts.map((part, i) => {
                if (part.type === 'text') {
                    return <span key={i}>{part.content}</span>;
                }
                // Clean domain
                const cleanDomain = part.domain.replace(/^www\./, '').split('/')[0];
                return (
                    <a 
                        key={i}
                        href={part.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-purple-800 hover:text-purple-800 transition-colors px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 rounded mx-1"
                        title={part.url}
                    >
                        {cleanDomain}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                );
            })}
        </span>
    );
};

const CATEGORIES = {
    Elements_Environment: {
        name: "Elements & Environment",
        icon: Globe,
        color: "#3B82F6",
        gradient: "from-blue-500 to-cyan-500",
        items: ["Earth", "Soil", "Water", "Air", "Fire", "Sunlight", "Moon", "Stars", "Sky", "Space", "Lightning", "Ice", "Climate", "Darkness", "Mountains", "Rivers", "Oceans", "Forests", "Deserts", "Islands", "Valleys", "Grasslands", "Polar Regions", "Caves", "Wetlands", "Plateaus", "Volcanoes", "Coral Reefs"]
    },

    Living_Things: {
        name: "Living Things",
        icon: Leaf,
        color: "#22C55E",
        gradient: "from-green-500 to-lime-500",
        items: ["Plants", "Animals", "Microorganisms", "Insects", "Birds", "Fish", "Reptiles", "Humans", "Amphibians", "Fungi", "Mollusks", "Crustaceans", "Arachnids", "Algae", "Dinosaurs"]
    },
    Forces_Cycles: {
        name: "Forces & Cycles",
        icon: Zap,
        color: "#F59E0B",
        gradient: "from-amber-500 to-orange-500",
        items: ["Gravity", "Seasons", "Weather", "Energy", "Time", "Magnetism", "Water Cycle", "Life Cycles", "Tectonic Activity", "Evolution", "Photosynthesis", "Carbon Cycle", "Erosion", "Radiation"]
    },
    Cosmic_Celestial: {
        name: "Cosmic & Celestial",
        icon: Star,
        color: "#8B5CF6",
        gradient: "from-purple-500 to-indigo-500",
        items: ["Universe", "Galaxy", "Solar System", "Planets", "Asteroids", "Comets", "Black Holes", "Nebulae", "Constellations", "Exoplanets", "Supernovae", "Pulsars", "Quasars", "Dark Matter", "Dark Energy"]
    },
    Energy_Utilities: {
        name: "Energy & Utilities",
        icon: Zap,
        color: "#EAB308",
        gradient: "from-yellow-500 to-amber-500",
        items: ["Oil & Gas", "Renewable Energy", "Solar Power", "Wind Energy", "Hydroelectric", "Geothermal", "Coal Mining", "Electric Utilities", "Gas Utilities", "Water Utilities", "Independent Power Producers", "Nuclear Energy"]
    },
    Materials_Manufacturing: {
        name: "Materials & Manufacturing",
        icon: Beaker,
        color: "#64748B",
        gradient: "from-slate-500 to-gray-600",
        items: ["Chemicals", "Construction Materials", "Metals & Mining", "Paper & Forest Products", "Containers & Packaging", "Industrial Machinery", "Aerospace & Defense", "Building Products", "Steel Production", "Aluminum"]
    },
    Transportation_Infrastructure: {
        name: "Transportation & Infrastructure",
        icon: Globe,
        color: "#0EA5E9",
        gradient: "from-sky-500 to-blue-600",
        items: ["Airlines", "Marine Shipping", "Road & Rail", "Logistics & Distribution", "Construction & Engineering", "Ports", "Airports", "Highways", "Public Transit", "Freight Services"]
    },
    Consumer_Goods_Retail: {
        name: "Consumer Goods & Retail",
        icon: Home,
        color: "#EC4899",
        gradient: "from-pink-500 to-rose-500",
        items: ["Automobiles", "Consumer Electronics", "Appliances", "Textiles & Apparel", "Luxury Goods", "Food Retailing", "Specialty Retail", "E-commerce", "Household Products", "Personal Care", "Tobacco"]
    },
    Hospitality_Leisure: {
        name: "Hospitality & Tourism",
        icon: Star,
        color: "#F97316",
        gradient: "from-orange-500 to-red-500",
        items: ["Hotels", "Restaurants", "Travel Agencies", "Tour Operators", "Entertainment", "Movies & Film", "Gaming", "Streaming Services", "Arts & Culture", "Recreation", "Theme Parks"]
    },
    Health_Life_Sciences: {
        name: "Health & Life Sciences",
        icon: Leaf,
        color: "#14B8A6",
        gradient: "from-teal-500 to-emerald-500",
        items: ["Biotechnology", "Pharmaceuticals", "Medical Equipment", "Health Care Providers", "Hospitals", "Life Sciences Tools", "Clinical Research", "Medical Devices", "Diagnostics", "Genomics"]
    },
    Finance_Real_Estate: {
        name: "Finance & Real Estate",
        icon: Brain,
        color: "#6366F1",
        gradient: "from-indigo-500 to-violet-500",
        items: ["Banks", "Insurance", "Capital Markets", "Investment Firms", "Brokerages", "Financial Services", "REITs", "Property Management", "Real Estate Development", "Mortgages", "Fintech"]
    },
    Technology_Communication: {
        name: "Technology & Communication",
        icon: Lightbulb,
        color: "#A855F7",
        gradient: "from-purple-500 to-fuchsia-500",
        items: ["Software", "IT Services", "Hardware", "Semiconductors", "Telecommunications", "Media & Publishing", "Social Media", "Search Engines", "Cloud Computing", "Cybersecurity", "AI & Machine Learning"]
    },
    Agriculture_Food: {
        name: "Agriculture & Food Systems",
        icon: Leaf,
        color: "#84CC16",
        gradient: "from-lime-500 to-green-500",
        items: ["Crop Production", "Livestock", "Fisheries", "Food Products", "Beverage Manufacturing", "Agricultural Services", "Farming Equipment", "Food Processing", "Organic Farming", "Agritech"]
    },
    Education_Government: {
        name: "Education & Government",
        icon: BookOpen,
        color: "#0891B2",
        gradient: "from-cyan-600 to-blue-600",
        items: ["Schools", "Universities", "Training Services", "Government", "Public Administration", "NGOs", "Nonprofits", "Professional Services", "Consulting", "Legal Services", "Research Institutions"]
    },
    Designing_Building: {
        name: "Designing & Building",
        icon: Beaker,
        color: "#7C3AED",
        gradient: "from-violet-500 to-purple-800",
        items: ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Structural Engineer", "Aerospace Engineer", "Automotive Engineer", "Industrial Designer", "Product Designer", "Fashion Designer", "Graphic Designer", "UX Designer", "Interior Designer", "Architect", "Tooling Engineer", "Manufacturing Engineer"]
    },
    Operating_Maintaining: {
        name: "Operating & Maintaining",
        icon: Zap,
        color: "#DC2626",
        gradient: "from-red-500 to-orange-500",
        items: ["Power Plant Operator", "Utility Lineworker", "CNC Machinist", "Maintenance Technician", "Rail Technician", "Equipment Operator", "Nuclear Technician", "Mechanical Technician", "Electrical Technician", "Warehouse Worker", "Truck Driver", "Forklift Operator", "Delivery Driver", "Ground Crew Technician", "Packaging Operator"]
    },
    Analyzing_Evaluating: {
        name: "Analyzing & Evaluating",
        icon: Calculator,
        color: "#0D9488",
        gradient: "from-teal-500 to-cyan-500",
        items: ["Financial Analyst", "Risk Analyst", "Credit Analyst", "Equity Analyst", "Budget Analyst", "Treasury Analyst", "Business Analyst", "Data Analyst", "Research Analyst", "Transportation Analyst", "Environmental Analyst", "Policy Analyst", "Energy Analyst", "Compliance Analyst", "Supply Chain Analyst"]
    },
    Managing_Leading: {
        name: "Managing & Leading",
        icon: Users,
        color: "#2563EB",
        gradient: "from-blue-600 to-indigo-600",
        items: ["Plant Manager", "Operations Manager", "Production Supervisor", "Facilities Manager", "Distribution Manager", "Procurement Manager", "Warehouse Manager", "Property Manager", "Hotel Manager", "Safety Manager", "Project Manager", "Business Development Manager", "Sales Manager", "Account Manager", "Customer Success Manager"]
    },
    Researching_Innovating: {
        name: "Researching & Innovating",
        icon: FlaskConical,
        color: "#059669",
        gradient: "from-emerald-500 to-green-600",
        items: ["Research Scientist", "Clinical Research Associate", "Laboratory Technician", "Biochemist", "Microbiologist", "Geneticist", "Neuroscientist", "Physicist", "Chemist", "Zoologist", "Botanist", "Climate Scientist", "Oceanographer", "Agricultural Scientist", "Food Scientist", "Materials Scientist", "Pharmacologist"]
    },
    Healthcare_Caring: {
        name: "Healthcare & Caring",
        icon: Heart,
        color: "#E11D48",
        gradient: "from-rose-500 to-pink-600",
        items: ["Physician", "Surgeon", "Nurse", "Pharmacist", "Radiologist", "Dentist", "Optometrist", "Midwife", "Occupational Therapist", "Physical Therapist", "Paramedic", "Psychiatrist", "Psychologist", "Nutritionist", "Speech Therapist", "Veterinarian", "Public Health Specialist"]
    },
    Technology_Digital: {
        name: "Technology & Digital Solutions",
        icon: Cpu,
        color: "#7C3AED",
        gradient: "from-purple-800 to-violet-600",
        items: ["Software Engineer", "Data Scientist", "AI/ML Engineer", "Web Developer", "Mobile App Developer", "Front-End Developer", "Back-End Developer", "Full-Stack Developer", "Cloud Architect", "DevOps Engineer", "Database Administrator", "Network Administrator", "IT Support Specialist", "Cybersecurity Analyst", "Business Intelligence Analyst"]
    },
    Customer_Service_Hospitality: {
        name: "Customer Service & Hospitality",
        icon: Star,
        color: "#EA580C",
        gradient: "from-orange-500 to-amber-500",
        items: ["Retail Sales Associate", "Store Manager", "Merchandiser", "Customer Service Representative", "Concierge", "Call Center Agent", "Tour Guide", "Travel Agent", "Event Coordinator", "Waiter/Waitress", "Bartender", "Barista", "Housekeeping Supervisor", "Entertainment Host", "Fitness Trainer", "Spa Therapist"]
    },
    Creative_Media: {
        name: "Creative & Media",
        icon: Sparkles,
        color: "#DB2777",
        gradient: "from-pink-500 to-fuchsia-500",
        items: ["Animator", "Illustrator", "Art Director", "Creative Director", "Film Director", "Music Producer", "Photographer", "Videographer", "Sound Engineer", "Screenwriter", "Actor", "Stage Manager", "Editor", "Journalist", "Blogger", "Podcaster", "Advertising Strategist", "Public Relations Specialist"]
    },
    Education_Govt_Nonprofit: {
        name: "Education, Government & Nonprofit",
        icon: GraduationCap,
        color: "#4F46E5",
        gradient: "from-indigo-500 to-blue-600",
        items: ["Teacher", "University Professor", "Curriculum Developer", "School Principal", "Librarian", "Education Policy Advisor", "Academic Advisor", "Career Counselor", "Museum Curator", "Diplomat", "Legislative Assistant", "Community Outreach Coordinator", "Fundraising Specialist", "Human Rights Advocate", "NGO Field Officer", "Grant Writer", "Economist"]
    }
};

function Breadcrumb({ items, onNavigate }) {
    return (
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-2 sm:mb-6 flex-wrap px-3 sm:px-0">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <button
                        onClick={() => onNavigate(index)}
                        className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-lg transition-colors text-xs sm:text-sm ${
                            index === items.length - 1
                                ? 'text-gray-900 font-medium bg-gray-100'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        {index === 0 && <Home className="w-3 h-3 sm:w-4 sm:h-4" />}
                        {item.label}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );
}

function CategoryCard({ category, onClick }) {
    const Icon = category.icon;
    
    return (
        <div 
            onClick={onClick}
            className={`bg-gradient-to-br ${category.gradient} rounded-none sm:rounded-2xl p-4 sm:p-6 cursor-pointer active:scale-95 sm:hover:scale-[1.02] transition-all shadow-none sm:shadow-lg active:shadow-md sm:hover:shadow-xl text-white group touch-manipulation border-b border-white/10 sm:border-0`}
        >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 group-active:translate-x-1 sm:group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">{category.name}</h3>
            <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">{category.items.length} topics to explore</p>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {category.items.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium">
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

function ItemCard({ item, color, onClick }) {
    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-none sm:rounded-xl border-0 border-b sm:border border-gray-200 p-3 sm:p-4 active:shadow-none sm:hover:shadow-lg active:border-purple-300 sm:hover:border-purple-200 cursor-pointer transition-all group touch-manipulation"
        >
            <div className="flex items-center gap-2.5 sm:gap-3">
                <div 
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}20` }}
                >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 group-active:text-purple-800 sm:group-hover:text-purple-800 transition-colors truncate">{item}</h4>
                    <p className="text-xs text-gray-500">Tap to explore</p>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-active:text-purple-500 sm:group-hover:text-purple-500 group-active:translate-x-1 sm:group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
        </div>
    );
}

function ItemDetailView({ item, category, onNavigateToTopic }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        fetchItemData();
        generateImage();
    }, [item]);

    const generateImage = async () => {
        setImageLoading(true);
        try {
            const response = await base44.integrations.Core.GenerateImage({
                prompt: `A stunning, educational scientific illustration of ${item} in the context of ${category?.name || 'natural world'}. Photorealistic, highly detailed, vibrant colors, professional scientific visualization style.`
            });
            setImageUrl(response?.url);
        } catch (error) {
            console.error('Failed to generate image:', error);
        } finally {
            setImageLoading(false);
        }
    };

    const fetchItemData = async () => {
        setLoading(true);
        setData(null);
        setError(false);
        try {
            // Split into two smaller API calls for reliability
            const [basicResponse, chartsResponse] = await Promise.all([
                base44.integrations.Core.InvokeLLM({
                    prompt: `Provide intelligence data about "${item}" (${category?.name || 'general'}):
                1. Overview: 3-4 sentence description
                2. Key Facts: 5 interesting facts (short, under 100 chars each)
                3. Significance: Why it matters (2 sentences)
                4. Related Topics: 4 related concepts
                5. Current Research: Recent developments (2 sentences)
                6. Physical Properties: 3 key properties with brief descriptions
                7. Chemical Elements: 3 main elements/compounds with percentages
                8. Historical Timeline: 4 key historical events with year, title, and brief description
                9. Applications: 4 common real-world applications with name and description
                10. Challenges: 4 current challenges or considerations
                11. Future Outlook: 2-3 sentences on future trends and predictions
                12. Innovations: 4 recent innovations or breakthroughs with name and description
                13. Tools: 4 key tools or technologies used with name and description
                14. Systems: 4 related systems or frameworks with name and description`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            overview: { type: "string" },
                            keyFacts: { type: "array", items: { type: "string" } },
                            significance: { type: "string" },
                            relatedTopics: { type: "array", items: { type: "string" } },
                            currentResearch: { type: "string" },
                            physicalComposition: { type: "array", items: { type: "object", properties: { property: { type: "string" }, description: { type: "string" } } } },
                            chemicalComposition: { type: "array", items: { type: "object", properties: { element: { type: "string" }, percentage: { type: "string" } } } },
                            historicalTimeline: { type: "array", items: { type: "object", properties: { year: { type: "string" }, title: { type: "string" }, description: { type: "string" } } } },
                            applications: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" } } } },
                            challenges: { type: "array", items: { type: "string" } },
                            futureOutlook: { type: "string" },
                            innovations: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" } } } },
                            tools: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" } } } },
                            systems: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" } } } }
                            }
                            }
                            }),
                base44.integrations.Core.InvokeLLM({
                    prompt: `For "${item}", provide numerical chart data:
- distributionData: 4 items with name and value (numbers adding to 100)
- trendData: 5 data points with year (2020-2024) and value (numbers)
- radarData: 4 attributes with score (0-100)`,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            distributionData: { type: "array", items: { type: "object", properties: { name: { type: "string" }, value: { type: "number" } } } },
                            trendData: { type: "array", items: { type: "object", properties: { year: { type: "string" }, value: { type: "number" } } } },
                            radarData: { type: "array", items: { type: "object", properties: { attribute: { type: "string" }, score: { type: "number" } } } }
                        }
                    }
                })
            ]);
            
            // Merge responses
            const mergedData = {
                ...basicResponse,
                ...chartsResponse
            };
            
            setData(mergedData);
        } catch (error) {
            console.error('Failed to fetch item data:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
                <p className="text-gray-500">Loading intelligence data...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Globe className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load data</h3>
                <p className="text-gray-500 mb-4">Unable to fetch intelligence data for {item}</p>
                <button 
                    onClick={fetchItemData}
                    className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-800 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Hero Section - Apple Style */}
            <div className="text-center py-8 sm:py-16 px-3 sm:px-4">
                <p className="text-sm sm:text-base font-semibold mb-2" style={{ color: category?.color }}>
                    {category?.name}
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 sm:mb-8">
                    {item}
                </h1>
                {imageLoading ? (
                    <div className="w-full max-w-5xl mx-auto h-64 sm:h-96 rounded-3xl bg-gray-100 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin" style={{ color: category?.color }} />
                    </div>
                ) : imageUrl && (
                    <motion.img 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        src={imageUrl} 
                        alt={item} 
                        className="w-full max-w-5xl mx-auto h-64 sm:h-96 object-cover rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl" 
                    />
                )}
            </div>

            <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-12 sm:space-y-24 pb-12 sm:pb-16">
                {/* Overview - Apple Style */}
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Overview</h2>
                    <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        <TextWithLinks text={data?.overview} />
                    </p>
                </div>

                {/* Distribution Analysis - Apple Style */}
                {data?.distributionData?.length > 0 && (
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Distribution</h2>
                        <div className="space-y-4">
                            {data.distributionData.map((item, index) => {
                                const maxValue = Math.max(...data.distributionData.map(d => d.value));
                                const percentage = (item.value / maxValue) * 100;
                                return (
                                    <div key={index} className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xl font-semibold text-gray-900">{item.name}</span>
                                            <span className="text-3xl font-bold" style={{ color: category?.color }}>
                                                {item.value}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1.2, delay: index * 0.15, ease: "easeOut" }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: category?.color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Attribute Analysis - Apple Style */}
                {data?.radarData?.length > 0 && (
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Key Attributes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {data.radarData.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="bg-gray-50 rounded-none sm:rounded-2xl p-4 sm:p-6 shadow-none sm:shadow-sm hover:shadow-md transition-all border-b border-gray-200 sm:border-0"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-lg font-semibold text-gray-900">{item.attribute}</span>
                                        <span className="text-2xl font-bold" style={{ color: category?.color }}>
                                            {item.score}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.score}%` }}
                                            transition={{ duration: 1.2, delay: index * 0.15, ease: "easeOut" }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: category?.color }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Fun Facts - Apple Style */}
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Did You Know?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data?.keyFacts?.map((fact, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-gray-50 rounded-none sm:rounded-2xl p-4 sm:p-6 shadow-none sm:shadow-sm border-b border-gray-200 sm:border-0"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0" style={{ backgroundColor: category?.color }}>
                                        {i + 1}
                                    </div>
                                    <p className="text-gray-700 text-base leading-relaxed pt-1">
                                        <TextWithLinks text={fact} />
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Gamified Learning Section */}
                <div className="sm:bg-gradient-to-br sm:from-purple-50 sm:to-blue-50 rounded-none sm:rounded-xl sm:border sm:border-purple-200 sm:p-6">
                    <div className="flex items-center gap-3 mb-4 px-3 sm:px-0">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Test Your Knowledge!</h3>
                            <p className="text-sm text-gray-600">Take this fun interactive quiz to learn more</p>
                        </div>
                    </div>
                    <GamifiedLearning item={item} category={category} />
                </div>

                {/* Physical Composition - Apple Style */}
                {Array.isArray(data?.physicalComposition) && data.physicalComposition.length > 0 && (
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Physical Properties</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {data.physicalComposition.map((comp, i) => (
                                <motion.button 
                                    key={i}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => onNavigateToTopic(comp.property)}
                                    className="p-4 sm:p-6 rounded-none sm:rounded-2xl bg-gray-50 hover:bg-gray-100 shadow-none sm:shadow-sm hover:shadow-md transition-all text-left group border-b border-gray-200 sm:border-0"
                                >
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{comp.property}</h4>
                                    <p className="text-sm text-gray-600">{comp.description}</p>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chemical Composition */}
                {Array.isArray(data?.chemicalComposition) && data.chemicalComposition.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FlaskConical className="w-5 h-5" style={{ color: category?.color }} />
                            Chemical Composition
                        </h3>
                        <div className="space-y-3">
                            {data.chemicalComposition.map((comp, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => onNavigateToTopic(comp.element)}
                                    className="w-full flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 hover:shadow-md transition-all cursor-pointer group text-left"
                                >
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}>
                                        {comp.element?.substring(0, 2)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-gray-900 group-hover:text-purple-800 transition-colors">{comp.element}</h4>
                                            <span className="text-sm font-semibold" style={{ color: category?.color }}>{comp.percentage}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{comp.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mathematical Illustrations */}
                {Array.isArray(data?.mathematicalIllustrations) && data.mathematicalIllustrations.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5" style={{ color: category?.color }} />
                            Mathematical Illustrations
                        </h3>
                        <div className="space-y-4">
                            {data.mathematicalIllustrations.map((item, i) => (
                                <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: `${category?.color}10` }}>
                                    <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
                                    <div className="bg-white rounded-lg p-3 mb-2 font-mono text-center text-lg" style={{ color: category?.color }}>
                                        {item.formula}
                                    </div>
                                    <p className="text-sm text-gray-600">{item.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Research Data */}
                {Array.isArray(data?.researchData) && data.researchData.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" style={{ color: category?.color }} />
                            Research Data & Statistics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.researchData.map((item, i) => (
                                <div key={i} className="p-4 border border-gray-100 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">{item.statistic}</p>
                                    <p className="text-2xl font-bold" style={{ color: category?.color }}>{item.value}</p>
                                    <div className="mt-1">
                                        <SourceLink source={item.source} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subject Matter Experts */}
                {Array.isArray(data?.subjectMatterExperts) && data.subjectMatterExperts.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" style={{ color: category?.color }} />
                            Subject Matter Experts
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.subjectMatterExperts.map((expert, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}>
                                        {expert.name?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{expert.name}</h4>
                                        <p className="text-sm text-gray-500 mb-1">{expert.field}</p>
                                        <p className="text-sm text-gray-600">{expert.contribution}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Why It Matters - Apple Style */}
                <div className="text-center py-12 px-6 rounded-3xl shadow-sm" style={{ backgroundColor: `${category?.color}08` }}>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Why It Matters</h2>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        <TextWithLinks text={data?.significance} />
                    </p>
                </div>
                
                {/* Related Topics - Apple Style */}
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Explore More</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {data?.relatedTopics?.map((topic, i) => (
                            <button 
                                key={i} 
                                onClick={() => onNavigateToTopic(topic)}
                                className="px-6 py-3 rounded-full text-base font-medium shadow-sm hover:shadow-md active:scale-95 transition-all bg-gray-50 text-gray-900 hover:bg-gray-100"
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Current Research */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">Current Research</h3>
                    <p className="text-gray-600"><TextWithLinks text={data?.currentResearch} /></p>
                </div>

                {/* Historical Timeline */}
                {Array.isArray(data?.historicalTimeline) && data.historicalTimeline.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" style={{ color: category?.color }} />
                            Historical Timeline
                        </h3>
                        <div className="space-y-4">
                            {data.historicalTimeline.map((event, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category?.color }} />
                                        {i < data.historicalTimeline.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="text-xs font-medium" style={{ color: category?.color }}>{event.year}</p>
                                        <p className="font-medium text-gray-900">{event.title}</p>
                                        <p className="text-sm text-gray-600">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Common Applications */}
                {Array.isArray(data?.applications) && data.applications.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" style={{ color: category?.color }} />
                            Common Applications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.applications.map((app, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => onNavigateToTopic(app.name)}
                                    className="p-4 rounded-lg border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all text-left cursor-pointer group" 
                                    style={{ backgroundColor: `${category?.color}05` }}
                                >
                                    <h4 className="font-medium text-gray-900 mb-1 group-hover:text-purple-800 transition-colors">{app.name}</h4>
                                    <p className="text-sm text-gray-600">{app.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Innovations */}
                {Array.isArray(data?.innovations) && data.innovations.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Rocket className="w-5 h-5" style={{ color: category?.color }} />
                            Recent Innovations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.innovations.map((innovation, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => onNavigateToTopic(innovation.name)}
                                    className="p-4 rounded-lg border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all text-left cursor-pointer group" 
                                    style={{ backgroundColor: `${category?.color}05` }}
                                >
                                    <h4 className="font-medium text-gray-900 mb-1 group-hover:text-purple-800 transition-colors">{innovation.name}</h4>
                                    <p className="text-sm text-gray-600">{innovation.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tools */}
                {Array.isArray(data?.tools) && data.tools.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Wrench className="w-5 h-5" style={{ color: category?.color }} />
                            Key Tools & Technologies
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.tools.map((tool, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => onNavigateToTopic(tool.name)}
                                    className="p-4 rounded-lg border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all text-left cursor-pointer group" 
                                    style={{ backgroundColor: `${category?.color}05` }}
                                >
                                    <h4 className="font-medium text-gray-900 mb-1 group-hover:text-purple-800 transition-colors">{tool.name}</h4>
                                    <p className="text-sm text-gray-600">{tool.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Systems */}
                {Array.isArray(data?.systems) && data.systems.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Network className="w-5 h-5" style={{ color: category?.color }} />
                            Related Systems & Frameworks
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.systems.map((system, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => onNavigateToTopic(system.name)}
                                    className="p-4 rounded-lg border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all text-left cursor-pointer group" 
                                    style={{ backgroundColor: `${category?.color}05` }}
                                >
                                    <h4 className="font-medium text-gray-900 mb-1 group-hover:text-purple-800 transition-colors">{system.name}</h4>
                                    <p className="text-sm text-gray-600">{system.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Challenges & Considerations */}
                {Array.isArray(data?.challenges) && data.challenges.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" style={{ color: category?.color }} />
                            Challenges & Considerations
                        </h3>
                        <div className="space-y-3">
                            {data.challenges.map((challenge, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                                    <p className="text-gray-700 text-sm">{challenge}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Future Outlook */}
                {data?.futureOutlook && (
                    <div className="bg-gradient-to-r rounded-xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${category?.color}dd, ${category?.color}99)` }}>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Rocket className="w-5 h-5" />
                            Future Outlook
                        </h3>
                        <p className="text-white/90 leading-relaxed">{data.futureOutlook}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Intelligence() {

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // Update URL for display only (aesthetic, not parsed)
    const updateUrl = (category, item) => {
        // Get the base path without any trailing segments
        const basePath = '/intelligence';
        let displayPath = basePath;
        if (category) {
            const catName = CATEGORIES[category]?.name?.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || category;
            displayPath = `${basePath}/${catName}`;
            if (item) {
                const itemSlug = item.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                displayPath = `${displayPath}/${itemSlug}`;
            }
        }
        window.history.pushState({ category, item }, '', displayPath);
    };

    const handleCategoryClick = (categoryKey) => {
        setSelectedCategory(categoryKey);
        setSelectedItem(null);
        updateUrl(categoryKey, null);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        updateUrl(selectedCategory, item);
    };

    const handleBreadcrumbNavigate = (index) => {
        if (index === 0) {
            setSelectedCategory(null);
            setSelectedItem(null);
            updateUrl(null, null);
        } else if (index === 1) {
            setSelectedItem(null);
            updateUrl(selectedCategory, null);
        }
    };

    // Handle browser back/forward - restore from history state only
    useEffect(() => {
        const handlePopState = (event) => {
            const state = event.state || {};
            setSelectedCategory(state.category || null);
            setSelectedItem(state.item || null);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const currentCategory = selectedCategory ? CATEGORIES[selectedCategory] : null;

    // Build breadcrumb items
    const breadcrumbItems = [{ label: 'Intelligence' }];
    if (selectedCategory) {
        breadcrumbItems.push({ label: currentCategory.name });
    }
    if (selectedItem) {
        breadcrumbItems.push({ label: selectedItem });
    }

    return (
        <>
            <PageMeta 
                title="General Intelligence"
                description="Intelligence platform delivering automated insights and smarter decisions for growth across all knowledge domains."
                keywords="AI intelligence, knowledge base, general intelligence, automated insights, research data"
            />
            <div className="min-h-screen bg-white sm:p-4 md:p-6">
                <div className="max-w-6xl mx-auto pb-safe">
                    {/* Logo Header */}
                    <div className="flex items-center gap-3 px-3 sm:px-0 py-4 sm:py-6">
                        <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6944bf3dc7235d670de46364/5040bab12_LearningAi.png" 
                            alt="Learning Ai" 
                            className="w-10 h-10 sm:w-12 sm:h-12"
                        />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Ai</h1>
                    </div>
                    
                    {/* Breadcrumb Navigation */}
                <Breadcrumb items={breadcrumbItems} onNavigate={handleBreadcrumbNavigate} />

                {/* Content */}
                {!selectedCategory ? (
                    /* Category Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-4 md:gap-6">
                        {Object.entries(CATEGORIES).map(([key, category]) => (
                            <CategoryCard 
                                key={key}
                                category={category}
                                onClick={() => handleCategoryClick(key)}
                            />
                        ))}
                    </div>
                ) : !selectedItem ? (
                    /* Category Items View */
                    <div>
                        <div className={`bg-gradient-to-r ${currentCategory.gradient} rounded-none sm:rounded-2xl p-4 sm:p-6 mb-0 sm:mb-6 text-white`}>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <currentCategory.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-xl sm:text-2xl font-bold truncate">{currentCategory.name}</h2>
                                    <p className="text-white/80 text-xs sm:text-sm">{currentCategory.items.length} topics to explore</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-3">
                            {currentCategory.items.map((item, i) => (
                                <ItemCard 
                                    key={i}
                                    item={item}
                                    color={currentCategory.color}
                                    onClick={() => handleItemClick(item)}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Item Detail View */
                    <ItemDetailView 
                        item={selectedItem} 
                        category={currentCategory} 
                        onNavigateToTopic={(topic) => {
                            setSelectedItem(topic);
                            updateUrl(selectedCategory, topic);
                        }}
                    />
                    )}
                    </div>
                    </div>
                    </>
                    );
                    }