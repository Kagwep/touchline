import React, { useEffect, useState } from 'react';
import { Loader2, Trophy, Star,  Shield, User, Users,Icon } from 'lucide-react';
import { soccerBall } from '@lucide/lab';

const LoadingScreen = ({ message = "Loading Touchline Soccer Match Attacks..." }) => {
  const [dots, setDots] = useState('');
  const [statusMessage, setStatusMessage] = useState('Connecting to league servers');
  const [progress, setProgress] = useState(0);
  const [showTip, setShowTip] = useState(0);

  const tips = [
    "Star players can have special abilities that change the match outcome!",
    "Balance your squad with the right mix of attackers and defenders.",
    "Trading cards with other managers can help complete your collection.",
    "Some stadium conditions can affect player performance.",
    "Legendary cards are rare but can turn the tide of any match!"
  ];

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const messageInterval = setInterval(() => {
      setStatusMessage(prev => {
        const messages = [
          'Connecting to league servers',
          'Building player database',
          'Loading match tactics',
          'Synchronizing team rosters',
          'Preparing stadium environment'
        ];
        const currentIndex = messages.indexOf(prev);
        return messages[(currentIndex + 1) % messages.length];
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        return newProgress > 99 ? 99 : newProgress;
      });
    }, 50);

    const tipInterval = setInterval(() => {
      setShowTip(prev => (prev + 1) % tips.length);
    }, 4000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-700 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/pitch-texture.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="absolute top-10 left-10 text-green-300/30 animate-pulse">
        <Shield size={80} />
      </div>
      <div className="absolute bottom-10 right-10 text-green-300/20 animate-pulse" style={{animationDelay: "1s"}}>
        <Trophy size={60} />
      </div>
      <div className="absolute top-20 right-20 text-green-300/10 animate-pulse" style={{animationDelay: "0.5s"}}>
        <Icon iconNode={soccerBall} />
      </div>
      <div className="absolute bottom-20 left-20 text-green-300/15 animate-pulse" style={{animationDelay: "1.5s"}}>
        <Star size={40} />
      </div>

      {/* Main container */}
      <div className="w-full max-w-2xl bg-gradient-to-br from-green-800/60 to-green-700/60 backdrop-blur-md rounded-xl border border-green-500/30 p-8 space-y-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon iconNode={soccerBall} />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent">TOUCHLINE</h1>
              <p className="text-green-400 text-sm">MATCH ATTACKS</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>

        {/* Loading animation */}
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-green-300 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <div className="text-green-100 font-medium text-lg text-center">
            {statusMessage}{dots}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-3">
          <div className="h-3 bg-green-900/60 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm font-medium text-green-200">
            <span>MATCH PREPARATION</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Tip box */}
        <div className="bg-green-900/40 rounded-lg p-5 border border-green-500/20">
          <div className="flex items-start space-x-3">
            <div className="bg-green-800/60 p-2 rounded-lg">
              <User className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <h3 className="text-green-300 font-medium mb-1">MANAGER TIP</h3>
              <p className="text-green-100/80 text-sm">
                {tips[showTip]}
              </p>
            </div>
          </div>
        </div>

        {/* System messages */}
        <div className="px-4 py-2 font-mono text-xs space-y-1.5 border-t border-green-500/20 pt-4">
          <p className="text-green-300/90 flex items-center">
            <span className="inline-block w-3 text-green-400 mr-1">$</span> 
            <span className="opacity-90">Initializing player database...</span>
          </p>
          <p className="text-green-300/70 flex items-center">
            <span className="inline-block w-3 text-green-400 mr-1">$</span> 
            <span className="opacity-70">Configuring match engine...</span>
          </p>
          <p className="text-green-300/50 flex items-center">
            <span className="inline-block w-3 text-green-400 mr-1">$</span> 
            <span className="opacity-50">Standing by for kickoff...</span>
          </p>
        </div>
      </div>

      {/* Footer status */}
      <div className="mt-6 text-green-300/60 text-sm font-medium flex items-center">
        <Users className="w-4 h-4 mr-2 opacity-70" />
        {message}
      </div>
    </div>
  );
};

export default LoadingScreen;