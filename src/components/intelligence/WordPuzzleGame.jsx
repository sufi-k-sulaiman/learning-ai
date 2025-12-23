import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trophy, Sparkles, RotateCcw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import confetti from 'canvas-confetti';

export default function WordPuzzleGame({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentWords, setCurrentWords] = useState([]);
  const [blankIndex, setBlankIndex] = useState(0);
  const [slots, setSlots] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [draggedWord, setDraggedWord] = useState(null);

  useEffect(() => {
    generateLevels();
  }, [item]);

  const generateLevels = async () => {
    setLoading(true);
    setGameComplete(false);
    setCurrentLevel(0);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 6 word puzzle levels about "${item}" (${category?.name}):
        
For each level, create:
- 4 related words/terms (these form the correct sequence)
- 4 distractor words (incorrect alternatives that seem plausible but are wrong)

Make it educational and progressively challenging. Use terminology, concepts, and vocabulary related to ${item}.

Example format:
Level 1: Basic terms
Level 2-4: Intermediate concepts
Level 5-6: Advanced/technical terms`,
        response_json_schema: {
          type: "object",
          properties: {
            levels: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  words: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                  distractors: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 }
                }
              },
              minItems: 6,
              maxItems: 6
            }
          }
        }
      });

      setLevels(response.levels || []);
      if (response.levels?.length > 0) {
        initLevel(response.levels, 0);
      }
    } catch (error) {
      console.error('Failed to generate levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initLevel = (levelsData, levelIndex) => {
    const puzzle = levelsData[levelIndex];
    const words = shuffle([...puzzle.words]);
    const blank = Math.floor(Math.random() * 4);

    const tileWords = [...puzzle.distractors];
    tileWords.push(words[blank]);
    const shuffledTiles = shuffle(tileWords);

    setCurrentWords(words);
    setBlankIndex(blank);
    setSlots(words.map((word, i) => ({
      id: i,
      expected: word,
      current: i === blank ? null : word,
      isBlank: i === blank,
      status: null
    })));
    setTiles(shuffledTiles.map((word, i) => ({ id: i, word, visible: true })));
  };

  const handleDrop = (slotId, word) => {
    const slot = slots.find(s => s.id === slotId);
    
    if (slot.isBlank && word === slot.expected) {
      // Correct!
      const newSlots = slots.map(s => 
        s.id === slotId ? { ...s, current: word, status: 'correct', isBlank: false } : s
      );
      setSlots(newSlots);

      const newTiles = tiles.map(t => 
        t.word === word ? { ...t, visible: false } : t
      );
      setTiles(newTiles);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [category?.color || '#6209e6', '#FFD700']
      });

      setTimeout(() => {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1);
          initLevel(levels, currentLevel + 1);
        } else {
          setGameComplete(true);
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 }
          });
        }
      }, 1600);
    } else if (slot.isBlank) {
      // Wrong
      const newSlots = slots.map(s => 
        s.id === slotId ? { ...s, status: 'wrong' } : s
      );
      setSlots(newSlots);

      setTimeout(() => {
        setSlots(slots.map(s => ({ ...s, status: null })));
      }, 600);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
          <p className="text-gray-500">Creating word puzzle...</p>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-8 text-center">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h3 className="text-3xl font-bold text-gray-900 mb-3">🎉 Puzzle Mastered!</h3>
        <p className="text-lg text-gray-700 mb-6">You completed all levels about {item}!</p>
        <button
          onClick={() => generateLevels()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          style={{ backgroundColor: category?.color }}>
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6" />
          Word Puzzle Challenge
        </h3>
        <p className="text-white/80 mb-4">Drag the correct word to fill the missing slot!</p>
        <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-white font-semibold">
          Level {currentLevel + 1} / {levels.length}
        </div>
      </div>

      {/* Slots */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 perspective-1000">
        {slots.map((slot) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: slot.id * 0.1 }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const word = e.dataTransfer.getData('text');
              handleDrop(slot.id, word);
            }}
            className={`
              w-40 h-24 rounded-2xl flex items-center justify-center text-lg font-bold
              transition-all duration-300 cursor-pointer shadow-lg
              ${slot.isBlank 
                ? 'bg-gradient-to-br from-indigo-800 to-purple-800 border-2 border-dashed border-white/50' 
                : 'bg-gradient-to-br from-indigo-700 to-purple-700 border-2 border-white/30'}
              ${slot.status === 'correct' ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400 animate-pulse' : ''}
              ${slot.status === 'wrong' ? 'bg-gradient-to-br from-red-500 to-rose-500 border-red-400 animate-shake' : ''}
              hover:scale-105 hover:shadow-2xl
            `}
            style={{
              transformStyle: 'preserve-3d',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
            <span className="text-white drop-shadow-lg">
              {slot.current || ''}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Tiles */}
      <div className="flex flex-wrap justify-center gap-4 min-h-[100px]">
        <AnimatePresence>
          {tiles.filter(t => t.visible).map((tile) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0, rotate: 360 }}
              transition={{ duration: 0.3 }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text', tile.word);
                setDraggedWord(tile.word);
              }}
              onDragEnd={() => setDraggedWord(null)}
              className={`
                w-36 h-20 rounded-xl flex items-center justify-center text-base font-bold
                bg-gradient-to-br from-blue-600 to-cyan-600 border-2 border-blue-400
                cursor-grab active:cursor-grabbing shadow-lg
                hover:scale-110 hover:shadow-2xl transition-all duration-200
                ${draggedWord === tile.word ? 'opacity-50 scale-95' : ''}
              `}
              style={{
                transformStyle: 'preserve-3d',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
              <span className="text-white drop-shadow-lg">{tile.word}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px) rotate(-5deg); }
          75% { transform: translateX(10px) rotate(5deg); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}