import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};

export default function PieChartCard({ 
    title = 'Distribution',
    data = [
        { name: 'Segment A', value: 45 },
        { name: 'Segment B', value: 30 },
        { name: 'Segment C', value: 25 }
    ],
    colors = ['#6B4EE6', '#A78BFA', '#C4B5FD'],
    variant = 'pie', // 'pie' | 'donut'
    onSegmentClick = null
}) {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>}
            
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={variant === 'donut' ? 50 : 0}
                            outerRadius={80}
                            dataKey="value"
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            onClick={(data, index) => onSegmentClick?.(data, index)}
                            className="cursor-pointer"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={index} 
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #E5E7EB', 
                                borderRadius: '8px' 
                            }}
                            formatter={(value, name) => [`${value}`, name]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {data.map((entry, index) => (
                    <div 
                        key={index} 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => onSegmentClick?.(entry, index)}
                    >
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: colors[index % colors.length] }} 
                        />
                        <span className="text-sm text-gray-600">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}