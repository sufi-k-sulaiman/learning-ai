import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Play, X, Loader2, Search, Sparkles, Globe, Cpu, Atom, Leaf, Brain, Lightbulb, TrendingUp, Target,
    Maximize2, Minimize2, RotateCcw
} from 'lucide-react';
import { LOGO_URL } from '@/components/NavigationConfig';

const TABS = [
    { id: 'trending', label: 'Trending', color: 'from-purple-600 to-purple-700' },
    { id: 'education', label: 'Education', color: 'from-blue-600 to-blue-700' },
    { id: 'science', label: 'Science', color: 'from-green-600 to-green-700' },
    { id: 'technology', label: 'Technology', color: 'from-cyan-600 to-cyan-700' },
    { id: 'language', label: 'Language', color: 'from-orange-600 to-orange-700' },
    { id: 'history', label: 'History', color: 'from-amber-600 to-amber-700' },
];

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Vibrant jungle-style colors
const PIECES = [
    { shape: [[1,1,1,1]], color: '#00bcd4', glow: '#4dd0e1', name: 'I' },  // Cyan
    { shape: [[1,1],[1,1]], color: '#ffeb3b', glow: '#fff176', name: 'O' },  // Yellow
    { shape: [[0,1,0],[1,1,1]], color: '#e91e63', glow: '#f06292', name: 'T' },  // Pink
    { shape: [[0,1,1],[1,1,0]], color: '#4caf50', glow: '#81c784', name: 'S' },  // Green
    { shape: [[1,1,0],[0,1,1]], color: '#f44336', glow: '#e57373', name: 'Z' },  // Red
    { shape: [[1,0,0],[1,1,1]], color: '#2196f3', glow: '#64b5f6', name: 'J' },  // Blue
    { shape: [[0,0,1],[1,1,1]], color: '#ff9800', glow: '#ffb74d', name: 'L' }   // Orange
];

