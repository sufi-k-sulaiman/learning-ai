import React, { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, Target, Gauge, Activity, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function PredictiveAnalytics({ activeDomain, domainInfo, countryData, selectedRegion }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [predictions, setPredictions] = useState(null);

    const runPrediction = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const forecast = Array.from({ length: 12 }, (_, i) => ({
                month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
                actual: i < 4 ? 50 + Math.random() * 20 : null,
                predicted: 50 + i * 1.5 + Math.random() * 15,
                upper: 55 + i * 2 + Math.random() * 10,
                lower: 45 + i * 1 + Math.random() * 10,
            }));

            setPredictions({
                forecast,
                metrics: {
                    accuracy: Math.round(85 + Math.random() * 10),
                    trend: Math.random() > 0.5 ? 'upward' : 'downward',
                    changeRate: Math.round((Math.random() - 0.3) * 20),
                    volatility: Math.round(10 + Math.random() * 20),
                },
                alerts: [
                    { type: 'warning', message: 'Potential downturn in Q3 detected', probability: 65 },
                    { type: 'opportunity', message: 'Growth opportunity in Q4', probability: 78 },
                    { type: 'risk', message: 'External factor sensitivity high', probability: 45 },
                ],
                drivers: [
                    { name: 'Policy Changes', impact: 85, direction: 'positive' },
                    { name: 'Market Trends', impact: 72, direction: 'positive' },
                    { name: 'External Factors', impact: 58, direction: 'negative' },
                    { name: 'Resource Availability', impact: 45, direction: 'neutral' },
                ]
            });
            setIsAnalyzing(false);
        }, 2000);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Predictive Analytics</h3>
                    <p className="text-xs text-gray-500">ML-powered forecasting</p>
                </div>
            </div>

            {!predictions ? (
                <div className="text-center py-6">
                    <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-4">Run predictive analysis on {domainInfo?.name || 'selected domain'}</p>
                    <Button onClick={runPrediction} disabled={isAnalyzing} className="bg-cyan-600 hover:bg-cyan-700">
                        {isAnalyzing ? 'Analyzing...' : 'Generate Predictions'}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={predictions.forecast}>
                                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                                <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                                <Tooltip />
                                <ReferenceLine x="Apr" stroke="#94A3B8" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="actual" stroke={domainInfo?.color || '#6366F1'} strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="predicted" stroke={domainInfo?.color || '#6366F1'} strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                <Line type="monotone" dataKey="upper" stroke="#94A3B8" strokeWidth={1} dot={false} />
                                <Line type="monotone" dataKey="lower" stroke="#94A3B8" strokeWidth={1} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <div className="text-center p-2 rounded-lg bg-gray-50">
                            <div className="text-lg font-bold text-cyan-600">{predictions.metrics.accuracy}%</div>
                            <div className="text-[10px] text-gray-500">Accuracy</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-gray-50">
                            <TrendingUp className={`w-5 h-5 mx-auto ${predictions.metrics.trend === 'upward' ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                            <div className="text-[10px] text-gray-500">Trend</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-gray-50">
                            <div className={`text-lg font-bold ${predictions.metrics.changeRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {predictions.metrics.changeRate >= 0 ? '+' : ''}{predictions.metrics.changeRate}%
                            </div>
                            <div className="text-[10px] text-gray-500">Change</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-gray-50">
                            <div className="text-lg font-bold text-amber-600">{predictions.metrics.volatility}%</div>
                            <div className="text-[10px] text-gray-500">Volatility</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">Alerts</div>
                        <div className="space-y-1">
                            {predictions.alerts.map((alert, i) => (
                                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                                    alert.type === 'warning' ? 'bg-amber-50 text-amber-700' :
                                    alert.type === 'opportunity' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    <span className="flex-1">{alert.message}</span>
                                    <span className="font-bold">{alert.probability}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">Key Drivers</div>
                        <div className="space-y-2">
                            {predictions.drivers.map((driver, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 w-28 truncate">{driver.name}</span>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${
                                            driver.direction === 'positive' ? 'bg-green-500' :
                                            driver.direction === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                                        }`} style={{ width: `${driver.impact}%` }} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 w-8">{driver.impact}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full" onClick={() => setPredictions(null)}>
                        Reset Analysis
                    </Button>
                </div>
            )}
        </div>
    );
}