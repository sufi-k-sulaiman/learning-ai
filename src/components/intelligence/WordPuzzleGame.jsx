import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Trophy, Zap, Sparkles, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import confetti from 'canvas-confetti';

export default function WordPuzzleGame({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([null, null, null, null]);
  const [availableWords, setAvailableWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    generateLevel();
  }, [item, level]);

  const generateLevel = async () => {
    setLoading(true);
    setShowResult(false);
    setIsCorrect(false);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a word puzzle game for "${item}" (${category?.name}):
        
        Create a sentence with 4 words where 1 word is missing (replaced with ___).
        
        Provide:
        1. sentence: The sentence with ___ for the missing word (e.g., "The ___ is essential for photosynthesis")
        2. correctWord: The word that fits in the blank
        3. decoyWords: 3 similar/related words that DON'T fit (make them challenging)
        4. explanation: Why the correct word is right (1 sentence)
        5. difficulty: Level ${level} (make it progressively harder)
        
        All words should be related to ${item} and ${category?.name}.`,
        response_json_schema: {
          type: "object",
          properties: {
            sentence: { type: "string" },
            correctWord: { type: "string" },
            decoyWords: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
            explanation: { type: "string" },
            difficulty: { type: "string" }
          }
        }
      });

      // Shuffle all words
      const allWords = [response.correctWord, ...response.decoyWords].sort(() => Math.random() - 0.5);
      
      setGameData(response);
      setAvailableWords(allWords.map((word, i) => ({ id: `word-${i}`, text: word })));
      setSelectedSlots([null, null, null, null]);
    } catch (error) {
      console.error('Failed to generate level:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Moving from available words to slots
    if (source.droppableId === 'available' && destination.droppableId.startsWith('slot-')) {
      const slotIndex = parseInt(destination.droppableId.split('-')[1]);
      const wordIndex = source.index;
      const word = availableWords[wordIndex];

      // Remove from available
      const newAvailable = availableWords.filter((_, i) => i !== wordIndex);
      
      // Add to slot (replace if occupied)
      const newSlots = [...selectedSlots];
      if (newSlots[slotIndex]) {
        newAvailable.push(newSlots[slotIndex]);
      }
      newSlots[slotIndex] = word;

      setAvailableWords(newAvailable);
      setSelectedSlots(newSlots);
    }
    
    // Moving from slot back to available
    if (source.droppableId.startsWith('slot-') && destination.droppableId === 'available') {
      const slotIndex = parseInt(source.droppableId.split('-')[1]);
      const word = selectedSlots[slotIndex];

      const newSlots = [...selectedSlots];
      newSlots[slotIndex] = null;

      setSelectedSlots(newSlots);
      setAvailableWords([...availableWords, word]);
    }
    
    // Moving between slots
    if (source.droppableId.startsWith('slot-') && destination.droppableId.startsWith('slot-')) {
      const sourceIndex = parseInt(source.droppableId.split('-')[1]);
      const destIndex = parseInt(destination.droppableId.split('-')[1]);

      const newSlots = [...selectedSlots];
      const temp = newSlots[destIndex];
      newSlots[destIndex] = newSlots[sourceIndex];
      newSlots[sourceIndex] = temp;

      setSelectedSlots(newSlots);
    }
  };

  const checkAnswer = () => {
    const sentence = gameData.sentence.split('___');
    let blankIndex = -1;
    
    // Find which slot should have the answer
    const words = sentence[0].trim().split(' ').length - 1;
    blankIndex = words;

    const userWord = selectedSlots[blankIndex]?.text;
    const correct = userWord?.toLowerCase() === gameData.correctWord.toLowerCase();

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + level * 10);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [category?.color || '#6209e6', '#FFD700']
      });
    }
  };

  const nextLevel = () => {
    setLevel(level + 1);
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    generateLevel();
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

  const sentenceParts = gameData.sentence.split('___');

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r" style={{ background: `linear-gradient(135deg, ${category?.color}15, ${category?.color}05)` }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6" style={{ color: category?.color }} />
            <h3 className="text-xl font-bold text-gray-900">Word Challenge</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-white rounded-full text-sm font-semibold" style={{ color: category?.color }}>
              Level {level}
            </div>
            <div className="px-3 py-1 bg-white rounded-full text-sm font-semibold flex items-center gap-1">
              <Trophy className="w-4 h-4" style={{ color: category?.color }} />
              {score}
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm">Drag the correct word to complete the sentence</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="p-6 space-y-6">
          {/* Sentence with Slots */}
          <div className="bg-gray-50 rounded-xl p-6 min-h-[120px]">
            <div className="flex flex-wrap items-center gap-3 text-lg sm:text-xl font-medium text-gray-900">
              {sentenceParts.map((part, i) => (
                <React.Fragment key={i}>
                  <span>{part}</span>
                  {i < sentenceParts.length - 1 && (
                    <Droppable droppableId={`slot-${i}`} direction="horizontal">
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-w-[140px] h-14 rounded-lg border-2 border-dashed transition-all flex items-center justify-center ${
                            snapshot.isDraggingOver ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-white'
                          }`}
                          style={{
                            transform: snapshot.isDraggingOver ? 'scale(1.05)' : 'scale(1)'
                          }}>
                          {selectedSlots[i] ? (
                            <Draggable draggableId={selectedSlots[i].id} index={0}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`px-4 py-2 rounded-lg font-semibold cursor-move transition-all ${
                                    snapshot.isDragging ? 'shadow-xl opacity-80' : 'shadow-md'
                                  }`}
                                  style={{
                                    backgroundColor: category?.color,
                                    color: 'white',
                                    ...provided.draggableProps.style
                                  }}>
                                  {selectedSlots[i].text}
                                </div>
                              )}
                            </Draggable>
                          ) : (
                            <span className="text-gray-400 text-sm">Drop here</span>
                          )}
                          {provided.placeholder}
                        </motion.div>
                      )}
                    </Droppable>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Available Words */}
          <Droppable droppableId="available" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex flex-wrap gap-3 p-6 rounded-xl border-2 transition-all min-h-[100px] ${
                  snapshot.isDraggingOver ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'
                }`}>
                {availableWords.length === 0 ? (
                  <p className="text-gray-400 text-sm w-full text-center">All words placed!</p>
                ) : (
                  availableWords.map((word, index) => (
                    <Draggable key={word.id} draggableId={word.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-5 py-3 rounded-lg font-semibold cursor-move transition-all shadow-md hover:shadow-lg ${
                            snapshot.isDragging ? 'opacity-50 rotate-3' : ''
                          }`}
                          style={{
                            backgroundColor: category?.color,
                            color: 'white',
                            ...provided.draggableProps.style
                          }}>
                          {word.text}
                        </motion.div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 rounded-xl ${
                  isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
                }`}>
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <>
                      <Zap className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-green-900 text-lg">Perfect! 🎉</h4>
                        <p className="text-green-700">{gameData.explanation}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">!</div>
                      <div>
                        <h4 className="font-bold text-red-900 text-lg">Not quite right</h4>
                        <p className="text-red-700">The correct answer is: <span className="font-bold">{gameData.correctWord}</span></p>
                        <p className="text-red-600 text-sm mt-1">{gameData.explanation}</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex gap-3 mt-4">
                  {isCorrect ? (
                    <button
                      onClick={nextLevel}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                      style={{ backgroundColor: category?.color }}>
                      Next Level <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowResult(false);
                        setSelectedSlots([null, null, null, null]);
                        setAvailableWords(availableWords.concat(selectedSlots.filter(Boolean)));
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                      style={{ backgroundColor: category?.color }}>
                      Try Again <RotateCcw className="w-5 h-5" />
                    </button>
                  )}
                  
                  <button
                    onClick={resetGame}
                    className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all">
                    Reset Game
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Check Answer Button */}
          {!showResult && (
            <button
              onClick={checkAnswer}
              disabled={selectedSlots.some(slot => slot === null)}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all ${
                selectedSlots.some(slot => slot === null)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
              }`}
              style={{
                backgroundColor: selectedSlots.some(slot => slot === null) ? undefined : category?.color
              }}>
              Check Answer
            </button>
          )}
        </div>
      </DragDropContext>
    </div>
  );
}