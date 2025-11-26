import React, { useState } from 'react';

export default function InfoCard({ 
    content = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat',
    bgColor = '#374151',
    textColor = 'white',
    onClick = null
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                isHovered ? 'shadow-lg scale-[1.02]' : ''
            }`}
            style={{ backgroundColor: bgColor, color: textColor }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <p className="text-sm leading-relaxed">{content}</p>
        </div>
    );
}