import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Trophy, Zap, Brain, Loader2, 
  Lightbulb, Flame, Droplet, Wind, Star, Globe, 
  Leaf, Rocket, Heart, Shield, Target, Eye 
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import confetti from 'canvas-confetti';

const FACT_ICONS = [Lightbulb, Flame, Droplet, Wind, Star, Globe, Leaf, Rocket, Heart, Shield, Target, Eye];

export default function KnowledgeChallenge({ item, category }) {
  const [gameState, setGameState] = useState('loading'); // loading, playing, result
  const [choices, setChoices] = useState([]);
  const [images, setImages] = useState([]);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);

  useEffect(() => {
    startGame();
  }, [item]);

  const startGame = async () => {
    setGameState('loading');
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 4 interesting facts about "${item}" for a knowledge challenge game. Each fact should be different and engaging. Format as short statements (max 12 words each).`,
        response_json_schema: {
          type: "object",
          properties: {
            facts: {
              type: "array",
              items: { type: "string" },
              minItems: 4,
              maxItems: 4
            }
          }
        }
      });

      const facts = response.facts || [];
      setChoices(facts);

      // Generate images for each fact
      const imagePromises = facts.map(async (fact, i) => {
        const cacheKey = `challenge_${item}_${i}_${fact.substring(0, 20)}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          try {
            const { url, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;
            if (age < 72 * 60 * 60 * 1000) return url;
          } catch (e) {}
        }

        const imageResponse = await base44.integrations.Core.GenerateImage({
          prompt: `Simple icon-style illustration representing: ${fact}. Minimal, clean, colorful, single subject focus.`
        });

        if (imageResponse?.url) {
          localStorage.setItem(cacheKey, JSON.stringify({
            url: imageResponse.url,
            timestamp: Date.now()
          }));
        }

        return imageResponse?.url;
      });

      const generatedImages = await Promise.all(imagePromises);
      setImages(generatedImages);
      setGameState('playing');
    } catch (error) {
      console.error('Failed to generate facts:', error);
      setGameState('ready');
    }
  };

  const playGame = (playerIndex) => {
    setPlayerChoice(playerIndex);
    
    // AI makes a choice
    const aiIndex = Math.floor(Math.random() * 4);
    setAiChoice(aiIndex);

    // Determine winner with 50% win rate for player, 30% lose, 20% tie
    const random = Math.random();
    let outcome;
    
    if (random < 0.50) {
      // Player wins
      outcome = 'win';
      setWins(wins + 1);
      setCurrentRound(currentRound + 1);
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
      setCurrentRound(currentRound + 0.5);
    }

    setResult(outcome);
    setGameState('result');
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    startGame();
  };

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
      <div className="bg-gradient-to-r p-4 sm:p-6 text-white" style={{ background: `linear-gradient(135deg, ${category?.color}dd, ${category?.color}99)` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
            <h3 className="text-base sm:text-lg font-bold">Knowledge Pathway</h3>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="px-2 sm:px-3 py-1 bg-white/20 rounded-full font-medium">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              {Math.floor(currentRound)}
            </div>
            <div className="px-2 sm:px-3 py-1 bg-white/20 rounded-full font-medium">
              {wins}W-{losses}L
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="p-4 sm:p-6">
        {gameState === 'playing' && (
          <div>
            <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Step on a tile to progress!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mx-auto">
              {choices.map((fact, i) => {
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => playGame(i)}
                    className="p-3 sm:p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all group relative overflow-hidden"
                    style={{ backgroundColor: `${category?.color}08`, aspectRatio: '4/2' }}
                  >
                    <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 flex items-center justify-center text-xs sm:text-sm font-bold" style={{ color: category?.color }}>
                      {i + 1}
                    </div>
                    <div className="flex items-center justify-between h-full gap-3 sm:gap-4">
                      {images[i] ? (
                        <img 
                          src={images[i]} 
                          alt={fact}
                          className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
                      )}
                      <p className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900 font-medium leading-tight flex-1 text-left">{fact}</p>
                    </div>
                  </motion.button>
                );
              })}
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
                  <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-blue-600" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <h4 className="text-2xl font-bold mb-2">
              {result === 'win' && '🎉 Advanced!'}
              {result === 'lose' && '😅 Try Again!'}
              {result === 'tie' && "🤝 Half Step!"}
            </h4>

            <p className="text-gray-600 mb-4">
              {result === 'win' && `You're now at Level ${Math.floor(currentRound)}!`}
              {result === 'lose' && 'Keep trying to advance!'}
              {result === 'tie' && 'You moved forward a bit!'}
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500 mb-2">You picked</div>
                <div className="flex items-center gap-2">
                  {images[playerChoice] && (
                    <img 
                      src={images[playerChoice]} 
                      alt="Your choice"
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <span className="text-xs font-medium">Tile {playerChoice + 1}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500 mb-2">AI picked</div>
                <div className="flex items-center gap-2">
                  {images[aiChoice] && (
                    <img 
                      src={images[aiChoice]} 
                      alt="AI choice"
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <span className="text-xs font-medium">Tile {aiChoice + 1}</span>
                </div>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              style={{ backgroundColor: category?.color }}
            >
              Continue Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}