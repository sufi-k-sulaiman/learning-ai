import React, { useState } from 'react';
import { Sparkles, Play, Pause, RotateCcw, Zap, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const SCENARIOS = [
    { id: 'growth', name: 'Economic Growth', icon: TrendingUp, color: '#22C55E', impact: '+15%' },
    { id: 'recession', name: 'Recession', icon: TrendingDown, color: '#EF4444', impact: '-12%' },
    { id: 'crisis', name: 'Crisis Event', icon: AlertTriangle, color: '#F59E0B', impact: '-25%' },
    { id: 'reform', name: 'Policy Reform', icon: CheckCircle, color: '#3B82F6', impact: '+8%' },
];

export default function AIScenarios({ activeDomain, domainInfo }) {
    const [activeScenario, setActiveScenario] = useState('growth');
    const [timeHorizon, setTimeHorizon] = useState([5]);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState(null);

    const generateProjection = () => {
        const scenario = SCENARIOS.find(s => s.id === activeScenario);
        const baseValue = 50;
        const trend = scenario.id === 'growth' || scenario.id === 'reform' ? 1 : -1;
        
        return Array.from({ length: timeHorizon[0] * 4 }, (_, i) => ({
            quarter: `Q${(i % 4) + 1} Y${Math.floor(i / 4) + 1}`,
            baseline: baseValue + Math.random() * 5,
            projected: baseValue + (i * trend * 2) + Math.random() * 8,
            confidence_high: baseValue + (i * trend * 2) + 15 + Math.random() * 5,
            confidence_low: baseValue + (i * trend * 2) - 10 + Math.random() * 5,
        }));
    };

    const runScenario = () => {
        setIsRunning(true);
        setTimeout(() => {
            setResults({
                projection: generateProjection(),
                summary: {
                    finalImpact: SCENARIOS.find(s => s.id === activeScenario)?.impact,
                    confidence: Math.round(70 + Math.random() * 25),
                    keyFactors: ['GDP Growth', 'Employment Rate', 'Trade Balance', 'Investment Flow'],
                    risks: ['Policy uncertainty', 'External shocks', 'Market volatility']
                }
            });
            setIsRunning(false);
        }, 1500);
    };

    const scenario = SCENARIOS.find(s => s.id === activeScenario);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">AI Scenarios</h3>
                    <p className="text-xs text-gray-500">What-if analysis powered by AI</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Select Scenario</label>
                    <div className="grid grid-cols-2 gap-2">
                        {SCENARIOS.map(s => (
                            <button key={s.id} onClick={() => setActiveScenario(s.id)}
                                className={`p-2 rounded-lg border text-left transition-all ${activeScenario === s.id ? 'border-2' : 'border-gray-200 hover:bg-gray-50'}`}
                                style={{ borderColor: activeScenario === s.id ? s.color : undefined, backgroundColor: activeScenario === s.id ? `${s.color}10` : undefined }}>
                                <div className="flex items-center gap-2">
                                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                                    <span className="text-xs font-medium text-gray-900">{s.name}</span>
                                </div>
                                <span className="text-xs font-bold mt-1 block" style={{ color: s.color }}>{s.impact}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-xs font-medium text-gray-600">Time Horizon</label>
                        <span className="text-xs font-bold text-purple-600">{timeHorizon[0]} years</span>
                    </div>
                    <Slider value={timeHorizon} onValueChange={setTimeHorizon} min={1} max={10} className="w-full" />
                </div>

                <div className="flex gap-2">
                    <Button onClick={runScenario} disabled={isRunning} className="flex-1 bg-purple-600 hover:bg-purple-700">
                        {isRunning ? <><Pause className="w-4 h-4 mr-2" /> Running...</> : <><Play className="w-4 h-4 mr-2" /> Run Scenario</>}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setResults(null)}><RotateCcw className="w-4 h-4" /></Button>
                </div>

                {results && (
                    <div className="pt-4 border-t border-gray-100 space-y-4">
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={results.projection}>
                                    <XAxis dataKey="quarter" tick={{ fontSize: 8 }} interval={3} />
                                    <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="confidence_high" stroke="transparent" fill={`${scenario?.color}20`} />
                                    <Area type="monotone" dataKey="confidence_low" stroke="transparent" fill="#fff" />
                                    <Line type="monotone" dataKey="baseline" stroke="#94A3B8" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                                    <Line type="monotone" dataKey="projected" stroke={scenario?.color} strokeWidth={2} dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-gray-50">
                                <div className="text-xs text-gray-500">Final Impact</div>
                                <div className="text-lg font-bold" style={{ color: scenario?.color }}>{results.summary.finalImpact}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-50">
                                <div className="text-xs text-gray-500">Confidence</div>
                                <div className="text-lg font-bold text-gray-900">{results.summary.confidence}%</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-medium text-gray-600 mb-2">Key Factors</div>
                            <div className="flex flex-wrap gap-1">
                                {results.summary.keyFactors.map((f, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs">{f}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}