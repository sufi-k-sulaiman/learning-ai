import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Loader2, RotateCcw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function WordPuzzleGame({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [slots, setSlots] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [blankIndex, setBlankIndex] = useState(0);
  const [draggedWord, setDraggedWord] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    generateLevels();
  }, [item]);

  const generateLevels = async () => {
    setLoading(true);
    setIsComplete(false);
    setCurrentLevel(0);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 4 challenging word puzzle levels about "${item}":
        
Each level should have:
- 4 related words (directly connected to the topic)
- 4 distractor words (plausible but incorrect alternatives)

Make them educational and fun! Keep words short (1-2 words max).`,
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

  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const initLevel = (levelIndex, levelsData = levels) => {
    if (!levelsData[levelIndex]) return;
    
    const puzzle = levelsData[levelIndex];
    const shuffledWords = shuffle([...puzzle.words]);
    const blank = Math.floor(Math.random() * 4);
    
    setBlankIndex(blank);
    
    const newSlots = shuffledWords.map((word, i) => ({
      word,
      expected: word,
      isEmpty: i === blank,
      isCorrect: false,
      isWrong: false
    }));
    
    setSlots(newSlots);
    
    const tileWords = [...puzzle.distractors, shuffledWords[blank]];
    const newTiles = shuffle(tileWords).map(word => ({ word, visible: true }));
    setTiles(newTiles);
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
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    
    const slot = slots[slotIndex];
    if (!slot.isEmpty) return;
    
    if (draggedWord === slot.expected) {
      // Correct!
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...slot, isEmpty: false, isCorrect: true };
      setSlots(newSlots);
      
      // Remove tile
      const newTiles = tiles.map(t => 
        t.word === draggedWord ? { ...t, visible: false } : t
      );
      setTiles(newTiles);
      
      // Move to next level
      setTimeout(() => {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1);
          initLevel(currentLevel + 1);
        } else {
          setIsComplete(true);
        }
      }, 1200);
    } else {
      // Wrong
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...slot, isWrong: true };
      setSlots(newSlots);
      
      setTimeout(() => {
        const resetSlots = [...slots];
        resetSlots[slotIndex] = { ...slot, isWrong: false };
        setSlots(resetSlots);
      }, 600);
    }
    
    setDraggedWord(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: category?.color }} />
          <p className="text-gray-500">Generating word puzzle...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${category?.color}15` }}>
          <Trophy className="w-10 h-10" style={{ color: category?.color }} />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Puzzle Complete! 🎉</h3>
        <p className="text-gray-600 mb-6">You mastered all word puzzles about {item}!</p>
        <button
          onClick={generateLevels}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: category?.color }}>
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Word Puzzle</h3>
          <div className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: `${category?.color}15`, color: category?.color }}>
            Level {currentLevel + 1} / {levels.length}
          </div>
        </div>
        <p className="text-sm text-gray-600">Drag the correct word to fill the empty slot!</p>
      </div>

      {/* 2x2 Grid Slots */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {slots.map((slot, i) => (
          <motion.div
            key={i}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
            className={`h-20 rounded-2xl border-2 flex items-center justify-center text-lg font-bold transition-all ${
              slot.isEmpty
                ? 'border-dashed border-gray-300 bg-gray-50 text-gray-400'
                : slot.isCorrect
                ? 'border-green-500 bg-green-50 text-green-900'
                : slot.isWrong
                ? 'border-red-500 bg-red-50 text-red-900'
                : 'border-gray-200 bg-white text-gray-900'
            }`}
            animate={
              slot.isCorrect
                ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                : slot.isWrong
                ? { x: [-10, 10, -10, 10, 0] }
                : {}
            }
            transition={{ duration: 0.5 }}>
            {!slot.isEmpty && slot.word}
          </motion.div>
        ))}
      </div>

      {/* Tiles */}
      <div className="flex flex-wrap justify-center gap-3">
        <AnimatePresence>
          {tiles.filter(t => t.visible).map((tile, i) => (
            <motion.div
              key={`${tile.word}-${i}`}
              draggable
              onDragStart={(e) => handleDragStart(e, tile.word)}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.05 }}
              className="px-5 py-3 rounded-full font-semibold cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg transition-all"
              style={{ 
                backgroundColor: `${category?.color}15`,
                color: category?.color,
                border: `2px solid ${category?.color}40`
              }}>
              {tile.word}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}