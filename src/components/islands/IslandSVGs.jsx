import React from 'react';

// Island 1 - Two palm trees on round mound
export const Island1 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left palm tree */}
        <path d="M35 45 Q30 30 20 25 Q28 28 32 35 Q30 22 18 18 Q28 22 35 32 Q38 20 30 12 Q38 18 40 30 Q45 18 55 15 Q45 22 42 32 Q55 22 62 18 Q52 28 43 35 L40 45" />
        <rect x="37" y="45" width="6" height="25" />
        {/* Right palm tree */}
        <path d="M75 40 Q70 25 60 20 Q68 23 72 30 Q70 17 58 13 Q68 17 75 27 Q78 15 70 7 Q78 13 80 25 Q85 13 95 10 Q85 17 82 27 Q95 17 102 13 Q92 23 83 30 L80 40" />
        <rect x="77" y="40" width="6" height="30" />
        {/* Ground mound */}
        <ellipse cx="60" cy="78" rx="50" ry="18" />
    </svg>
);

// Island 2 - Two tall palms on flat island
export const Island2 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left palm */}
        <path d="M40 35 Q32 20 22 18 Q32 22 38 30 Q35 15 22 10 Q35 15 42 28 Q48 15 58 12 Q48 20 44 30 Q58 20 68 18 Q55 25 45 32 L43 35" />
        <rect x="40" y="35" width="5" height="35" />
        {/* Right palm */}
        <path d="M78 30 Q70 15 60 13 Q70 17 76 25 Q73 10 60 5 Q73 10 80 23 Q86 10 96 7 Q86 15 82 25 Q96 15 106 13 Q93 20 83 27 L81 30" />
        <rect x="78" y="30" width="5" height="40" />
        {/* Ground */}
        <path d="M10 75 Q30 65 60 68 Q90 65 110 75 Q100 85 60 82 Q20 85 10 75 Z" />
    </svg>
);

// Island 3 - Palm with sun, mountain, and birds
export const Island3 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Sun */}
        <circle cx="100" cy="20" r="12" />
        {/* Birds */}
        <path d="M65 35 Q68 32 71 35 M75 30 Q78 27 81 30 M58 40 Q61 37 64 40" fill="none" stroke={color} strokeWidth="2" />
        {/* Mountain */}
        <path d="M50 80 L75 45 L100 80 Z" />
        {/* Palm tree */}
        <path d="M30 50 Q22 35 12 32 Q22 36 28 44 Q25 30 12 25 Q25 30 32 42 Q38 28 48 25 Q38 33 34 44 Q48 33 58 30 Q45 38 35 46 L33 50" />
        <rect x="30" y="50" width="5" height="28" />
        {/* Ground */}
        <ellipse cx="50" cy="82" rx="45" ry="12" />
    </svg>
);

// Island 4 - Two crossing palms
export const Island4 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left palm leaning right */}
        <path d="M45 40 Q35 25 25 22 Q35 26 42 34 Q38 18 25 12 Q38 18 47 32 Q55 18 65 15 Q55 23 50 34 Q65 23 75 20 Q62 28 52 36 L50 40" />
        <path d="M30 75 Q35 55 48 42" fill="none" stroke={color} strokeWidth="5" />
        {/* Right palm leaning left */}
        <path d="M72 35 Q62 20 52 17 Q62 21 69 29 Q65 13 52 7 Q65 13 74 27 Q82 13 92 10 Q82 18 77 29 Q92 18 102 15 Q89 23 79 31 L77 35" />
        <path d="M90 75 Q85 50 75 37" fill="none" stroke={color} strokeWidth="5" />
        {/* Ground */}
        <ellipse cx="60" cy="78" rx="45" ry="15" />
    </svg>
);

// Island 5 - Two palms different heights
export const Island5 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Tall left palm */}
        <path d="M42 30 Q32 15 22 12 Q32 16 40 25 Q36 8 22 2 Q36 8 45 22 Q53 8 63 5 Q53 13 48 25 Q63 13 73 10 Q60 18 50 27 L48 30" />
        <rect x="43" y="30" width="5" height="40" />
        {/* Shorter right palm */}
        <path d="M80 45 Q72 32 62 30 Q72 33 78 40 Q75 25 62 20 Q75 25 82 37 Q88 25 98 22 Q88 30 84 40 Q98 30 108 28 Q95 35 85 42 L83 45" />
        <rect x="80" y="45" width="5" height="25" />
        {/* Ground */}
        <path d="M15 78 Q40 68 60 70 Q80 68 105 78 Q90 88 60 85 Q30 88 15 78 Z" />
    </svg>
);

