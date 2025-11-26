import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HorizontalBarChart({ 
    title = 'Performance',
    data = [
        { name: 'Category A', value1: 80, value2: 40 },
        { name: 'Category B', value1: 65, value2: 55 },
        { name: 'Category C', value1: 90, value2: 30 },
        { name: 'Category D', value1: 50, value2: 60 },
        { name: 'Category E', value1: 70, value2: 45 }
    ],
    color1 = '#6B4EE6',
    color2 = '#A78BFA',
    onBarClick = null
}) {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>}
            
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={data} 
                        layout="vertical"
                        onMouseMove={(e) => setActiveIndex(e?.activeTooltipIndex)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis 
                            type="category" 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            width={80}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                            cursor={{ fill: 'rgba(107, 78, 230, 0.1)' }}
                        />
                        <Bar 
                            dataKey="value1" 
                            stackId="a"
                            radius={[0, 0, 0, 0]}
                            onClick={(data, index) => onBarClick?.(data, index)}
                            className="cursor-pointer"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={index} 
                                    fill={color1}
                                    opacity={activeIndex === index ? 1 : 0.8}
                                />
                            ))}
                        </Bar>
                        <Bar 
                            dataKey="value2" 
                            stackId="a"
                            radius={[0, 4, 4, 0]}
                            onClick={(data, index) => onBarClick?.(data, index)}
                            className="cursor-pointer"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={index} 
                                    fill={color2}
                                    opacity={activeIndex === index ? 1 : 0.8}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}