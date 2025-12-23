import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trophy, RotateCcw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import confetti from 'canvas-confetti';

export default function WordPuzzleGame({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentWords, setCurrentWords] = useState([]);
  const [blankIndex, setBlankIndex] = useState(0);
  const [tileWords, setTileWords] = useState([]);
  const [slots, setSlots] = useState([]);
  const [draggedWord, setDraggedWord] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    generateLevels();
  }, [item]);

  const generateLevels = async () => {
    setLoading(true);
    setGameComplete(false);
    setCurrentLevel(0);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5 word puzzle levels about "${item}" (${category?.name}):
        
For each level, provide:
1. words: Array of 4 related words/terms about ${item} (single words or short 2-word phrases)
2. distractors: Array of 4 words that DON'T relate to ${item} but could be confused

Make it educational and progressively challenging. Words should be specific to ${item}.`,
        response_json_schema: {
          type: "object",
          properties: {
            levels: {
              type: "array",
              minItems: 5,
              maxItems: 5,
              items: {
                type: "object",
                properties: {
                  words: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                  distractors: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 }
                }
              }
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
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const initLevel = (levelsData, levelIndex) => {
    const puzzle = levelsData[levelIndex];
    const words = shuffle([...puzzle.words]);
    const blank = Math.floor(Math.random() * 4);

    setCurrentWords(words);
    setBlankIndex(blank);

    const tiles = [...puzzle.distractors, words[blank]];
    setTileWords(shuffle(tiles));

    setSlots(words.map((word, i) => ({
      word,
      filled: i !== blank,
      status: 'normal' // normal, correct, wrong
    })));
  };

  const handleDragStart = (word) => {
    setDraggedWord(word);
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  const handleDrop = (slotIndex) => {
    if (!draggedWord || slots[slotIndex].filled) return;

    const expectedWord = currentWords[slotIndex];
    
    if (draggedWord === expectedWord) {
      // Correct!
      const newSlots = [...slots];
      newSlots[slotIndex] = { word: draggedWord, filled: true, status: 'correct' };
      setSlots(newSlots);

      // Remove tile
      setTileWords(tileWords.filter(w => w !== draggedWord));

      // Celebrate
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [category?.color || '#6209e6', '#FFD700']
      });

      // Next level after delay
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
      }, 1500);
    } else {
      // Wrong
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...slots[slotIndex], status: 'wrong' };
      setSlots(newSlots);

      setTimeout(() => {
        const resetSlots = [...newSlots];
        resetSlots[slotIndex] = { ...resetSlots[slotIndex], status: 'normal' };
        setSlots(resetSlots);
      }, 600);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
          <p className="text-gray-500">Generating word puzzle...</p>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}>
          <Trophy className="w-20 h-20 mx-auto mb-4" style={{ color: category?.color }} />
          <h3 className="text-3xl font-bold text-gray-900 mb-3">🎉 Puzzle Master!</h3>
          <p className="text-gray-600 text-lg mb-6">You completed all {levels.length} levels about {item}!</p>
          <button
            onClick={() => {
              setCurrentLevel(0);
              setGameComplete(false);
              initLevel(levels, 0);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: category?.color }}>
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <style>{`
        .puzzle-slot {
          perspective: 1200px;
        }
        .puzzle-slot-inner {
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .puzzle-slot-inner:hover {
          transform: rotateY(10deg) rotateX(8deg) translateZ(20px);
        }
        .puzzle-tile {
          perspective: 1000px;
          transform-style: preserve-3d;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .puzzle-tile:hover {
          transform: rotateY(-8deg) scale(1.05) translateZ(15px);
        }
        .puzzle-tile:active {
          transform: rotateY(15deg) rotateX(-10deg) scale(1.1) translateZ(40px);
        }
        @keyframes shake3d {
          0%, 100% { transform: translateX(0) translateZ(0) rotateY(0deg); }
          20% { transform: translateX(-10px) translateZ(15px) rotateY(-8deg); }
          40% { transform: translateX(10px) translateZ(15px) rotateY(8deg); }
          60% { transform: translateX(-8px) translateZ(15px) rotateY(-5deg); }
          80% { transform: translateX(8px) translateZ(15px) rotateY(5deg); }
        }
        .slot-wrong {
          animation: shake3d 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
      `}</style>

      {/* Header */}
      <div className="p-6 border-b border-gray-200" style={{ background: `linear-gradient(135deg, ${category?.color}15, ${category?.color}08)` }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">🧩 Word Puzzle Challenge</h3>
          <div className="px-4 py-2 bg-white rounded-full border-2 font-bold" style={{ borderColor: category?.color, color: category?.color }}>
            Level {currentLevel + 1} / {levels.length}
          </div>
        </div>
        <p className="text-gray-600">Drag the correct word to fill the empty slot!</p>
      </div>

      {/* Slots */}
      <div className="p-6 flex flex-wrap justify-center gap-4">
        {slots.map((slot, i) => (
          <div
            key={i}
            className="puzzle-slot"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}>
            <div
              className={`puzzle-slot-inner w-36 sm:w-40 h-20 sm:h-24 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold shadow-lg ${
                slot.filled ? 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900' : 'border-4 border-dashed bg-gray-50/50 text-gray-400'
              } ${
                slot.status === 'correct' ? '!bg-gradient-to-br !from-green-400 !to-green-500 !text-white' : ''
              } ${
                slot.status === 'wrong' ? 'slot-wrong !bg-gradient-to-br !from-red-400 !to-red-500 !text-white' : ''
              }`}
              style={{ borderColor: slot.filled ? 'transparent' : category?.color }}>
              {slot.filled ? slot.word : '?'}
            </div>
          </div>
        ))}
      </div>

      {/* Tiles */}
      <div className="p-6 pt-2 flex flex-wrap justify-center gap-3 min-h-[120px]">
        <AnimatePresence>
          {tileWords.map((word, i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              draggable
              onDragStart={() => handleDragStart(word)}
              onDragEnd={handleDragEnd}
              className="puzzle-tile px-5 py-4 rounded-xl font-bold text-base sm:text-lg cursor-grab active:cursor-grabbing shadow-md"
              style={{ 
                background: `linear-gradient(145deg, ${category?.color}dd, ${category?.color}99)`,
                color: 'white'
              }}>
              {word}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}