import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function CategorySection({ 
    title, 
    description,
    icon: Icon,
    color = '#8B5CF6',
    children,
    defaultExpanded = true,
    stats = []
}) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div 
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
                style={{ borderLeft: `4px solid ${color}` }}
            >
                <div className="flex items-center gap-4">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}15` }}
                    >
                        {Icon && <Icon className="w-6 h-6" style={{ color }} />}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Quick Stats */}
                    {stats.length > 0 && (
                        <div className="hidden md:flex items-center gap-4">
                            {stats.slice(0, 3).map((stat, i) => (
                                <div key={i} className="text-center px-4 border-r border-gray-200 last:border-0">
                                    <p className="text-lg font-bold" style={{ color }}>{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                </div>
            </div>

            {/* Content */}
            {expanded && (
                <div className="p-5 pt-0 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    );
}