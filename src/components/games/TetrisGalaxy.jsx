import React, { useState, useEffect, useRef } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Play, X, Loader2, Search, Sparkles, Globe, Cpu, Atom, Leaf, Brain, Lightbulb, TrendingUp, Target,
    Maximize2, Minimize2
} from 'lucide-react';
import { LOGO_URL } from '@/components/NavigationConfig';

const TABS = [
    { id: 'trending', label: 'Trending', color: 'from-cyan-500 to-blue-600' },
    { id: 'ocean', label: 'Ocean Life', color: 'from-blue-500 to-teal-600' },
    { id: 'science', label: 'Science', color: 'from-purple-500 to-indigo-600' },
    { id: 'technology', label: 'Technology', color: 'from-green-500 to-emerald-600' },
    { id: 'language', label: 'Language', color: 'from-orange-500 to-red-600' },
    { id: 'history', label: 'History', color: 'from-amber-500 to-yellow-600' },
];

const BOARD_WIDTH = 20; // 2x wider
const BOARD_HEIGHT = 20;

// Ocean-themed vibrant colors
const PIECES = [
    { shape: [[1,1,1,1]], color: '#00bcd4', glow: '#4dd0e1', name: 'I' },
    { shape: [[1,1],[1,1]], color: '#ffeb3b', glow: '#fff176', name: 'O' },
    { shape: [[0,1,0],[1,1,1]], color: '#e91e63', glow: '#f06292', name: 'T' },
    { shape: [[0,1,1],[1,1,0]], color: '#4caf50', glow: '#81c784', name: 'S' },
    { shape: [[1,1,0],[0,1,1]], color: '#f44336', glow: '#e57373', name: 'Z' },
    { shape: [[1,0,0],[1,1,1]], color: '#9c27b0', glow: '#ba68c8', name: 'J' },
    { shape: [[0,0,1],[1,1,1]], color: '#ff9800', glow: '#ffb74d', name: 'L' }
];

