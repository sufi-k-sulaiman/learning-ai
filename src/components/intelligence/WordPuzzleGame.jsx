import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function WordPuzzleGame({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [slots, setSlots] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [blankIndex, setBlankIndex] = useState(0);
  const [draggedWord, setDraggedWord] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    generatePuzzle();
  }, [item]);

  const generatePuzzle = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a word puzzle game about "${item}" with 3 levels. Each level has 4 related words and 4 distractor words.
        
        Return 3 levels where each level contains:
        - words: array of 4 words closely related to ${item}
        - distractors: array of 4 words that seem related but are incorrect
        
        Make it educational and fun!`,
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
              minItems: 3,
              maxItems: 3
            }
          }
        }
      });

      setLevels(response.levels || []);
      initLevel(response.levels || [], 0);
    } catch (error) {
      console.error('Failed to generate puzzle:', error);
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
    if (!levelsData[levelIndex]) return;

    const puzzle = levelsData[levelIndex];
    const shuffledWords = shuffle([...puzzle.words]);
    const blank = Math.floor(Math.random() * 4);

    const newSlots = shuffledWords.map((word, i) => ({
      word: i === blank ? '' : word,
      expected: word,
      isEmpty: i === blank,
      isCorrect: false,
      isWrong: false
    }));

    const tileWords = shuffle([...puzzle.distractors, shuffledWords[blank]]);
    const newTiles = tileWords.map(word => ({ word, used: false }));

    setSlots(newSlots);
    setTiles(newTiles);
    setBlankIndex(blank);
  };

  const handleDragStart = (word) => {
    setDraggedWord(word);
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  const handleDrop = (slotIndex) => {
    if (!draggedWord || !slots[slotIndex].isEmpty) return;

    const isCorrect = draggedWord === slots[slotIndex].expected;

    if (isCorrect) {
      // Correct answer
      const newSlots = [...slots];
      newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        word: draggedWord,
        isEmpty: false,
        isCorrect: true
      };
      setSlots(newSlots);

      // Remove used tile
      setTiles(tiles.map(t => t.word === draggedWord ? { ...t, used: true } : t));

      // Move to next level after delay
      setTimeout(() => {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1);
          initLevel(levels, currentLevel + 1);
        } else {
          setGameComplete(true);
        }
      }, 1500);
    } else {
      // Wrong answer
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...newSlots[slotIndex], isWrong: true };
      setSlots(newSlots);

      setTimeout(() => {
        const resetSlots = [...newSlots];
        resetSlots[slotIndex] = { ...resetSlots[slotIndex], isWrong: false };
        setSlots(resetSlots);
      }, 600);
    }

    setDraggedWord(null);
  };

  const handleReset = () => {
    setCurrentLevel(0);
    setGameComplete(false);
    initLevel(levels, 0);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mb-4" style={{ borderColor: category?.color, borderTopColor: 'transparent' }} />
          <p className="text-gray-500">Generating word puzzle...</p>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6">
          <Trophy className="w-16 h-16 mx-auto mb-4" style={{ color: category?.color }} />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Puzzle Complete! 🎉</h3>
          <p className="text-gray-600">You've mastered all the words about {item}!</p>
        </motion.div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: category?.color }}>
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6" style={{ color: category?.color }} />
            <h3 className="text-lg font-bold text-gray-900">Word Puzzle</h3>
          </div>
          <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
            Level {currentLevel + 1} / {levels.length}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Drag the correct word to fill the missing slot!</p>
      </div>

      {/* Game Area */}
      <div className="p-6">
        {/* 2x2 Grid Slots */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {slots.map((slot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className={`
                h-24 rounded-2xl border-2 flex items-center justify-center font-bold text-lg transition-all
                ${slot.isEmpty ? 'border-dashed border-gray-300 bg-gray-50' : 'border-gray-200 bg-white'}
                ${slot.isCorrect ? 'bg-green-100 border-green-500 animate-pulse' : ''}
                ${slot.isWrong ? 'bg-red-100 border-red-500 animate-shake' : ''}
              `}
              style={{
                borderColor: slot.isCorrect ? '#10B981' : slot.isWrong ? '#EF4444' : undefined
              }}>
              {slot.word || (
                <span className="text-gray-400 text-sm">Drop here</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tiles */}
        <div className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {tiles.filter(t => !t.used).map((tile, i) => (
              <motion.div
                key={tile.word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: i * 0.05 }}
                draggable
                onDragStart={() => handleDragStart(tile.word)}
                onDragEnd={handleDragEnd}
                className="px-6 py-3 rounded-full font-semibold cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg transition-all text-white"
                style={{ backgroundColor: category?.color }}>
                {tile.word}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}