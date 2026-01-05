import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function AssetCard({ 
    title, 
    value, 
    unit = '',
    change = null,
    trend = 'stable', // 'up', 'down', 'stable'
    icon: Icon,
    color = '#8B5CF6',
    description = '',
    onClick = null
}) {
    const trendColors = {
        up: 'text-emerald-600 bg-emerald-50',
        down: 'text-red-600 bg-red-50',
        stable: 'text-gray-600 bg-gray-50'
    };

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

    return (
        <div 
            className={`bg-white rounded-xl border border-gray-200 p-5 transition-all hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-3">
                <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                >
                    {Icon && <Icon className="w-5 h-5" style={{ color }} />}
                </div>
                {change !== null && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}>
                        <TrendIcon className="w-3 h-3" />
                        {change}%
                    </div>
                )}
            </div>
            <div className="mb-1">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
            </div>
            <p className="text-sm font-medium text-gray-700">{title}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
    );
}