import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { X, Loader2, Award, Trophy, Target, Sparkles, Play, Search, Rocket, Crosshair, Zap } from 'lucide-react';

export default function SpaceBattleGame({ onExit }) {
    const [screen, setScreen] = useState('menu');
    const [activeCategory, setActiveCategory] = useState('trending');
    const [generatedTopics, setGeneratedTopics] = useState({});
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [gameScore, setGameScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [awards, setAwards] = useState([]);
    const canvasRef = useRef(null);
    const gameStateRef = useRef(null);

    const TABS = [
        { id: 'trending', label: 'Trending', color: 'from-cyan-600 to-cyan-700' },
        { id: 'programming', label: 'Programming', color: 'from-blue-600 to-blue-700' },
        { id: 'science', label: 'Science', color: 'from-green-600 to-green-700' },
        { id: 'business', label: 'Business', color: 'from-amber-600 to-amber-700' },
    ];

    useEffect(() => {
        generateAllTopics();
    }, []);

    const generateAllTopics = async () => {
        setLoadingTopics(true);
        const allTopics = {};
        
        const prompts = {
            trending: 'Generate 6 trending tech and knowledge topics people should learn about right now. Include AI, cybersecurity, space, and emerging technologies.',
            programming: 'Generate 6 programming and software development topics including languages, frameworks, algorithms, and development practices.',
            science: 'Generate 6 science topics across physics, chemistry, biology, astronomy, and earth sciences.',
            business: 'Generate 6 business and entrepreneurship topics including finance, marketing, strategy, and leadership.'
        };

        for (const tab of TABS) {
            try {
                const result = await base44.integrations.Core.InvokeLLM({
                    prompt: `${prompts[tab.id]} Return as JSON: { "topics": [{ "id": "topic-id", "label": "Topic Name", "description": "Brief compelling description" }] }`,
                    add_context_from_internet: tab.id === 'trending',
                    response_json_schema: {
                        type: "object",
                        properties: {
                            topics: { 
                                type: "array", 
                                items: { 
                                    type: "object", 
                                    properties: { 
                                        id: { type: "string" }, 
                                        label: { type: "string" }, 
                                        description: { type: "string" } 
                                    } 
                                } 
                            }
                        }
                    }
                });
                allTopics[tab.id] = result?.topics || [];
            } catch (error) {
                console.error(`Failed to generate ${tab.id} topics:`, error);
                allTopics[tab.id] = [];
            }
        }
        
        setGeneratedTopics(allTopics);
        setLoadingTopics(false);
    };

    const startGame = async (topic) => {
        if (topic === 'custom') {
            if (!searchQuery.trim()) return;
            setSelectedTopic({ label: searchQuery, description: 'Custom topic' });
        } else {
            setSelectedTopic(topic);
        }
        
        setLoading(true);
        setScreen('loading');
        
        try {
            const topicLabel = topic === 'custom' ? searchQuery : topic.label;
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 10 educational Yes/No questions for: "${topicLabel}". Each should test real knowledge. Return: { "questions": [{ "question": "Is X true?", "answer": true, "explanation": "Brief explanation" }] }`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        questions: { type: "array", items: { type: "object", properties: { question: { type: "string" }, answer: { type: "boolean" }, explanation: { type: "string" } } } }
                    }
                }
            });
            setQuestions(result.questions || []);
            setGameScore(0);
            setScore(0);
            setCurrentQuestion(0);
            setAwards([]);
            setScreen('game');
        } catch (error) {
            console.error('Failed to generate questions:', error);
            setScreen('menu');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (screen !== 'game' || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const state = {
            player: { x: canvas.width / 2, y: canvas.height - 60, width: 50, height: 50, health: 3 },
            bullets: [],
            enemies: [],
            particles: [],
            stars: [],
            score: 0,
            gameOver: false,
            enemySpawnTimer: 100,
        };
        gameStateRef.current = state;

        // Initialize stars
        for (let i = 0; i < 200; i++) {
            state.stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }

        const keys = {};
        const handleKeyDown = (e) => {
            keys[e.key.toLowerCase()] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                state.bullets.push({ x: state.player.x, y: state.player.y, width: 5, height: 15, speed: 10 });
            }
        };
        const handleKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const gameLoop = () => {
            if (state.gameOver) {
                setGameScore(state.score);
                setScreen('quiz');
                return;
            }
            
            ctx.fillStyle = '#0a0f1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw stars
            state.stars.forEach(s => {
                s.y += s.speed;
                if (s.y > canvas.height) { s.y = -5; s.x = Math.random() * canvas.width; }
                ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Player movement
            const moveSpeed = 8;
            if (keys.arrowleft || keys.a) state.player.x -= moveSpeed;
            if (keys.arrowright || keys.d) state.player.x += moveSpeed;
            state.player.x = Math.max(30, Math.min(canvas.width - 30, state.player.x));

            // Draw player
            ctx.save();
            ctx.translate(state.player.x, state.player.y);
            ctx.fillStyle = '#06b6d4';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#06b6d4';
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(-20, 15);
            ctx.lineTo(0, 5);
            ctx.lineTo(20, 15);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.arc(0, -5, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
            
            // Bullets
            state.bullets = state.bullets.filter(bullet => {
                bullet.y -= bullet.speed;
                const gradient = ctx.createLinearGradient(bullet.x, bullet.y, bullet.x, bullet.y + bullet.height);
                gradient.addColorStop(0, '#22d3ee');
                gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
                ctx.fillStyle = gradient;
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#06b6d4';
                ctx.fillRect(bullet.x - bullet.width/2, bullet.y, bullet.width, bullet.height);
                ctx.shadowBlur = 0;
                return bullet.y > 0;
            });

            // Enemies
            state.enemySpawnTimer--;
            if (state.enemySpawnTimer <= 0) {
                state.enemies.push({
                    x: Math.random() * (canvas.width - 60) + 30,
                    y: -30,
                    width: 40,
                    height: 40,
                    speed: 1 + Math.random() * 2,
                });
                state.enemySpawnTimer = Math.max(20, 100 - state.score / 100);
            }

            state.enemies = state.enemies.filter((enemy, eIndex) => {
                enemy.y += enemy.speed;
                
                // Draw enemy
                ctx.save();
                ctx.translate(enemy.x, enemy.y);
                ctx.fillStyle = '#ef4444';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ef4444';
                ctx.beginPath();
                ctx.moveTo(0, 20);
                ctx.lineTo(-18, -15);
                ctx.lineTo(18, -15);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.restore();
                
                if (enemy.y > canvas.height) {
                    state.player.health--;
                    if (state.player.health <= 0) state.gameOver = true;
                    return false;
                }

                // Collision detection
                for (let i = state.bullets.length - 1; i >= 0; i--) {
                    const b = state.bullets[i];
                    if (Math.abs(b.x - enemy.x) < 25 && Math.abs(b.y - enemy.y) < 25) {
                        // Explosion particles
                        for (let j = 0; j < 20; j++) {
                            state.particles.push({
                                x: enemy.x, y: enemy.y,
                                vx: (Math.random() - 0.5) * 8,
                                vy: (Math.random() - 0.5) * 8,
                                life: 30, maxLife: 30
                            });
                        }
                        state.bullets.splice(i, 1);
                        state.score += 100;
                        return false;
                    }
                }
                return true;
            });

            // Particles
            state.particles = state.particles.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                ctx.fillStyle = `rgba(255, 180, 80, ${p.life / p.maxLife})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
                return p.life > 0;
            });
            
            // UI
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Inter';
            ctx.textAlign = 'left';
            ctx.fillText(`SCORE: ${state.score}`, 30, 40);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ef4444';
            for (let i = 0; i < state.player.health; i++) {
                ctx.fillText('❤️', canvas.width - 30 - i * 40, 40);
            }

            animationId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationId);
        };
    }, [screen]);

    const handleAnswer = (answer) => {
        const correct = questions[currentQuestion]?.answer === answer;
        if (correct) {
            setScore(s => s + 1);
            if (score + 1 === 3) setAwards(a => [...a, 'bronze']);
            if (score + 1 === 7) setAwards(a => [...a, 'silver']);
            if (score + 1 === 10) setAwards(a => [...a, 'gold']);
        }
        
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(c => c + 1);
        } else {
            setScreen('results');
        }
    };

    const filteredTopics = (topics) => {
        if (!searchQuery.trim()) return topics;
        return topics.filter(t => 
            t.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };
    
    if (screen === 'loading') {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#0a0f1a] z-[9999]">
                <div className="text-center">
                    <Loader2 className="w-20 h-20 animate-spin mx-auto mb-6 text-cyan-400" />
                    <h2 className="text-3xl font-bold mb-2 text-white">Initializing Battle Zone...</h2>
                    <p className="text-lg text-gray-400">AI is generating your mission</p>
                </div>
            </div>
        );
    }
    
    if (screen === 'quiz') {
        const q = questions[currentQuestion];
        return (
            <div className="fixed inset-0 bg-[#0a0f1a] z-[9999] flex items-center justify-center p-4">
                <Card className="p-6 bg-[#0d1a2d]/95 border border-cyan-500/30 backdrop-blur w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-cyan-400 font-bold">Bonus Round</span>
                        <span className="text-gray-400">Question {currentQuestion + 1}/{questions.length}</span>
                    </div>
                    <h3 className="text-xl text-white mb-6 text-center">{q?.question}</h3>
                    <div className="flex gap-4">
                        <Button onClick={() => handleAnswer(false)} className="flex-1 h-14 text-lg border-2 border-red-500/50 bg-transparent hover:bg-red-500/20 text-red-400">No</Button>
                        <Button onClick={() => handleAnswer(true)} className="flex-1 h-14 text-lg border-2 border-green-500/50 bg-transparent hover:bg-green-500/20 text-green-400">Yes</Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (screen === 'results') {
        const totalScore = gameScore + (score * 50);
        return (
            <div className="fixed inset-0 bg-[#0a0f1a] z-[9999] flex items-center justify-center">
                <Card className="p-10 bg-[#0d1a2d] border-cyan-500/50 text-center max-w-lg">
                    <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
                    <h2 className="text-4xl font-bold text-white mb-4">Mission Complete!</h2>
                    <p className="text-xl text-gray-400">Combat Score: {gameScore}</p>
                    <p className="text-xl text-gray-400">Knowledge Score: {score}/{questions.length}</p>
                    <p className="text-2xl text-cyan-400 mb-6">Total Score: {totalScore}</p>
                    <div className="flex justify-center gap-4 mb-8">
                        {awards.includes('gold') && <Award className="w-12 h-12 text-yellow-400" />}
                        {awards.includes('silver') && <Award className="w-12 h-12 text-gray-300" />}
                        {awards.includes('bronze') && <Award className="w-12 h-12 text-amber-600" />}
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={() => setScreen('menu')} className="flex-1 bg-gray-700 hover:bg-gray-600">New Mission</Button>
                        <Button onClick={onExit} className="flex-1 bg-cyan-600 hover:bg-cyan-700">Exit</Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (screen === 'game') {
        return (
            <div className="fixed inset-0 bg-[#0a0f1a] z-[9999]">
                <canvas ref={canvasRef} className="absolute inset-0" />
                <Button onClick={onExit} className="absolute top-4 right-4 bg-red-600/80 hover:bg-red-700">
                    <X className="w-4 h-4 mr-1" /> Exit
                </Button>
            </div>
        );
    }

    // Menu screen - matching WordShooter design
    return (
        <div className="fixed inset-0 bg-gray-50 z-[9999] overflow-auto p-8">
            <Button onClick={onExit} className="absolute top-4 right-4 bg-red-600 hover:bg-red-700">
                <X className="w-4 h-4" />
            </Button>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <div className="text-6xl mb-6">🎯</div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4">
                        SPACE BATTLE
                    </h1>
                    <p className="text-xl text-cyan-600">Combat & Knowledge Challenge</p>
                </div>

                <Card className="p-6 mb-8 bg-white border-cyan-200 border-2 shadow-sm">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input placeholder="Search topics or enter custom..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter' && searchQuery.trim()) startGame('custom'); }}
                                className="pl-12 h-14 text-lg bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" />
                        </div>
                        <Button onClick={() => searchQuery.trim() && startGame('custom')} disabled={!searchQuery.trim() || loading}
                            className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                            <Play className="w-5 h-5 mr-2" /> Start Game
                        </Button>
                    </div>
                </Card>

                <Card className="p-6 mb-8 bg-white border-gray-200 shadow-sm">
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {TABS.map(tab => (
                            <Button key={tab.id} onClick={() => setActiveCategory(tab.id)}
                                className={`px-5 py-2 ${activeCategory === tab.id ? `bg-gradient-to-r ${tab.color}` : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} ${activeCategory === tab.id ? 'text-white' : ''}`}>
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    {loadingTopics ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-500" />
                            <p className="text-gray-500">Generating topics with AI...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredTopics(generatedTopics[activeCategory] || []).map((topic, i) => {
                                const tabInfo = TABS.find(t => t.id === activeCategory);
                                return (
                                    <Button key={topic.id || i} onClick={() => startGame(topic)} 
                                        className={`h-28 text-left justify-start p-5 bg-gradient-to-r ${tabInfo?.color || 'from-cyan-600 to-cyan-700'} hover:opacity-90 text-white`}>
                                        <div className="w-full">
                                            <div className="text-lg font-bold mb-1 line-clamp-1">{topic.label}</div>
                                            <div className="text-xs opacity-80 line-clamp-2">{topic.description}</div>
                                        </div>
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </Card>

                <div className="grid grid-cols-3 gap-6">
                    {[
                        { icon: Crosshair, title: 'Destroy Targets', desc: 'Shoot down enemy ships to earn combat points', color: 'from-cyan-500 to-cyan-600' },
                        { icon: Sparkles, title: 'Knowledge Quiz', desc: 'Answer questions after battle to boost your score', color: 'from-yellow-500 to-yellow-600' },
                        { icon: Trophy, title: 'Achieve Highscore', desc: 'Combine combat and knowledge for the top rank', color: 'from-amber-500 to-amber-600' }
                    ].map((item, i) => (
                        <Card key={i} className="p-6 text-center bg-white border-gray-200 shadow-sm">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r ${item.color}`}>
                                <item.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}