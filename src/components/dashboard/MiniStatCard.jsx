import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export default function MiniStatCard({ 
    value = '$874',
    label = 'sales last month',
    accentColor = '#6B4EE6',
    data = [
        { v: 30 }, { v: 45 }, { v: 35 }, { v: 50 }, { v: 40 }, { v: 60 }, 
        { v: 45 }, { v: 55 }, { v: 50 }, { v: 45 }, { v: 55 }, { v: 50 }
    ],
    dataKey = 'v',
    onClick = null
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-b-4 transition-all duration-300 hover:shadow-md cursor-pointer"
            style={{ borderBottomColor: accentColor }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mb-4">{label}</p>
            
            <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        {isHovered && <Tooltip 
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }}
                        />}
                        <Line 
                            type="monotone" 
                            dataKey={dataKey}
                            stroke={accentColor} 
                            strokeWidth={2}
                            dot={false}
                            activeDot={isHovered ? { r: 4, fill: accentColor } : false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}