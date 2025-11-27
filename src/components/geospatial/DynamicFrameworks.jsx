import React, { useState } from 'react';
import { 
    Target, TrendingUp, Zap, BarChart3, Grid3X3, Globe2, 
    Building2, CircleDot, Plus, Minus, ArrowUp, ArrowDown,
    ChevronDown, ChevronUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ScatterChart, Scatter, ZAxis, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Button } from "@/components/ui/button";

const FRAMEWORKS = [
    { id: 'swot', name: 'SWOT', icon: Grid3X3, color: '#6366F1' },
    { id: 'dmaic', name: 'DMAIC', icon: Target, color: '#10B981' },
    { id: 'ice', name: 'ICE', icon: Zap, color: '#F59E0B' },
    { id: 'pareto', name: 'Pareto', icon: BarChart3, color: '#EF4444' },
    { id: 'ansoff', name: 'Ansoff', icon: Grid3X3, color: '#8B5CF6' },
    { id: 'pestle', name: 'PESTLE', icon: Globe2, color: '#06B6D4' },
    { id: 'porter', name: 'Porter', icon: Building2, color: '#EC4899' },
    { id: 'bcg', name: 'BCG', icon: CircleDot, color: '#22C55E' },
];

const DOMAIN_SWOT = {
    governance: {
        strengths: ['Democratic institutions', 'Transparency initiatives', 'Digital governance', 'Policy frameworks'],
        weaknesses: ['Bureaucratic delays', 'Corruption risks', 'Fragmented systems', 'Legacy processes'],
        opportunities: ['E-governance expansion', 'Citizen engagement', 'AI policy automation', 'Cross-border cooperation'],
        threats: ['Political instability', 'Cyber attacks', 'Public distrust', 'Resource constraints']
    },
    economy: {
        strengths: ['GDP growth', 'Diversified sectors', 'Foreign investment', 'Skilled labor'],
        weaknesses: ['Income inequality', 'Debt levels', 'Infrastructure gaps', 'Regional disparities'],
        opportunities: ['Digital economy', 'Green transition', 'Trade agreements', 'Innovation hubs'],
        threats: ['Global recession', 'Currency volatility', 'Supply chain disruptions', 'Climate impacts']
    },
    health: {
        strengths: ['Healthcare access', 'Medical research', 'Vaccination rates', 'Emergency response'],
        weaknesses: ['Cost inflation', 'Rural coverage', 'Staff shortages', 'Mental health gaps'],
        opportunities: ['Telemedicine', 'Preventive care', 'Biotech advances', 'Public-private partnerships'],
        threats: ['Pandemics', 'Aging population', 'Chronic diseases', 'Funding cuts']
    },
    education: {
        strengths: ['Literacy rates', 'Higher education', 'Research output', 'STEM programs'],
        weaknesses: ['Quality gaps', 'Dropout rates', 'Teacher shortages', 'Digital divide'],
        opportunities: ['EdTech adoption', 'Lifelong learning', 'Skills development', 'Global partnerships'],
        threats: ['Budget constraints', 'Brain drain', 'Outdated curricula', 'Inequality']
    },
    defense: {
        strengths: ['Military capability', 'Strategic alliances', 'Technology', 'Intelligence'],
        weaknesses: ['Budget pressures', 'Recruitment', 'Cyber vulnerabilities', 'Aging equipment'],
        opportunities: ['Modernization', 'Cyber defense', 'Space capabilities', 'AI integration'],
        threats: ['Regional conflicts', 'Terrorism', 'Hybrid warfare', 'Nuclear proliferation']
    },
    trade: {
        strengths: ['Export diversity', 'Port infrastructure', 'Trade agreements', 'Logistics'],
        weaknesses: ['Trade deficits', 'Tariff barriers', 'Customs delays', 'Currency risks'],
        opportunities: ['New markets', 'E-commerce', 'Green exports', 'Services trade'],
        threats: ['Protectionism', 'Supply disruptions', 'Geopolitical tensions', 'Competition']
    },
    labor: {
        strengths: ['Employment rates', 'Labor laws', 'Union representation', 'Training programs'],
        weaknesses: ['Wage stagnation', 'Informal sector', 'Gender gaps', 'Automation risks'],
        opportunities: ['Remote work', 'Gig economy', 'Reskilling', 'Immigration'],
        threats: ['Job displacement', 'Aging workforce', 'Skills mismatch', 'Economic shocks']
    },
    tourism: {
        strengths: ['Natural attractions', 'Cultural heritage', 'Infrastructure', 'Hospitality'],
        weaknesses: ['Seasonality', 'Over-tourism', 'Service quality', 'Marketing'],
        opportunities: ['Eco-tourism', 'Digital booking', 'Medical tourism', 'Adventure travel'],
        threats: ['Climate change', 'Security concerns', 'Pandemics', 'Competition']
    }
};

