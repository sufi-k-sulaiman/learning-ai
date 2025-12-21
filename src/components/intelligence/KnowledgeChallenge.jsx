import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Trophy, Zap, Brain, Loader2,
  Lightbulb, Flame, Droplet, Wind, Star, Globe,
  Leaf, Rocket, Heart, Shield, Target, Eye, ExternalLink, XCircle, CheckCircle2 } from
'lucide-react';
import { base44 } from '@/api/base44Client';
import confetti from 'canvas-confetti';

// Helper to extract domain from URL
const extractDomain = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = urlObj.hostname.replace('www.', '');
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts.slice(-2).join('.');
    }
    return hostname;
  } catch {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/\?\s]+)/);
    if (match) {
      const domain = match[1].split('/')[0];
      const parts = domain.split('.');
      if (parts.length > 2) {
        return parts.slice(-2).join('.');
      }
      return domain;
    }
    return url;
  }
};

// Parse text and convert markdown links to clickable badges
const TextWithLinks = ({ text }) => {
  if (!text) return null;

  const parts = [];
  let lastIndex = 0;
  const linkRegex = /\(\[([^\]]+)\]\(([^)]+)\)\)/g;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const domain = extractDomain(match[2]);
    parts.push({ type: 'link', domain, url: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return <span>{text}</span>;
  }

  return (
    <span>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return <span key={i}>{part.content}</span>;
        }
        return (
          <a
            key={i}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-white/90 hover:text-white transition-colors px-1.5 py-0.5 bg-white/20 hover:bg-white/30 rounded mx-1"
            title={part.url}>

            {part.domain}
            <ExternalLink className="w-3 h-3" />
          </a>);

      })}
    </span>);

};

const FACT_ICONS = [Lightbulb, Flame, Droplet, Wind, Star, Globe, Leaf, Rocket, Heart, Shield, Target, Eye];