export default function TetrisGalaxy({ onExit }) {
    const canvasRef = useRef(null);
    
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

    useEffect(() => {
        loadTabTopics('trending');
    }, []);

    const loadTabTopics = async (tabId) => {
        if (generatedTopics[tabId]?.length) return;
        setLoadingTopics(true);
        try {
            const prompts = {
                trending: 'Generate 9 trending vocabulary topics including technology, current events, pop culture.',
                ocean: 'Generate 9 ocean and marine life vocabulary topics including sea creatures, coral reefs, oceanography.',
                science: 'Generate 9 science vocabulary topics including biology, chemistry, physics.',
                technology: 'Generate 9 technology vocabulary topics including programming, AI, hardware.',
                language: 'Generate 9 language learning vocabulary topics including SAT words, idioms.',
                history: 'Generate 9 history vocabulary topics including ancient civilizations, world events.'
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
                prompt: `Generate vocabulary data for: "${topic}". Return 40 terms with short definitions (max 10 words each). Format: { "words": [{ "word": "term", "definition": "short definition" }] }`,
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

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();
        window.addEventListener('resize', updateSize);

        const getCellSize = () => {
            const maxHeight = canvas.height - 120;
            const maxWidth = canvas.width * 0.7;
            return Math.floor(Math.min(maxHeight / BOARD_HEIGHT, maxWidth / BOARD_WIDTH));
        };

        // Ocean background
        const drawOceanBackground = () => {
            // Deep ocean gradient
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, '#006994');
            grad.addColorStop(0.3, '#0077a8');
            grad.addColorStop(0.6, '#005f7f');
            grad.addColorStop(1, '#003d52');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Light rays from top
            ctx.globalAlpha = 0.1;
            for (let i = 0; i < 8; i++) {
                ctx.fillStyle = '#87ceeb';
                ctx.beginPath();
                const x = canvas.width * 0.1 + i * canvas.width * 0.12;
                ctx.moveTo(x, 0);
                ctx.lineTo(x + 80, canvas.height);
                ctx.lineTo(x + 40, canvas.height);
                ctx.lineTo(x - 40, 0);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Sandy floor
            const floorY = canvas.height - 80;
            const sandGrad = ctx.createLinearGradient(0, floorY, 0, canvas.height);
            sandGrad.addColorStop(0, '#d4a574');
            sandGrad.addColorStop(1, '#c4956a');
            ctx.fillStyle = sandGrad;
            ctx.fillRect(0, floorY, canvas.width, 80);

            // Seaweed
            drawSeaweed(50, floorY, 1);
            drawSeaweed(120, floorY, 0.8);
            drawSeaweed(canvas.width - 80, floorY, 1.1);
            drawSeaweed(canvas.width - 150, floorY, 0.9);

            // Sea creatures
            drawDolphin(100, 120, 0.7, Date.now());
            drawDolphin(canvas.width - 150, 180, -0.6, Date.now() + 1000);
            drawOctopus(60, canvas.height / 2, 0.5, Date.now());
            drawFish(canvas.width - 100, canvas.height / 2 + 50, 0.4, '#ff6b6b');
            drawFish(canvas.width - 60, canvas.height / 2 + 100, 0.3, '#ffd93d');
            drawBubbles(Date.now());
        };

        const drawSeaweed = (x, floorY, scale) => {
            ctx.save();
            const time = Date.now() * 0.002;
            for (let i = 0; i < 4; i++) {
                ctx.fillStyle = i % 2 === 0 ? '#2d5a27' : '#3d7a37';
                ctx.beginPath();
                const sway = Math.sin(time + i * 0.5) * 10;
                ctx.moveTo(x + i * 15, floorY);
                ctx.quadraticCurveTo(
                    x + i * 15 + sway, floorY - 80 * scale,
                    x + i * 15 + sway * 1.5, floorY - 150 * scale
                );
                ctx.quadraticCurveTo(
                    x + i * 15 + 10 + sway, floorY - 80 * scale,
                    x + i * 15 + 8, floorY
                );
                ctx.fill();
            }
            ctx.restore();
        };

        const drawDolphin = (x, y, scale, timeOffset) => {
            const time = Date.now() * 0.001;
            const bobY = Math.sin(time + timeOffset * 0.001) * 15;
            ctx.save();
            ctx.translate(x, y + bobY);
            ctx.scale(scale, Math.abs(scale));
            if (scale < 0) ctx.scale(-1, 1);

            // Body
            ctx.fillStyle = '#4a90a4';
            ctx.beginPath();
            ctx.ellipse(0, 0, 60, 25, 0, 0, Math.PI * 2);
            ctx.fill();

            // Head
            ctx.beginPath();
            ctx.ellipse(50, -5, 25, 18, 0.2, 0, Math.PI * 2);
            ctx.fill();

            // Snout
            ctx.beginPath();
            ctx.ellipse(75, 0, 15, 8, 0.1, 0, Math.PI * 2);
            ctx.fill();

            // Dorsal fin
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.quadraticCurveTo(15, -50, 25, -25);
            ctx.fill();

            // Tail
            ctx.beginPath();
            ctx.moveTo(-60, 0);
            ctx.quadraticCurveTo(-80, -20, -90, -15);
            ctx.quadraticCurveTo(-75, 0, -90, 15);
            ctx.quadraticCurveTo(-80, 20, -60, 0);
            ctx.fill();

            // Eye
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(60, -8, 4, 0, Math.PI * 2);
            ctx.fill();

            // Belly
            ctx.fillStyle = '#8fc4d4';
            ctx.beginPath();
            ctx.ellipse(20, 10, 40, 12, 0, 0, Math.PI);
            ctx.fill();

            ctx.restore();
        };

        const drawOctopus = (x, y, scale, timeOffset) => {
            const time = Date.now() * 0.003;
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);

            // Head
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.ellipse(0, 0, 50, 40, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tentacles
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI + Math.PI * 0.1;
                const wave = Math.sin(time + i) * 10;
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * 40, Math.sin(angle) * 30 + 20);
                ctx.quadraticCurveTo(
                    Math.cos(angle) * 80 + wave, Math.sin(angle) * 60 + 40,
                    Math.cos(angle) * 100 + wave * 2, Math.sin(angle) * 80 + 60
                );
                ctx.lineWidth = 12;
                ctx.strokeStyle = '#e74c3c';
                ctx.lineCap = 'round';
                ctx.stroke();
            }

            // Eyes
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.ellipse(-15, -10, 12, 15, 0, 0, Math.PI * 2);
            ctx.ellipse(15, -10, 12, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(-15, -8, 6, 0, Math.PI * 2);
            ctx.arc(15, -8, 6, 0, Math.PI * 2);
            ctx.fill();

            // Smile
            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 10, 15, 0.2, Math.PI - 0.2);
            ctx.stroke();

            ctx.restore();
        };

        const drawFish = (x, y, scale, color) => {
            const time = Date.now() * 0.005;
            const swimX = Math.sin(time) * 20;
            ctx.save();
            ctx.translate(x + swimX, y);
            ctx.scale(scale, scale);

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tail
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-50, -15);
            ctx.lineTo(-50, 15);
            ctx.closePath();
            ctx.fill();

            // Eye
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(15, -5, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(17, -5, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        const drawBubbles = (time) => {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            for (let i = 0; i < 15; i++) {
                const x = (i * 97 + time * 0.02) % canvas.width;
                const y = canvas.height - ((time * 0.05 + i * 80) % canvas.height);
                const size = 3 + (i % 5) * 2;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
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
        let lineClearMessage = null;
        let lineClearTimer = 0;

        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const getNextPiece = () => {
            if (bag.length === 0) bag = shuffle([...PIECES]);
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

        // Draw single block - ONE word per entire piece, not per cell
        const draw3DBlock = (x, y, size, color, glow) => {
            const padding = 2;
            const radius = size * 0.15;
            const innerX = x + padding;
            const innerY = y + padding;
            const innerSize = size - padding * 2;

            // Main block gradient
            const gradient = ctx.createLinearGradient(innerX, innerY, innerX + innerSize, innerY + innerSize);
            gradient.addColorStop(0, glow);
            gradient.addColorStop(0.5, color);
            gradient.addColorStop(1, shadeColor(color, -25));

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(innerX, innerY, innerSize, innerSize, radius);
            ctx.fill();

            // Texture dots
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    ctx.beginPath();
                    ctx.arc(innerX + innerSize * 0.3 + i * innerSize * 0.4, innerY + innerSize * 0.3 + j * innerSize * 0.4, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Top highlight
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.beginPath();
            ctx.roundRect(innerX + 3, innerY + 3, innerSize - 6, innerSize * 0.25, radius * 0.5);
            ctx.fill();
        };

        // Draw word and definition next to falling piece
        const drawPieceWord = (piece, offsetX, offsetY, cellSize) => {
            if (!piece.word) return;
            
            // Calculate piece bounding box
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            piece.shape.forEach((row, dy) => {
                row.forEach((value, dx) => {
                    if (value) {
                        minX = Math.min(minX, dx);
                        maxX = Math.max(maxX, dx);
                        minY = Math.min(minY, dy);
                        maxY = Math.max(maxY, dy);
                    }
                });
            });

            const pieceRightX = offsetX + (piece.x + maxX + 1) * cellSize;
            const pieceCenterY = offsetY + (piece.y + (minY + maxY + 1) / 2) * cellSize;

            // Position text box to the right of the piece
            const textBoxX = pieceRightX + 15;
            const textBoxWidth = 180;
            
            // Wrap definition into lines
            const wrapText = (text, maxWidth) => {
                const words = (text || '').split(' ');
                const lines = [];
                let currentLine = '';
                ctx.font = '13px Arial';
                
                for (const word of words) {
                    const testLine = currentLine ? currentLine + ' ' + word : word;
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > maxWidth && currentLine) {
                        lines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                }
                if (currentLine) lines.push(currentLine);
                return lines.slice(0, 3); // Max 3 lines
            };

            const defLines = wrapText(piece.definition, textBoxWidth - 20);
            const textBoxHeight = 30 + defLines.length * 18;

            // Background
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.beginPath();
            ctx.roundRect(textBoxX, pieceCenterY - textBoxHeight/2, textBoxWidth, textBoxHeight, 10);
            ctx.fill();
            ctx.strokeStyle = '#4dd0e1';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Word
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#4dd0e1';
            ctx.fillText(piece.word, textBoxX + 12, pieceCenterY - textBoxHeight/2 + 8);

            // Definition lines
            ctx.font = '13px Arial';
            ctx.fillStyle = '#fff';
            defLines.forEach((line, i) => {
                ctx.fillText(line, textBoxX + 12, pieceCenterY - textBoxHeight/2 + 30 + i * 18);
            });
        };

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
            let allClearedWords = [];
            
            for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
                if (board[y].every(cell => cell !== null)) {
                    const lineWords = board[y].filter(cell => cell).map(cell => cell.word);
                    const uniqueWords = [...new Set(lineWords)];
                    allClearedWords.push(...uniqueWords);
                    
                    board.splice(y, 1);
                    board.unshift(Array(BOARD_WIDTH).fill(null));
                    linesCleared++;
                    y++;
                }
            }

            if (linesCleared > 0) {
                const points = [0, 100, 300, 500, 800];
                gameScore += points[Math.min(linesCleared, 4)] * gameLevel;
                gameLines += linesCleared;
                gameLevel = Math.floor(gameLines / 10) + 1;
                dropInterval = Math.max(100, 1000 - (gameLevel - 1) * 80);
                setScore(gameScore);
                setLines(gameLines);
                setLevel(gameLevel);

                // Create sentence from cleared words
                const uniqueAllWords = [...new Set(allClearedWords)];
                if (uniqueAllWords.length > 0) {
                    lineClearMessage = `Words cleared: ${uniqueAllWords.join(', ')}`;
                    lineClearTimer = 3000;
                }
            }
        };

        const createPiece = () => {
            if (!nextPiece) nextPiece = getNextPiece();
            currentPiece = nextPiece;
            currentPiece.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece.shape[0].length / 2);
            currentPiece.y = 0;
            nextPiece = getNextPiece();
            if (collision(currentPiece)) gameOver = true;
        };

        const lock = () => { merge(); clearLines(); createPiece(); };
        const drop = () => { if (!collision(currentPiece, 0, 1)) currentPiece.y++; else lock(); dropCounter = 0; };
        const hardDrop = () => { while (!collision(currentPiece, 0, 1)) { currentPiece.y++; gameScore += 2; } setScore(gameScore); lock(); };
        const move = (dir) => { if (!collision(currentPiece, dir, 0)) currentPiece.x += dir; };
        const rotate = () => {
            const original = currentPiece.shape.map(row => [...row]);
            currentPiece.shape = original[0].map((_, i) => original.map(row => row[i]).reverse());
            const kicks = [0, -1, 1, -2, 2];
            for (const offset of kicks) { if (!collision(currentPiece, offset, 0)) { currentPiece.x += offset; return; } }
            currentPiece.shape = original;
        };

        const handleKeyDown = (e) => {
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
        window.addEventListener('keydown', handleKeyDown);

        let touchStartX = null, touchStartY = null;
        const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; };
        const handleTouchEnd = (e) => {
            if (!touchStartX || gameOver || paused) return;
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const deltaY = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(deltaX) > Math.abs(deltaY)) { if (deltaX > 30) move(1); else if (deltaX < -30) move(-1); }
            else { if (deltaY > 30) hardDrop(); else if (deltaY < -30) rotate(); }
            touchStartX = null;
        };
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchend', handleTouchEnd);

        createPiece();

        const draw = () => {
            const CELL_SIZE = getCellSize();
            const gameWidth = BOARD_WIDTH * CELL_SIZE;
            const gameHeight = BOARD_HEIGHT * CELL_SIZE;
            const offsetX = Math.floor((canvas.width - gameWidth) / 2);
            const offsetY = Math.floor((canvas.height - gameHeight) / 2) + 30;

            drawOceanBackground();

            // Game board background
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.roundRect(offsetX - 8, offsetY - 8, gameWidth + 16, gameHeight + 16, 12);
            ctx.fill();

            // Draw locked blocks
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    if (board[y][x]) {
                        draw3DBlock(offsetX + x * CELL_SIZE, offsetY + y * CELL_SIZE, CELL_SIZE, board[y][x].color, board[y][x].glow);
                    }
                }
            }

            // Draw current piece
            if (currentPiece && !gameOver) {
                currentPiece.shape.forEach((row, dy) => {
                    row.forEach((value, dx) => {
                        if (value && currentPiece.y + dy >= 0) {
                            draw3DBlock(offsetX + (currentPiece.x + dx) * CELL_SIZE, offsetY + (currentPiece.y + dy) * CELL_SIZE, CELL_SIZE, currentPiece.color, currentPiece.glow);
                        }
                    });
                });
                // Draw word and definition on piece
                drawPieceWord(currentPiece, offsetX, offsetY, CELL_SIZE);
            }

            // Title
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 10;
            ctx.fillText('TETRIS GALAXY', canvas.width / 2, 35);
            ctx.shadowBlur = 0;

            // Stats bar
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.beginPath();
            ctx.roundRect(offsetX, offsetY - 55, gameWidth, 45, 10);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`SCORE: ${gameScore}`, offsetX + 20, offsetY - 28);
            ctx.textAlign = 'center';
            ctx.fillText(`LINES: ${gameLines}  |  LEVEL: ${gameLevel}`, offsetX + gameWidth / 2, offsetY - 28);
            ctx.textAlign = 'right';
            ctx.fillText(currentTopic || '', offsetX + gameWidth - 20, offsetY - 28);

            // Next piece
            const previewX = offsetX + gameWidth + 20;
            const previewY = offsetY;
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.beginPath();
            ctx.roundRect(previewX, previewY, 110, 110, 10);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('NEXT', previewX + 55, previewY + 20);
            if (nextPiece) {
                const pSize = 22;
                const px = previewX + 55 - (nextPiece.shape[0].length * pSize) / 2;
                const py = previewY + 35;
                nextPiece.shape.forEach((row, dy) => {
                    row.forEach((value, dx) => {
                        if (value) draw3DBlock(px + dx * pSize, py + dy * pSize, pSize - 1, nextPiece.color, nextPiece.glow);
                    });
                });
                ctx.font = 'bold 12px Arial';
                ctx.fillText(nextPiece.word, previewX + 55, previewY + 100);
            }

            // Line clear message in center of screen
            if (lineClearMessage) {
                const msgWidth = Math.min(gameWidth * 0.9, 500);
                const msgHeight = 80;
                const msgX = canvas.width / 2 - msgWidth / 2;
                const msgY = canvas.height / 2 - msgHeight / 2;

                ctx.fillStyle = 'rgba(0,0,0,0.9)';
                ctx.beginPath();
                ctx.roundRect(msgX, msgY, msgWidth, msgHeight, 16);
                ctx.fill();
                ctx.strokeStyle = '#4dd0e1';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.fillStyle = '#4dd0e1';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('LINE CLEARED!', canvas.width / 2, msgY + 25);

                ctx.fillStyle = '#fff';
                ctx.font = '16px Arial';
                ctx.fillText(lineClearMessage, canvas.width / 2, msgY + 55);
            }

            // Pause/Game Over overlays
            if (paused && !gameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#4dd0e1';
                ctx.font = 'bold 48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
            }
            if (gameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.9)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#f44336';
                ctx.font = 'bold 48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
                ctx.fillStyle = '#fff';
                ctx.font = '24px Arial';
                ctx.fillText(`Score: ${gameScore}  |  Lines: ${gameLines}`, canvas.width / 2, canvas.height / 2 + 20);
                ctx.font = '16px Arial';
                ctx.fillStyle = '#888';
                ctx.fillText('Click to return', canvas.width / 2, canvas.height / 2 + 60);
            }
        };

        const update = (time = 0) => {
            if (!gameRunning) return;
            const deltaTime = time - lastTime;
            lastTime = time;

            // Update line clear message timer
            if (lineClearMessage) {
                lineClearTimer -= deltaTime;
                if (lineClearTimer <= 0) lineClearMessage = null;
            }

            if (!paused && !gameOver) {
                dropCounter += deltaTime;
                if (dropCounter > dropInterval) drop();
            }

            draw();
            animationFrameId = requestAnimationFrame(update);
        };

        const handleClick = () => { if (gameOver) { gameRunning = false; setScreen('title'); } };
        canvas.addEventListener('click', handleClick);

        update();

        return () => {
            gameRunning = false;
            window.removeEventListener('resize', updateSize);
            window.removeEventListener('keydown', handleKeyDown);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, [screen, wordData, onExit, currentTopic]);

    const toggleFullscreen = async () => {
        try {
            if (!fullscreen) { await document.documentElement.requestFullscreen?.(); setFullscreen(true); }
            else { if (document.fullscreenElement) await document.exitFullscreen(); setFullscreen(false); }
        } catch (error) { console.error('Fullscreen error:', error); }
    };

    if (screen === 'loading') {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-cyan-900 to-blue-950 z-[9999]">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-cyan-400" />
                    <h2 className="text-2xl font-bold mb-2 text-white">Diving into the Ocean...</h2>
                    <p className="text-cyan-300">Generating vocabulary for "{currentTopic}"</p>
                </div>
            </div>
        );
    }

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

    const filteredTopics = (topics) => {
        if (!searchQuery.trim()) return topics;
        return topics.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()) || t.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-cyan-50 to-blue-100 z-[9999] overflow-auto p-4">
            <Button onClick={onExit} variant="ghost" className="absolute top-2 right-2 text-gray-500 hover:text-red-500 hover:bg-red-50">
                <X className="w-5 h-5" />
            </Button>
            
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-4">
                    <img src={LOGO_URL} alt="Logo" className="w-14 h-14 mx-auto mb-2 rounded-xl" />
                    <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1">TETRIS GALAXY</h1>
                    <p className="text-blue-600">Stack Words • Learn Vocabulary • Ocean Adventure</p>
                </div>

                <div className="bg-white rounded-xl border border-cyan-200 p-3 mb-4 shadow-lg">
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
                            className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl"
                        >
                            <Play className="w-4 h-4 mr-2" /> Dive In
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-lg">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {TABS.map(tab => (
                            <Button 
                                key={tab.id} 
                                onClick={() => handleTabClick(tab.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === tab.id ? `bg-gradient-to-r ${tab.color} text-white` : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
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
                                        className={`h-28 text-left py-3 px-4 rounded-xl bg-gradient-to-br ${tabInfo?.color || 'from-cyan-500 to-blue-600'} hover:opacity-90 text-white transition-all hover:scale-[1.02] hover:shadow-lg`}
                                    >
                                        <TopicIcon className="w-5 h-5 text-white/70 mb-2" />
                                        <div className="text-sm font-bold line-clamp-2">{topic.label}</div>
                                        <div className="text-xs text-white/70 line-clamp-1 mt-1">{topic.description}</div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Target, title: 'Word Blocks', desc: 'Each piece shows a vocabulary word', bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600' },
                        { icon: Brain, title: 'Learn Definitions', desc: 'See meanings when lines clear', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
                        { icon: TrendingUp, title: 'Level Up', desc: 'Speed increases as you progress', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow">
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