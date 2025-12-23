import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trophy, RotateCcw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function WordPuzzleGame({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentWords, setCurrentWords] = useState([]);
  const [blankIndex, setBlankIndex] = useState(0);
  const [tileWords, setTileWords] = useState([]);
  const [slots, setSlots] = useState([]);
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
        prompt: `Create 6 word puzzle levels about "${item}" (${category?.name}). Each level has 4 related words and 4 distractor words.
        
Rules:
- words: 4 closely related terms/concepts about the topic (single words or short 2-word phrases)
- distractors: 4 words that are plausible but incorrect (related field but not core to this topic)
- Make progressively harder (level 1: basic terms, level 6: advanced concepts)
- Keep all words/phrases under 15 characters`,
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
      initLevel(0, response.levels);
    } catch (error) {
      console.error('Failed to generate puzzle:', error);
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

  const initLevel = (levelIndex, levelsData = levels) => {
    if (!levelsData[levelIndex]) return;

    const puzzle = levelsData[levelIndex];
    const shuffledWords = shuffle([...puzzle.words]);
    const blank = Math.floor(Math.random() * 4);

    const tiles = [...puzzle.distractors, shuffledWords[blank]];
    const shuffledTiles = shuffle(tiles);

    setCurrentWords(shuffledWords);
    setBlankIndex(blank);
    setTileWords(shuffledTiles);
    setSlots(shuffledWords.map((word, i) => ({
      word,
      filled: i !== blank,
      correct: false,
      wrong: false
    })));
  };

  const handleDragStart = (e, word) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedWord(word);
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    
    if (slotIndex !== blankIndex || !draggedWord) return;

    const correctWord = currentWords[blankIndex];
    
    if (draggedWord === correctWord) {
      // Correct!
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...newSlots[slotIndex], filled: true, correct: true };
      setSlots(newSlots);

      // Remove tile
      setTileWords(tileWords.filter(w => w !== draggedWord));

      setTimeout(() => {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1);
          initLevel(currentLevel + 1);
        } else {
          setGameComplete(true);
        }
      }, 1500);
    } else {
      // Wrong
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...newSlots[slotIndex], wrong: true };
      setSlots(newSlots);

      setTimeout(() => {
        const resetSlots = [...slots];
        resetSlots[slotIndex] = { ...resetSlots[slotIndex], wrong: false };
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
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}>
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-3xl font-bold text-gray-900 mb-3">🎉 Puzzle Master!</h3>
          <p className="text-lg text-gray-600 mb-6">You completed all {levels.length} levels about {item}!</p>
          <button
            onClick={() => {
              setCurrentLevel(0);
              setGameComplete(false);
              initLevel(0);
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
    <div className="bg-black rounded-xl p-6 sm:p-8 shadow-2xl border border-purple-900/30">
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">
          🧠 Word Puzzle Challenge
        </h3>
        <p className="text-purple-300/70 text-sm sm:text-base mb-4">
          Drag the correct word to fill the missing slot!
        </p>
        <div className="text-lg font-semibold text-purple-400">
          Level {currentLevel + 1} / {levels.length}
        </div>
      </div>

      {/* 4x1 Grid of Large Squares with Arrows */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-12 px-2 overflow-x-auto pb-2">
        {slots.map((slot, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i)}
              className={`
                w-32 h-32 sm:w-40 sm:h-40 rounded-2xl flex items-center justify-center
                text-sm sm:text-lg font-bold transition-all duration-300 cursor-pointer
                flex-shrink-0
                ${!slot.filled ? 'bg-purple-950/50 border-2 border-dashed border-purple-600/50 text-purple-500/40' : ''}
                ${slot.filled && !slot.correct ? 'bg-gradient-to-br from-purple-900 to-purple-800 border-2 border-purple-600 text-purple-200 shadow-lg shadow-purple-900/50' : ''}
                ${slot.correct ? 'bg-gradient-to-br from-purple-600 to-purple-700 border-2 border-purple-400 text-white shadow-xl shadow-purple-600/50 animate-pulse' : ''}
                ${slot.wrong ? 'bg-gradient-to-br from-red-900 to-red-800 border-2 border-red-600 animate-shake' : ''}
              `}
              style={{
                textShadow: slot.filled ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
              }}>
              <span className="text-center px-2 break-words">{slot.filled ? slot.word : '?'}</span>
            </motion.div>
            
            {/* Arrow between slots */}
            {i < slots.length - 1 && (
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Suggestive Word Tiles - Rounded Rectangles */}
      <div className="flex flex-wrap justify-center gap-3 min-h-24">
        <AnimatePresence>
          {tileWords.map((word, i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: i * 0.08 }}
              draggable
              onDragStart={(e) => handleDragStart(e, word)}
              onDragEnd={handleDragEnd}
              className="px-6 py-3 bg-gradient-to-r from-purple-800 to-purple-900
                       border border-purple-600/50 rounded-full flex items-center justify-center
                       text-sm sm:text-base font-semibold text-purple-200 cursor-grab active:cursor-grabbing
                       hover:scale-105 hover:shadow-lg hover:shadow-purple-700/50 transition-all duration-300
                       hover:border-purple-500 active:scale-110"
              style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                transform: draggedWord === word ? 'scale(1.1)' : 'scale(1)',
                opacity: draggedWord === word ? 0.7 : 1
              }}>
              {word}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}