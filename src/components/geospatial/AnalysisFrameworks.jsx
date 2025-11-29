import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Target, TrendingUp, Zap, BarChart3, Grid3X3, Globe, Building, CircleDot } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, Legend } from 'recharts';

const FRAMEWORKS = [
    { id: 'swot', name: 'SWOT', icon: Grid3X3 },
    { id: 'dmaic', name: 'DMAIC', icon: Target },
    { id: 'ice', name: 'ICE', icon: Zap },
    { id: 'pareto', name: 'Pareto', icon: BarChart3 },
    { id: 'ansoff', name: 'Ansoff', icon: TrendingUp },
    { id: 'pestle', name: 'PESTLE', icon: Globe },
    { id: 'porter', name: 'Porter', icon: Building },
    { id: 'bcg', name: 'BCG', icon: CircleDot },
];

const CATEGORY_LABELS = {
    carbon: 'Carbon & Climate',
    airwater: 'Air & Water Quality',
    forests: 'Forests & Biodiversity',
    resources: 'Natural Resources',
    sustainability: 'Sustainability',
    health: 'Environmental Health',
    treasures: 'National Treasures & Protected Areas',
};

const FRAMEWORK_PROMPTS = {
    swot: (categories) => `Perform a SWOT analysis SPECIFICALLY for ${categories} environmental sector.

ONLY include items directly related to ${categories}. Examples:
- For Carbon & Climate: emissions reduction tech, carbon pricing policies, renewable energy adoption, fossil fuel lobbying
- For Forests: deforestation rates, reforestation programs, illegal logging, biodiversity corridors
- For Air & Water: pollution monitoring, treatment infrastructure, industrial emissions, water scarcity

Provide 4 items per category with scores (0-100). Be specific with real data points like percentages, gigatons, PPM levels, hectares.`,

    dmaic: (categories) => `Apply DMAIC framework SPECIFICALLY to ${categories} environmental outcomes.

Focus on actual ${categories} metrics:
- For Carbon: CO2 emissions (gigatons), temperature anomalies, renewable capacity (GW)
- For Forests: deforestation rates (hectares/year), forest coverage %, species populations
- For Air/Water: AQI levels, PM2.5 concentrations, water quality indices

Each phase needs a progress score (0-100) and 3 specific measurable data points relevant to ${categories}.`,

    ice: (categories) => `Score 6 specific initiatives for ${categories} using ICE framework.

Initiatives MUST be directly related to ${categories}:
- For Carbon: carbon capture, methane reduction, grid decarbonization, EV adoption, building efficiency
- For Forests: protected area expansion, sustainable forestry, REDD+ programs, indigenous land rights
- For Resources: circular mining, rare earth recycling, sustainable extraction

Rate Impact/Confidence/Ease (1-10) with specific justification using real metrics.`,

    pareto: (categories) => `Apply Pareto 80/20 rule to ${categories} specifically.

Identify the 20% of actions that drive 80% of improvement in ${categories}:
- For Carbon: which emission sources to target (power, transport, industry percentages)
- For Forests: which regions/activities cause most deforestation
- For Water: which pollutants/sources cause most contamination

List 6 high-impact actions with their specific contribution percentages (must total ~100%).`,

    ansoff: (categories) => `Apply Ansoff Matrix to ${categories} environmental strategy.

All initiatives MUST relate to ${categories}:
- Market Penetration: scaling existing ${categories} solutions
- Market Development: new regions/sectors for ${categories} solutions  
- Product Development: new technologies for ${categories}
- Diversification: cross-sector ${categories} innovations

Provide 3 specific initiatives per quadrant with growth potential scores based on real market data.`,

    pestle: (categories) => `Conduct PESTLE analysis SPECIFICALLY for ${categories} sector.

Each factor must relate to ${categories}:
- Political: ${categories}-specific regulations, treaties, government targets
- Economic: ${categories} market size, investment flows, carbon pricing
- Social: public awareness of ${categories} issues, behavior changes
- Technological: ${categories}-specific innovations, R&D breakthroughs
- Legal: ${categories} compliance requirements, liability laws
- Environmental: current ${categories} state, trends, tipping points

Include real 2024 statistics and data points for each factor.`,

    porter: (categories) => `Apply Porter's Five Forces to ${categories} industry/sector.

Analyze competitive dynamics specific to ${categories}:
- Rivalry: competition among ${categories} solution providers
- Supplier Power: raw materials, technology for ${categories}
- Buyer Power: governments, corporations demanding ${categories} solutions
- Substitutes: alternative approaches to ${categories} challenges
- New Entrants: startups, new players in ${categories} space

Rate each force 1-10 with specific market data and examples from ${categories} sector.`,

    bcg: (categories) => `Create BCG Matrix for ${categories} initiatives and technologies.

Categorize real ${categories} solutions:
- Stars: high-growth, high-share ${categories} technologies (e.g., solar for carbon, satellite monitoring for forests)
- Cash Cows: mature ${categories} solutions with stable returns
- Question Marks: emerging ${categories} innovations with uncertain outcomes
- Dogs: declining or ineffective ${categories} approaches

Provide market share % and growth rate % for 8 specific ${categories} initiatives.`,
};

