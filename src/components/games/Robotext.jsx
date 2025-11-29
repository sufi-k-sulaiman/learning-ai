import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Zap, Trophy, BookOpen, Gamepad2 } from 'lucide-react';

// Word categories with semantic meanings
const WORD_CATEGORIES = {
    power: ['Strength', 'Force', 'Power', 'Might', 'Energy'],
    speed: ['Speed', 'Swift', 'Quick', 'Rapid', 'Flash'],
    defense: ['Shield', 'Guard', 'Armor', 'Protect', 'Defend'],
    wisdom: ['Hope', 'Unity', 'Peace', 'Wisdom', 'Truth'],
    chaos: ['Chaos', 'Storm', 'Fury', 'Rage', 'Blast']
};

const ABILITIES = {
    power: { name: 'Power Shot', description: 'Stronger bullets', color: '#EF4444' },
    speed: { name: 'Velocity Boost', description: 'Move faster', color: '#3B82F6' },
    defense: { name: 'Energy Shield', description: 'Temporary invincibility', color: '#10B981' },
    wisdom: { name: 'Insight', description: 'Reveal enemy weaknesses', color: '#F59E0B' },
    chaos: { name: 'Chain Reaction', description: 'Explosions chain to nearby enemies', color: '#8B5CF6' }
};

const STORY_FRAGMENTS = [
    "In the beginning, Robotext was built for peace...",
    "The words scattered when the old world fell...",
    "Each enemy carries fragments of lost meaning...",
    "Unity awaits those who gather the truth...",
    "The final word remains hidden in chaos..."
];

