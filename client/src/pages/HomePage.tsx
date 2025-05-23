import React, { useState, useEffect } from 'react';
import { Star, ChevronRight, Plus, Icon, Trophy, Calendar, Zap, ArrowRight, Award } from 'lucide-react';
import { soccerBall } from '@lucide/lab';
import { useNetworkAccount } from '../context/WalletContex';
import WalletButton from '../components/WalletButton';
import { useTouchlineStore } from '../utils/touchline';
import GameState from '../utils/gamestate';
import { TouchlineNavigation } from './Navigation';
import { getRandomPlayerImage } from '../utils';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [featuredCards, setFeaturedCards] = useState([
    {
      id: 1,
      name: "Lion",
      team: "Miami",
      rating: 92,
      image: getRandomPlayerImage(),
      rarity: "legendary"
    },
    {
      id: 2,
      name: "Ronado",
      team: "AlN",
      rating: 90,
      image: getRandomPlayerImage(),
       rarity: "legendary"
    },
    {
      id: 3,
      name: "Kilian",
      team: "Madrid",
      rating: 91,
      image: getRandomPlayerImage(),
      rarity: "epic"
    }
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(1); // Start with middle card
  const [isHovering, setIsHovering] = useState(null);
  const { account, address, status, isConnected } = useNetworkAccount();

  const { set_game_state} = useTouchlineStore();

  // News items for the news ticker
  const newsItems = [
    "New Season 5 cards available now in the store!",
    "Weekend tournament with legendary card rewards starts Friday",
    "Trading volumes hit new record with over 1M cards exchanged yesterday",
    "New 'Manager Challenge' mode coming soon - stay tuned!"
  ];
  
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    // Animation effect for cards when component mounts
    const timer = setTimeout(() => {
      document.querySelectorAll('.card').forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-in');
        }, index * 200);
      });
    }, 500);

    // News ticker rotation
    const newsInterval = setInterval(() => {
      setCurrentNewsIndex(prevIndex => (prevIndex + 1) % newsItems.length);
    }, 5000);

    // Card rotation
    const cardInterval = setInterval(() => {
      setCurrentCardIndex(prevIndex => (prevIndex + 1) % featuredCards.length);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(newsInterval);
      clearInterval(cardInterval);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMarketplaceClick = () => {
      set_game_state(GameState.Market)
  }


  const handleSquadClick = () => {
    set_game_state(GameState.Squad)
  }

  const handleMatchClick = () => {
    set_game_state(GameState.Matches)
  }


    const handleHomeClick = () => {
    set_game_state(GameState.MainMenu)
}


    const handleTournamentClick = () => {
    set_game_state(GameState.Tournament)
}

  const handleCommunityClick = () => {
    set_game_state(GameState.Community)
}

  // Quick action buttons data
  const quickActions = [
    { icon: <Icon iconNode={soccerBall} className="w-5 h-5" />, label: "Play Now", color: "bg-green-500 hover:bg-green-400", action: handleMatchClick},
    { icon: <Trophy className="w-5 h-5" />, label: "Tournaments", color: "bg-blue-500 hover:bg-blue-400", action: handleTournamentClick },
    { icon: <Calendar className="w-5 h-5" />, label: "Events", color: "bg-purple-500 hover:bg-purple-400",action: handleCommunityClick },
    { icon: <Award className="w-5 h-5" />, label: "Rewards", color: "bg-amber-500 hover:bg-amber-400", action: handleTournamentClick }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
      
      {/* Background glow */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-green-400 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-400 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: "1.5s"}}></div>
      
      <TouchlineNavigation />
      
      {/* News ticker */}
      <div className="bg-green-800/50 border-y border-green-600/30 py-2 mb-6 relative overflow-hidden">
        <div className="container mx-auto px-4 flex items-center">
          <div className="bg-green-600 text-white px-3 py-1 rounded mr-4 text-sm font-bold flex items-center shrink-0">
            <Zap className="w-4 h-4 mr-1" /> NEWS
          </div>
          <div className="overflow-hidden relative w-full">
            <div className="whitespace-nowrap animate-marquee">
              {newsItems.map((item, index) => (
                <span 
                  key={index} 
                  className={`inline-block transition-opacity duration-700 ${currentNewsIndex === index ? 'opacity-100' : 'opacity-0 absolute'}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Collect, Trade, <br/>
              <span className="text-green-300">Conquer the Pitch</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-green-100 max-w-xl">
              Build your ultimate football squad with digital player cards. Trade with fans worldwide and compete in exciting tournaments to become a legendary manager.
            </p>
            
            {/* Quick action buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {quickActions.map((action, index) => (
                <button 
                  key={index} 
                  className={`${action.color} px-4 py-3 rounded-lg font-semibold transition-all flex flex-col items-center justify-center hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1`}
                  onClick={action.action}
                >
                  {action.icon}
                  <span className="mt-1">{action.label}</span>
                </button>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-green-900/30 flex items-center justify-center group">
                Start Playing <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-green-900/30 flex items-center justify-center">
                New Game <Plus size={20} className="ml-2" />
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-full font-bold transition-all">
                Watch Trailer
              </button>
            </div>
          </div>
          
          {/* Cards display */}
          <div className="md:w-1/2 relative">
            <div className="absolute w-64 h-64 bg-green-500 rounded-full filter blur-3xl opacity-20 -top-10 -right-10"></div>
            <div className="relative h-80 w-full flex justify-center items-center perspective-1000">
              {featuredCards.map((card, index) => {
                // Calculate position based on current card index
                const position = (index - currentCardIndex + featuredCards.length) % featuredCards.length;
                
                // Positions: 0 = left, 1 = center, 2 = right
                const isCenter = position === 0;
                const isLeft = position === 2;
                const isRight = position === 1;
                
                return (
                  <div 
                    key={card.id} 
                    className={`card absolute transition-all duration-700 ease-out ${
                      isCenter ? 'z-30 scale-110 opacity-100' : 
                      isLeft ? 'z-10 -translate-x-16 -rotate-12 scale-90 opacity-70' : 
                      'z-10 translate-x-16 rotate-12 scale-90 opacity-70'
                    }`}
                    onMouseEnter={() => setIsHovering(card.id)}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    <div 
                      className={`w-48 md:w-56 h-72 rounded-xl overflow-hidden relative transition-transform duration-300 ${
                        isHovering === card.id ? 'transform scale-105' : ''
                      }`}
                    >
                      {/* Card background with gradient based on rarity */}
                      <div className="absolute inset-0" 
                        style={{
                          background: card.rarity === 'legendary' ? 'linear-gradient(145deg, #10b981, #047857)' : 
                                    card.rarity === 'epic' ? 'linear-gradient(145deg, #059669, #047857)' : 
                                    'linear-gradient(145deg, #10b981, #065f46)'
                        }}
                      ></div>
                      
                      {/* Card shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                      
                      {/* Card content */}
                      <div className="absolute top-0 left-0 w-full h-full p-3">
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg w-full h-full p-3 flex flex-col">
                          <div className="flex justify-between">
                            <span className="text-sm bg-white text-green-900 px-2 py-0.5 rounded-full font-bold shadow-md">{card.rating}</span>
                            <div className="text-yellow-300">
                              <Star size={18} fill="currentColor" />
                            </div>
                          </div>
                          
                          <div className="flex-grow flex justify-center items-center py-3">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-full"></div>
                              <img src={card.image} alt={card.name} className="h-32 md:h-36 rounded-full object-cover border-2 border-white/20" />
                            </div>
                          </div>
                          
                          <div className="mt-2 text-center">
                            <div className="font-bold text-base md:text-lg">{card.name}</div>
                            <div className="text-sm text-green-100 flex items-center justify-center">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-300 mr-1.5"></span>
                              {card.team}
                            </div>
                            
                            {/* Rarity badge */}
                            <div className={`mt-2 text-xs uppercase tracking-wider px-2 py-0.5 rounded inline-block
                              ${card.rarity === 'legendary' ? 'bg-purple-500/30 text-purple-200' : 
                                card.rarity === 'epic' ? 'bg-blue-500/30 text-blue-200' : 
                                'bg-green-500/30 text-green-200'}`}
                            >
                              {card.rarity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Card navigation dots */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {featuredCards.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentCardIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentCardIndex ? 'bg-green-300 w-6' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
 

      
      {/* Footer */}
      <footer className="bg-green-950 py-8 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="mr-2 text-green-400">
                  <Icon iconNode={soccerBall} className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">Touchline</span>
              </div>
              <p className="text-green-300 mt-2">The ultimate digital football card game</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-green-300 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-green-300 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-green-300 hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="text-green-300 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-green-400 text-sm">
            &copy; 2025 Touchline. All rights reserved.
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default HomePage;