const FRAMEWORK_SCHEMAS = {
    swot: {
        type: "object",
        properties: {
            strengths: { type: "array", items: { type: "object", properties: { item: { type: "string" }, score: { type: "number" } } } },
            weaknesses: { type: "array", items: { type: "object", properties: { item: { type: "string" }, score: { type: "number" } } } },
            opportunities: { type: "array", items: { type: "object", properties: { item: { type: "string" }, score: { type: "number" } } } },
            threats: { type: "array", items: { type: "object", properties: { item: { type: "string" }, score: { type: "number" } } } }
        }
    },
    dmaic: {
        type: "object",
        properties: {
            phases: { type: "array", items: { type: "object", properties: { phase: { type: "string" }, score: { type: "number" }, points: { type: "array", items: { type: "string" } } } } }
        }
    },
    ice: {
        type: "object",
        properties: {
            initiatives: { type: "array", items: { type: "object", properties: { name: { type: "string" }, impact: { type: "number" }, confidence: { type: "number" }, ease: { type: "number" } } } }
        }
    },
    pareto: {
        type: "object",
        properties: {
            actions: { type: "array", items: { type: "object", properties: { action: { type: "string" }, impact: { type: "number" }, cumulative: { type: "number" } } } }
        }
    },
    ansoff: {
        type: "object",
        properties: {
            quadrants: { type: "array", items: { type: "object", properties: { quadrant: { type: "string" }, initiatives: { type: "array", items: { type: "object", properties: { name: { type: "string" }, score: { type: "number" } } } } } } }
        }
    },
    pestle: {
        type: "object",
        properties: {
            factors: { type: "array", items: { type: "object", properties: { factor: { type: "string" }, score: { type: "number" }, points: { type: "array", items: { type: "string" } } } } }
        }
    },
    porter: {
        type: "object",
        properties: {
            forces: { type: "array", items: { type: "object", properties: { force: { type: "string" }, score: { type: "number" }, insight: { type: "string" } } } }
        }
    },
    bcg: {
        type: "object",
        properties: {
            initiatives: { type: "array", items: { type: "object", properties: { name: { type: "string" }, quadrant: { type: "string" }, market_share: { type: "number" }, growth_rate: { type: "number" } } } }
        }
    },
};

