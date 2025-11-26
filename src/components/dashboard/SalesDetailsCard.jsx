import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreHorizontal, ShoppingBag, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

const StatItem = ({ icon: Icon, iconBg, value, label, onClick }) => (
    <div 
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={onClick}
    >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg }}>
            <Icon className="w-5 h-5" style={{ color: '#6B4EE6' }} />
        </div>
        <div>
            <p className="text-xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

export default function SalesDetailsCard({ 
    title = 'Sales Details',
    stats = [
        { icon: ShoppingBag, iconBg: '#EDE9FE', value: '$2,034', label: 'Author Sales' },
        { icon: BarChart3, iconBg: '#FEE2E2', value: '$706', label: 'Commission' },
        { icon: DollarSign, iconBg: '#D1FAE5', value: '$49', label: 'Average Bid' },
        { icon: TrendingUp, iconBg: '#D1FAE5', value: '$5.8M', label: 'All Time Sales' }
    ],
    chartData = [
        { value: 30 }, { value: 45 }, { value: 35 }, { value: 50 }, { value: 40 },
        { value: 60 }, { value: 55 }, { value: 70 }, { value: 65 }, { value: 80 }
    ],
    onStatClick = null,
    onMenuClick = null
}) {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={onMenuClick}
                >
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
                {stats.map((stat, index) => (
                    <StatItem 
                        key={index}
                        {...stat}
                        onClick={() => onStatClick?.(stat, index)}
                    />
                ))}
            </div>
            
            <div className="h-32 rounded-xl overflow-hidden" style={{ backgroundColor: '#FAFAFA' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} onMouseMove={(e) => setActiveIndex(e?.activeTooltipIndex)}>
                        <defs>
                            <linearGradient id="purpleGradientSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6B4EE6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6B4EE6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #E5E7EB', 
                                borderRadius: '8px' 
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#6B4EE6" 
                            strokeWidth={3}
                            fill="url(#purpleGradientSales)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}