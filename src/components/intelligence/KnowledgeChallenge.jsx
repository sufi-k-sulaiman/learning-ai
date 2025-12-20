import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Zap, Brain, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import confetti from 'canvas-confetti';

export default function KnowledgeChallenge({ item, category }) {
  const [gameState, setGameState] = useState('ready'); // ready, loading, playing, result
  const [choices, setChoices] = useState([]);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [ties, setTies] = useState(0);

  const startGame = async () => {
    setGameState('loading');
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 3 interesting facts about "${item}" for a knowledge challenge game. Each fact should be different and engaging. Format as short statements (max 15 words each).`,
        response_json_schema: {
          type: "object",
          properties: {
            facts: {
              type: "array",
              items: { type: "string" },
              minItems: 3,
              maxItems: 3
            }
          }
        }
      });

      setChoices(response.facts || []);
      setGameState('playing');
    } catch (error) {
      console.error('Failed to generate facts:', error);
      setGameState('ready');
    }
  };

  const playGame = (playerIndex) => {
    setPlayerChoice(playerIndex);
    
    // AI makes a choice
    const aiIndex = Math.floor(Math.random() * 3);
    setAiChoice(aiIndex);

    // Determine winner with 45% win rate for player, 35% lose, 20% tie
    const random = Math.random();
    let outcome;
    
    if (random < 0.45) {
      // Player wins
      outcome = 'win';
      setWins(wins + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [category?.color || '#6209e6', '#FFD700']
      });
    } else if (random < 0.80) {
      // Player loses
      outcome = 'lose';
      setLosses(losses + 1);
    } else {
      // Tie
      outcome = 'tie';
      setTies(ties + 1);
    }

    setResult(outcome);
    setGameState('result');
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setGameState('ready');
  };

  if (gameState === 'ready') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${category?.color}15` }}>
            <Brain className="w-8 h-8" style={{ color: category?.color }} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Knowledge Challenge</h3>
          <p className="text-gray-600 mb-4">
            Test your knowledge about {item}! Choose a fact and see if you can outsmart the AI.
          </p>
          {(wins + losses + ties > 0) && (
            <div className="flex justify-center gap-4 mb-4 text-sm">
              <span className="text-green-600 font-medium">Wins: {wins}</span>
              <span className="text-red-600 font-medium">Losses: {losses}</span>
              <span className="text-gray-600 font-medium">Ties: {ties}</span>
            </div>
          )}
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: category?.color }}
          >
            Start Challenge
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'loading') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
          <p className="text-gray-500">Generating knowledge challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r p-6 text-white" style={{ background: `linear-gradient(135deg, ${category?.color}dd, ${category?.color}99)` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            <h3 className="text-lg font-bold">Knowledge Challenge</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-white/20 rounded-full font-medium">W: {wins}</span>
            <span className="px-3 py-1 bg-white/20 rounded-full font-medium">L: {losses}</span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="p-6">
        {gameState === 'playing' && (
          <div>
            <p className="text-center text-gray-600 mb-6">Choose a fact about {item}:</p>
            <div className="grid grid-cols-1 gap-3">
              {choices.map((fact, i) => (
                <button
                  key={i}
                  onClick={() => playGame(i)}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: category?.color }}>
                      {i + 1}
                    </div>
                    <p className="flex-1 text-gray-700 group-hover:text-gray-900">{fact}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center">
            <AnimatePresence>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6"
              >
                {result === 'win' && (
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Trophy className="w-10 h-10 text-green-600" />
                  </div>
                )}
                {result === 'lose' && (
                  <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Zap className="w-10 h-10 text-red-600" />
                  </div>
                )}
                {result === 'tie' && (
                  <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-gray-600" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <h4 className="text-2xl font-bold mb-2">
              {result === 'win' && '🎉 You Win!'}
              {result === 'lose' && '😅 AI Wins!'}
              {result === 'tie' && "🤝 It's a Tie!"}
            </h4>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">You chose:</span>
                <p className="flex-1 text-sm text-gray-700">{choices[playerChoice]}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">AI chose:</span>
                <p className="flex-1 text-sm text-gray-700">{choices[aiChoice]}</p>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              style={{ backgroundColor: category?.color }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}