export default function TetrisGalaxy({ onExit }) {
    const canvasRef = useRef(null);
    const gameRef = useRef(null);
    const keysRef = useRef({});
    
    const [screen, setScreen] = useState('title');
    const [loading, setLoading] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [activeTab, setActiveTab] = useState('trending');
    const [searchQuery, setSearchQuery] = useState('');
    const [generatedTopics, setGeneratedTopics] = useState({});
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [wordData, setWordData] = useState([]);
    
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [clearedWords, setClearedWords] = useState([]);
    const [showDefinition, setShowDefinition] = useState(null);

    // Load topics for tab
    useEffect(() => {
        loadTabTopics('trending');
    }, []);

    const loadTabTopics = async (tabId) => {
        if (generatedTopics[tabId]?.length) return;
        setLoadingTopics(true);
        try {
            const prompts = {
                trending: 'Generate 9 trending vocabulary topics. Include technology, current events, pop culture.',
                education: 'Generate 9 educational vocabulary topics across math, literature, grammar.',
                science: 'Generate 9 science vocabulary topics including biology, chemistry, physics.',
                technology: 'Generate 9 technology vocabulary topics including programming, AI, hardware.',
                language: 'Generate 9 language learning vocabulary topics including SAT words, idioms, foreign phrases.',
                history: 'Generate 9 history vocabulary topics including ancient civilizations, world wars, famous figures.'
            };

            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `${prompts[tabId]} Return as JSON: { "topics": [{ "id": "topic-id", "label": "Topic Name", "description": "Brief description" }] }`,
                add_context_from_internet: tabId === 'trending',
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
            setGeneratedTopics(prev => ({ ...prev, [tabId]: result?.topics || [] }));
        } catch (error) {
            console.error('Failed to load topics:', error);
        } finally {
            setLoadingTopics(false);
        }
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        loadTabTopics(tabId);
    };

    const generateWordData = async (topic) => {
        setCurrentTopic(topic);
        setLoading(true);
        setScreen('loading');
        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate vocabulary data for: "${topic}". Return 30 terms with short definitions (max 8 words each). Format: { "words": [{ "word": "term", "definition": "short definition" }] }`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        words: { type: "array", items: { type: "object", properties: { word: { type: "string" }, definition: { type: "string" } } } }
                    }
                }
            });
            const words = result?.words || [];
            setWordData(words);
            setLevel(1);
            setLines(0);
            setScore(0);
            setClearedWords([]);
            setScreen('game');
        } catch (error) {
            console.error('Failed to generate words:', error);
            setScreen('title');
        } finally {
            setLoading(false);
        }
    };

    const handleStartGame = (topic) => {
        if (topic === 'custom') {
            if (!searchQuery.trim()) return;
            generateWordData(searchQuery);
        } else {
            generateWordData(topic.label);
        }
    };

    // Game logic
    useEffect(() => {
        if (screen !== 'game' || !canvasRef.current || wordData.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let gameRunning = true;

        // Fullscreen responsive sizing
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();
        window.addEventListener('resize', updateSize);

        // Calculate cell size based on screen - prioritize game size
        const getCellSize = () => {
            const maxHeight = canvas.height - 80;
            const maxWidth = canvas.width * 0.5;
            return Math.floor(Math.min(maxHeight / BOARD_HEIGHT, maxWidth / BOARD_WIDTH));
        };

        // Draw jungle background with animals
        const drawJungleBackground = () => {
            // Sky gradient
            const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            skyGrad.addColorStop(0, '#e8f5e9');
            skyGrad.addColorStop(0.3, '#f1f8e9');
            skyGrad.addColorStop(1, '#c8e6c9');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ground
            ctx.fillStyle = '#8bc34a';
            ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
            ctx.fillStyle = '#689f38';
            ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

            // Trees and leaves (left side)
            drawTree(50, canvas.height - 60, 0.8);
            drawTree(-30, canvas.height - 40, 1.2);
            
            // Trees and leaves (right side)
            drawTree(canvas.width - 80, canvas.height - 60, 0.9);
            drawTree(canvas.width + 20, canvas.height - 50, 1.1);

            // Top leaves/canopy
            drawCanopy();

            // Plants at bottom
            drawPlants();

            // Animals
            drawGiraffe(80, canvas.height - 180, 0.6);
            drawGiraffe(canvas.width - 120, canvas.height - 200, 0.7);
            drawButterfly(150, 200, '#f44336');
            drawButterfly(canvas.width - 180, 150, '#2196f3');
            drawButterfly(canvas.width / 2 - 100, 120, '#ff9800');
            drawBird(canvas.width - 200, 180, '#4caf50');
            drawBird(180, 280, '#e91e63');
        };

        const drawTree = (x, y, scale) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);
            
            // Trunk
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(-15, -100, 30, 120);
            
            // Branches
            ctx.fillStyle = '#4caf50';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.ellipse(-60 + i * 30, -120 - i * 20, 40, 25, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        };

        const drawCanopy = () => {
            ctx.fillStyle = '#43a047';
            // Top left leaves
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.ellipse(i * 60, 30, 50, 40, 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            // Top right leaves
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.ellipse(canvas.width - i * 60, 40, 45, 35, -0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Hanging leaves
            ctx.fillStyle = '#66bb6a';
            for (let i = 0; i < 12; i++) {
                const lx = 50 + i * 80;
                ctx.beginPath();
                ctx.moveTo(lx, 0);
                ctx.quadraticCurveTo(lx + 20, 60, lx - 10, 80);
                ctx.quadraticCurveTo(lx - 25, 50, lx, 0);
                ctx.fill();
            }
        };

        const drawPlants = () => {
            ctx.fillStyle = '#2e7d32';
            // Left plants
            for (let i = 0; i < 4; i++) {
                const px = 20 + i * 40;
                ctx.beginPath();
                ctx.moveTo(px, canvas.height - 60);
                ctx.quadraticCurveTo(px - 30, canvas.height - 150, px + 10, canvas.height - 180);
                ctx.quadraticCurveTo(px + 20, canvas.height - 140, px + 5, canvas.height - 60);
                ctx.fill();
            }
            // Right plants
            for (let i = 0; i < 4; i++) {
                const px = canvas.width - 40 - i * 40;
                ctx.beginPath();
                ctx.moveTo(px, canvas.height - 60);
                ctx.quadraticCurveTo(px + 30, canvas.height - 140, px - 10, canvas.height - 170);
                ctx.quadraticCurveTo(px - 20, canvas.height - 130, px - 5, canvas.height - 60);
                ctx.fill();
            }
        };

        const drawGiraffe = (x, y, scale) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);
            
            // Body
            ctx.fillStyle = '#ff9800';
            ctx.beginPath();
            ctx.ellipse(0, 80, 35, 25, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Neck
            ctx.fillRect(-8, -40, 16, 120);
            
            // Head
            ctx.beginPath();
            ctx.ellipse(0, -50, 18, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Spots
            ctx.fillStyle = '#e65100';
            ctx.beginPath();
            ctx.arc(-5, 20, 6, 0, Math.PI * 2);
            ctx.arc(5, 50, 5, 0, Math.PI * 2);
            ctx.arc(-3, 80, 8, 0, Math.PI * 2);
            ctx.arc(15, 75, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Ears
            ctx.fillStyle = '#ff9800';
            ctx.beginPath();
            ctx.ellipse(-15, -55, 6, 10, -0.4, 0, Math.PI * 2);
            ctx.ellipse(15, -55, 6, 10, 0.4, 0, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(-6, -52, 3, 0, Math.PI * 2);
            ctx.arc(6, -52, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Legs
            ctx.fillStyle = '#ff9800';
            ctx.fillRect(-25, 100, 8, 40);
            ctx.fillRect(17, 100, 8, 40);
            
            ctx.restore();
        };

        const drawButterfly = (x, y, color) => {
            ctx.save();
            ctx.translate(x, y);
            
            ctx.fillStyle = color;
            // Wings
            ctx.beginPath();
            ctx.ellipse(-12, 0, 15, 10, -0.3, 0, Math.PI * 2);
            ctx.ellipse(12, 0, 15, 10, 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Body
            ctx.fillStyle = '#333';
            ctx.fillRect(-2, -8, 4, 16);
            
            ctx.restore();
        };

        const drawBird = (x, y, color) => {
            ctx.save();
            ctx.translate(x, y);
            
            ctx.fillStyle = color;
            // Body
            ctx.beginPath();
            ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Wing
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.quadraticCurveTo(-20, -20, -5, 0);
            ctx.fill();
            
            // Beak
            ctx.fillStyle = '#ff9800';
            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(20, 2);
            ctx.lineTo(12, 4);
            ctx.fill();
            
            ctx.restore();
        };

        // Game state
        const board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null));
        let bag = [];
        let currentPiece = null;
        let nextPiece = null;
        let gameScore = 0;
        let gameLines = 0;
        let gameLevel = 1;
        let dropCounter = 0;
        let dropInterval = 1000;
        let lastTime = 0;
        let wordIndex = 0;
        let gameOver = false;
        let paused = false;
        let definitionQueue = [];
        let currentDefinition = null;
        let definitionTimer = 0;

        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const getNextPiece = () => {
            if (bag.length === 0) {
                bag = shuffle([...PIECES]);
            }
            const piece = bag.pop();
            const word = wordData[wordIndex % wordData.length];
            wordIndex++;
            return {
                shape: piece.shape.map(row => [...row]),
                color: piece.color,
                glow: piece.glow,
                name: piece.name,
                word: word.word,
                definition: word.definition,
                x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
                y: 0
            };
        };

        // Draw colorful textured block like jungle reference
        const draw3DBlock = (x, y, size, color, glow, word) => {
            const padding = 2;
            const radius = size * 0.12;
            const innerX = x + padding;
            const innerY = y + padding;
            const innerSize = size - padding * 2;

            // Main block with gradient
            const gradient = ctx.createLinearGradient(innerX, innerY, innerX + innerSize, innerY + innerSize);
            gradient.addColorStop(0, glow);
            gradient.addColorStop(0.5, color);
            gradient.addColorStop(1, shadeColor(color, -20));

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(innerX, innerY, innerSize, innerSize, radius);
            ctx.fill();

            // Texture dots
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    ctx.beginPath();
                    ctx.arc(
                        innerX + innerSize * 0.25 + i * innerSize * 0.25,
                        innerY + innerSize * 0.25 + j * innerSize * 0.25,
                        2, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }

            // Top highlight
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.roundRect(innerX + 2, innerY + 2, innerSize - 4, innerSize * 0.3, radius * 0.5);
            ctx.fill();

            // Word text - one word per block, larger
            if (word) {
                ctx.fillStyle = '#fff';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                const fontSize = Math.max(10, size * 0.35);
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.strokeText(word.substring(0, 5), x + size / 2, y + size / 2);
                ctx.fillText(word.substring(0, 5), x + size / 2, y + size / 2);
            }
        };

        // Helper to darken color
        const shadeColor = (color, percent) => {
            const num = parseInt(color.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = Math.max(0, Math.min(255, (num >> 16) + amt));
            const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
            const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
            return `rgb(${R},${G},${B})`;
        };

        const collision = (piece, offsetX = 0, offsetY = 0) => {
            return piece.shape.some((row, dy) => {
                return row.some((value, dx) => {
                    if (!value) return false;
                    const x = piece.x + dx + offsetX;
                    const y = piece.y + dy + offsetY;
                    return x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT || (y >= 0 && board[y][x]);
                });
            });
        };

        const merge = () => {
            currentPiece.shape.forEach((row, dy) => {
                row.forEach((value, dx) => {
                    if (value) {
                        const x = currentPiece.x + dx;
                        const y = currentPiece.y + dy;
                        if (y >= 0) {
                            board[y][x] = { 
                                color: currentPiece.color,
                                glow: currentPiece.glow,
                                word: currentPiece.word,
                                definition: currentPiece.definition
                            };
                        }
                    }
                });
            });
        };

        const clearLines = () => {
            let linesCleared = 0;
            for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
                if (board[y].every(cell => cell !== null)) {
                    // Collect words from cleared line
                    const lineWords = board[y].filter(cell => cell).map(cell => ({
                        word: cell.word,
                        definition: cell.definition
                    }));
                    // Remove duplicates
                    const uniqueWords = lineWords.filter((w, i, arr) => 
                        arr.findIndex(x => x.word === w.word) === i
                    );
                    definitionQueue.push(...uniqueWords);
                    
                    board.splice(y, 1);
                    board.unshift(Array(BOARD_WIDTH).fill(null));
                    linesCleared++;
                    y++;
                }
            }

            if (linesCleared > 0) {
                const points = [0, 100, 300, 500, 800];
                gameScore += points[linesCleared] * gameLevel;
                gameLines += linesCleared;
                gameLevel = Math.floor(gameLines / 10) + 1;
                dropInterval = Math.max(100, 1000 - (gameLevel - 1) * 80);
                setScore(gameScore);
                setLines(gameLines);
                setLevel(gameLevel);
            }
        };

        const createPiece = () => {
            if (!nextPiece) {
                nextPiece = getNextPiece();
            }
            currentPiece = nextPiece;
            currentPiece.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece.shape[0].length / 2);
            currentPiece.y = 0;
            nextPiece = getNextPiece();

            if (collision(currentPiece)) {
                gameOver = true;
            }
        };

        const lock = () => {
            merge();
            clearLines();
            createPiece();
        };

        const drop = () => {
            if (!collision(currentPiece, 0, 1)) {
                currentPiece.y++;
            } else {
                lock();
            }
            dropCounter = 0;
        };

        const hardDrop = () => {
            while (!collision(currentPiece, 0, 1)) {
                currentPiece.y++;
                gameScore += 2;
            }
            setScore(gameScore);
            lock();
        };

        const move = (dir) => {
            if (!collision(currentPiece, dir, 0)) {
                currentPiece.x += dir;
            }
        };

        const rotate = () => {
            const original = currentPiece.shape.map(row => [...row]);
            currentPiece.shape = original[0].map((_, i) => 
                original.map(row => row[i]).reverse()
            );

            const kicks = [0, -1, 1, -2, 2];
            for (const offset of kicks) {
                if (!collision(currentPiece, offset, 0)) {
                    currentPiece.x += offset;
                    return;
                }
            }
            currentPiece.shape = original;
        };

        // Input handling
        const handleKeyDown = (e) => {
            keysRef.current[e.key] = true;
            if (gameOver) return;
            if (e.key.toLowerCase() === 'p') paused = !paused;
            if (e.key === 'Escape' && onExit) onExit();
            if (paused) return;
            
            switch (e.key) {
                case 'ArrowLeft': move(-1); break;
                case 'ArrowRight': move(1); break;
                case 'ArrowDown': drop(); break;
                case 'ArrowUp': rotate(); break;
                case ' ': e.preventDefault(); hardDrop(); break;
            }
        };

        const handleKeyUp = (e) => {
            keysRef.current[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Touch controls
        let touchStartX = null;
        let touchStartY = null;
        
        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        };

        const handleTouchEnd = (e) => {
            if (!touchStartX || gameOver || paused) return;
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 30) move(1);
                else if (deltaX < -30) move(-1);
            } else {
                if (deltaY > 30) hardDrop();
                else if (deltaY < -30) rotate();
            }
            touchStartX = null;
        };

        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchend', handleTouchEnd);

        // Initialize
        createPiece();

        // Draw function
        const draw = () => {
            const CELL_SIZE = getCellSize();
            const gameWidth = BOARD_WIDTH * CELL_SIZE;
            const gameHeight = BOARD_HEIGHT * CELL_SIZE;
            const offsetX = Math.floor((canvas.width - gameWidth) / 2);
            const offsetY = Math.floor((canvas.height - gameHeight) / 2) + 20;

            // Draw jungle background first
            drawJungleBackground();

            // Semi-transparent game area background
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(offsetX - 5, offsetY - 5, gameWidth + 10, gameHeight + 10);

            // Draw board with 3D blocks
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    if (board[y][x]) {
                        const cell = board[y][x];
                        draw3DBlock(
                            offsetX + x * CELL_SIZE,
                            offsetY + y * CELL_SIZE,
                            CELL_SIZE,
                            cell.color,
                            cell.glow,
                            cell.word
                        );
                    }
                }
            }

            // Draw current piece with 3D blocks
            if (currentPiece && !gameOver) {
                currentPiece.shape.forEach((row, dy) => {
                    row.forEach((value, dx) => {
                        if (value) {
                            const x = currentPiece.x + dx;
                            const y = currentPiece.y + dy;
                            if (y >= 0) {
                                draw3DBlock(
                                    offsetX + x * CELL_SIZE,
                                    offsetY + y * CELL_SIZE,
                                    CELL_SIZE,
                                    currentPiece.color,
                                    currentPiece.glow,
                                    currentPiece.word
                                );
                            }
                        }
                    });
                });

                // Ghost piece (drop preview)
                let ghostY = currentPiece.y;
                while (!collision(currentPiece, 0, ghostY - currentPiece.y + 1)) {
                    ghostY++;
                }
                if (ghostY !== currentPiece.y) {
                    ctx.globalAlpha = 0.3;
                    currentPiece.shape.forEach((row, dy) => {
                        row.forEach((value, dx) => {
                            if (value) {
                                const x = currentPiece.x + dx;
                                const y = ghostY + dy;
                                if (y >= 0) {
                                    draw3DBlock(
                                        offsetX + x * CELL_SIZE,
                                        offsetY + y * CELL_SIZE,
                                        CELL_SIZE,
                                        currentPiece.color,
                                        currentPiece.glow,
                                        null
                                    );
                                }
                            }
                        });
                    });
                    ctx.globalAlpha = 1;
                }
            }

            // Title at top center
            ctx.fillStyle = '#2e7d32';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('TETRIS GALAXY', canvas.width / 2, 35);
            ctx.fillStyle = '#4caf50';
            ctx.font = '14px Arial';
            ctx.fillText(currentTopic || '', canvas.width / 2, 55);

            // Stats overlay at top
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath();
            ctx.roundRect(offsetX, offsetY - 50, gameWidth, 40, 8);
            ctx.fill();

            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`SCORE: ${gameScore}`, offsetX + 15, offsetY - 25);
            ctx.textAlign = 'center';
            ctx.fillText(`LINES: ${gameLines}`, offsetX + gameWidth / 2, offsetY - 25);
            ctx.textAlign = 'right';
            ctx.fillText(`LEVEL: ${gameLevel}`, offsetX + gameWidth - 15, offsetY - 25);

            // Next piece preview (top right of game)
            const previewX = offsetX + gameWidth + 20;
            const previewY = offsetY;
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.beginPath();
            ctx.roundRect(previewX, previewY, 100, 100, 8);
            ctx.fill();

            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('NEXT', previewX + 50, previewY + 18);

            if (nextPiece) {
                const pSize = 20;
                const px = previewX + 50 - (nextPiece.shape[0].length * pSize) / 2;
                const py = previewY + 35;
                
                nextPiece.shape.forEach((row, dy) => {
                    row.forEach((value, dx) => {
                        if (value) {
                            draw3DBlock(px + dx * pSize, py + dy * pSize, pSize - 1, nextPiece.color, nextPiece.glow, null);
                        }
                    });
                });
            }

            // Definition display (bottom of screen)
            if (currentDefinition) {
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.beginPath();
                ctx.roundRect(offsetX, canvas.height - 80, gameWidth, 60, 10);
                ctx.fill();

                ctx.fillStyle = '#e91e63';
                ctx.font = 'bold 18px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(currentDefinition.word, offsetX + 20, canvas.height - 50);

                ctx.fillStyle = '#333';
                ctx.font = '14px Arial';
                ctx.fillText(currentDefinition.definition, offsetX + 20, canvas.height - 28);
            }

            // Paused overlay
            if (paused && !gameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#0ff';
                ctx.font = 'bold 36px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
                ctx.font = '16px Arial';
                ctx.fillStyle = '#888';
                ctx.fillText('Press P to resume', canvas.width / 2, canvas.height / 2 + 40);
            }

            // Game over overlay
            if (gameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.9)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#f00';
                ctx.font = 'bold 36px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.fillText(`Score: ${gameScore}`, canvas.width / 2, canvas.height / 2 + 10);
                ctx.fillText(`Lines: ${gameLines}`, canvas.width / 2, canvas.height / 2 + 40);
                ctx.fillStyle = '#888';
                ctx.font = '14px Arial';
                ctx.fillText('Click to return to menu', canvas.width / 2, canvas.height / 2 + 80);
            }
        };

        // Game loop
        const update = (time = 0) => {
            if (!gameRunning) return;

            const deltaTime = time - lastTime;
            lastTime = time;

            // Update definition display
            if (definitionQueue.length > 0 && !currentDefinition) {
                currentDefinition = definitionQueue.shift();
                definitionTimer = 3000;
                setShowDefinition(currentDefinition);
                setClearedWords(prev => [...prev, currentDefinition]);
            }
            if (currentDefinition) {
                definitionTimer -= deltaTime;
                if (definitionTimer <= 0) {
                    currentDefinition = null;
                    setShowDefinition(null);
                }
            }

            if (!paused && !gameOver) {
                dropCounter += deltaTime;
                if (dropCounter > dropInterval) {
                    drop();
                }
            }

            draw();
            animationFrameId = requestAnimationFrame(update);
        };

        // Click handler for game over
        const handleClick = () => {
            if (gameOver) {
                gameRunning = false;
                setScreen('title');
            }
        };
        canvas.addEventListener('click', handleClick);

        update();

        return () => {
            gameRunning = false;
            window.removeEventListener('resize', updateSize);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, [screen, wordData, onExit, currentTopic]);

    const toggleFullscreen = async () => {
        try {
            if (!fullscreen) {
                await document.documentElement.requestFullscreen?.();
                setFullscreen(true);
            } else {
                if (document.fullscreenElement) await document.exitFullscreen();
                setFullscreen(false);
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    };

    // Loading screen
    if (screen === 'loading') {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a1a] z-[9999]">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-cyan-500" />
                    <h2 className="text-2xl font-bold mb-2 text-white">Generating Vocabulary...</h2>
                    <p className="text-gray-400">Creating word blocks for "{currentTopic}"</p>
                </div>
            </div>
        );
    }

    // Game screen
    if (screen === 'game') {
        return (
            <div className="fixed inset-0 z-[9999]">
                <canvas ref={canvasRef} className="block w-full h-full touch-none" />
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button onClick={toggleFullscreen} className="bg-cyan-600/80 hover:bg-cyan-700 backdrop-blur" size="sm">
                        {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                    <Button onClick={() => setScreen('title')} className="bg-gray-600/80 hover:bg-gray-700 backdrop-blur" size="sm">
                        <X className="w-4 h-4 mr-1" /> Exit
                    </Button>
                </div>
            </div>
        );
    }

    // Title screen
    const filteredTopics = (topics) => {
        if (!searchQuery.trim()) return topics;
        return topics.filter(t => 
            t.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-50 z-[9999] overflow-auto p-4">
            <Button onClick={onExit} variant="ghost" className="absolute top-2 right-2 text-gray-500 hover:text-red-500 hover:bg-red-50">
                <X className="w-5 h-5" />
            </Button>
            
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-4">
                    <img src={LOGO_URL} alt="Logo" className="w-14 h-14 mx-auto mb-2 rounded-xl" />
                    <h1 className="text-4xl font-black text-gray-900 mb-1">TETRIS GALAXY</h1>
                    <p className="text-gray-500">Stack Words • Learn Vocabulary</p>
                </div>

                <div className="bg-white rounded-xl border border-cyan-200 p-3 mb-4 shadow-sm">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input 
                                placeholder="Enter any topic to learn..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter' && searchQuery.trim()) handleStartGame('custom'); }}
                                className="pl-12 h-12 bg-white border-gray-200 text-gray-900 rounded-xl" 
                            />
                        </div>
                        <Button 
                            onClick={() => searchQuery.trim() && handleStartGame('custom')} 
                            disabled={!searchQuery.trim() || loading}
                            className="h-12 px-6 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl"
                        >
                            <Play className="w-4 h-4 mr-2" /> Start Game
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {TABS.map(tab => (
                            <Button 
                                key={tab.id} 
                                onClick={() => handleTabClick(tab.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                    activeTab === tab.id 
                                        ? `bg-gradient-to-r ${tab.color} text-white` 
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    {loadingTopics && !generatedTopics[activeTab]?.length ? (
                        <div className="text-center py-8">
                            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-cyan-500" />
                            <p className="text-gray-600">Loading topics...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {filteredTopics(generatedTopics[activeTab] || []).slice(0, 9).map((topic, i) => {
                                const tabInfo = TABS.find(t => t.id === activeTab);
                                const icons = [Sparkles, Globe, Cpu, Atom, Leaf, Brain, Lightbulb, TrendingUp, Target];
                                const TopicIcon = icons[i % icons.length];
                                return (
                                    <button 
                                        key={topic.id || i} 
                                        onClick={() => handleStartGame(topic)} 
                                        className={`h-32 text-left py-3 px-4 rounded-xl bg-gradient-to-br ${tabInfo?.color || 'from-cyan-600 to-cyan-700'} hover:opacity-90 text-white transition-all hover:scale-[1.02] hover:shadow-lg`}
                                    >
                                        <TopicIcon className="w-5 h-5 text-white/70 mb-2" />
                                        <div className="text-sm font-bold line-clamp-2 leading-tight">{topic.label}</div>
                                        <div className="text-xs text-white/70 line-clamp-2 mt-1">{topic.description}</div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Target, title: 'Word Blocks', desc: 'Each block has a vocabulary word', bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600' },
                        { icon: Brain, title: 'Learn Definitions', desc: 'See meanings when lines clear', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
                        { icon: TrendingUp, title: 'Level Up', desc: 'Speed increases as you progress', bgColor: 'bg-green-100', iconColor: 'text-green-600' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                            <div className={`w-12 h-12 ${item.bgColor} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                            </div>
                            <h3 className="text-gray-900 font-semibold text-sm mb-1">{item.title}</h3>
                            <p className="text-gray-500 text-xs">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}