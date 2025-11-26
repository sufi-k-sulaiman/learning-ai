import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Rocket, Target, Zap, Trophy, Star, Play, Pause, RotateCcw, 
    Volume2, VolumeX, ChevronRight, Lock, Check, Gamepad2, 
    Flame, Award, Clock, Heart, Shield, Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PageLayout from '../components/PageLayout';

// Game levels with word sets
const GAME_LEVELS = [
    { id: 1, name: 'Basics', difficulty: 'Easy', color: '#10B981', words: [
        { word: 'Algorithm', definition: 'A step-by-step procedure for solving a problem' },
        { word: 'Variable', definition: 'A container that holds data values' },
        { word: 'Function', definition: 'A reusable block of code that performs a task' },
        { word: 'Loop', definition: 'Code that repeats until a condition is met' },
        { word: 'Array', definition: 'An ordered collection of elements' },
    ], requiredScore: 0, timeLimit: 60 },
    { id: 2, name: 'Web Basics', difficulty: 'Easy', color: '#3B82F6', words: [
        { word: 'HTML', definition: 'Markup language for creating web pages' },
        { word: 'CSS', definition: 'Stylesheet language for designing web pages' },
        { word: 'JavaScript', definition: 'Programming language for web interactivity' },
        { word: 'DOM', definition: 'Document Object Model for web page structure' },
        { word: 'API', definition: 'Interface for software applications to communicate' },
    ], requiredScore: 100, timeLimit: 55 },
    { id: 3, name: 'Data Types', difficulty: 'Medium', color: '#8B5CF6', words: [
        { word: 'String', definition: 'A sequence of characters' },
        { word: 'Integer', definition: 'A whole number without decimals' },
        { word: 'Boolean', definition: 'A true or false value' },
        { word: 'Object', definition: 'A collection of key-value pairs' },
        { word: 'Null', definition: 'Represents intentional absence of value' },
    ], requiredScore: 200, timeLimit: 50 },
    { id: 4, name: 'Advanced JS', difficulty: 'Medium', color: '#F59E0B', words: [
        { word: 'Promise', definition: 'Object representing eventual completion of async operation' },
        { word: 'Callback', definition: 'Function passed as argument to another function' },
        { word: 'Closure', definition: 'Function with access to outer scope variables' },
        { word: 'Prototype', definition: 'Object from which other objects inherit properties' },
        { word: 'Hoisting', definition: 'Moving declarations to the top of scope' },
    ], requiredScore: 350, timeLimit: 45 },
    { id: 5, name: 'React Basics', difficulty: 'Medium', color: '#06B6D4', words: [
        { word: 'Component', definition: 'Reusable piece of UI in React' },
        { word: 'Props', definition: 'Data passed from parent to child component' },
        { word: 'State', definition: 'Local data that can change over time' },
        { word: 'Hook', definition: 'Function to use React features in functional components' },
        { word: 'JSX', definition: 'JavaScript syntax extension for writing UI' },
    ], requiredScore: 500, timeLimit: 45 },
    { id: 6, name: 'Databases', difficulty: 'Hard', color: '#EC4899', words: [
        { word: 'Query', definition: 'Request for data from a database' },
        { word: 'Schema', definition: 'Structure that defines database organization' },
        { word: 'Index', definition: 'Data structure for faster database queries' },
        { word: 'Transaction', definition: 'Atomic unit of database operations' },
        { word: 'Normalization', definition: 'Organizing data to reduce redundancy' },
    ], requiredScore: 700, timeLimit: 40 },
    { id: 7, name: 'Security', difficulty: 'Hard', color: '#EF4444', words: [
        { word: 'Encryption', definition: 'Converting data into coded format' },
        { word: 'Authentication', definition: 'Verifying user identity' },
        { word: 'Authorization', definition: 'Granting access permissions' },
        { word: 'Firewall', definition: 'Network security system monitoring traffic' },
        { word: 'Vulnerability', definition: 'Weakness that can be exploited' },
    ], requiredScore: 900, timeLimit: 40 },
    { id: 8, name: 'Cloud Computing', difficulty: 'Hard', color: '#6366F1', words: [
        { word: 'Serverless', definition: 'Cloud execution without managing servers' },
        { word: 'Container', definition: 'Isolated environment for running applications' },
        { word: 'Microservices', definition: 'Architecture of small independent services' },
        { word: 'Kubernetes', definition: 'Container orchestration platform' },
        { word: 'Lambda', definition: 'AWS serverless compute service' },
    ], requiredScore: 1100, timeLimit: 35 },
    { id: 9, name: 'AI & ML', difficulty: 'Expert', color: '#A855F7', words: [
        { word: 'Neural Network', definition: 'Computing system inspired by biological brains' },
        { word: 'Deep Learning', definition: 'ML using multi-layered neural networks' },
        { word: 'Tensor', definition: 'Multi-dimensional array of numerical data' },
        { word: 'Gradient', definition: 'Direction of steepest increase of a function' },
        { word: 'Epoch', definition: 'One complete pass through training data' },
    ], requiredScore: 1350, timeLimit: 35 },
    { id: 10, name: 'Master Level', difficulty: 'Expert', color: '#F43F5E', words: [
        { word: 'Polymorphism', definition: 'Objects taking many forms in OOP' },
        { word: 'Idempotent', definition: 'Operation producing same result when repeated' },
        { word: 'Memoization', definition: 'Caching function results for optimization' },
        { word: 'Recursion', definition: 'Function calling itself to solve problems' },
        { word: 'Concurrency', definition: 'Executing multiple tasks simultaneously' },
    ], requiredScore: 1600, timeLimit: 30 },
];

