import React, { useState } from 'react';

const FollowerCard = ({ label, value, bgColor, textColor, onClick, isHovered }) => (
    <div 
        className={`rounded-2xl p-6 flex flex-col justify-end h-32 cursor-pointer transition-all duration-300 ${
            isHovered ? 'scale-105 shadow-lg' : ''
        }`}
        style={{ backgroundColor: bgColor }}
        onClick={onClick}
    >
        <p className="text-sm font-medium" style={{ color: textColor }}>{label}</p>
        <p className="text-3xl font-bold" style={{ color: textColor }}>{value}</p>
    </div>
);

export default function SocialMediaCard({ 
    title = "Social Media",
    subtitle = "About Your Social Popularity",
    stats = [
        { label: 'Facebook', value: '35.6K', bgColor: '#FEF3C7', textColor: '#F59E0B' },
        { label: 'Twitter', value: '35.6K', bgColor: '#D1FAE5', textColor: '#10B981' },
        { label: 'Instagram', value: '35.6K', bgColor: '#FEE2E2', textColor: '#EF4444' },
        { label: 'LinkedIn', value: '35.6K', bgColor: '#DBEAFE', textColor: '#3B82F6' }
    ],
    onStatClick = null
}) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
            
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <FollowerCard 
                            {...stat} 
                            isHovered={hoveredIndex === index}
                            onClick={() => onStatClick?.(stat, index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}