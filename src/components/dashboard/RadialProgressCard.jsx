import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function RadialProgressCard({ 
    percentage = 50,
    title = '',
    size = 'large', // 'large' | 'medium' | 'small'
    color = '#6B4EE6',
    trackColor = '#E5E7EB',
    onClick = null
}) {
    const [isHovered, setIsHovered] = useState(false);
    
    const data = [
        { value: percentage },
        { value: 100 - percentage }
    ];

    const sizes = {
        large: { outer: 90, inner: 70, text: 'text-3xl', container: 'h-52 w-52' },
        medium: { outer: 60, inner: 45, text: 'text-xl', container: 'h-36 w-36' },
        small: { outer: 40, inner: 30, text: 'text-sm', container: 'h-24 w-24' }
    };

    const s = sizes[size];

    return (
        <div 
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center transition-all duration-300 cursor-pointer ${
                isHovered ? 'shadow-lg scale-[1.02]' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className={`relative ${s.container}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={s.inner}
                            outerRadius={isHovered ? s.outer + 4 : s.outer}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            <Cell fill={color} />
                            <Cell fill={trackColor} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-700 rounded-full flex items-center justify-center" 
                         style={{ width: s.inner * 1.4, height: s.inner * 1.4 }}>
                        <span className={`font-bold text-white ${s.text}`}>{percentage}%</span>
                    </div>
                </div>
            </div>
            {title && <p className="mt-4 text-gray-600 font-medium">{title}</p>}
        </div>
    );
}