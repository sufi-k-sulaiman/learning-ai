import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Globe, Compass, Flame } from 'lucide-react';

const BrowserItem = ({ icon: Icon, name, date, count, iconBg, onClick }) => (
    <div 
        className="flex items-center justify-between py-3 px-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
        onClick={onClick}
    >
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg }}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="font-semibold text-gray-800">{name}</p>
                <p className="text-sm text-gray-500">{date}</p>
            </div>
        </div>
        <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-lg">+{count}</span>
    </div>
);

export default function BrowserVisitorsCard({ 
    title = 'Visitors by Browser',
    totalVisitors = '15654',
    chartData = [
        { value: 20 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 },
        { value: 60 }, { value: 55 }, { value: 70 }, { value: 60 }, { value: 65 }
    ],
    browsers = [
        { icon: Globe, name: 'Chrome Users', date: 'Today', count: '2155', iconBg: '#6B4EE6' },
        { icon: Compass, name: 'Safari Users', date: 'Today', count: '54', iconBg: '#50C8E8' },
        { icon: Flame, name: 'Firefox Users', date: 'Today', count: '22', iconBg: '#F59E0B' }
    ],
    tabs = ['Week', 'Day'],
    onTabChange = null,
    onBrowserClick = null
}) {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500">{totalVisitors} Visitors</p>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    {tabs.map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                activeTab === tab ? 'text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
                            }`}
                            style={{ backgroundColor: activeTab === tab ? '#6B4EE6' : 'transparent' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="h-40 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="purpleAreaGradientBrowser" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6B4EE6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#6B4EE6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#6B4EE6" 
                            strokeWidth={3}
                            fill="url(#purpleAreaGradientBrowser)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div>
                {browsers.map((browser, index) => (
                    <BrowserItem 
                        key={index} 
                        {...browser} 
                        onClick={() => onBrowserClick?.(browser, index)}
                    />
                ))}
            </div>
        </div>
    );
}