import React from 'react';

// Island 10 - Beach hut with palm
export const Island10 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Palm fronds */}
        <path d="M25 45 C21 38 15 36 9 38 C15 39 20 42 23 45 Z" />
        <path d="M25 45 C19 36 11 32 3 35 C13 37 20 41 24 45 Z" />
        <path d="M26 45 C23 34 17 26 9 25 C17 30 23 38 26 45 Z" />
        <path d="M27 45 C31 34 37 26 45 25 C37 30 31 38 28 45 Z" />
        <path d="M28 45 C35 36 43 32 51 35 C41 37 33 41 29 45 Z" />
        <path d="M28 45 C33 38 39 36 45 38 C39 39 33 42 29 45 Z" />
        {/* Trunk */}
        <path d="M24 45 Q26 62 27 80 Q29 62 27 45 Z" />
        {/* Beach hut */}
        <path d="M60 55 L75 40 L90 55 Z" /> {/* Roof */}
        <rect x="63" y="55" width="24" height="25" /> {/* Walls */}
        <rect x="71" y="62" width="8" height="18" /> {/* Door */}
        {/* Ground */}
        <ellipse cx="55" cy="88" rx="50" ry="12" />
    </svg>
);

// Island 11 - Large island with multiple palms and pond
export const Island11 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left palm */}
        <path d="M18 48 C15 42 10 41 5 42 C10 43 14 46 17 48 Z" />
        <path d="M18 48 C14 41 8 38 2 40 C9 42 14 45 17 48 Z" />
        <path d="M19 48 C17 40 12 34 6 33 C12 37 17 43 19 48 Z" />
        <path d="M20 48 C23 40 28 34 34 33 C28 37 23 43 20 48 Z" />
        <path d="M21 48 C25 41 32 38 38 40 C31 42 25 45 22 48 Z" />
        <path d="M21 48 C24 42 30 41 35 42 C30 43 25 46 22 48 Z" />
        <path d="M17 48 Q18 65 19 82 Q21 65 19 48 Z" />
        {/* Right palm */}
        <path d="M95 42 C92 36 87 35 82 36 C87 37 91 40 94 42 Z" />
        <path d="M95 42 C91 35 85 32 79 34 C86 36 91 39 94 42 Z" />
        <path d="M96 42 C94 34 89 28 83 27 C89 31 94 37 96 42 Z" />
        <path d="M97 42 C100 34 105 28 111 27 C105 31 100 37 97 42 Z" />
        <path d="M98 42 C102 35 109 32 115 34 C108 36 102 39 99 42 Z" />
        <path d="M98 42 C101 36 107 35 112 36 C107 37 102 40 99 42 Z" />
        <path d="M94 42 Q95 62 96 82 Q98 62 96 42 Z" />
        {/* Pond (negative space effect - outline) */}
        <ellipse cx="58" cy="75" rx="15" ry="6" />
        <ellipse cx="58" cy="75" rx="12" ry="4" fill="white" />
        {/* Large ground */}
        <path d="M2 88 Q20 72 40 78 Q60 70 80 78 Q100 72 118 88 Q95 98 60 96 Q25 98 2 88 Z" />
    </svg>
);

// Island 12 - Twin mountains with sunrise
export const Island12 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Sun rising */}
        <circle cx="60" cy="25" r="12" />
        {/* Sun rays */}
        <path d="M60 8 L60 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M72 13 L76 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M48 13 L44 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Left mountain */}
        <path d="M5 90 L35 45 L65 90 Z" />
        {/* Right mountain */}
        <path d="M45 90 L80 35 L115 90 Z" />
        {/* Ground */}
        <ellipse cx="60" cy="92" rx="55" ry="8" />
    </svg>
);

// Island 13 - Pine trees island
export const Island13 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left pine tree */}
        <path d="M25 75 L15 60 L20 60 L12 48 L18 48 L10 35 L25 55 L20 55 L28 65 L23 65 L30 75 Z" />
        <rect x="23" y="75" width="4" height="10" />
        {/* Center pine tree (taller) */}
        <path d="M60 70 L48 52 L54 52 L44 38 L52 38 L42 22 L60 45 L54 45 L64 58 L58 58 L68 70 Z" />
        <rect x="57" y="70" width="6" height="15" />
        {/* Right pine tree */}
        <path d="M95 75 L85 60 L90 60 L82 48 L88 48 L80 35 L95 55 L90 55 L98 65 L93 65 L100 75 Z" />
        <rect x="93" y="75" width="4" height="10" />
        {/* Ground */}
        <ellipse cx="60" cy="90" rx="52" ry="10" />
    </svg>
);

