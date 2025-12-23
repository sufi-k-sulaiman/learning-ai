import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trophy, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function WordPuzzle({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [slots, setSlots] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [blankIndex, setBlankIndex] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successSentence, setSuccessSentence] = useState('');
  const [draggedWord, setDraggedWord] = useState(null);
  const [touchStartPos, setTouchStartPos] = useState(null);

  useEffect(() => {
    generateLevels();
  }, [item]);

  const generateLevels = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 6 progressive word puzzle levels about "${item}". Each level has 4 words that form a meaningful phrase or concept.
        
Rules:
- Level 1: Basic/simple concepts (e.g., for "Water": ["Pure", "Fresh", "Clean", "H2O"])
- Level 2-6: Progressively more complex/technical terms
- Each level must have exactly 4 words that relate to ${item}
- Also provide 5 distractor words for each level (similar but incorrect)
- Words should be 2-10 characters max`,
        response_json_schema: {
          type: "object",
          properties: {
            levels: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  words: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                  distractors: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 5 }
                }
              },
              minItems: 6,
              maxItems: 6
            }
          }
        }
      });

      setLevels(response.levels || []);
      initLevel(0, response.levels || []);
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

  const initLevel = (levelIndex, levelsData) => {
    const puzzle = levelsData[levelIndex];
    const shuffledWords = shuffle(puzzle.words);
    const blank = Math.floor(Math.random() * 4);

    const slotData = shuffledWords.map((word, i) => ({
      id: i,
      word: i === blank ? '' : word,
      expected: word,
      isEmpty: i === blank,
      isCorrect: false,
      isWrong: false
    }));

    const tileWords = shuffle([...puzzle.distractors, shuffledWords[blank]]);
    const tileData = tileWords.map((word, i) => ({
      id: i,
      word
    }));

    setSlots(slotData);
    setTiles(tileData);
    setBlankIndex(blank);
  };

  const handleDrop = (slotId, droppedWord) => {
    const slot = slots.find(s => s.id === slotId);
    
    if (slot.isEmpty && droppedWord === slot.expected) {
      // Correct!
      const newSlots = slots.map(s => 
        s.id === slotId ? { ...s, word: droppedWord, isEmpty: false, isCorrect: true } : s
      );
      setSlots(newSlots);

      // Remove tile
      setTiles(prev => prev.filter(t => t.word !== droppedWord));

      // Generate success sentence
      setTimeout(async () => {
        try {
          const allWords = newSlots.map(s => s.word).join(', ');
          const response = await base44.integrations.Core.InvokeLLM({
            prompt: `Create one meaningful, educational sentence about "${item}" using these 4 words: ${allWords}. The sentence should be informative and flow naturally. Return only the sentence.`,
            response_json_schema: {
              type: "object",
              properties: {
                sentence: { type: "string" }
              }
            }
          });
          setSuccessSentence(response.sentence || '');
        } catch (error) {
          setSuccessSentence(`Great job! You correctly identified: ${allWords}.`);
        }
        setShowSuccess(true);
      }, 1000);
    } else if (slot.isEmpty) {
      // Wrong
      const newSlots = slots.map(s => 
        s.id === slotId ? { ...s, isWrong: true } : s
      );
      setSlots(newSlots);
      
      setTimeout(() => {
        setSlots(prev => prev.map(s => ({ ...s, isWrong: false })));
      }, 600);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
          <p className="text-gray-500">Creating word puzzle...</p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    setShowSuccess(false);
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      initLevel(currentLevel + 1, levels);
    } else {
      setGameComplete(true);
    }
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Puzzle Master!</h3>
        <p className="text-gray-600 mb-6">You completed all {levels.length} levels!</p>
        <button
          onClick={() => {
            setGameComplete(false);
            setCurrentLevel(0);
            generateLevels();
          }}
          className="px-6 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: category?.color }}>
          Play Again
        </button>
      </motion.div>
    );
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: category?.color }} />
        <h3 className="text-xl font-bold text-gray-900 mb-4">Perfect! 🎯</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-md mx-auto">
          {successSentence}
        </p>
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: category?.color }}>
          {currentLevel < levels.length - 1 ? 'Next Level →' : 'Finish'}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: category?.color }} />
            <h3 className="text-lg font-bold text-gray-900">Word Puzzle</h3>
          </div>
          <div className="text-sm font-medium text-gray-600">
            Level {currentLevel + 1} / {levels.length}
          </div>
        </div>
        <p className="text-sm text-gray-600">Drag the correct word to fill the blank slot!</p>
      </div>

      <div className="p-6">
        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
          {slots.map((slot) => (
            <div
              key={slot.id}
              data-slot-id={slot.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const word = e.dataTransfer.getData('text/plain');
                handleDrop(slot.id, word);
              }}
              className={`
                aspect-square rounded-2xl border-3 flex items-center justify-center
                text-lg font-bold transition-all duration-300
                ${slot.isEmpty ? 
                  'border-dashed border-gray-300 bg-gray-50' : 
                  'border-solid bg-gradient-to-br shadow-lg'
                }
                ${slot.isCorrect ? 
                  'animate-bounce bg-green-50 border-green-500 text-green-900' : 
                  ''
                }
                ${slot.isWrong ? 
                  'animate-shake bg-red-50 border-red-500' : 
                  !slot.isEmpty ? 'border-gray-200 from-gray-50 to-gray-100 text-gray-900' : ''
                }
              `}
              style={!slot.isEmpty && !slot.isCorrect && !slot.isWrong ? {
                background: `linear-gradient(135deg, ${category?.color}15, ${category?.color}05)`
              } : {}}>
              {slot.word || '?'}
            </div>
          ))}
        </div>

        {/* Rounded Tile Suggestions */}
        <div className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {tiles.map((tile) => (
              <motion.div
                key={tile.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', tile.word);
                  setDraggedWord(tile.word);
                }}
                onDragEnd={() => setDraggedWord(null)}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  setTouchStartPos({ x: touch.clientX, y: touch.clientY });
                  setDraggedWord(tile.word);
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.opacity = '0.8';
                }}
                onTouchMove={(e) => {
                  if (!draggedWord) return;
                  e.preventDefault();
                  const touch = e.touches[0];
                  const element = e.currentTarget;
                  element.style.position = 'fixed';
                  element.style.zIndex = '9999';
                  element.style.left = `${touch.clientX - 50}px`;
                  element.style.top = `${touch.clientY - 20}px`;
                }}
                onTouchEnd={(e) => {
                  if (!draggedWord) return;
                  const touch = e.changedTouches[0];
                  const element = document.elementFromPoint(touch.clientX, touch.clientY);
                  const slot = element?.closest('[data-slot-id]');
                  
                  if (slot) {
                    const slotId = parseInt(slot.dataset.slotId);
                    handleDrop(slotId, draggedWord);
                  }
                  
                  e.currentTarget.style.position = '';
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.opacity = '';
                  e.currentTarget.style.left = '';
                  e.currentTarget.style.top = '';
                  e.currentTarget.style.zIndex = '';
                  setDraggedWord(null);
                  setTouchStartPos(null);
                }}
                className="px-6 py-3 rounded-full font-semibold cursor-grab active:cursor-grabbing
                          shadow-md hover:shadow-lg active:scale-95 transition-all touch-manipulation"
                style={{ 
                  backgroundColor: `${category?.color}20`,
                  color: category?.color,
                  border: `2px solid ${category?.color}40`
                }}>
                {tile.word}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}