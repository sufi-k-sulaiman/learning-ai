import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Timer, CheckCircle2, XCircle, Loader2, RotateCcw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import confetti from 'canvas-confetti';

export default function LightningRound({ item, category }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState('loading'); // loading, playing, answered, complete
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, [item]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, gameState]);

  const loadQuestions = async () => {
    setLoading(true);
    setGameState('loading');

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create 10 rapid-fire true/false questions about "${item}" (${category?.name}). 
        
        Make them:
        - Quick to read (under 15 words)
        - Mix of easy, medium, and hard
        - Clear and unambiguous
        - Educational and interesting
        - Some should be true, some false (roughly 50/50 split)
        
        For each question provide:
        1. statement: the true/false statement
        2. answer: true or false
        3. explanation: brief 1-sentence explanation (under 20 words)`,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  statement: { type: "string" },
                  answer: { type: "boolean" },
                  explanation: { type: "string" }
                }
              },
              minItems: 10,
              maxItems: 10
            }
          }
        }
      });

      setQuestions(response.questions || []);
      setGameState('playing');
      setTimeLeft(10);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setGameState('loading');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    if (gameState !== 'playing') return;

    const isCorrect = answer === questions[currentQuestion].answer;
    setSelectedAnswer(answer);
    setCorrectAnswer(questions[currentQuestion].answer);
    setGameState('answered');

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 2);
      setScore(score + 10 + timeBonus);
      
      if (score >= 50) {
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.6 },
          colors: [category?.color || '#6209e6']
        });
      }
    }
  };

  const handleTimeout = () => {
    setSelectedAnswer(null);
    setCorrectAnswer(questions[currentQuestion].answer);
    setGameState('answered');
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
      setTimeLeft(10);
      setGameState('playing');
    } else {
      setGameState('complete');
      
      if (score >= 80) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    loadQuestions();
  };

  if (loading || gameState === 'loading') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
          <p className="text-gray-500">Loading lightning round...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'complete') {
    const maxScore = questions.length * 15; // 10 base + 5 avg time bonus
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
            <Zap className="w-12 h-12" style={{ color: category?.color }} />
          </motion.div>

          <h3 className="text-3xl font-bold text-gray-900 mb-3">Lightning Round Complete! ⚡</h3>
          <p className="text-gray-600 text-lg mb-8">Quick thinking on {item}!</p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="text-4xl font-bold mb-1" style={{ color: category?.color }}>{score}</div>
              <div className="text-sm text-gray-500 font-medium">Final Score</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="text-4xl font-bold text-green-600 mb-1">{percentage}%</div>
              <div className="text-sm text-gray-500 font-medium">Accuracy</div>
            </div>
          </div>

          <div className="mb-8">
            {percentage >= 80 && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-50 text-yellow-800 rounded-full border-2 border-yellow-200">
                <Trophy className="w-6 h-6" />
                <span className="font-bold text-lg">Lightning Fast! 🌟</span>
              </div>
            )}
            {percentage >= 60 && percentage < 80 && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-800 rounded-full border-2 border-blue-200">
                <Zap className="w-6 h-6" />
                <span className="font-bold text-lg">Great Speed!</span>
              </div>
            )}
            {percentage < 60 && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-50 text-purple-800 rounded-full border-2 border-purple-200">
                <Timer className="w-6 h-6" />
                <span className="font-bold text-lg">Keep Practicing!</span>
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

  const question = questions[currentQuestion];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r p-6 text-white" style={{ background: `linear-gradient(135deg, ${category?.color}dd, ${category?.color}99)` }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6" />
            <h3 className="text-lg font-bold">Lightning Round</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
              <Timer className="w-4 h-4" />
              <span className="font-bold text-xl">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
              <Trophy className="w-4 h-4" />
              <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i < currentQuestion ? 'bg-white' :
                i === currentQuestion ? 'bg-white/60' :
                'bg-white/20'
              }`}
            />
          ))}
        </div>
        <p className="text-white/80 text-sm">Question {currentQuestion + 1} of {questions.length}</p>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <div className="mb-8">
          <h4 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            {question.statement}
          </h4>
          <p className="text-center text-gray-500 text-sm">Is this true or false?</p>
        </div>

        {/* Answer Buttons */}
        {gameState === 'playing' ? (
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(true)}
              className="py-6 rounded-xl border-2 font-bold text-xl transition-all bg-green-50 border-green-200 hover:border-green-500 hover:bg-green-100 text-green-700">
              TRUE
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(false)}
              className="py-6 rounded-xl border-2 font-bold text-xl transition-all bg-red-50 border-red-200 hover:border-red-500 hover:bg-red-100 text-red-700">
              FALSE
            </motion.button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`py-6 rounded-xl border-2 font-bold text-xl text-center ${
                correctAnswer === true ? 'bg-green-100 border-green-500 text-green-700' : 
                selectedAnswer === true ? 'bg-red-100 border-red-500 text-red-700' :
                'bg-gray-50 border-gray-200 text-gray-500'
              }`}>
                {correctAnswer === true && <CheckCircle2 className="w-6 h-6 inline mr-2" />}
                {selectedAnswer === true && correctAnswer === false && <XCircle className="w-6 h-6 inline mr-2" />}
                TRUE
              </div>
              <div className={`py-6 rounded-xl border-2 font-bold text-xl text-center ${
                correctAnswer === false ? 'bg-green-100 border-green-500 text-green-700' : 
                selectedAnswer === false ? 'bg-red-100 border-red-500 text-red-700' :
                'bg-gray-50 border-gray-200 text-gray-500'
              }`}>
                {correctAnswer === false && <CheckCircle2 className="w-6 h-6 inline mr-2" />}
                {selectedAnswer === false && correctAnswer === true && <XCircle className="w-6 h-6 inline mr-2" />}
                FALSE
              </div>
            </div>

            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-4 rounded-xl mb-6 ${
                selectedAnswer === correctAnswer ? 'bg-green-50 border border-green-200' : 
                selectedAnswer === null ? 'bg-gray-50 border border-gray-200' :
                'bg-red-50 border border-red-200'
              }`}>
              <p className={`font-semibold mb-2 ${
                selectedAnswer === correctAnswer ? 'text-green-900' : 
                selectedAnswer === null ? 'text-gray-900' :
                'text-red-900'
              }`}>
                {selectedAnswer === correctAnswer ? '⚡ Correct!' : 
                 selectedAnswer === null ? '⏱️ Time\'s up!' :
                 '❌ Incorrect'}
              </p>
              <p className="text-sm text-gray-700">{question.explanation}</p>
            </motion.div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              style={{ backgroundColor: category?.color }}>
              {currentQuestion < questions.length - 1 ? 'Next Question ⚡' : 'See Results 🏆'}
            </button>
          </div>
        )}

        {/* Timer Warning */}
        {gameState === 'playing' && timeLeft <= 3 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="mt-4 text-center">
            <p className="text-red-600 font-bold">Hurry! {timeLeft}s left!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}