export default function Robotext({ onBack }) {
    const canvasRef = useRef(null);
    const gameStateRef = useRef(null);
    const keysRef = useRef({});
    const animationRef = useRef(null);
    const scoreRef = useRef(0);
    const levelRef = useRef(1);
    const livesRef = useRef(3);
    const [gameStatus, setGameStatus] = useState('menu'); // menu, playing, paused, gameover, victory
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [collectedWords, setCollectedWords] = useState([]);
    const [activeAbilities, setActiveAbilities] = useState({});
    const [storyIndex, setStoryIndex] = useState(0);
    const [level, setLevel] = useState(1);
    const [showStory, setShowStory] = useState(false);
    const showStoryRef = useRef(false);
    const storyIndexRef = useRef(0);

    const initGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        gameStateRef.current = {
            robot: {
                x: 100,
                y: canvas.height - 100,
                vx: 0,
                vy: 0,
                width: 40,
                height: 50,
                grounded: false,
                facing: 1,
                fireRate: 300,
                lastFire: 0,
                bulletSpeed: 12,
                bulletPower: 1,
                speedMultiplier: 1,
                shieldActive: false,
                shieldTimer: 0,
                insightActive: false,
                chainReaction: false
            },
            bullets: [],
            enemies: [],
            words: [],
            platforms: [],
            particles: [],
            gravity: 0.6,
            friction: 0.85,
            jumpForce: -14,
            moveSpeed: 0.8,
            maxSpeed: 6,
            spawnTimer: 0,
            spawnRate: 2000,
            time: 0
        };

        // Create platforms
        const g = gameStateRef.current;
        g.platforms = [
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 }, // Ground
            { x: 150, y: canvas.height - 120, width: 150, height: 15 },
            { x: 400, y: canvas.height - 180, width: 120, height: 15 },
            { x: 600, y: canvas.height - 100, width: 100, height: 15 },
            { x: 50, y: canvas.height - 220, width: 100, height: 15 },
            { x: 700, y: canvas.height - 200, width: 80, height: 15 },
        ];

        setScore(0);
        setLives(3);
        setCollectedWords([]);
        setActiveAbilities({});
    }, []);

    const spawnEnemy = useCallback(() => {
        const canvas = canvasRef.current;
        const g = gameStateRef.current;
        if (!canvas || !g) return;

        const types = ['walker', 'flyer', 'turret'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const enemy = {
            id: Date.now() + Math.random(),
            type,
            x: Math.random() > 0.5 ? canvas.width + 30 : -30,
            y: type === 'flyer' ? 100 + Math.random() * 150 : canvas.height - 70,
            vx: 0,
            vy: 0,
            width: type === 'turret' ? 35 : 30,
            height: type === 'turret' ? 35 : 40,
            health: type === 'turret' ? 3 : (type === 'flyer' ? 1 : 2),
            maxHealth: type === 'turret' ? 3 : (type === 'flyer' ? 1 : 2),
            direction: 1,
            shootTimer: 0,
            wordCategory: Object.keys(WORD_CATEGORIES)[Math.floor(Math.random() * 5)]
        };

        enemy.vx = enemy.x < 0 ? 2 : -2;
        g.enemies.push(enemy);
    }, []);

    const spawnWord = useCallback((x, y, category) => {
        const g = gameStateRef.current;
        if (!g) return;

        const words = WORD_CATEGORIES[category];
        const word = words[Math.floor(Math.random() * words.length)];
        
        g.words.push({
            id: Date.now() + Math.random(),
            text: word,
            category,
            x,
            y,
            vx: (Math.random() - 0.5) * 8,
            vy: -8 - Math.random() * 4,
            alpha: 1,
            scale: 1,
            collected: false,
            lifetime: 8000
        });

        // Spawn particles
        for (let i = 0; i < 12; i++) {
            g.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color: ABILITIES[category].color,
                size: 3 + Math.random() * 4
            });
        }
    }, []);

    const checkAbilities = useCallback((words) => {
        const categoryCounts = {};
        words.forEach(w => {
            const cat = Object.entries(WORD_CATEGORIES).find(([_, arr]) => arr.includes(w))?.[0];
            if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const newAbilities = {};
        Object.entries(categoryCounts).forEach(([cat, count]) => {
            if (count >= 3) {
                newAbilities[cat] = true;
            }
        });

        // Apply ability effects
        const g = gameStateRef.current;
        if (g) {
            if (newAbilities.power && !activeAbilities.power) {
                g.robot.bulletPower = 2;
            }
            if (newAbilities.speed && !activeAbilities.speed) {
                g.robot.speedMultiplier = 1.5;
            }
            if (newAbilities.defense && !activeAbilities.defense) {
                g.robot.shieldActive = true;
                g.robot.shieldTimer = 10000;
            }
            if (newAbilities.wisdom && !activeAbilities.wisdom) {
                g.robot.insightActive = true;
            }
            if (newAbilities.chaos && !activeAbilities.chaos) {
                g.robot.chainReaction = true;
            }
        }

        setActiveAbilities(prev => ({ ...prev, ...newAbilities }));

        // Check for story unlock
        if (words.length > 0 && words.length % 10 === 0 && storyIndex < STORY_FRAGMENTS.length - 1) {
            setStoryIndex(prev => Math.min(prev + 1, STORY_FRAGMENTS.length - 1));
            setShowStory(true);
            setTimeout(() => setShowStory(false), 3000);
        }
    }, [activeAbilities, storyIndex]);

    const gameLoop = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const g = gameStateRef.current;
        if (!canvas || !ctx || !g || gameStatus !== 'playing') return;

        const keys = keysRef.current;
        const dt = 16;
        g.time += dt;

        // Update robot physics
        const robot = g.robot;
        
        // Horizontal movement
        if (keys['ArrowLeft'] || keys['a']) {
            robot.vx -= g.moveSpeed * robot.speedMultiplier;
            robot.facing = -1;
        }
        if (keys['ArrowRight'] || keys['d']) {
            robot.vx += g.moveSpeed * robot.speedMultiplier;
            robot.facing = 1;
        }

        // Jump
        if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && robot.grounded) {
            robot.vy = g.jumpForce;
            robot.grounded = false;
        }

        // Apply physics
        robot.vx *= g.friction;
        robot.vy += g.gravity;
        robot.vx = Math.max(-g.maxSpeed * robot.speedMultiplier, Math.min(g.maxSpeed * robot.speedMultiplier, robot.vx));

        robot.x += robot.vx;
        robot.y += robot.vy;

        // Platform collision
        robot.grounded = false;
        g.platforms.forEach(p => {
            if (robot.x + robot.width > p.x && robot.x < p.x + p.width) {
                if (robot.y + robot.height > p.y && robot.y + robot.height < p.y + p.height + robot.vy + 5) {
                    robot.y = p.y - robot.height;
                    robot.vy = 0;
                    robot.grounded = true;
                }
            }
        });

        // Boundaries
        robot.x = Math.max(0, Math.min(canvas.width - robot.width, robot.x));

        // Shield timer
        if (robot.shieldActive && robot.shieldTimer > 0) {
            robot.shieldTimer -= dt;
            if (robot.shieldTimer <= 0) {
                robot.shieldActive = false;
            }
        }

        // Shooting
        if (keys['x'] || keys['Enter']) {
            if (g.time - robot.lastFire > robot.fireRate) {
                g.bullets.push({
                    x: robot.x + robot.width / 2 + robot.facing * 20,
                    y: robot.y + robot.height / 2 - 5,
                    vx: robot.bulletSpeed * robot.facing,
                    vy: 0,
                    power: robot.bulletPower
                });
                robot.lastFire = g.time;
            }
        }

        // Update bullets
        g.bullets = g.bullets.filter(b => {
            b.x += b.vx;
            b.y += b.vy;
            return b.x > -20 && b.x < canvas.width + 20 && b.y > -20 && b.y < canvas.height + 20;
        });

        // Enemy spawning
        g.spawnTimer += dt;
        if (g.spawnTimer > g.spawnRate) {
            spawnEnemy();
            g.spawnTimer = 0;
            g.spawnRate = Math.max(800, g.spawnRate - 20); // Increase difficulty
        }

        // Update enemies
        g.enemies = g.enemies.filter(e => {
            // Movement based on type
            if (e.type === 'walker') {
                e.x += e.vx;
                if (e.x < 50 || e.x > canvas.width - 50) e.vx *= -1;
            } else if (e.type === 'flyer') {
                e.x += e.vx;
                e.y += Math.sin(g.time / 300) * 2;
                if (e.x < 50 || e.x > canvas.width - 50) e.vx *= -1;
            } else if (e.type === 'turret') {
                e.shootTimer += dt;
                if (e.shootTimer > 1500) {
                    const angle = Math.atan2(robot.y - e.y, robot.x - e.x);
                    g.bullets.push({
                        x: e.x + e.width / 2,
                        y: e.y + e.height / 2,
                        vx: Math.cos(angle) * 5,
                        vy: Math.sin(angle) * 5,
                        enemy: true
                    });
                    e.shootTimer = 0;
                }
            }

            // Bullet collision
            let hit = false;
            g.bullets = g.bullets.filter(b => {
                if (b.enemy) return true;
                if (b.x > e.x && b.x < e.x + e.width && b.y > e.y && b.y < e.y + e.height) {
                    e.health -= b.power;
                    hit = true;
                    return false;
                }
                return true;
            });

            if (e.health <= 0) {
                // Word explosion!
                spawnWord(e.x + e.width / 2, e.y, e.wordCategory);
                setScore(prev => prev + 100);

                // Chain reaction
                if (robot.chainReaction) {
                    const nearby = g.enemies.filter(other => 
                        other !== e && 
                        Math.hypot(other.x - e.x, other.y - e.y) < 150
                    );
                    nearby.forEach(n => n.health -= 1);
                }
                return false;
            }

            // Enemy hits robot
            if (!robot.shieldActive && 
                robot.x < e.x + e.width && robot.x + robot.width > e.x &&
                robot.y < e.y + e.height && robot.y + robot.height > e.y) {
                setLives(prev => {
                    if (prev <= 1) {
                        setGameStatus('gameover');
                        return 0;
                    }
                    return prev - 1;
                });
                robot.x = 100;
                robot.y = canvas.height - 100;
                return false;
            }

            return e.x > -50 && e.x < canvas.width + 50;
        });

        // Check enemy bullets hitting robot
        if (!robot.shieldActive) {
            g.bullets = g.bullets.filter(b => {
                if (b.enemy && 
                    b.x > robot.x && b.x < robot.x + robot.width &&
                    b.y > robot.y && b.y < robot.y + robot.height) {
                    setLives(prev => {
                        if (prev <= 1) {
                            setGameStatus('gameover');
                            return 0;
                        }
                        return prev - 1;
                    });
                    return false;
                }
                return true;
            });
        }

        // Update words
        g.words = g.words.filter(w => {
            w.x += w.vx;
            w.y += w.vy;
            w.vy += 0.15;
            w.vx *= 0.98;
            w.lifetime -= dt;

            // Bounce on ground
            if (w.y > canvas.height - 40) {
                w.y = canvas.height - 40;
                w.vy *= -0.5;
            }

            // Collection
            if (!w.collected && 
                robot.x < w.x + 50 && robot.x + robot.width > w.x - 20 &&
                robot.y < w.y + 20 && robot.y + robot.height > w.y - 20) {
                w.collected = true;
                setCollectedWords(prev => {
                    const newWords = [...prev, w.text];
                    checkAbilities(newWords);
                    return newWords;
                });
                setScore(prev => prev + 50);
                return false;
            }

            return w.lifetime > 0;
        });

        // Update particles
        g.particles = g.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life -= 0.02;
            return p.life > 0;
        });

        // Victory condition
        if (score >= 2000 * level) {
            if (level >= 3) {
                setGameStatus('victory');
            } else {
                setLevel(prev => prev + 1);
                g.spawnRate = 2000 - level * 300;
            }
        }

        // RENDER
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Background grid
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Platforms
        g.platforms.forEach(p => {
            const gradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
            gradient.addColorStop(0, '#4F46E5');
            gradient.addColorStop(1, '#3730A3');
            ctx.fillStyle = gradient;
            ctx.fillRect(p.x, p.y, p.width, p.height);
            ctx.strokeStyle = '#818CF8';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.width, p.height);
        });

        // Particles
        g.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Words floating
        g.words.forEach(w => {
            ctx.save();
            ctx.globalAlpha = Math.min(1, w.lifetime / 2000);
            ctx.font = 'bold 18px monospace';
            ctx.fillStyle = ABILITIES[w.category].color;
            ctx.shadowColor = ABILITIES[w.category].color;
            ctx.shadowBlur = 10;
            ctx.fillText(w.text, w.x - ctx.measureText(w.text).width / 2, w.y);
            ctx.restore();
        });

        // Enemies
        g.enemies.forEach(e => {
            ctx.save();
            
            // Show weakness if insight active
            if (robot.insightActive) {
                ctx.fillStyle = ABILITIES[e.wordCategory].color;
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(e.x + e.width/2, e.y + e.height/2, 35, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // Enemy body
            if (e.type === 'walker') {
                ctx.fillStyle = '#DC2626';
                ctx.fillRect(e.x, e.y, e.width, e.height);
                // Eyes
                ctx.fillStyle = '#FEF2F2';
                ctx.fillRect(e.x + 5, e.y + 10, 8, 8);
                ctx.fillRect(e.x + e.width - 13, e.y + 10, 8, 8);
                // Legs
                ctx.fillStyle = '#991B1B';
                ctx.fillRect(e.x + 5, e.y + e.height, 8, 10);
                ctx.fillRect(e.x + e.width - 13, e.y + e.height, 8, 10);
            } else if (e.type === 'flyer') {
                ctx.fillStyle = '#7C3AED';
                ctx.beginPath();
                ctx.moveTo(e.x + e.width/2, e.y);
                ctx.lineTo(e.x + e.width, e.y + e.height);
                ctx.lineTo(e.x, e.y + e.height);
                ctx.closePath();
                ctx.fill();
                // Wings
                ctx.fillStyle = '#A78BFA';
                ctx.fillRect(e.x - 10, e.y + 15, 15, 5);
                ctx.fillRect(e.x + e.width - 5, e.y + 15, 15, 5);
            } else if (e.type === 'turret') {
                ctx.fillStyle = '#F59E0B';
                ctx.fillRect(e.x, e.y + 10, e.width, e.height - 10);
                // Cannon
                const angle = Math.atan2(robot.y - e.y, robot.x - e.x);
                ctx.save();
                ctx.translate(e.x + e.width/2, e.y + e.height/2);
                ctx.rotate(angle);
                ctx.fillStyle = '#D97706';
                ctx.fillRect(0, -4, 25, 8);
                ctx.restore();
            }

            // Health bar
            if (e.health < e.maxHealth) {
                ctx.fillStyle = '#1F2937';
                ctx.fillRect(e.x, e.y - 10, e.width, 5);
                ctx.fillStyle = '#10B981';
                ctx.fillRect(e.x, e.y - 10, e.width * (e.health / e.maxHealth), 5);
            }

            ctx.restore();
        });

        // Bullets
        g.bullets.forEach(b => {
            if (b.enemy) {
                ctx.fillStyle = '#F59E0B';
                ctx.beginPath();
                ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = b.power > 1 ? '#EF4444' : '#3B82F6';
                ctx.shadowColor = b.power > 1 ? '#EF4444' : '#3B82F6';
                ctx.shadowBlur = 10;
                ctx.fillRect(b.x - 8, b.y - 2, 16, 4);
                ctx.shadowBlur = 0;
            }
        });

        // Robot
        ctx.save();
        
        // Shield effect
        if (robot.shieldActive) {
            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.5 + Math.sin(g.time / 100) * 0.3;
            ctx.beginPath();
            ctx.arc(robot.x + robot.width/2, robot.y + robot.height/2, 35, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Body
        ctx.fillStyle = '#6366F1';
        ctx.fillRect(robot.x + 5, robot.y + 10, robot.width - 10, robot.height - 15);
        
        // Head
        ctx.fillStyle = '#818CF8';
        ctx.fillRect(robot.x + 8, robot.y, robot.width - 16, 15);
        
        // Eyes
        ctx.fillStyle = '#FEF9C3';
        const eyeX = robot.facing > 0 ? robot.x + 20 : robot.x + 10;
        ctx.fillRect(eyeX, robot.y + 3, 10, 8);
        
        // Arms
        ctx.fillStyle = '#4F46E5';
        if (robot.facing > 0) {
            ctx.fillRect(robot.x + robot.width - 5, robot.y + 15, 12, 6);
        } else {
            ctx.fillRect(robot.x - 7, robot.y + 15, 12, 6);
        }
        
        // Legs
        ctx.fillStyle = '#3730A3';
        ctx.fillRect(robot.x + 8, robot.y + robot.height - 5, 10, 10);
        ctx.fillRect(robot.x + robot.width - 18, robot.y + robot.height - 5, 10, 10);

        // Speed effect
        if (robot.speedMultiplier > 1) {
            ctx.strokeStyle = '#3B82F6';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.5;
            for (let i = 1; i <= 3; i++) {
                ctx.beginPath();
                ctx.moveTo(robot.x - i * 8 * robot.facing, robot.y + 15);
                ctx.lineTo(robot.x - i * 8 * robot.facing, robot.y + robot.height - 10);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        ctx.restore();

        // Story overlay
        if (showStory) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, canvas.height/2 - 40, canvas.width, 80);
            ctx.font = 'italic 18px serif';
            ctx.fillStyle = '#F59E0B';
            ctx.textAlign = 'center';
            ctx.fillText(STORY_FRAGMENTS[storyIndex], canvas.width/2, canvas.height/2 + 5);
            ctx.textAlign = 'left';
        }

        requestAnimationFrame(gameLoop);
    }, [gameStatus, spawnEnemy, spawnWord, checkAbilities, score, level, showStory, storyIndex, activeAbilities]);

    useEffect(() => {
        if (gameStatus === 'playing') {
            initGame();
            gameLoop();
        }
    }, [gameStatus, initGame, gameLoop]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            keysRef.current[e.key] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        };
        const handleKeyUp = (e) => {
            keysRef.current[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <Button onClick={onBack} variant="ghost" className="text-white hover:bg-slate-800">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Games
                    </Button>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Gamepad2 className="w-6 h-6 text-indigo-400" />
                        ROBOTEXT
                    </h1>
                </div>

                {gameStatus === 'menu' && (
                    <div className="bg-slate-800 rounded-2xl p-8 text-center">
                        <div className="w-24 h-24 bg-indigo-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                            <Gamepad2 className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">ROBOTEXT</h2>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">
                            Control your robot, defeat enemies, and collect words to unlock abilities. 
                            Combat generates meaning—build sentences to reveal the story.
                        </p>
                        <div className="text-sm text-slate-500 mb-6 space-y-1">
                            <p>← → or A/D to move</p>
                            <p>↑ or W or SPACE to jump</p>
                            <p>X or ENTER to shoot</p>
                        </div>
                        <Button onClick={() => setGameStatus('playing')} className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3">
                            Start Game
                        </Button>
                    </div>
                )}

                {gameStatus === 'playing' && (
                    <>
                        {/* Game Stats */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-slate-800/50 rounded-xl p-3">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    {[...Array(3)].map((_, i) => (
                                        <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} />
                                    ))}
                                </div>
                                <div className="text-white font-bold">
                                    <Trophy className="w-4 h-4 inline mr-1 text-yellow-500" />
                                    {score}
                                </div>
                                <div className="text-indigo-400 text-sm">Level {level}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-400 text-sm">{collectedWords.length} words</span>
                            </div>
                        </div>

                        {/* Abilities */}
                        {Object.keys(activeAbilities).length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {Object.entries(activeAbilities).map(([key, active]) => active && (
                                    <div key={key} className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                                        style={{ backgroundColor: ABILITIES[key].color + '30', color: ABILITIES[key].color }}>
                                        <Zap className="w-3 h-3" />
                                        {ABILITIES[key].name}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Game Canvas */}
                        <canvas 
                            ref={canvasRef} 
                            width={800} 
                            height={400} 
                            className="w-full bg-slate-950 rounded-xl border border-slate-700"
                        />

                        {/* Collected Words */}
                        {collectedWords.length > 0 && (
                            <div className="mt-4 bg-slate-800/50 rounded-xl p-3">
                                <p className="text-slate-400 text-xs mb-2">Collected Words:</p>
                                <div className="flex flex-wrap gap-2">
                                    {collectedWords.slice(-15).map((word, i) => {
                                        const cat = Object.entries(WORD_CATEGORIES).find(([_, arr]) => arr.includes(word))?.[0];
                                        return (
                                            <span key={i} className="px-2 py-1 rounded text-xs font-medium"
                                                style={{ backgroundColor: ABILITIES[cat]?.color + '20', color: ABILITIES[cat]?.color }}>
                                                {word}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {gameStatus === 'gameover' && (
                    <div className="bg-slate-800 rounded-2xl p-8 text-center">
                        <h2 className="text-3xl font-bold text-red-500 mb-4">GAME OVER</h2>
                        <p className="text-slate-400 mb-2">Final Score: <span className="text-white font-bold">{score}</span></p>
                        <p className="text-slate-400 mb-6">Words Collected: <span className="text-indigo-400 font-bold">{collectedWords.length}</span></p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => setGameStatus('playing')} className="bg-indigo-600 hover:bg-indigo-700">
                                Play Again
                            </Button>
                            <Button onClick={onBack} variant="outline" className="border-slate-600 text-slate-300">
                                Back to Games
                            </Button>
                        </div>
                    </div>
                )}

                {gameStatus === 'victory' && (
                    <div className="bg-slate-800 rounded-2xl p-8 text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-3xl font-bold text-green-500 mb-4">VICTORY!</h2>
                        <p className="text-slate-400 mb-2">Final Score: <span className="text-white font-bold">{score}</span></p>
                        <p className="text-slate-400 mb-4">Words Collected: <span className="text-indigo-400 font-bold">{collectedWords.length}</span></p>
                        <p className="text-yellow-400 italic mb-6">"{STORY_FRAGMENTS[STORY_FRAGMENTS.length - 1]}"</p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => { setLevel(1); setGameStatus('playing'); }} className="bg-indigo-600 hover:bg-indigo-700">
                                Play Again
                            </Button>
                            <Button onClick={onBack} variant="outline" className="border-slate-600 text-slate-300">
                                Back to Games
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}