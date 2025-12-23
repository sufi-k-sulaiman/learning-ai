import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Loader2, Trophy } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function WordPuzzleGame({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [slots, setSlots] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [blankIndex, setBlankIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [draggedWord, setDraggedWord] = useState(null);

  useEffect(() => {
    generateLevels();
  }, [item]);

  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const generateLevels = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5 word puzzle levels about "${item}" (${category?.name}). 
        
Each level should have:
- 4 correct words that are closely related to the topic
- 4 distractor words that are plausible but wrong

Rules:
- Words should be 1-2 words max, concise
- Make it educational and fun
- Progress from easier to harder levels
- Distractors should be tempting but clearly wrong for experts

Return as JSON array.`,
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
              minItems: 5,
              maxItems: 5
            }
          }
        }
      });

      setLevels(response.levels || []);
      if (response.levels?.length > 0) {
        initLevel(0, response.levels);
      }
    } catch (error) {
      console.error('Failed to generate levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const initLevel = (levelIndex, levelsData) => {
    const puzzle = levelsData[levelIndex];
    const shuffledWords = shuffle([...puzzle.words]);
    const blank = Math.floor(Math.random() * 4);

    const tileWords = [...puzzle.distractors, shuffledWords[blank]];
    const shuffledTiles = shuffle(tileWords);

    setCorrectWords(shuffledWords);
    setBlankIndex(blank);
    setSlots(shuffledWords.map((word, i) => ({
      word,
      filled: i !== blank,
      correct: false,
      wrong: false
    })));
    setTiles(shuffledTiles.map(word => ({ word, used: false })));
  };

  const handleDragStart = (e, word) => {
    setDraggedWord(word);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    
    if (!draggedWord || slots[slotIndex].filled) return;

    const isCorrect = draggedWord === correctWords[slotIndex];

    if (isCorrect) {
      // Correct answer
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...newSlots[slotIndex], filled: true, correct: true };
      setSlots(newSlots);

      const newTiles = tiles.map(t => 
        t.word === draggedWord ? { ...t, used: true } : t
      );
      setTiles(newTiles);

      setTimeout(() => {
        const nextLevel = currentLevel + 1;
        if (nextLevel < levels.length) {
          setCurrentLevel(nextLevel);
          initLevel(nextLevel, levels);
        } else {
          setGameComplete(true);
        }
      }, 1500);
    } else {
      // Wrong answer
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...newSlots[slotIndex], wrong: true };
      setSlots(newSlots);

      setTimeout(() => {
        const resetSlots = [...newSlots];
        resetSlots[slotIndex] = { ...resetSlots[slotIndex], wrong: false };
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

  if (gameComplete) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6">
          <Trophy className="w-20 h-20 mx-auto mb-4" style={{ color: category?.color }} />
          <h3 className="text-3xl font-bold text-gray-900 mb-2">🎉 Puzzle Master!</h3>
          <p className="text-gray-600 text-lg">You completed all {levels.length} levels about {item}!</p>
        </motion.div>
        <button
          onClick={() => {
            setCurrentLevel(0);
            setGameComplete(false);
            initLevel(0, levels);
          }}
          className="px-8 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: category?.color }}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-indigo-950 rounded-xl p-6 sm:p-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
          🧠 Word Puzzle Challenge
        </h3>
        <p className="text-gray-300 mb-4">Drag the correct word to fill the missing slot!</p>
        <div className="text-xl font-semibold text-green-400">
          Level {currentLevel + 1} / {levels.length}
        </div>
      </div>

      {/* Slots */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap" style={{ perspective: '1200px' }}>
        {slots.map((slot, i) => (
          <div
            key={i}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
            className={`w-40 h-24 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
              slot.filled && !slot.correct
                ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-4 border-indigo-500 text-white shadow-lg'
                : slot.filled && slot.correct
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-green-400 text-white shadow-xl animate-pulse'
                : slot.wrong
                ? 'bg-gradient-to-br from-red-500 to-rose-600 border-4 border-red-400 text-white'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-dashed border-indigo-500/50 text-gray-500'
            }`}
            style={{
              textShadow: slot.filled ? '0 2px 10px rgba(0,255,136,0.5)' : 'none',
              transform: slot.correct ? 'rotateY(360deg) scale(1.05)' : 'none',
              boxShadow: slot.correct ? '0 15px 40px rgba(0,255,136,0.4)' : '0 12px 30px rgba(0,0,0,0.3)'
            }}>
            {slot.filled ? slot.word : '?'}
          </div>
        ))}
      </div>

      {/* Tiles */}
      <div className="flex justify-center gap-4 flex-wrap min-h-[120px]" style={{ perspective: '1000px' }}>
        <AnimatePresence>
          {tiles.filter(t => !t.used).map((tile, i) => (
            <motion.div
              key={tile.word}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              draggable
              onDragStart={(e) => handleDragStart(e, tile.word)}
              onDragEnd={handleDragEnd}
              className={`w-36 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 border-4 border-indigo-500 rounded-xl flex items-center justify-center text-base font-bold text-white cursor-grab active:cursor-grabbing transition-all duration-300 hover:scale-110 hover:shadow-2xl ${
                draggedWord === tile.word ? 'opacity-50 scale-125' : ''
              }`}
              style={{
                boxShadow: '0 12px 35px rgba(99, 102, 241, 0.4)',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
              {tile.word}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}