export default function KnowledgeChallenge({ item, category }) {
  const [gameState, setGameState] = useState('loading'); // loading, playing, result
  const [choices, setChoices] = useState([]);
  const [images, setImages] = useState([]);
  const [objective, setObjective] = useState('');
  const [correctIndex, setCorrectIndex] = useState(null);
  const [funFacts, setFunFacts] = useState([]);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [preloadedGames, setPreloadedGames] = useState([]);

  useEffect(() => {
    startGame();
  }, [item]);

  const loadGameData = async () => {
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a knowledge challenge about "${item}":
1. Create an objective/target (e.g., "Find the fact about temperature", "Pick the most recent discovery", "Choose the largest measurement")
2. Generate 4 facts where ONE clearly matches the objective
3. Make facts interesting and engaging (max 12 words each)
4. For each fact, add a fun fact about it (1-2 sentences, interesting and educational)`,
      response_json_schema: {
        type: "object",
        properties: {
          objective: { type: "string" },
          facts: {
            type: "array",
            items: { type: "string" },
            minItems: 4,
            maxItems: 4
          },
          correctIndex: { type: "number" },
          funFacts: {
            type: "array",
            items: { type: "string" },
            minItems: 4,
            maxItems: 4
          }
        }
      }
    });

    const facts = response.facts || [];

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
        prompt: `Illustration representing: ${fact}. Minimal, clean, colorful, single subject focus. Standard format, 4:3 ratio.`
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
    return {
      facts,
      images: generatedImages,
      objective: response.objective,
      correctIndex: response.correctIndex,
      funFacts: response.funFacts
    };
  };

  const preloadNextGames = async (count) => {
    const preloaded = [];
    for (let i = 0; i < count; i++) {
      try {
        const gameData = await loadGameData();
        preloaded.push(gameData);
      } catch (error) {
        console.error('Failed to preload game:', error);
      }
    }
    setPreloadedGames((prev) => [...prev, ...preloaded]);
  };

  const startGame = async () => {
    setGameState('loading');

    try {
      let gameData;

      // Use preloaded data if available
      if (preloadedGames.length > 0) {
        gameData = preloadedGames[0];
        setPreloadedGames((prev) => prev.slice(1));

        // Preload one more game to maintain buffer
        preloadNextGames(1);
      } else {
        // Load current game and preload next 2
        gameData = await loadGameData();
        preloadNextGames(2);
      }

      setChoices(gameData.facts);
      setImages(gameData.images);
      setObjective(gameData.objective);
      setCorrectIndex(gameData.correctIndex);
      setFunFacts(gameData.funFacts);
      setGameState('playing');
    } catch (error) {
      console.error('Failed to generate facts:', error);
      setGameState('loading');
    }
  };

  const playGame = (playerIndex) => {
    setPlayerChoice(playerIndex);

    // AI makes a choice (random)
    const aiIndex = Math.floor(Math.random() * 4);
    setAiChoice(aiIndex);

    // Check if choices match the objective
    const playerCorrect = playerIndex === correctIndex;
    const aiCorrect = aiIndex === correctIndex;

    let outcome;

    if (playerCorrect && aiCorrect) {
      // Both correct - shared points
      outcome = 'shared';
      setCurrentRound(currentRound + 0.5);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: [category?.color || '#6209e6', '#FFD700']
      });
    } else if (playerCorrect && !aiCorrect) {
      // Only player correct - full win
      outcome = 'win';
      setWins(wins + 1);
      setCurrentRound(currentRound + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [category?.color || '#6209e6', '#FFD700']
      });
    } else if (!playerCorrect && aiCorrect) {
      // Only AI correct - lose
      outcome = 'lose';
      setLosses(losses + 1);
    } else {
      // Both wrong - tie
      outcome = 'tie';
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
      </div>);

  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: category?.color }} />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Knowledge Pathway</h3>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full font-medium text-gray-700">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              {Math.floor(currentRound)}
            </div>
            <div className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full font-medium text-gray-700">
              {wins}W-{losses}L
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="p-4 sm:p-6">
        {gameState === 'playing' &&
        <div>
            <div className="mb-6 p-4 sm:p-6 rounded-xl bg-gradient-to-r text-white text-center" style={{ background: `linear-gradient(135deg, ${category?.color}dd, ${category?.color}99)` }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                <h4 className="text-xl sm:text-3xl font-bold normal-case">Objective</h4>
              </div>
              <p className="text-white/90 text-base sm:text-2xl font-medium px-2 sm:px-48">{objective}</p>
            </div>
            <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Choose the tile that matches the objective!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mx-auto">
              {choices.map((fact, i) => {
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => playGame(i)}
                  className="p-3 sm:p-4 rounded-none sm:rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all group relative overflow-hidden"
                  style={{ backgroundColor: `${category?.color}08`, aspectRatio: '4/2' }}>

                    <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 flex items-center justify-center text-xs sm:text-sm font-bold" style={{ color: category?.color }}>
                      {i + 1}
                    </div>
                    <div className="flex items-center justify-between h-full gap-3 sm:gap-4">
                      {images[i] ?
                      <img
                      src={images[i]}
                      alt={fact}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl object-cover flex-shrink-0" /> :


                      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
                      }
                      <p className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900 font-medium leading-tight flex-1 text-left">{fact}</p>
                    </div>
                  </motion.button>);

            })}
            </div>
          </div>
        }

        {gameState === 'result' &&
        <div className="text-center">
            <AnimatePresence>
              <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-6">

                <h4 className="text-2xl font-bold mb-2 flex items-center justify-center gap-3">
                  {result === 'win' && <><Trophy className="w-8 h-8 text-green-600" /> Perfect! You Win!</>}
                  {result === 'lose' && <><XCircle className="w-8 h-8 text-red-600" /> AI Got It Right!</>}
                  {result === 'shared' && <><Star className="w-8 h-8 text-yellow-600" /> Both Correct!</>}
                  {result === 'tie' && <><XCircle className="w-8 h-8 text-gray-600" /> Both Wrong!</>}
                </h4>
              </motion.div>
            </AnimatePresence>

            <p className="text-gray-600 mb-4">
              {result === 'win' && `Only you found the right answer! Level ${Math.floor(currentRound)}`}
              {result === 'lose' && 'The AI picked correctly, you didn\'t!'}
              {result === 'shared' && 'Great minds think alike! Points shared'}
              {result === 'tie' && 'Neither of you got it right!'}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">Objective</p>
                    <p className="text-sm text-gray-700">{objective}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-1">Correct Answer</p>
                    <p className="text-sm text-gray-700">Tile {correctIndex + 1}</p>
                  </div>
                </div>
              </div>

              {funFacts[playerChoice] && (
                <div className="flex items-start gap-3 pt-6 border-t border-blue-200">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Fun Fact</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {funFacts[playerChoice]}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className={`rounded-2xl p-5 ${playerChoice === correctIndex ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                <div className="text-sm text-gray-500 mb-3 font-medium">You picked</div>
                <div className="space-y-3">
                  {images[playerChoice] &&
                <img
                  src={images[playerChoice]}
                  alt="Your choice"
                  className="w-full rounded-xl object-cover shadow-md"
                  style={{ aspectRatio: '3/2' }} />

                }
                  <div>
                    <span className="text-base font-semibold block mb-1">Tile {playerChoice + 1}</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{choices[playerChoice]}</p>
                  </div>
                </div>
              </div>
              <div className={`rounded-2xl p-5 ${aiChoice === correctIndex ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                <div className="text-sm text-gray-500 mb-3 font-medium">AI picked</div>
                <div className="space-y-3">
                  {images[aiChoice] &&
                <img
                  src={images[aiChoice]}
                  alt="AI choice"
                  className="w-full rounded-xl object-cover shadow-md"
                  style={{ aspectRatio: '3/2' }} />

                }
                  <div>
                    <span className="text-base font-semibold block mb-1">Tile {aiChoice + 1}</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{choices[aiChoice]}</p>
                  </div>
                </div>
              </div>
            </div>



            <button
            onClick={resetGame}
            className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: category?.color }}>

              Continue Journey
            </button>
            </div>
        }
            </div>
            </div>);

}