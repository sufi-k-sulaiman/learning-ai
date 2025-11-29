import React from 'react';

const TOPIC_CONFIGS = {
    'Geography': { colors: ['#10B981', '#059669', '#34D399'], icon: '🌍' },
    'Psychology': { colors: ['#8B5CF6', '#7C3AED', '#A78BFA'], icon: '🧠' },
    'Music': { colors: ['#F59E0B', '#D97706', '#FBBF24'], icon: '🎵' },
    'Business': { colors: ['#3B82F6', '#2563EB', '#60A5FA'], icon: '💼' },
    'Sociology': { colors: ['#EC4899', '#DB2777', '#F472B6'], icon: '👥' },
    'Environment': { colors: ['#22C55E', '#16A34A', '#4ADE80'], icon: '🌱' },
    'Mathematics': { colors: ['#6366F1', '#4F46E5', '#818CF8'], icon: '📐' },
    'History': { colors: ['#F97316', '#EA580C', '#FB923C'], icon: '📜' },
    'Literature': { colors: ['#A855F7', '#9333EA', '#C084FC'], icon: '📚' },
    'Sports': { colors: ['#EF4444', '#DC2626', '#F87171'], icon: '⚽' },
    'Science': { colors: ['#06B6D4', '#0891B2', '#22D3EE'], icon: '🔬' },
    'Culture & Anthropology': { colors: ['#D946EF', '#C026D3', '#E879F9'], icon: '🏛️' },
    'Health & Medicine': { colors: ['#14B8A6', '#0D9488', '#2DD4BF'], icon: '🏥' },
    'Education': { colors: ['#8B5CF6', '#7C3AED', '#A78BFA'], icon: '🎓' },
    'Art': { colors: ['#F43F5E', '#E11D48', '#FB7185'], icon: '🎨' },
    'Economics': { colors: ['#84CC16', '#65A30D', '#A3E635'], icon: '📊' },
    'Philosophy': { colors: ['#64748B', '#475569', '#94A3B8'], icon: '💭' },
    'Politics': { colors: ['#0EA5E9', '#0284C7', '#38BDF8'], icon: '🏛️' },
};

export default function TopicThumbnail({ topic, onClick }) {
    const config = TOPIC_CONFIGS[topic] || { colors: ['#8B5CF6', '#7C3AED', '#A78BFA'], icon: '📌' };
    const [primary, secondary, tertiary] = config.colors;

    // Generate subtopic names based on topic
    const getSubtopics = (t) => {
        const subtopics = {
            'Geography': ['Continents', 'Climate', 'Mapping'],
            'Psychology': ['Behavior', 'Cognition', 'Emotion'],
            'Music': ['Theory', 'Genres', 'History'],
            'Business': ['Strategy', 'Marketing', 'Finance'],
            'Sociology': ['Culture', 'Groups', 'Behavior'],
            'Environment': ['Ecology', 'Climate', 'Conservation'],
            'Mathematics': ['Algebra', 'Geometry', 'Calculus'],
            'History': ['Ancient', 'Modern', 'Events'],
            'Literature': ['Poetry', 'Prose', 'Drama'],
            'Sports': ['Teams', 'Athletes', 'Events'],
            'Science': ['Physics', 'Chemistry', 'Biology'],
            'Culture & Anthropology': ['Traditions', 'Society', 'Artifacts'],
            'Health & Medicine': ['Anatomy', 'Treatment', 'Prevention'],
            'Education': ['Methods', 'Theory', 'Practice'],
            'Art': ['Painting', 'Sculpture', 'Digital'],
            'Economics': ['Markets', 'Trade', 'Policy'],
            'Philosophy': ['Ethics', 'Logic', 'Metaphysics'],
            'Politics': ['Systems', 'Policy', 'Law'],
        };
        return subtopics[t] || ['Topic 1', 'Topic 2', 'Topic 3'];
    };

    const subtopics = getSubtopics(topic);

    return (
        <button
            onClick={() => onClick(topic)}
            className="group relative bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-purple-300 transition-all duration-300 text-left overflow-hidden"
        >
            {/* Mini mind map visualization */}
            <div className="relative h-28 mb-3">
                {/* Center node */}
                <div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg z-10 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: primary }}
                >
                    {config.icon}
                </div>
                
                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                    {/* Line to top-left */}
                    <line x1="50%" y1="50%" x2="20%" y2="15%" stroke={secondary} strokeWidth="2" opacity="0.5" />
                    {/* Line to top-right */}
                    <line x1="50%" y1="50%" x2="80%" y2="15%" stroke={secondary} strokeWidth="2" opacity="0.5" />
                    {/* Line to bottom */}
                    <line x1="50%" y1="50%" x2="50%" y2="90%" stroke={secondary} strokeWidth="2" opacity="0.5" />
                </svg>
                
                {/* Child nodes */}
                <div 
                    className="absolute left-[15%] top-[8%] w-10 h-10 rounded-full flex items-center justify-center text-white text-[9px] font-medium shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: secondary }}
                >
                    <span className="truncate px-1">{subtopics[0]?.slice(0, 6)}</span>
                </div>
                <div 
                    className="absolute right-[15%] top-[8%] w-10 h-10 rounded-full flex items-center justify-center text-white text-[9px] font-medium shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: tertiary }}
                >
                    <span className="truncate px-1">{subtopics[1]?.slice(0, 6)}</span>
                </div>
                <div 
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-[9px] font-medium shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: secondary }}
                >
                    <span className="truncate px-1">{subtopics[2]?.slice(0, 6)}</span>
                </div>
            </div>
            
            {/* Topic name */}
            <h3 className="font-semibold text-gray-900 text-sm text-center group-hover:text-purple-700 transition-colors">
                {topic}
            </h3>
        </button>
    );
}