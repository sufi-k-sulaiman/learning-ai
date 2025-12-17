import React, { useState, useEffect } from 'react';
import PageMeta from '@/components/PageMeta';
import { Gamepad2, Rocket, Target, Shield, Blocks } from 'lucide-react';

import WordShooter from '@/components/games/WordShooter';
import SpaceBattleGame from '@/components/games/SpaceBattleGame';
import TankCity from '@/components/games/TankCity';
import TetrisGalaxy from '@/components/games/TetrisGalaxy';
import { Button } from '@/components/ui/button';

export default function Games() {
    // Update URL for display only (aesthetic, not parsed)
    const updateUrl = (game) => {
        const basePath = window.location.pathname;
        if (game) {
            window.history.pushState({ game }, '', `${basePath}/${game}`);
        } else {
            window.history.pushState({}, '', basePath);
        }
    };

    useEffect(() => {
        
        // Handle browser back/forward - restore from history state only
        const handlePopState = (event) => {
            const state = event.state || {};
            setActiveGame(state.game || null);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const [activeGame, setActiveGame] = useState(null);
    
    const selectGame = (game) => {
        setActiveGame(game);
        updateUrl(game);
    };
    
    const exitGame = () => {
        setActiveGame(null);
        updateUrl(null);
    };

    if (activeGame === 'space-battle') {
        return <SpaceBattleGame onExit={exitGame} />;
    }
    
    if (activeGame === 'word-shooter') {
        return <WordShooter onExit={exitGame} />;
    }

    if (activeGame === 'tank-city') {
        return <TankCity onExit={exitGame} />;
    }

    if (activeGame === 'tetris-galaxy') {
        return <TetrisGalaxy onExit={exitGame} />;
    }

    return (
        <>
            <PageMeta 
                title="Gamified Education"
                description="Space battle and word shooters make education engaging, interactive, and boost learning through AI-powered games."
                keywords="gamification, educational games, learning games, AI games, vocabulary games"
            />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gamified Education</h1>
                    </div>
                    <p className="text-gray-500">Game Arcade transforms learning into play by merging education with immersive, AI‑powered
games.</p> <p className="text-gray-500">Instead of traditional study methods, it gamifies knowledge so every challenge feels
like fun.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Space Battle Game Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center flex flex-col">
                      <img 
                          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/0e93be6bb_Space-Battle.png" 
                          alt="Space Battle" 
                          className="w-full h-52 object-cover rounded-xl mb-4"
                      />
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Space Battle</h2>
                      <p className="text-gray-500 text-sm mb-4 flex-grow">Destroy alien ships and test your knowledge!</p>
                      <Button onClick={() => selectGame('space-battle')} size="lg" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                          Play Now
                      </Button>
                  </div>

                  {/* Word Shooter Game Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center flex flex-col">
                      <img 
                          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/73d9c14c2_Wordshooter.png" 
                          alt="Word Shooter" 
                          className="w-full h-52 object-cover rounded-xl mb-4"
                      />
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Word Shooter</h2>
                      <p className="text-gray-500 text-sm mb-4 flex-grow">Gamified vocabulary learning with AI-powered word sets.</p>
                      <Button onClick={() => selectGame('word-shooter')} size="lg" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-800 hover:to-pink-700">
                          Play Now
                      </Button>
                  </div>

                  {/* Tank City Game Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center flex flex-col">
                      <img 
                          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/83bb1d7fa_CosmicTank.png" 
                          alt="Cosmic Tank" 
                          className="w-full h-52 object-cover rounded-xl mb-4"
                      />
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Cosmic Tank</h2>
                      <p className="text-gray-500 text-sm mb-4 flex-grow">Space tank battle - defend your base from enemies!</p>
                      <Button onClick={() => selectGame('tank-city')} size="lg" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                          Play Now
                      </Button>
                  </div>

                  {/* Tetris Galaxy Game Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center flex flex-col">
                      <img 
                          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/ce10027d6_TetrisGalaxy.png" 
                          alt="Tetris Galaxy" 
                          className="w-full h-52 object-cover rounded-xl mb-4"
                      />
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Tetris Galaxy</h2>
                      <p className="text-gray-500 text-sm mb-4 flex-grow">Stack word blocks and learn vocabulary as you clear lines!</p>
                      <Button onClick={() => selectGame('tetris-galaxy')} size="lg" className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700">
                          Play Now
                      </Button>
                  </div>
                </div>
            </div>
        </div>
        </>
    );
}