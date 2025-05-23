import React, { useState, useEffect } from 'react';
import { ChevronRight, X, Trophy, Users, Clock, Award, Icon, Star, Shield } from 'lucide-react';
import { soccerBall } from '@lucide/lab';
import About from './About';  // Import your About component
import GameTutorial from './GameTutorial';
import { tutorialContent } from '../utils/touchline';

const LandingPage = ({ onStartGame }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  
  const featuredCards = [
    {
      player: "Lionel",
      position: "Forward",
      rating: 94,
      team: "Miami",
      rarity: "Legendary",
      color: "from-purple-500 to-purple-700"
    },
    {
      player: "Cristiano",
      position: "Forward",
      rating: 92,
      team: "AlN",
      rarity: "Legendary",
      color: "from-yellow-500 to-yellow-700"
    },
    {
      player: "Eling",
      position: "Striker",
      rating: 91,
      team: "City",
      rarity: "Epic",
      color: "from-blue-500 to-blue-700"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCardIndex((prevIndex) => (prevIndex + 1) % featuredCards.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const TutorialModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-green-900/90 border border-green-500/20 p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-green-300 text-xl font-mono">Match Strategy Guide</h3>
          <button 
            onClick={() => setShowTutorial(false)}
            className="text-green-300 hover:text-green-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 text-green-200/80 font-mono">
        <GameTutorial 
          content={tutorialContent} 
          onClose={() => setShowTutorial(false)}
        />
        </div>
      </div>
    </div>
  );

  const AboutModal = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto">
      <div className="relative w-full max-w-6xl mx-4 bg-green-900/40">
        {/* Close button */}
        <button 
          onClick={() => setShowAbout(false)}
          className="absolute right-4 text-green-300 hover:text-green-200 z-10 bg-green-900/40 p-1 rounded-lg"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Scrollable container */}
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-green-900/20 scrollbar-thumb-green-500/20 hover:scrollbar-thumb-green-500/30">
          <div className="bg-green-900/40 border border-green-500/20 rounded-lg">
            <About />
          </div>
        </div>
      </div>
    </div>
  );

  // Card animation component
  const AnimatedCard = ({ card, isActive }) => (
    <div className={`transform transition-all duration-700 ease-out ${
      isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40 -rotate-6'
    }`}>
      <div className={`w-64 h-96 rounded-xl overflow-hidden shadow-lg relative bg-gradient-to-b ${card.color}`}>
        {/* Card header */}
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-center">
          <span className="bg-white/90 text-gray-800 font-bold rounded-full px-2 py-1 text-sm">
            {card.rating}
          </span>
          <span className="bg-black/30 text-yellow-300 font-bold rounded-full px-2 py-1 text-xs">
            {card.rarity}
          </span>
        </div>
        
        {/* Card body with player silhouette */}
        <div className="h-64 flex justify-center items-center">
          <div className="w-48 h-48 bg-black/20 rounded-full flex items-center justify-center">
            <Icon iconNode={soccerBall} className="w-10 h-10 text-white/80" />
          </div>
        </div>
        
        {/* Card footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-black/50">
          <div className="text-white font-bold text-xl mb-1">{card.player}</div>
          <div className="flex justify-between items-center">
            <div className="text-white/80 text-sm">{card.position}</div>
            <div className="text-white/80 text-sm">{card.team}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-700 flex flex-col">
      {/* Stadium atmosphere background effect */}
      <div className="absolute inset-0 bg-[url('/images/stadium-blur.jpg')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-800/20 via-green-900 to-green-950" />
      
      {/* Field line overlay effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-20 text-green-400/10 animate-pulse">
        <Trophy size={80} />
      </div>
      <div className="absolute bottom-20 right-20 text-green-400/10 animate-pulse" style={{animationDelay: "1.5s"}}>
        <Shield size={70} />
      </div>
      <div className="absolute top-40 right-40 text-green-400/10 animate-pulse" style={{animationDelay: "0.8s"}}>
        <Star size={60} />
      </div>
      
      {/* Main content */}
      <div className="relative flex-1 flex flex-col md:flex-row items-center justify-center px-4 py-8 md:py-0 gap-8">
        {/* Left side content */}
        <div className="md:w-1/2 max-w-2xl w-full space-y-8 text-center md:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <Icon iconNode={soccerBall} className="w-5 h-5 text-green-300 mr-2" />
            <span className="text-green-300 text-sm font-medium">Season 2025</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold">
            Touchline 
            <span className="block text-green-300 text-3xl md:text-4xl mt-2">
              Match 
            </span>
          </h1>
          
          <p className="text-xl text-green-100/90 max-w-xl">
            Build your ultimate team with digital player cards, master formations, and 
            outplay opponents with strategic gameplay in the world's most popular football card game.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-8">
            <button 
              onClick={onStartGame}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center group shadow-lg shadow-green-900/30 transition-all duration-300"
            >
              Start
              <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAbout(true)}
                className="border border-green-400/30 bg-green-800/30 hover:bg-green-700/40 text-green-300 px-6 py-4 rounded-lg font-medium transition-colors"
              >
                Game Overview
              </button>
              <button 
                onClick={() => setShowTutorial(true)}
                className="border border-green-400/30 bg-green-800/30 hover:bg-green-700/40 text-green-300 px-6 py-4 rounded-lg font-medium transition-colors"
              >
                Tutorial
              </button>
            </div>
          </div>
          
          {/* Stats section */}
          {/* <div className="flex justify-center md:justify-start space-x-6 pt-6 mt-8 border-t border-green-500/20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-green-400 mr-1.5" />
                <span className="text-2xl font-bold text-white">1M+</span>
              </div>
              <div className="text-green-300/70 text-sm">Players</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Icon iconNode={soccerBall} className="w-4 h-4 text-green-400 mr-1.5" />
                <span className="text-2xl font-bold text-white">10K+</span>
              </div>
              <div className="text-green-300/70 text-sm">Cards</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="w-4 h-4 text-green-400 mr-1.5" />
                <span className="text-2xl font-bold text-white">50+</span>
              </div>
              <div className="text-green-300/70 text-sm">Tournaments</div>
            </div>
          </div> */}
        </div>
        
        {/* Right side - Card Showcase */}
        <div className="md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
          <div className="relative h-96 w-64">
            {featuredCards.map((card, index) => (
              <div key={index} className="absolute inset-0 transition-all duration-700" 
                   style={{
                     opacity: cardIndex === index ? 1 : 0,
                     transform: cardIndex === index ? 'rotateY(0)' : 'rotateY(-90deg)',
                     transformStyle: 'preserve-3d',
                     perspective: '1000px'
                   }}>
                <AnimatedCard card={card} isActive={true} />
              </div>
            ))}
            
            {/* Card shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-xl transform -rotate-12"></div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="relative w-full p-4 mt-auto">
        <div className="flex justify-between items-center text-green-300/60 text-sm">
          <div className="flex items-center">
            <Icon iconNode={soccerBall} className="w-4 h-4 mr-2" />
            <span>Touchline Soccer © 2025</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>Season 5 Active</span>
            </span>
            <button className="hover:text-green-200 transition-colors">Support</button>
            <button className="hover:text-green-200 transition-colors">Terms</button>
          </div>
        </div>
      </div>
      
      {showTutorial && <TutorialModal />}
      {showAbout && <AboutModal />}
    </div>
  );
};

export default LandingPage;