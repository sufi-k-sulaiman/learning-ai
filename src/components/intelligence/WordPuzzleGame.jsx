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
  const [gameComplete, setGameComplete] = useState(false);
  const [draggedWord, setDraggedWord] = useState(null);

  useEffect(() => {
    loadGameData();
  }, [item]);

  const loadGameData = async () => {
    setLoading(true);
    setGameComplete(false);
    setCurrentLevel(0);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a word puzzle game about "${item}". Generate 4 levels:
        
Each level should have:
- 4 core words related to ${item} (words array)
- 4 distractor words that are incorrect (distractors array)

Keep words short (1-2 words max). Make them educational and relevant.`,
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

      setLevels(response.levels);
      initLevel(response.levels, 0);
    } catch (error) {
      console.error('Failed to load puzzle:', error);
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
    const currentWords = shuffle([...puzzle.words]);
    const blank = Math.floor(Math.random() * 4);

    const slotsData = currentWords.map((word, i) => ({
      id: i,
      expected: word,
      current: i === blank ? null : word,
      isBlank: i === blank,
      status: 'normal'
    }));

    const tileWords = [...puzzle.distractors, currentWords[blank]];
    const tilesData = shuffle(tileWords).map((word, i) => ({
      id: i,
      word: word,
      visible: true
    }));

    setSlots(slotsData);
    setTiles(tilesData);
    setBlankIndex(blank);
  };

  const handleDragStart = (e, word) => {
    setDraggedWord(word);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    const slot = slots[slotIndex];

    if (slot.isBlank && draggedWord === slot.expected) {
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...slot, current: draggedWord, status: 'correct' };
      setSlots(newSlots);

      const newTiles = tiles.map(t => 
        t.word === draggedWord ? { ...t, visible: false } : t
      );
      setTiles(newTiles);

      setTimeout(() => {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1);
          initLevel(levels, currentLevel + 1);
        } else {
          setGameComplete(true);
        }
      }, 1500);
    } else if (slot.isBlank) {
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...slot, status: 'wrong' };
      setSlots(newSlots);

      setTimeout(() => {
        const resetSlots = [...newSlots];
        resetSlots[slotIndex] = { ...resetSlots[slotIndex], status: 'normal' };
        setSlots(resetSlots);
      }, 600);
    }

    setDraggedWord(null);
  };

  const handleReset = () => {
    loadGameData();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
          <p className="text-gray-500">Loading word puzzle...</p>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${category?.color}15` }}>
            <Trophy className="w-10 h-10" style={{ color: category?.color }} />
          </motion.div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Puzzle Complete!</h3>
          <p className="text-gray-600 mb-6">You mastered all words about {item}!</p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: category?.color }}>
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Word Puzzle</h3>
          <div className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: `${category?.color}15`, color: category?.color }}>
            Level {currentLevel + 1} / {levels.length}
          </div>
        </div>
        <p className="text-gray-600 text-sm">Drag the correct word to fill the blank slot!</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {slots.map((slot, index) => (
          <motion.div
            key={slot.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`h-20 rounded-2xl border-2 flex items-center justify-center text-base font-bold transition-all ${
              slot.isBlank && !slot.current ? 'border-dashed border-gray-300 bg-gray-50' :
              slot.status === 'correct' ? 'bg-green-100 border-green-500 text-green-900' :
              slot.status === 'wrong' ? 'bg-red-100 border-red-500 text-red-900' :
              'bg-gray-100 border-gray-300 text-gray-900'
            }`}
            animate={slot.status === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}>
            {slot.current || '?'}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3 min-h-[100px]">
        <AnimatePresence>
          {tiles.filter(t => t.visible).map((tile) => (
            <motion.div
              key={tile.id}
              draggable
              onDragStart={(e) => handleDragStart(e, tile.word)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-full border-2 font-semibold cursor-grab active:cursor-grabbing text-sm"
              style={{ 
                borderColor: category?.color,
                backgroundColor: `${category?.color}10`,
                color: category?.color
              }}>
              {tile.word}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}