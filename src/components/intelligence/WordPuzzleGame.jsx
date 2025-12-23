import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trophy, RotateCcw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function WordPuzzleGame({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [slots, setSlots] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(0);
  const [draggedWord, setDraggedWord] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [completedSentence, setCompletedSentence] = useState('');
  const [touchedTile, setTouchedTile] = useState(null);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    generatePuzzle();
  }, [item]);

  const generatePuzzle = async () => {
    setLoading(true);
    setGameComplete(false);
    setCurrentLevel(0);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create 8 word puzzle levels about "${item}". Each level has 4 related words that form a meaningful sentence or phrase.
        
For each level provide:
- words: array of 4 words that form a sentence/phrase (in correct order)
- distractors: array of 4 misleading words that don't fit
- hint: a short hint about what connects the words
- sentence: the complete sentence formed by the 4 words
- didYouKnow: an interesting fact that relates to these 4 words (1-2 sentences, educational and engaging)

Example for "Water":
Level 1: words: ["H2O", "Molecule", "Liquid", "Life"], distractors: ["CO2", "Atom", "Gas", "Death"], sentence: "H2O Molecule Liquid Life", didYouKnow: "Every H2O molecule contains two hydrogen atoms bonded to one oxygen atom, and this simple structure makes water essential for all known forms of life on Earth!"`,
        response_json_schema: {
          type: "object",
          properties: {
            levels: {
              type: "array",
              minItems: 8,
              maxItems: 8,
              items: {
                type: "object",
                properties: {
                  words: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                  distractors: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                  hint: { type: "string" },
                  sentence: { type: "string" },
                  didYouKnow: { type: "string" }
                }
              }
            }
          }
        }
      });

      setLevels(response.levels || []);
      initLevel(response.levels[0]);
    } catch (error) {
      console.error('Failed to generate puzzle:', error);
    } finally {
      setLoading(false);
    }
  };

  const initLevel = (level) => {
    if (!level) return;

    const emptyIdx = Math.floor(Math.random() * 4);
    setEmptyIndex(emptyIdx);

    const slotsData = level.words.map((word, i) => ({
      word: i === emptyIdx ? '' : word,
      expected: word,
      isEmpty: i === emptyIdx,
      isCorrect: false,
      isWrong: false
    }));
    setSlots(slotsData);

    const allTiles = [...level.distractors, level.words[emptyIdx]];
    const shuffled = allTiles.sort(() => Math.random() - 0.5);
    setTiles(shuffled.map(word => ({ word, isUsed: false })));
  };

  const handleDragStart = (e, word) => {
    setDraggedWord(word);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    
    const slot = slots[slotIndex];
    if (!slot.isEmpty || !draggedWord) return;

    const isCorrect = draggedWord === slot.expected;

    if (isCorrect) {
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...slot, word: draggedWord, isEmpty: false, isCorrect: true };
      setSlots(newSlots);

      const newTiles = tiles.map(t => 
        t.word === draggedWord ? { ...t, isUsed: true } : t
      );
      setTiles(newTiles);

      // Show the completed sentence
      const sentence = levels[currentLevel]?.sentence || newSlots.map(s => s.word).join(' ');
      setCompletedSentence(sentence);
      
      setTimeout(() => {
        setShowLevelComplete(true);
      }, 800);
    } else {
      const newSlots = [...slots];
      newSlots[slotIndex] = { ...slot, isWrong: true };
      setSlots(newSlots);

      setTimeout(() => {
        const resetSlots = [...slots];
        resetSlots[slotIndex] = { ...slot, isWrong: false };
        setSlots(resetSlots);
      }, 600);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleContinue = () => {
    setShowLevelComplete(false);
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      initLevel(levels[currentLevel + 1]);
    } else {
      setGameComplete(true);
    }
  };

  // Touch handlers for iOS
  const handleTouchStart = (e, word) => {
    e.preventDefault();
    setTouchedTile(word);
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (touchedTile) {
      const touch = e.touches[0];
      setTouchPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (!touchedTile) return;

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const slotElement = element?.closest('[data-slot-index]');
    
    if (slotElement) {
      const slotIndex = parseInt(slotElement.getAttribute('data-slot-index'));
      const slot = slots[slotIndex];
      
      if (slot.isEmpty) {
        const isCorrect = touchedTile === slot.expected;
        
        if (isCorrect) {
          const newSlots = [...slots];
          newSlots[slotIndex] = { ...slot, word: touchedTile, isEmpty: false, isCorrect: true };
          setSlots(newSlots);

          const newTiles = tiles.map(t => 
            t.word === touchedTile ? { ...t, isUsed: true } : t
          );
          setTiles(newTiles);

          const sentence = levels[currentLevel]?.sentence || newSlots.map(s => s.word).join(' ');
          setCompletedSentence(sentence);
          
          setTimeout(() => {
            setShowLevelComplete(true);
          }, 800);
        } else {
          const newSlots = [...slots];
          newSlots[slotIndex] = { ...slot, isWrong: true };
          setSlots(newSlots);

          setTimeout(() => {
            const resetSlots = [...slots];
            resetSlots[slotIndex] = { ...slot, isWrong: false };
            setSlots(resetSlots);
          }, 600);
        }
      }
    }
    
    setTouchedTile(null);
    setTouchPosition({ x: 0, y: 0 });
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
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}>
            <Trophy className="w-16 h-16 mx-auto mb-4 text-green-600" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Puzzle Complete!</h3>
          <p className="text-gray-600 mb-6">You mastered all {levels.length} word puzzles!</p>
          <button
            onClick={generatePuzzle}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: category?.color }}>
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const currentLevelData = levels[currentLevel];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 relative">
      {/* Level Complete Overlay */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Perfect! ✨</h3>
                <p className="text-lg font-semibold mb-3" style={{ color: category?.color }}>
                  "{completedSentence}"
                </p>
                <div className="text-left bg-blue-50 rounded-lg p-4 mb-2">
                  <p className="text-sm font-semibold text-blue-900 mb-1">💡 Did You Know?</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {levels[currentLevel]?.didYouKnow}
                  </p>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="w-full py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: category?.color }}>
                {currentLevel < levels.length - 1 ? 'Continue to Next Level' : 'See Final Results'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Word Puzzle Challenge</h3>
        <p className="text-sm text-gray-600 mb-4">{currentLevelData?.hint}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Level</span>
          <span className="text-lg font-bold" style={{ color: category?.color }}>
            {currentLevel + 1} / {levels.length}
          </span>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
        {slots.map((slot, i) => (
          <motion.div
            key={i}
            data-slot-index={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onDrop={(e) => handleDrop(e, i)}
            onDragOver={handleDragOver}
            className={`
              aspect-square rounded-2xl flex items-center justify-center text-lg font-bold
              transition-all duration-300 cursor-pointer
              ${slot.isEmpty ? 'border-4 border-dashed border-purple-300 bg-white' : 'border-4 border-purple-400'}
              ${slot.isCorrect ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-500 text-white animate-pulse' : ''}
              ${slot.isWrong ? 'bg-gradient-to-br from-red-400 to-red-500 border-red-500 text-white' : ''}
              ${!slot.isEmpty && !slot.isCorrect && !slot.isWrong ? 'bg-gradient-to-br from-purple-100 to-purple-200 text-gray-900' : ''}
              ${slot.isEmpty ? 'hover:border-purple-500 hover:bg-purple-50' : ''}
            `}
            style={{
              boxShadow: slot.isCorrect ? '0 0 30px rgba(34, 197, 94, 0.4)' : 
                         slot.isWrong ? '0 0 20px rgba(239, 68, 68, 0.4)' : 
                         'none',
              animation: slot.isWrong ? 'shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)' : 'none'
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
          {tiles.filter(t => !t.isUsed).map((tile, i) => (
            <motion.div
              key={tile.word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: i * 0.05 }}
              draggable
              onDragStart={(e) => handleDragStart(e, tile.word)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, tile.word)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="px-6 py-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 touch-none select-none"
              style={{
                opacity: (draggedWord === tile.word || touchedTile === tile.word) ? 0.5 : 1,
                transform: (draggedWord === tile.word || touchedTile === tile.word) ? 'scale(1.1)' : 'scale(1)'
              }}>
              {tile.word}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating tile during touch */}
      {touchedTile && (
        <div
          className="fixed pointer-events-none z-50 px-6 py-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full font-semibold text-base shadow-2xl"
          style={{
            left: touchPosition.x,
            top: touchPosition.y,
            transform: 'translate(-50%, -50%)',
            opacity: 0.9
          }}>
          {touchedTile}
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}