// Island 14 - Lighthouse island
export const Island14 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Light rays */}
        <path d="M60 22 L45 15 M60 22 L50 10 M60 22 L60 5 M60 22 L70 10 M60 22 L75 15" 
              fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Lighthouse */}
        <path d="M52 82 L55 35 L65 35 L68 82 Z" /> {/* Tower */}
        <rect x="53" y="28" width="14" height="10" /> {/* Light housing */}
        <path d="M50 28 L60 18 L70 28 Z" /> {/* Roof */}
        {/* Stripes on lighthouse */}
        <rect x="54" y="45" width="12" height="6" fill="white" />
        <rect x="55" y="58" width="10" height="6" fill="white" />
        <rect x="56" y="71" width="8" height="6" fill="white" />
        {/* Small palm */}
        <path d="M92 60 C90 55 86 54 82 55 C86 56 89 58 91 60 Z" />
        <path d="M92 60 C89 54 84 52 79 53 C85 55 89 58 91 60 Z" />
        <path d="M93 60 C91 53 87 48 82 47 C87 50 91 55 93 60 Z" />
        <path d="M94 60 C96 53 100 48 105 47 C100 50 96 55 94 60 Z" />
        <path d="M95 60 C98 54 103 52 108 53 C102 55 98 58 96 60 Z" />
        <path d="M91 60 Q92 72 93 82 Q95 72 93 60 Z" />
        {/* Rocky ground */}
        <path d="M5 88 Q25 78 45 82 Q60 76 80 82 Q100 78 115 88 Q90 96 60 94 Q30 96 5 88 Z" />
    </svg>
);

// Island 15 - Volcano island
export const Island15 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Smoke clouds */}
        <circle cx="55" cy="15" r="6" />
        <circle cx="62" cy="12" r="5" />
        <circle cx="68" cy="16" r="4" />
        <circle cx="58" cy="8" r="4" />
        {/* Volcano */}
        <path d="M20 90 L50 30 L55 35 L60 28 L65 35 L70 30 L100 90 Z" />
        {/* Lava glow (crater) */}
        <ellipse cx="60" cy="32" rx="8" ry="3" fill="white" />
        {/* Small palm left */}
        <path d="M18 65 C16 60 12 59 8 60 C12 61 15 63 17 65 Z" />
        <path d="M18 65 C15 59 10 57 5 58 C11 60 15 63 17 65 Z" />
        <path d="M19 65 C17 58 13 53 8 52 C13 55 17 60 19 65 Z" />
        <path d="M20 65 C22 58 26 53 31 52 C26 55 22 60 20 65 Z" />
        <path d="M21 65 C24 59 29 57 34 58 C28 60 24 63 22 65 Z" />
        <path d="M17 65 Q18 77 19 85 Q21 77 19 65 Z" />
        {/* Ground */}
        <ellipse cx="60" cy="92" rx="55" ry="8" />
    </svg>
);

// Island 16 - Hammock between palms
export const Island16 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left palm */}
        <path d="M25 40 C21 33 15 31 9 33 C15 34 20 37 23 40 Z" />
        <path d="M25 40 C19 31 11 27 3 30 C13 32 20 36 24 40 Z" />
        <path d="M26 40 C23 29 17 21 9 20 C17 25 23 33 26 40 Z" />
        <path d="M27 40 C31 29 37 21 45 20 C37 25 31 33 28 40 Z" />
        <path d="M28 40 C35 31 43 27 51 30 C41 32 33 36 29 40 Z" />
        <path d="M24 40 Q28 60 30 82" stroke={color} strokeWidth="4" fill="none" />
        {/* Right palm */}
        <path d="M92 40 C88 33 82 31 76 33 C82 34 87 37 90 40 Z" />
        <path d="M92 40 C86 31 78 27 70 30 C80 32 87 36 91 40 Z" />
        <path d="M93 40 C90 29 84 21 76 20 C84 25 90 33 93 40 Z" />
        <path d="M94 40 C98 29 104 21 112 20 C104 25 98 33 95 40 Z" />
        <path d="M95 40 C102 31 110 27 118 30 C108 32 100 36 96 40 Z" />
        <path d="M93 40 Q90 60 88 82" stroke={color} strokeWidth="4" fill="none" />
        {/* Hammock */}
        <path d="M32 58 Q60 72 86 58" fill="none" stroke={color} strokeWidth="2" />
        <path d="M32 58 Q60 78 86 58" fill="none" stroke={color} strokeWidth="2" />
        {/* Ground */}
        <ellipse cx="58" cy="88" rx="50" ry="12" />
    </svg>
);