const generateDomainData = (domain, countries) => {
    const baseData = DOMAIN_SWOT[domain] || DOMAIN_SWOT.governance;
    return {
        ...baseData,
        countryScores: countries.map(c => ({
            country: c.country,
            strength: Math.round(50 + Math.random() * 40),
            weakness: Math.round(20 + Math.random() * 40),
            opportunity: Math.round(40 + Math.random() * 50),
            threat: Math.round(30 + Math.random() * 40)
        }))
    };
};

export default function DynamicFrameworks({ activeDomain, countryData, selectedRegion, domainInfo }) {
    const [activeFramework, setActiveFramework] = useState('swot');
    const [expanded, setExpanded] = useState(true);
    
    const regionCountries = countryData.filter(c => {
        if (selectedRegion === 'north-america') return ['USA', 'Canada', 'Mexico'].includes(c.country);
        if (selectedRegion === 'europe') return ['UK', 'Germany', 'France', 'Italy', 'Spain'].includes(c.country);
        if (selectedRegion === 'asia-pacific') return ['China', 'Japan', 'India', 'Australia', 'Korea'].includes(c.country);
        if (selectedRegion === 'latin-america') return ['Brazil', 'Argentina', 'Chile', 'Colombia'].includes(c.country);
        if (selectedRegion === 'middle-east') return ['UAE', 'Saudi Arabia', 'Israel', 'Qatar'].includes(c.country);
        if (selectedRegion === 'africa') return ['South Africa', 'Nigeria', 'Kenya', 'Egypt'].includes(c.country);
        return true;
    });
    
    const domainData = generateDomainData(activeDomain, regionCountries);
    
    const renderSWOT = () => (
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Plus className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold text-green-800 text-sm">Strengths</h4>
                </div>
                <ul className="space-y-1">
                    {domainData.strengths.map((item, i) => (
                        <li key={i} className="text-xs text-green-700 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-green-500" />{item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Minus className="w-4 h-4 text-red-600" />
                    <h4 className="font-semibold text-red-800 text-sm">Weaknesses</h4>
                </div>
                <ul className="space-y-1">
                    {domainData.weaknesses.map((item, i) => (
                        <li key={i} className="text-xs text-red-700 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-red-500" />{item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                    <ArrowUp className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800 text-sm">Opportunities</h4>
                </div>
                <ul className="space-y-1">
                    {domainData.opportunities.map((item, i) => (
                        <li key={i} className="text-xs text-blue-700 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-blue-500" />{item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                    <ArrowDown className="w-4 h-4 text-amber-600" />
                    <h4 className="font-semibold text-amber-800 text-sm">Threats</h4>
                </div>
                <ul className="space-y-1">
                    {domainData.threats.map((item, i) => (
                        <li key={i} className="text-xs text-amber-700 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-amber-500" />{item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
    
    const renderCountryComparison = () => (
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                    { metric: 'Strength', ...Object.fromEntries(domainData.countryScores.slice(0, 4).map(c => [c.country, c.strength])) },
                    { metric: 'Weakness', ...Object.fromEntries(domainData.countryScores.slice(0, 4).map(c => [c.country, c.weakness])) },
                    { metric: 'Opportunity', ...Object.fromEntries(domainData.countryScores.slice(0, 4).map(c => [c.country, c.opportunity])) },
                    { metric: 'Threat', ...Object.fromEntries(domainData.countryScores.slice(0, 4).map(c => [c.country, c.threat])) },
                ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                    {domainData.countryScores.slice(0, 4).map((c, i) => (
                        <Radar key={c.country} name={c.country} dataKey={c.country} stroke={['#6366F1', '#22C55E', '#F59E0B', '#EF4444'][i]} fill={['#6366F1', '#22C55E', '#F59E0B', '#EF4444'][i]} fillOpacity={0.1} strokeWidth={2} />
                    ))}
                    <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );

    const renderDMAIC = () => {
        const phases = [
            { name: 'Define', score: 70 + Math.round(Math.random() * 25) },
            { name: 'Measure', score: 60 + Math.round(Math.random() * 30) },
            { name: 'Analyze', score: 50 + Math.round(Math.random() * 35) },
            { name: 'Improve', score: 40 + Math.round(Math.random() * 40) },
            { name: 'Control', score: 30 + Math.round(Math.random() * 45) },
        ];
        return (
            <div className="space-y-2">
                {phases.map(phase => (
                    <div key={phase.name} className="flex items-center gap-2">
                        <span className="w-16 text-xs font-medium text-gray-600">{phase.name}</span>
                        <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                            <div className="h-full rounded transition-all" style={{ width: `${phase.score}%`, backgroundColor: domainInfo?.color || '#6366F1' }} />
                        </div>
                        <span className="text-xs font-bold w-8" style={{ color: domainInfo?.color }}>{phase.score}%</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderICE = () => {
        const initiatives = regionCountries.slice(0, 5).map(c => ({
            name: c.country,
            impact: 5 + Math.round(Math.random() * 5),
            confidence: 5 + Math.round(Math.random() * 5),
            ease: 5 + Math.round(Math.random() * 5),
        })).map(i => ({ ...i, score: i.impact * i.confidence * i.ease / 10 })).sort((a, b) => b.score - a.score);
        
        return (
            <div className="space-y-2">
                {initiatives.map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                        <span className="w-20 font-medium truncate">{item.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">I:{item.impact}</span>
                        <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700">C:{item.confidence}</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">E:{item.ease}</span>
                        <span className="ml-auto font-bold" style={{ color: domainInfo?.color }}>{Math.round(item.score)}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderPareto = () => {
        const data = regionCountries.slice(0, 5).map(c => ({
            name: c.country,
            value: c.metrics?.[activeDomain]?.current || 50
        })).sort((a, b) => b.value - a.value);
        
        return (
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical">
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis type="category" dataKey="name" width={50} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill={domainInfo?.color || '#6366F1'} radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderAnsoff = () => (
        <div className="grid grid-cols-2 gap-2">
            {[
                { name: 'Market Penetration', risk: 'Low', color: '#22C55E' },
                { name: 'Product Development', risk: 'Medium', color: '#F59E0B' },
                { name: 'Market Development', risk: 'Medium', color: '#3B82F6' },
                { name: 'Diversification', risk: 'High', color: '#EF4444' },
            ].map(q => (
                <div key={q.name} className="p-2 rounded-lg border" style={{ borderColor: q.color, backgroundColor: `${q.color}10` }}>
                    <h4 className="font-medium text-xs" style={{ color: q.color }}>{q.name}</h4>
                    <span className="text-[10px] text-gray-500">Risk: {q.risk}</span>
                </div>
            ))}
        </div>
    );

    const renderPESTLE = () => {
        const factors = ['Political', 'Economic', 'Social', 'Tech', 'Legal', 'Environ'].map(f => ({
            name: f, score: 40 + Math.round(Math.random() * 50)
        }));
        return (
            <div className="grid grid-cols-3 gap-2">
                {factors.map((f, i) => (
                    <div key={f.name} className="text-center p-2 rounded-lg bg-gray-50">
                        <div className="text-lg font-bold" style={{ color: domainInfo?.color }}>{f.score}</div>
                        <div className="text-[10px] text-gray-500">{f.name}</div>
                    </div>
                ))}
            </div>
        );
    };

    const renderPorter = () => (
        <div className="grid grid-cols-3 gap-2 text-center">
            <div /><div className="bg-red-50 rounded-lg p-2"><div className="text-sm font-bold text-red-600">{60 + Math.round(Math.random() * 30)}%</div><div className="text-[10px] text-gray-500">Rivalry</div></div><div />
            <div className="bg-blue-50 rounded-lg p-2"><div className="text-sm font-bold text-blue-600">{40 + Math.round(Math.random() * 30)}%</div><div className="text-[10px] text-gray-500">Supplier</div></div>
            <div className="bg-purple-50 rounded-lg p-2 flex items-center justify-center"><Building2 className="w-6 h-6" style={{ color: domainInfo?.color }} /></div>
            <div className="bg-green-50 rounded-lg p-2"><div className="text-sm font-bold text-green-600">{50 + Math.round(Math.random() * 30)}%</div><div className="text-[10px] text-gray-500">Buyer</div></div>
            <div className="bg-amber-50 rounded-lg p-2"><div className="text-sm font-bold text-amber-600">{30 + Math.round(Math.random() * 40)}%</div><div className="text-[10px] text-gray-500">Substitutes</div></div>
            <div /><div className="bg-purple-50 rounded-lg p-2"><div className="text-sm font-bold text-purple-600">{35 + Math.round(Math.random() * 35)}%</div><div className="text-[10px] text-gray-500">New Entry</div></div>
        </div>
    );

    const renderBCG = () => {
        const data = regionCountries.slice(0, 5).map(c => ({
            name: c.country,
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60,
            z: 100 + Math.random() * 200
        }));
        return (
            <div className="h-40 relative">
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 text-[8px] text-gray-400">
                    <div className="border-r border-b border-gray-200 p-1">?</div>
                    <div className="border-b border-gray-200 p-1">★</div>
                    <div className="border-r border-gray-200 p-1">✕</div>
                    <div className="p-1">$</div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <XAxis type="number" dataKey="x" domain={[0, 100]} hide />
                        <YAxis type="number" dataKey="y" domain={[0, 100]} hide />
                        <ZAxis type="number" dataKey="z" range={[50, 200]} />
                        <Tooltip />
                        <Scatter data={data} fill={domainInfo?.color || '#6366F1'} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderFramework = () => {
        switch (activeFramework) {
            case 'swot': return renderSWOT();
            case 'dmaic': return renderDMAIC();
            case 'ice': return renderICE();
            case 'pareto': return renderPareto();
            case 'ansoff': return renderAnsoff();
            case 'pestle': return renderPESTLE();
            case 'porter': return renderPorter();
            case 'bcg': return renderBCG();
            default: return renderSWOT();
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Strategic Analysis</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${domainInfo?.color}20`, color: domainInfo?.color }}>
                        {domainInfo?.name}
                    </span>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            
            {expanded && (
                <div className="p-4 pt-0 space-y-4">
                    <div className="flex flex-wrap gap-1">
                        {FRAMEWORKS.map(fw => (
                            <button key={fw.id} onClick={() => setActiveFramework(fw.id)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-all ${activeFramework === fw.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                style={{ backgroundColor: activeFramework === fw.id ? fw.color : undefined }}>
                                {fw.name}
                            </button>
                        ))}
                    </div>
                    {renderFramework()}
                    <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-medium text-gray-600 mb-2">Country Comparison</h4>
                        {renderCountryComparison()}
                    </div>
                </div>
            )}
        </div>
    );
}