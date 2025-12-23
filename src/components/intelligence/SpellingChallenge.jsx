import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Trophy, Zap, CheckCircle2, XCircle, RotateCcw, Loader2, Target } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import confetti from 'canvas-confetti';

export default function SpellingChallenge({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [droppedWord, setDroppedWord] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [availableWords, setAvailableWords] = useState([]);

  useEffect(() => {
    loadGameData();
  }, [item]);

  const loadGameData = async () => {
    setLoading(true);
    setCurrentLevel(0);
    setScore(0);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a spelling word challenge game about "${item}" (${category?.name}).
        
Generate 8 levels, each with:
1. A descriptive sentence about ${item} with ONE key word missing (mark missing word position with _____)
2. The correct word that fills the blank (must be topic-related, challenging spelling)
3. Three incorrect words (similar length/complexity, but wrong)
4. A brief explanation of why the correct word fits

Make words progressively harder. Focus on technical terms, scientific names, or advanced vocabulary related to ${item}.`,
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
                  sentence: { type: "string" },
                  correctWord: { type: "string" },
                  incorrectWords: { 
                    type: "array", 
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 3
                  },
                  explanation: { type: "string" }
                }
              }
            }
          }
        }
      });

      setGameData(response);
      if (response?.levels?.[0]) {
        const words = [
          response.levels[0].correctWord,
          ...response.levels[0].incorrectWords
        ].sort(() => Math.random() - 0.5);
        setAvailableWords(words);
      }
    } catch (error) {
      console.error('Failed to load game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination || showResult) return;

    const { source, destination } = result;

    if (destination.droppableId === 'blank-space' && source.droppableId === 'word-bank') {
      const word = availableWords[source.index];
      setDroppedWord(word);
      setAvailableWords(availableWords.filter((_, i) => i !== source.index));
    } else if (source.droppableId === 'blank-space' && destination.droppableId === 'word-bank') {
      // Moving word back from blank to bank
      setAvailableWords([...availableWords, droppedWord]);
      setDroppedWord(null);
    }
  };

  const handleSubmit = () => {
    if (!droppedWord) return;

    const level = gameData.levels[currentLevel];
    const correct = droppedWord === level.correctWord;

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 100);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [category?.color || '#6209e6', '#FFD700']
      });
    }
  };

  const handleNext = () => {
    if (currentLevel < gameData.levels.length - 1) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      setDroppedWord(null);
      setShowResult(false);
      
      const words = [
        gameData.levels[nextLevel].correctWord,
        ...gameData.levels[nextLevel].incorrectWords
      ].sort(() => Math.random() - 0.5);
      setAvailableWords(words);
    }
  };

  const handleReset = () => {
    const words = [
      gameData.levels[currentLevel].correctWord,
      ...gameData.levels[currentLevel].incorrectWords
    ].sort(() => Math.random() - 0.5);
    setAvailableWords(words);
    setDroppedWord(null);
    setShowResult(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
          <p className="text-gray-500">Loading spelling challenge...</p>
        </div>
      </div>
    );
  }

  if (!gameData?.levels?.length) return null;

  const level = gameData.levels[currentLevel];
  const isComplete = currentLevel === gameData.levels.length - 1 && showResult;

  if (isComplete) {
    const percentage = Math.round((score / (gameData.levels.length * 100)) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="text-center px-6 py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${category?.color}15` }}
          >
            <Trophy className="w-12 h-12" style={{ color: category?.color }} />
          </motion.div>

          <h3 className="text-3xl font-bold text-gray-900 mb-3">Challenge Complete! 🎉</h3>
          <p className="text-gray-600 text-lg mb-8">You've mastered the vocabulary!</p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="text-4xl font-bold mb-1" style={{ color: category?.color }}>{score}</div>
              <div className="text-sm text-gray-500 font-medium">Total Points</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="text-4xl font-bold text-blue-600 mb-1">{percentage}%</div>
              <div className="text-sm text-gray-500 font-medium">Accuracy</div>
            </div>
          </div>

          <button
            onClick={loadGameData}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: category?.color }}
          >
            <RotateCcw className="w-5 h-5" />
            Try New Words
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r p-6 text-white" style={{ background: `linear-gradient(135deg, ${category?.color}dd, ${category?.color}99)` }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            <h3 className="text-lg font-bold">Spelling Challenge</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
              <Zap className="w-4 h-4" />
              <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {gameData.levels.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i < currentLevel ? 'bg-white' :
                i === currentLevel ? 'bg-white/60' :
                'bg-white/20'
              }`}
            />
          ))}
        </div>
        <p className="text-white/80 text-sm">Level {currentLevel + 1} of {gameData.levels.length}</p>
      </div>

      {/* Game Content */}
      <div className="p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Sentence with Blank */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Complete the sentence:</h4>
            <div className="bg-gray-50 rounded-xl p-6 text-lg leading-relaxed">
              {level.sentence.split('_____').map((part, i) => (
                <React.Fragment key={i}>
                  <span className="text-gray-700">{part}</span>
                  {i < level.sentence.split('_____').length - 1 && (
                    <Droppable droppableId="blank-space">
                      {(provided, snapshot) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`inline-flex items-center justify-center min-w-[120px] h-12 px-4 mx-2 border-2 border-dashed rounded-lg transition-all ${
                            snapshot.isDraggingOver ? 'border-purple-500 bg-purple-50' :
                            droppedWord ? 'border-purple-500 bg-purple-50' :
                            'border-gray-300 bg-white'
                          }`}
                          style={{ display: 'inline-flex' }}
                        >
                          {droppedWord ? (
                            <Draggable draggableId={`placed-${droppedWord}`} index={0} isDragDisabled={showResult}>
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="font-bold text-gray-900"
                                >
                                  {droppedWord}
                                </span>
                              )}
                            </Draggable>
                          ) : (
                            <span className="text-gray-400 text-sm">Drop here</span>
                          )}
                          {provided.placeholder}
                        </span>
                      )}
                    </Droppable>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Available Words */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Drag a word to complete the sentence:</h4>
            <Droppable droppableId="word-bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-3 min-h-[60px]"
                >
                  {availableWords.map((word, index) => (
                    <Draggable key={`word-${word}-${index}`} draggableId={`word-${word}-${index}`} index={index} isDragDisabled={showResult}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-6 py-3 rounded-xl font-semibold text-gray-900 border-2 shadow-sm transition-all ${
                            showResult ? 'cursor-default' : 'cursor-move'
                          } ${
                            snapshot.isDragging ? 'border-purple-500 bg-purple-50 shadow-lg scale-105' :
                            'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          {word}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-xl mb-6 ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-semibold mb-1 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                      {isCorrect ? '🎉 Correct!' : `❌ Incorrect! The correct word is "${level.correctWord}"`}
                    </p>
                    <p className="text-sm text-gray-700">{level.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!showResult ? (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={!droppedWord}
                  className={`flex-1 py-3 rounded-xl font-medium text-white transition-all ${
                    droppedWord
                      ? 'shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: category?.color }}
                >
                  Submit Answer
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl font-medium border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                style={{ backgroundColor: category?.color }}
              >
                {currentLevel < gameData.levels.length - 1 ? 'Next Level →' : 'Complete Challenge 🎯'}
              </button>
            )}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}