const COLORS = ['#22C55E', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

const SWOTDisplay = ({ data }) => {
    const chartData = [
        { name: 'Strengths', value: data.strengths?.reduce((a, b) => a + (b.score || 0), 0) / (data.strengths?.length || 1), fill: '#22C55E' },
        { name: 'Weaknesses', value: data.weaknesses?.reduce((a, b) => a + (b.score || 0), 0) / (data.weaknesses?.length || 1), fill: '#EF4444' },
        { name: 'Opportunities', value: data.opportunities?.reduce((a, b) => a + (b.score || 0), 0) / (data.opportunities?.length || 1), fill: '#3B82F6' },
        { name: 'Threats', value: data.threats?.reduce((a, b) => a + (b.score || 0), 0) / (data.threats?.length || 1), fill: '#F59E0B' },
    ];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Score" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.5} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {[
                    { key: 'strengths', label: 'Strengths', color: 'green' },
                    { key: 'weaknesses', label: 'Weaknesses', color: 'red' },
                    { key: 'opportunities', label: 'Opportunities', color: 'blue' },
                    { key: 'threats', label: 'Threats', color: 'amber' },
                ].map(cat => (
                    <div key={cat.key} className={`bg-${cat.color}-50 rounded-lg p-2 border border-${cat.color}-200`}>
                        <h4 className={`font-semibold text-${cat.color}-800 mb-1`}>{cat.label}</h4>
                        <ul className="space-y-0.5">{data[cat.key]?.map((s, i) => <li key={i} className="text-gray-700 truncate">• {s.item} ({s.score})</li>)}</ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DMAICDisplay = ({ data }) => {
    const chartData = data.phases?.map(p => ({ name: p.phase, score: p.score })) || [];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-2">
                {data.phases?.map((phase, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-800">{phase.phase}</span>
                            <span className="text-purple-600 font-bold">{phase.score}%</span>
                        </div>
                        <ul className="text-gray-600">{phase.points?.map((p, j) => <li key={j}>• {p}</li>)}</ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ICEDisplay = ({ data }) => {
    const chartData = data.initiatives?.map(i => ({ 
        name: i.name?.substring(0, 15) + '...',
        fullName: i.name,
        Impact: i.impact, 
        Confidence: i.confidence, 
        Ease: i.ease,
        total: i.impact + i.confidence + i.ease 
    })).sort((a, b) => b.total - a.total) || [];
    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 10]} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip content={({ payload }) => payload?.[0] && (
                        <div className="bg-white p-2 rounded shadow border text-sm">
                            <p className="font-semibold">{payload[0].payload.fullName}</p>
                            <p>Impact: {payload[0].payload.Impact}</p>
                            <p>Confidence: {payload[0].payload.Confidence}</p>
                            <p>Ease: {payload[0].payload.Ease}</p>
                            <p className="font-bold text-purple-600">Total: {payload[0].payload.total}</p>
                        </div>
                    )} />
                    <Legend />
                    <Bar dataKey="Impact" stackId="a" fill="#22C55E" />
                    <Bar dataKey="Confidence" stackId="a" fill="#3B82F6" />
                    <Bar dataKey="Ease" stackId="a" fill="#F59E0B" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const ParetoDisplay = ({ data }) => {
    const chartData = data.actions?.map(a => ({ name: a.action?.substring(0, 20), impact: a.impact, cumulative: a.cumulative })) || [];
    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, angle: -20 }} height={60} />
                    <YAxis yAxisId="left" orientation="left" domain={[0, 50]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="impact" fill="#8B5CF6" name="Impact %" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#EF4444" name="Cumulative %" strokeWidth={2} dot />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const AnsoffDisplay = ({ data }) => {
    const allData = data.quadrants?.flatMap(q => q.initiatives?.map(i => ({ ...i, quadrant: q.quadrant })) || []) || [];
    return (
        <div className="grid grid-cols-2 gap-3">
            {data.quadrants?.map((q, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">{q.quadrant}</h4>
                    <div className="space-y-1">
                        {q.initiatives?.map((init, j) => (
                            <div key={j} className="flex justify-between items-center">
                                <span className="text-gray-700 truncate flex-1">{init.name}</span>
                                <div className="w-16 h-2 bg-gray-200 rounded-full ml-2">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${init.score}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const PESTLEDisplay = ({ data }) => {
    const chartData = data.factors?.map(f => ({ name: f.factor, score: f.score })) || [];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Impact" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.5} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {data.factors?.map((f, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-800">{f.factor}</span>
                            <span className="text-purple-600 font-bold">{f.score}</span>
                        </div>
                        <ul className="text-gray-600">{f.points?.map((p, j) => <li key={j} className="truncate">• {p}</li>)}</ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PorterDisplay = ({ data }) => {
    const chartData = data.forces?.map(f => ({ name: f.force, score: f.score })) || [];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#8B5CF6" radius={[0, 4, 4, 0]}>
                            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-2">
                {data.forces?.map((f, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-800">{f.force}</span>
                            <span className="text-purple-600 font-bold">{f.score}/10</span>
                        </div>
                        <p className="text-gray-600">{f.insight}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BCGDisplay = ({ data }) => {
    const quadrantColors = { Stars: '#F59E0B', 'Cash Cows': '#22C55E', 'Question Marks': '#8B5CF6', Dogs: '#6B7280' };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64 relative border border-gray-300 rounded-lg p-2">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300" />
                <div className="absolute top-1 left-1 text-gray-400">High Growth</div>
                <div className="absolute bottom-1 left-1 text-gray-400">Low Growth</div>
                <div className="absolute bottom-1 right-1 text-gray-400">High Share</div>
                <div className="absolute bottom-1 left-1/2 text-gray-400 -translate-x-1/2">Low Share</div>
                {data.initiatives?.map((item, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                            left: `${Math.min(95, Math.max(5, item.market_share))}%`,
                            top: `${100 - Math.min(95, Math.max(5, item.growth_rate))}%`,
                            backgroundColor: quadrantColors[item.quadrant] || '#8B5CF6'
                        }}
                        title={`${item.name}: ${item.market_share}% share, ${item.growth_rate}% growth`}
                    />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
                {['Stars', 'Cash Cows', 'Question Marks', 'Dogs'].map(q => (
                    <div key={q} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <h4 className="font-semibold mb-1" style={{ color: quadrantColors[q] }}>{q}</h4>
                        <ul className="text-gray-700">
                            {data.initiatives?.filter(i => i.quadrant === q).map((item, j) => (
                                <li key={j} className="truncate">• {item.name}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DISPLAY_COMPONENTS = {
    swot: SWOTDisplay,
    dmaic: DMAICDisplay,
    ice: ICEDisplay,
    pareto: ParetoDisplay,
    ansoff: AnsoffDisplay,
    pestle: PESTLEDisplay,
    porter: PorterDisplay,
    bcg: BCGDisplay,
};

export default function AnalysisFrameworks({ selectedCategories = [] }) {
    const [activeTab, setActiveTab] = useState('swot');
    const [frameworkData, setFrameworkData] = useState({});
    const [loading, setLoading] = useState(false);
    const cacheRef = useRef({});

    const categoryKey = selectedCategories.sort().join(',');

    useEffect(() => {
        if (selectedCategories.length > 0) {
            fetchFrameworkData(activeTab);
        }
    }, [activeTab, categoryKey]);

    const fetchFrameworkData = async (framework) => {
        const cacheKey = `${framework}-${categoryKey}`;
        if (cacheRef.current[cacheKey]) {
            setFrameworkData(prev => ({ ...prev, [framework]: cacheRef.current[cacheKey] }));
            return;
        }

        setLoading(true);
        try {
            const categoryNames = selectedCategories
                .map(c => CATEGORY_LABELS[c] || c)
                .join(', ');

            const response = await base44.integrations.Core.InvokeLLM({
                prompt: FRAMEWORK_PROMPTS[framework](categoryNames),
                add_context_from_internet: true,
                response_json_schema: FRAMEWORK_SCHEMAS[framework]
            });

            cacheRef.current[cacheKey] = response;
            setFrameworkData(prev => ({ ...prev, [framework]: response }));
        } catch (err) {
            console.error('Error fetching framework data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (selectedCategories.length === 0) return null;

    const DisplayComponent = DISPLAY_COMPONENTS[activeTab];
    const data = frameworkData[activeTab];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 my-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-100 p-1 mb-4 flex-wrap h-auto gap-1">
                    {FRAMEWORKS.map(fw => {
                        const Icon = fw.icon;
                        return (
                            <TabsTrigger 
                                key={fw.id} 
                                value={fw.id}
                                className="gap-1.5 text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                            >
                                <Icon className="w-3 h-3" />
                                {fw.name}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-purple-600 animate-spin mr-3" />
                        <span className="text-gray-600">Generating {activeTab.toUpperCase()} analysis...</span>
                    </div>
                ) : data ? (
                    <DisplayComponent data={data} />
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Select a framework to view analysis
                    </div>
                )}
            </Tabs>
        </div>
    );
}