// Island 6 - Mountain with palm and sun
export const Island6 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Sun */}
        <circle cx="100" cy="18" r="10" />
        {/* Bird */}
        <path d="M75 28 Q78 25 81 28" fill="none" stroke={color} strokeWidth="2" />
        {/* Mountain */}
        <path d="M25 82 L55 35 L85 82 Z" />
        {/* Small palm */}
        <path d="M95 55 Q88 45 80 43 Q88 46 93 52 Q90 40 80 36 Q90 40 96 50 Q100 40 108 38 Q100 44 97 52 Q108 44 115 42 Q105 48 98 54 L96 55" />
        <rect x="94" y="55" width="4" height="20" />
        {/* Ground */}
        <ellipse cx="60" cy="82" rx="50" ry="12" />
    </svg>
);

// Island 7 - Three palms with signposts
export const Island7 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left palm */}
        <path d="M25 45 Q18 32 10 30 Q18 33 23 40 Q20 25 10 20 Q20 25 27 37 Q33 25 42 22 Q33 30 28 40 Q42 30 50 28 Q40 35 30 42 L28 45" />
        <rect x="25" y="45" width="4" height="25" />
        {/* Center tall palm */}
        <path d="M58 35 Q50 20 40 18 Q50 22 56 30 Q53 12 40 6 Q53 12 60 27 Q68 12 78 9 Q68 17 63 30 Q78 17 88 14 Q75 22 65 32 L63 35" />
        <rect x="58" y="35" width="5" height="35" />
        {/* Right small palm */}
        <path d="M92 50 Q86 40 78 38 Q86 41 90 47 Q88 35 78 30 Q88 35 94 45 Q98 35 106 33 Q98 40 95 48 Q106 40 112 38 Q102 44 96 50 L94 50" />
        <rect x="92" y="50" width="4" height="20" />
        {/* Signposts */}
        <rect x="35" y="60" width="2" height="15" />
        <rect x="32" y="62" width="8" height="4" />
        <rect x="80" y="58" width="2" height="17" />
        <rect x="77" y="60" width="8" height="4" />
        {/* Ground */}
        <ellipse cx="60" cy="78" rx="50" ry="15" />
    </svg>
);

// Island 8 - Palm with rock/mountain and birds
export const Island8 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Birds */}
        <path d="M55 25 Q58 22 61 25 M65 30 Q68 27 71 30" fill="none" stroke={color} strokeWidth="2" />
        {/* Left palm */}
        <path d="M30 50 Q22 35 12 32 Q22 36 28 44 Q25 28 12 22 Q25 28 32 42 Q40 28 50 25 Q40 33 35 44 Q50 33 60 30 Q47 38 37 46 L35 50" />
        <rect x="32" y="50" width="5" height="25" />
        {/* Rock/Mountain */}
        <path d="M55 78 Q60 55 75 50 Q90 55 95 78 Z" />
        {/* Right palm */}
        <path d="M100 55 Q93 42 85 40 Q93 43 98 50 Q95 35 85 30 Q95 35 102 48 Q108 35 116 33 Q108 41 104 50 Q116 41 122 39 Q110 46 105 53 L103 55" />
        <rect x="100" y="55" width="4" height="20" />
        {/* Ground */}
        <ellipse cx="65" cy="80" rx="48" ry="12" />
    </svg>
);

// Island 9 - Three palms with sun
export const Island9 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Sun */}
        <circle cx="105" cy="18" r="10" />
        {/* Left palm */}
        <path d="M22 50 Q15 38 7 36 Q15 39 20 46 Q17 32 7 27 Q17 32 24 44 Q30 32 38 30 Q30 37 26 46 Q38 37 46 35 Q36 42 27 48 L25 50" />
        <rect x="22" y="50" width="4" height="22" />
        {/* Center palm */}
        <path d="M55 40 Q47 25 37 22 Q47 26 53 35 Q50 18 37 12 Q50 18 58 32 Q65 18 75 15 Q65 23 60 35 Q75 23 85 20 Q72 28 62 37 L60 40" />
        <rect x="55" y="40" width="5" height="32" />
        {/* Right palm */}
        <path d="M88 48 Q82 36 74 34 Q82 37 86 44 Q84 30 74 25 Q84 30 90 42 Q95 30 103 28 Q95 35 91 44 Q103 35 110 33 Q100 40 92 46 L90 48" />
        <rect x="88" y="48" width="4" height="24" />
        {/* Ground with grass texture */}
        <ellipse cx="60" cy="78" rx="50" ry="14" />
        {/* Small grass details */}
        <path d="M30 75 L32 70 L34 75 M45 73 L47 68 L49 73 M75 74 L77 69 L79 74 M90 75 L92 70 L94 75" />
    </svg>
);

// Export all islands as an array for easy iteration
export const AllIslands = [Island1, Island2, Island3, Island4, Island5, Island6, Island7, Island8, Island9];

export default { Island1, Island2, Island3, Island4, Island5, Island6, Island7, Island8, Island9, AllIslands };