import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function LineChartWithMarkers({ 
    title = 'Trend Analysis',
    data = [
        { name: '1990', value: 20 },
        { name: '2000', value: 45 },
        { name: '2010', value: 30 },
        { name: '2020', value: 60 },
        { name: '2030', value: 75 }
    ],
    dataKey = 'value',
    color = '#6B4EE6',
    showGrid = true,
    onPointClick = null
}) {
    const [activeIndex, setActiveIndex] = useState(null);

    const CustomDot = (props) => {
        const { cx, cy, index } = props;
        const isActive = activeIndex === index;
        
        return (
            <circle
                cx={cx}
                cy={cy}
                r={isActive ? 8 : 6}
                fill="white"
                stroke={color}
                strokeWidth={2}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onPointClick?.(data[index], index)}
            />
        );
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>}
            
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={data}
                        onMouseMove={(e) => setActiveIndex(e?.activeTooltipIndex)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {showGrid && (
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        )}
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #E5E7EB', 
                                borderRadius: '8px' 
                            }}
                        />
                        <Line 
                            type="linear" 
                            dataKey={dataKey}
                            stroke="#9CA3AF"
                            strokeWidth={2}
                            dot={<CustomDot />}
                            activeDot={{ r: 10, fill: 'white', stroke: color, strokeWidth: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}