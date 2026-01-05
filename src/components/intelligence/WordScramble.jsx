import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Star, Loader2, RotateCcw, Lightbulb, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import confetti from 'canvas-confetti';

export default function WordScramble({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(0);
  const [userInputs, setUserInputs] = useState([]);
  const [gameState, setGameState] = useState('loading'); // loading, playing, correct, wrong, complete
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (item) {
      loadWords();
    }
  }, [item]);

  const loadWords = async () => {
    setLoading(true);
    setGameState('loading');
    setError(null);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 8 key vocabulary terms related to "${item}" (${category?.name || 'general'}) for a fill-in-the-blanks learning game.
        
        For each word provide:
        1. word: the term (single word, 4-12 letters, no spaces or underscores)
        2. meaning: a clear definition explaining what this term means (15-25 words)
        3. importance: why this term matters or its significance related to ${item} (15-25 words)
        4. hint: first letter and last letter hint format like "Starts with 'P', ends with 'S'"
        
        Choose words that are:
        - Important vocabulary related to the topic
        - Educational and commonly used terms
        - Single words only (no phrases)
        - Mix of different difficulty levels`,
        response_json_schema: {
          type: "object",
          properties: {
            words: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  word: { type: "string" },
                  meaning: { type: "string" },
                  importance: { type: "string" },
                  hint: { type: "string" }
                }
              },
              minItems: 8,
              maxItems: 8
            }
          }
        }
      });

      const validWords = (response?.words || []).filter(w => w?.word && w.word.length >= 3);
      
      if (validWords.length === 0) {
        setError('Could not generate words. Please try again.');
        setGameState('error');
      } else {
        setWords(validWords);
        // Initialize inputs for first word
        const firstWordLength = validWords[0].word.replace(/[^a-zA-Z]/g, '').length;
        setUserInputs(new Array(firstWordLength).fill(''));
        setGameState('playing');
      }
    } catch (err) {
      console.error('Failed to load words:', err);
      setError('Failed to load the game. Please try again.');
      setGameState('error');
    } finally {
      setLoading(false);
    }
  };

  // Generate blanks with some letters revealed
  const generateBlanks = (word) => {
    if (!word) return [];
    const cleanWord = word.toUpperCase().replace(/[^A-Z]/g, '');
    const blanks = [];
    
    // Reveal first letter, last letter, and ~30% of middle letters
    for (let i = 0; i < cleanWord.length; i++) {
      const isFirst = i === 0;
      const isLast = i === cleanWord.length - 1;
      const revealMiddle = Math.random() < 0.3 && cleanWord.length > 4;
      
      blanks.push({
        letter: cleanWord[i],
        revealed: isFirst || isLast || revealMiddle,
        index: i
      });
    }
    return blanks;
  };

  const handleInputChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newInputs = [...userInputs];
    newInputs[index] = value.toUpperCase();
    setUserInputs(newInputs);

    // Auto-focus next empty input
    if (value && index < userInputs.length - 1) {
      const nextEmptyIndex = newInputs.findIndex((v, i) => i > index && !v);
      if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
        inputRefs.current[nextEmptyIndex].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !userInputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (gameState !== 'playing' || !words[currentWord]) return;

    const correctWord = words[currentWord].word.toUpperCase().replace(/[^A-Z]/g, '');
    const userWord = userInputs.join('');
    const blanks = generateBlanks(words[currentWord].word);

    // Check if user filled all blanks correctly
    let isCorrect = true;
    blanks.forEach((blank, i) => {
      if (!blank.revealed && userInputs[i] !== blank.letter) {
        isCorrect = false;
      }
    });

    if (isCorrect || userWord === correctWord) {
      const points = showHint ? 5 : 10;
      setScore(score + points);
      setGameState('correct');
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [category?.color || '#6209e6']
      });
    } else {
      setGameState('wrong');
    }
  };

  const handleNext = () => {
    if (currentWord < words.length - 1) {
      const nextIndex = currentWord + 1;
      setCurrentWord(nextIndex);
      const nextWordLength = words[nextIndex].word.replace(/[^a-zA-Z]/g, '').length;
      setUserInputs(new Array(nextWordLength).fill(''));
      setShowHint(false);
      setGameState('playing');
    } else {
      setGameState('complete');
      
      if (score >= 60) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentWord(0);
    setScore(0);
    setShowHint(false);
    setHintsUsed(0);
    setUserInputs([]);
    loadWords();
  };

  const handleShowHint = () => {
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
  };

  if (loading || gameState === 'loading') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
          <p className="text-gray-500">Loading word scramble...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'complete') {
    const maxScore = words.length * 10;
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="text-center px-6 py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${category?.color}15` }}>
            <Shuffle className="w-12 h-12" style={{ color: category?.color }} />
          </motion.div>

          <h3 className="text-3xl font-bold text-gray-900 mb-3">Scramble Complete! 🎯</h3>
          <p className="text-gray-600 text-lg mb-8">You unscrambled the {item} vocabulary!</p>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-3xl font-bold mb-1" style={{ color: category?.color }}>{score}</div>
              <div className="text-xs text-gray-500 font-medium">Points</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-1">{percentage}%</div>
              <div className="text-xs text-gray-500 font-medium">Score</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-1">{hintsUsed}</div>
              <div className="text-xs text-gray-500 font-medium">Hints</div>
            </div>
          </div>

          <div className="mb-8">
            {percentage >= 80 && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-50 text-yellow-800 rounded-full border-2 border-yellow-200">
                <Trophy className="w-6 h-6" />
                <span className="font-bold text-lg">Word Master! 🌟</span>
              </div>
            )}
            {percentage >= 60 && percentage < 80 && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-800 rounded-full border-2 border-blue-200">
                <Star className="w-6 h-6" />
                <span className="font-bold text-lg">Great Job!</span>
              </div>
            )}
            {percentage < 60 && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-50 text-purple-800 rounded-full border-2 border-purple-200">
                <Shuffle className="w-6 h-6" />
                <span className="font-bold text-lg">Keep Learning!</span>
              </div>
            )}
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: category?.color }}>
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </motion.div>
    );
  }

  const word = words[currentWord];
  const scrambled = scrambleWord(word.word);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r p-6 text-white" style={{ background: `linear-gradient(135deg, ${category?.color}dd, ${category?.color}99)` }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shuffle className="w-6 h-6" />
            <h3 className="text-lg font-bold">Word Scramble</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
            <Trophy className="w-4 h-4" />
            <span className="font-bold">{score}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-2">
          {words.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i < currentWord ? 'bg-white' :
                i === currentWord ? 'bg-white/60' :
                'bg-white/20'
              }`}
            />
          ))}
        </div>
        <p className="text-white/80 text-sm">Word {currentWord + 1} of {words.length}</p>
      </div>

      {/* Game Content */}
      <div className="p-6">
        {gameState === 'playing' ? (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4 text-sm">Unscramble this word:</p>
              <div className="inline-flex gap-2 mb-6">
                {scrambled.split('').map((letter, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                    style={{ backgroundColor: category?.color }}>
                    {letter}
                  </motion.div>
                ))}
              </div>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-900 text-sm">{word.hint}</p>
                  </div>
                </motion.div>
              )}

              {!showHint && (
                <button
                  onClick={handleShowHint}
                  className="text-sm text-gray-500 hover:text-gray-700 underline mb-4">
                  Need a hint? (−5 points)
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={!userAnswer.trim()}
                className="w-full py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: category?.color }}>
                Submit Answer
              </button>
            </form>
          </>
        ) : (
          <>
            <div className={`p-6 rounded-xl mb-6 ${
              gameState === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-bold text-xl mb-2 ${
                gameState === 'correct' ? 'text-green-900' : 'text-red-900'
              }`}>
                {gameState === 'correct' ? '🎉 Correct!' : '❌ Not quite!'}
              </p>
              <p className="text-gray-900 mb-1">
                The word was: <span className="font-bold">{word.word.replace(/_/g, ' ')}</span>
              </p>
              <p className="text-gray-700 text-sm">{word.definition}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              style={{ backgroundColor: category?.color }}>
              {currentWord < words.length - 1 ? 'Next Word →' : 'See Results 🏆'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}