function WordBubble({ word, position, onClick, isTarget }) {
    return (
        <div 
            onClick={onClick}
            className={`absolute cursor-crosshair select-none transition-all duration-100 ${isTarget ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}`}
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)'
            }}
        >
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg hover:scale-110 transition-transform ${isTarget ? 'animate-pulse' : ''}`}>
                {word}
            </div>
        </div>
    );
}

function GameCanvas({ level, onComplete, onBack }) {
    const canvasRef = useRef(null);
    const [words, setWords] = useState([]);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(level.timeLimit);
    const [isPaused, setIsPaused] = useState(false);
    const [currentDefinition, setCurrentDefinition] = useState(null);
    const [targetWord, setTargetWord] = useState(null);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [showDefinition, setShowDefinition] = useState(null);

    // Initialize words
    useEffect(() => {
        const initialWords = level.words.map((w, i) => ({
            ...w,
            id: i,
            position: {
                x: Math.random() * 600 + 100,
                y: Math.random() * 300 + 100
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            }
        }));
        setWords(initialWords);
        setTargetWord(initialWords[Math.floor(Math.random() * initialWords.length)]);
    }, [level]);

    // Game timer
    useEffect(() => {
        if (isPaused || gameOver) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameOver(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isPaused, gameOver]);

    // Word movement
    useEffect(() => {
        if (isPaused || gameOver) return;
        const moveInterval = setInterval(() => {
            setWords(prev => prev.map(w => {
                let newX = w.position.x + w.velocity.x;
                let newY = w.position.y + w.velocity.y;
                let newVelX = w.velocity.x;
                let newVelY = w.velocity.y;

                if (newX < 50 || newX > 750) newVelX *= -1;
                if (newY < 50 || newY > 350) newVelY *= -1;

                return {
                    ...w,
                    position: { x: Math.max(50, Math.min(750, newX)), y: Math.max(50, Math.min(350, newY)) },
                    velocity: { x: newVelX, y: newVelY }
                };
            }));
        }, 50);
        return () => clearInterval(moveInterval);
    }, [isPaused, gameOver]);

    const handleWordClick = (clickedWord) => {
        if (gameOver || isPaused) return;

        if (clickedWord.id === targetWord?.id) {
            // Correct hit
            const comboBonus = Math.min(combo, 5) * 10;
            const points = 50 + comboBonus;
            setScore(s => s + points);
            setCombo(c => c + 1);
            setMaxCombo(m => Math.max(m, combo + 1));
            setShowDefinition({ word: clickedWord.word, definition: clickedWord.definition, correct: true });
            
            setTimeout(() => setShowDefinition(null), 2000);

            // Remove word and set new target
            const remainingWords = words.filter(w => w.id !== clickedWord.id);
            if (remainingWords.length === 0) {
                setGameOver(true);
                onComplete(score + points, maxCombo);
            } else {
                setWords(remainingWords);
                setTargetWord(remainingWords[Math.floor(Math.random() * remainingWords.length)]);
            }
        } else {
            // Wrong hit
            setCombo(0);
            setLives(l => {
                if (l <= 1) {
                    setGameOver(true);
                    return 0;
                }
                return l - 1;
            });
            setShowDefinition({ word: clickedWord.word, definition: clickedWord.definition, correct: false });
            setTimeout(() => setShowDefinition(null), 2000);
        }
    };

    return (
        <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-2xl overflow-hidden">
            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-black/30">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold">{score}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <span className="font-bold">x{combo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(3)].map((_, i) => (
                            <Heart key={i} className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white">
                        <Clock className="w-5 h-5 text-cyan-400" />
                        <span className="font-bold">{timeLeft}s</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => setIsPaused(!isPaused)} className="text-white hover:bg-white/20">
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Target indicator */}
            {targetWord && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 bg-black/50 px-4 py-2 rounded-lg text-white text-center">
                    <p className="text-xs text-gray-400 mb-1">Find & shoot:</p>
                    <p className="font-bold text-lg text-yellow-400">{targetWord.definition}</p>
                </div>
            )}

            {/* Game area */}
            <div ref={canvasRef} className="absolute inset-0 pt-32">
                {words.map(word => (
                    <WordBubble 
                        key={word.id}
                        word={word.word}
                        position={word.position}
                        onClick={() => handleWordClick(word)}
                        isTarget={word.id === targetWord?.id}
                    />
                ))}
            </div>

            {/* Definition popup */}
            {showDefinition && (
                <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl ${showDefinition.correct ? 'bg-green-500' : 'bg-red-500'} text-white z-30 animate-bounce`}>
                    <p className="font-bold">{showDefinition.word}</p>
                    <p className="text-sm opacity-90">{showDefinition.definition}</p>
                </div>
            )}

            {/* Pause overlay */}
            {isPaused && !gameOver && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-40">
                    <div className="text-center text-white">
                        <Pause className="w-16 h-16 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-4">Paused</h2>
                        <Button onClick={() => setIsPaused(false)} className="bg-purple-600 hover:bg-purple-700">
                            <Play className="w-4 h-4 mr-2" /> Resume
                        </Button>
                    </div>
                </div>
            )}

            {/* Game over overlay */}
            {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
                    <div className="text-center text-white bg-gray-900/90 p-8 rounded-2xl">
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                        <h2 className="text-3xl font-bold mb-2">{words.length === 0 ? 'Level Complete!' : 'Game Over'}</h2>
                        <div className="space-y-2 mb-6">
                            <p className="text-xl">Score: <span className="text-yellow-400 font-bold">{score}</span></p>
                            <p className="text-lg">Max Combo: <span className="text-orange-400 font-bold">x{maxCombo}</span></p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button onClick={onBack} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                                Back to Levels
                            </Button>
                            <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
                                <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Games() {
    const [selectedGame, setSelectedGame] = useState('word-shooter');
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [totalScore, setTotalScore] = useState(() => {
        const saved = localStorage.getItem('wordShooterScore');
        return saved ? parseInt(saved) : 0;
    });
    const [completedLevels, setCompletedLevels] = useState(() => {
        const saved = localStorage.getItem('wordShooterLevels');
        return saved ? JSON.parse(saved) : [];
    });

    const handleLevelComplete = (score, maxCombo) => {
        const newTotal = totalScore + score;
        setTotalScore(newTotal);
        localStorage.setItem('wordShooterScore', newTotal.toString());
        
        if (!completedLevels.includes(selectedLevel.id)) {
            const newCompleted = [...completedLevels, selectedLevel.id];
            setCompletedLevels(newCompleted);
            localStorage.setItem('wordShooterLevels', JSON.stringify(newCompleted));
        }
    };

    const isLevelUnlocked = (level) => {
        return totalScore >= level.requiredScore;
    };

    return (
        <PageLayout activePage="Games" showSearch={false}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <Gamepad2 className="w-10 h-10 text-purple-400" />
                            <h1 className="text-4xl font-bold text-white">Game Arcade</h1>
                        </div>
                        <p className="text-gray-400">Learn while you play!</p>
                    </div>

                    {selectedLevel ? (
                        <GameCanvas 
                            level={selectedLevel} 
                            onComplete={handleLevelComplete}
                            onBack={() => setSelectedLevel(null)}
                        />
                    ) : (
                        <>
                            {/* Game Selection */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <Rocket className="w-8 h-8 text-purple-400" />
                                            Word Shooter
                                        </h2>
                                        <p className="text-gray-400 mt-1">Gamified Vocabulary Learning</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Total Score</p>
                                        <p className="text-3xl font-bold text-yellow-400">{totalScore}</p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Target className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                        <h3 className="text-white font-semibold">Shoot Words</h3>
                                        <p className="text-gray-400 text-sm">Click matching words to collect definitions</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                        <h3 className="text-white font-semibold">Combo System</h3>
                                        <p className="text-gray-400 text-sm">Chain hits to multiply your score</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                        <h3 className="text-white font-semibold">10 Levels</h3>
                                        <p className="text-gray-400 text-sm">From basics to expert difficulty</p>
                                    </div>
                                </div>
                            </div>

                            {/* Level Selection */}
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400" /> Select Level
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {GAME_LEVELS.map((level) => {
                                    const unlocked = isLevelUnlocked(level);
                                    const completed = completedLevels.includes(level.id);
                                    
                                    return (
                                        <div 
                                            key={level.id}
                                            onClick={() => unlocked && setSelectedLevel(level)}
                                            className={`relative rounded-xl p-4 transition-all cursor-pointer ${
                                                unlocked 
                                                    ? 'bg-white/10 hover:bg-white/20 hover:scale-105' 
                                                    : 'bg-gray-800/50 opacity-60 cursor-not-allowed'
                                            }`}
                                        >
                                            {completed && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-2xl font-bold text-white">{level.id}</span>
                                                {!unlocked && <Lock className="w-5 h-5 text-gray-500" />}
                                            </div>
                                            <h4 className="text-white font-semibold">{level.name}</h4>
                                            <span className="inline-block px-2 py-0.5 rounded text-xs mt-1" style={{ backgroundColor: level.color + '30', color: level.color }}>
                                                {level.difficulty}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-2">{level.words.length} words • {level.timeLimit}s</p>
                                            {!unlocked && (
                                                <p className="text-xs text-yellow-400 mt-1">Need {level.requiredScore} pts</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Progress */}
                            <div className="mt-8 bg-white/10 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400 text-sm">Overall Progress</span>
                                    <span className="text-white font-semibold">{completedLevels.length}/{GAME_LEVELS.length} Levels</span>
                                </div>
                                <Progress value={(completedLevels.length / GAME_LEVELS.length) * 100} className="h-2" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}