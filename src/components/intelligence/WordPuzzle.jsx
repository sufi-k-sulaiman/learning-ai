import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function WordPuzzle({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [slots, setSlots] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [blankIndex, setBlankIndex] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [draggedWord, setDraggedWord] = useState(null);

  useEffect(() => {
    generateGame();
  }, [item]);

  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const generateGame = async () => {
    setLoading(true);
    setGameComplete(false);
    setCurrentLevel(0);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a word puzzle game about "${item}" (${category?.name}):
        
Generate 4 levels, each with:
- 4 words that form a meaningful sequence or are strongly related to ${item}
- 4 distractor words that are plausible but incorrect

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
              minItems: 4,
              maxItems: 4
            }
          }
        }
      });

      setGameData(response);
      initLevel(response.levels[0]);
    } catch (error) {
      console.error('Failed to generate game:', error);
    } finally {
      setLoading(false);
    }
  };

  const initLevel = (level) => {
    const shuffledWords = shuffle(level.words);
    const blank = Math.floor(Math.random() * 4);
    
    const slotData = shuffledWords.map((word, i) => ({
      word,
      isEmpty: i === blank,
      isCorrect: false,
      isWrong: false
    }));

    const tileWords = [...level.distractors, shuffledWords[blank]];
    const tileData = shuffle(tileWords).map(word => ({
      word,
      isUsed: false
    }));

    setSlots(slotData);
    setTiles(tileData);
    setBlankIndex(blank);
  };

  const handleDragStart = (e, word) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedWord(word);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    
    if (slotIndex !== blankIndex || !draggedWord) return;

    const correctWord = slots[slotIndex].word;
    
    if (draggedWord === correctWord) {
      // Correct answer
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...newSlots[slotIndex], isEmpty: false, isCorrect: true };
      setSlots(newSlots);

      const newTiles = tiles.map(t => 
        t.word === draggedWord ? { ...t, isUsed: true } : t
      );
      setTiles(newTiles);

      // Move to next level after delay
      setTimeout(() => {
        const nextLevel = currentLevel + 1;
        if (nextLevel < gameData.levels.length) {
          setCurrentLevel(nextLevel);
          initLevel(gameData.levels[nextLevel]);
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

  if (!gameData) return null;

  if (gameComplete) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}>
          <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: category?.color }} />
          <h3 className="text-3xl font-bold text-gray-900 mb-3">🎉 Puzzle Complete!</h3>
          <p className="text-gray-600 text-lg mb-6">You mastered all {gameData.levels.length} levels!</p>
          <button
            onClick={generateGame}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: category?.color }}>
            <RefreshCw className="w-5 h-5" />
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Word Puzzle Challenge</h3>
        <p className="text-gray-600">Drag the correct word to fill the blank slot!</p>
        <div className="mt-3 inline-block px-4 py-2 bg-white rounded-full shadow-sm">
          <span className="font-bold" style={{ color: category?.color }}>
            Level {currentLevel + 1} / {gameData.levels.length}
          </span>
        </div>
      </div>

      {/* 2x2 Grid of Slots */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
        {slots.map((slot, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              aspect-square rounded-2xl flex items-center justify-center text-xl font-bold
              transition-all duration-300 cursor-default
              ${slot.isEmpty ? 
                'bg-white border-4 border-dashed border-purple-300 text-gray-400' : 
                slot.isCorrect ?
                'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg animate-pulse' :
                slot.isWrong ?
                'bg-gradient-to-br from-red-400 to-red-500 text-white animate-shake' :
                'bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md'
              }
            `}>
            {slot.isEmpty ? '?' : slot.word}
          </motion.div>
        ))}
      </div>

      {/* Tiles */}
      <div className="flex flex-wrap justify-center gap-3">
        <AnimatePresence>
          {tiles.filter(t => !t.isUsed).map((tile, index) => (
            <motion.div
              key={tile.word}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
              transition={{ delay: index * 0.05 }}
              draggable
              onDragStart={(e) => handleDragStart(e, tile.word)}
              className="px-5 py-3 bg-white rounded-full border-2 border-purple-300 text-gray-900 font-semibold
                       cursor-grab active:cursor-grabbing hover:shadow-lg hover:scale-105 transition-all
                       hover:border-purple-500 select-none">
              {tile.word}
            </motion.div>
          ))}
        </AnimatePresence>
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