// Island 17 - Boat near island
export const Island17 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Sun */}
        <circle cx="100" cy="20" r="10" />
        {/* Palm fronds */}
        <path d="M55 45 C51 38 45 36 39 38 C45 39 50 42 53 45 Z" />
        <path d="M55 45 C49 36 41 32 33 35 C43 37 50 41 54 45 Z" />
        <path d="M56 45 C53 34 47 26 39 25 C47 30 53 38 56 45 Z" />
        <path d="M57 45 C61 34 67 26 75 25 C67 30 61 38 58 45 Z" />
        <path d="M58 45 C65 36 73 32 81 35 C71 37 63 41 59 45 Z" />
        <path d="M58 45 C63 38 69 36 75 38 C69 39 63 42 59 45 Z" />
        {/* Trunk */}
        <path d="M54 45 Q56 62 57 78 Q59 62 57 45 Z" />
        {/* Boat */}
        <path d="M5 75 Q15 82 25 75 L22 68 L8 68 Z" />
        <rect x="14" y="55" width="2" height="13" /> {/* Mast */}
        <path d="M16 55 L16 65 L22 65 Z" /> {/* Sail */}
        {/* Ground */}
        <path d="M35 85 Q55 75 75 80 Q95 75 110 85 Q90 93 72 91 Q50 93 35 85 Z" />
    </svg>
);

// Island 18 - Treasure island with X mark
export const Island18 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Birds */}
        <path d="M75 25 Q79 19 83 25" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M85 30 Q89 24 93 30" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Left palm */}
        <path d="M22 48 C19 42 14 41 9 42 C14 43 18 46 21 48 Z" />
        <path d="M22 48 C18 41 12 38 6 40 C13 42 18 45 21 48 Z" />
        <path d="M23 48 C21 40 16 34 10 33 C16 37 21 43 23 48 Z" />
        <path d="M24 48 C27 40 32 34 38 33 C32 37 27 43 24 48 Z" />
        <path d="M25 48 C29 41 36 38 42 40 C35 42 29 45 26 48 Z" />
        <path d="M21 48 Q22 65 23 82 Q25 65 23 48 Z" />
        {/* Right palm */}
        <path d="M88 42 C85 36 80 35 75 36 C80 37 84 40 87 42 Z" />
        <path d="M88 42 C84 35 78 32 72 34 C79 36 84 39 87 42 Z" />
        <path d="M89 42 C87 34 82 28 76 27 C82 31 87 37 89 42 Z" />
        <path d="M90 42 C93 34 98 28 104 27 C98 31 93 37 90 42 Z" />
        <path d="M91 42 C95 35 102 32 108 34 C101 36 95 39 92 42 Z" />
        <path d="M87 42 Q88 62 89 82 Q91 62 89 42 Z" />
        {/* X mark */}
        <path d="M52 68 L62 78 M62 68 L52 78" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {/* Treasure chest */}
        <rect x="48" y="78" width="18" height="8" rx="1" />
        <path d="M48 78 Q57 74 66 78" />
        {/* Ground */}
        <ellipse cx="58" cy="90" rx="50" ry="10" />
    </svg>
);

// Export all islands as an array for easy iteration
export const AllIslands2 = [Island10, Island11, Island12, Island13, Island14, Island15, Island16, Island17, Island18];

export default { Island10, Island11, Island12, Island13, Island14, Island15, Island16, Island17, Island18, AllIslands2 };