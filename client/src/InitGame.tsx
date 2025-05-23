import React, { useState, useCallback, useEffect } from "react";
import { useTouchlineStore } from './utils/touchline';
import MainMenu from "./pages/HomePage";
import GameState from './utils/gamestate';;

import { useNetworkAccount } from "./context/WalletContex";
import SquadManagementPage from "./pages/Lobby";
import MarketPlacePage from "./components/MarketPlace";
import ArenaPage from "./pages/ArenaPage";
import MatchesPage from "./pages/MatchesPage";
import Tournament from "./pages/Tournaments";
import CommunityComingSoon from "./pages/Community";
import Community from "./pages/Community";

const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState("CONNECTING TO STADIUM");
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const texts = [
          "CONNECTING TO STADIUM",
          "VERIFYING MANAGER CREDENTIALS",
          "LOADING SQUAD DATA",
          "PREPARING MATCH ENGINE",
          "CHECKING TOURNAMENT STATUS"
        ];
        const currentIndex = texts.indexOf(prev);
        return texts[(currentIndex + 1) % texts.length];
      });
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);

    return () => {
      clearInterval(textInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 flex flex-col items-center justify-center">
      {/* Football Pitch Grid Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      <div className="relative z-10 w-full max-w-md p-6">
        {/* Terminal Window */}
        <div className="bg-green-900/50 backdrop-blur-sm border border-green-400/30 rounded-lg overflow-hidden shadow-lg">
          {/* Terminal Header */}
          <div className="bg-green-800/50 px-4 py-2 border-b border-green-400/30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            </div>
          </div>
          
          {/* Terminal Content */}
          <div className="p-4 font-mono text-sm">
            <div className="space-y-2">
              <p className="text-green-300">
                - TOUCHLINE_SOCCER v1.0.0
              </p>
              <p className="text-green-200/70">
                - INITIALIZING MATCH DAY SEQUENCE...
              </p>
              <div className="flex items-center gap-2 text-green-200">
                <div className="w-2 h-2 bg-green-200 animate-pulse"></div>
                <span>{loadingText}{'.'.repeat(dots)}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 h-1 bg-green-700/30 rounded-full overflow-hidden">
                <div className="h-full bg-green-300/50 animate-pulse" 
                  style={{width: '60%'}}></div>
              </div>
              
              {/* Status Messages */}
              <div className="mt-4 space-y-1 text-xs text-green-200/50">
                <p>{">"} LIVE MATCH DATA: LOADING</p>
                <p>{">"} MANAGER VERIFICATION: IN PROGRESS</p>
                <p>{">"} SERVER STATUS: ONLINE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InitGame = () => {
  const { account } = useNetworkAccount();
  const { game_state } = useTouchlineStore((state) => state);
  
  return (
    <>
      {account ? (
        <div className="bg-green-950 pb-4">
          {game_state === GameState.MainMenu && <MainMenu />}
          {game_state === GameState.Lobby && <SquadManagementPage />}
          {game_state === GameState.Market && <MarketPlacePage />}
          {game_state === GameState.Squad && <SquadManagementPage />}
          {game_state === GameState.Arena && <ArenaPage  />}
          {game_state === GameState.Matches && <MatchesPage  />}
          {game_state === GameState.Tournament && <Tournament />}
          {game_state === GameState.Community && <Community />}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default InitGame;