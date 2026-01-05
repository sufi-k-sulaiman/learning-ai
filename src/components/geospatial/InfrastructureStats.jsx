import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function InfrastructureStats({ 
    title = 'Infrastructure Development',
    data = [],
    lines = [{ key: 'value', color: '#8B5CF6', name: 'Primary' }],
    type = 'area', // 'area', 'line', 'multi'
    height = 200
}) {
    if (type === 'multi') {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
                <div style={{ height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="period" fontSize={10} />
                            <YAxis fontSize={10} />
                            <Tooltip />
                            <Legend />
                            {lines.map((line, i) => (
                                <Line 
                                    key={i}
                                    type="monotone" 
                                    dataKey={line.key} 
                                    stroke={line.color} 
                                    name={line.name}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="period" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="url(#colorGrad)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}