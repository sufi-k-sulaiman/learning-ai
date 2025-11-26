import React from 'react';
import { Users, Briefcase, Activity, UserCheck } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, iconColor = '#6B4EE6', onClick }) => (
    <div 
        className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200 cursor-pointer"
        onClick={onClick}
    >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${iconColor}20` }}>
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

export default function StatsRow({ 
    stats = [
        { icon: Users, value: '520', label: 'Authors', iconColor: '#50C8E8' },
        { icon: Briefcase, value: '6969', label: 'Publishers', iconColor: '#F59E0B' },
        { icon: Activity, value: '7509', label: 'Active Users', iconColor: '#50C8E8' },
        { icon: UserCheck, value: '2110', label: 'Subscribers', iconColor: '#50C8E8' }
    ],
    onStatClick = null
}) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <StatCard 
                    key={index} 
                    {...stat} 
                    onClick={() => onStatClick?.(stat, index)}
                />
            ))}
        </div>
    );
}