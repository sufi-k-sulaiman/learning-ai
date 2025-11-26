import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export default function MetricCard({ 
    title = 'Metric', 
    subtitle = 'Description', 
    value = '0', 
    change = null, 
    changeType = 'positive',
    data = [],
    dataKey = 'value',
    bgColor = '#6B4EE6',
    variant = 'colored', // 'colored' | 'white'
    onClick = null
}) {
    const [isHovered, setIsHovered] = useState(false);
    const isPositive = changeType === 'positive';
    const isWhite = variant === 'white';
    
    const chartData = data.length > 0 ? data : [
        { value: 30 }, { value: 45 }, { value: 35 }, { value: 50 }, 
        { value: 40 }, { value: 60 }, { value: 55 }, { value: 70 }
    ];

    return (
        <div 
            className={`rounded-2xl p-6 h-full transition-all duration-300 cursor-pointer ${
                isWhite 
                    ? 'bg-white shadow-sm hover:shadow-lg border border-gray-100' 
                    : 'hover:scale-[1.02]'
            }`}
            style={{ backgroundColor: isWhite ? 'white' : bgColor }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className={`text-lg font-semibold ${isWhite ? 'text-gray-800' : 'text-white'}`}>{title}</h3>
                    <p className={`text-sm ${isWhite ? 'text-gray-500' : 'text-white/80'}`}>{subtitle}</p>
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                        isPositive 
                            ? (isWhite ? 'bg-green-100 text-green-600' : 'bg-white/20 text-green-300')
                            : (isWhite ? 'bg-red-100 text-red-600' : 'bg-white/20 text-red-300')
                    }`}>
                        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {change}
                    </div>
                )}
            </div>
            
            <div className="h-16 my-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <Line 
                            type="monotone" 
                            dataKey={dataKey}
                            stroke={isWhite ? bgColor : 'rgba(255,255,255,0.8)'}
                            strokeWidth={2}
                            dot={false}
                            activeDot={isHovered ? { r: 4, fill: isWhite ? bgColor : 'white' } : false}
                        />
                        {isHovered && <Tooltip 
                            contentStyle={{ 
                                backgroundColor: isWhite ? 'white' : bgColor, 
                                border: 'none', 
                                borderRadius: '8px',
                                color: isWhite ? '#374151' : 'white'
                            }}
                        />}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
                <span className={`text-3xl font-bold ${isWhite ? 'text-gray-800' : 'text-white'}`}>{value}</span>
            </div>
        </div>
    );
}