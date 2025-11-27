import React from 'react';
import { Button } from "@/components/ui/button";
import { Compass, BookOpen, ChevronRight } from 'lucide-react';

const COLORS = [
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-pink-500 to-rose-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-violet-500 to-purple-500',
];

export default function KeywordCard({ keyword, index, onExplore, onLearnMore, isCenter = false }) {
    const colorClass = COLORS[index % COLORS.length];
    
    if (isCenter) {
        return (
            <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 text-white shadow-xl`}>
                <h2 className="text-2xl font-bold mb-2">{keyword.name}</h2>
                <p className="text-white/80 text-sm mb-4">{keyword.description}</p>
                <div className="flex gap-2">
                    <Button 
                        onClick={() => onLearnMore(keyword)}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                    >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Learn More
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center mb-3`}>
                <span className="text-white font-bold text-sm">{keyword.name.charAt(0)}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{keyword.name}</h3>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{keyword.description}</p>
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onExplore(keyword)}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                    <Compass className="w-3 h-3 mr-1" />
                    Explore
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onLearnMore(keyword)}
                    className="text-gray-600"
                >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Learn
                </Button>
            </div>
        </div>
    );
}