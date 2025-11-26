import React, { useState } from 'react';

export default function RankingPodium({ 
    title = 'Top Performers',
    data = [
        { name: '1ST', value: 100, position: 1 },
        { name: '2ND', value: 80, position: 2 },
        { name: '3RD', value: 60, position: 3 }
    ],
    colors = ['#6B4EE6', '#A78BFA', '#EC4899'],
    onItemClick = null
}) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Reorder for podium display: 2nd, 1st, 3rd
    const orderedData = [
        data.find(d => d.position === 2) || data[1],
        data.find(d => d.position === 1) || data[0],
        data.find(d => d.position === 3) || data[2]
    ].filter(Boolean);

    const heights = {
        1: 'h-32',
        2: 'h-24',
        3: 'h-20'
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>}
            
            <div className="flex items-end justify-center gap-2">
                {orderedData.map((item, index) => {
                    const isHovered = hoveredIndex === index;
                    const colorIndex = item.position - 1;
                    
                    return (
                        <div
                            key={index}
                            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                                isHovered ? 'scale-105' : ''
                            }`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => onItemClick?.(item, index)}
                        >
                            <div 
                                className={`w-24 ${heights[item.position]} rounded-t-lg flex items-center justify-center transition-all duration-300 ${
                                    isHovered ? 'shadow-lg' : ''
                                }`}
                                style={{ backgroundColor: colors[colorIndex] || colors[0] }}
                            >
                                <span className="text-white font-bold text-xl">{item.name}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex justify-center gap-6 mt-6">
                {data.map((item, index) => (
                    <div key={index} className="text-center">
                        <div 
                            className="w-3 h-3 rounded-full mx-auto mb-1" 
                            style={{ backgroundColor: colors[index] || colors[0] }}
                        />
                        <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}