import { Icon } from 'lucide-react';
import GameState from '../utils/gamestate';
import { useTouchlineStore } from '../utils/touchline';
import React, { useState } from 'react'
import { soccerBall } from '@lucide/lab';
import WalletButton from '../components/WalletButton';

export const TouchlineNavigation = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { set_game_state} = useTouchlineStore();

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


  return (
    <div>
              {/* Navigation */}
      <nav className="p-4 relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2 text-green-300">
              ⚽
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-100">Touchline</span>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2">
              <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white mb-1.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
              <div className={`w-6 h-0.5 bg-white ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#"
              onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleHomeClick(); // Call your handler
            }}
            className="hover:text-green-300 transition-colors group relative">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-300 transition-all group-hover:w-full"></span>
            </a>
            <a href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleSquadClick(); // Call your handler
            }}
            className="hover:text-green-300 transition-colors group relative">
              Squad
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-300 transition-all group-hover:w-full"></span>
            </a>
            <a href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleMatchClick(); // Call your handler
            }}
            className="hover:text-green-300 transition-colors group relative">
              Matches
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-300 transition-all group-hover:w-full"></span>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevents default anchor behavior
                handleMarketplaceClick(); // Call your handler
              }}
              className="hover:text-green-300 transition-colors group relative"
            >
              Marketplace
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-300 transition-all group-hover:w-full"></span>
            </a>

            <a href="#"
              onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleTournamentClick();
            }}
            
            className="hover:text-green-300 transition-colors group relative">
              Tournaments
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-300 transition-all group-hover:w-full"></span>
            </a>
            <a href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleCommunityClick();
            }}
            
            className="hover:text-green-300 transition-colors group relative">
              Community
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-300 transition-all group-hover:w-full"></span>
            </a>
            <WalletButton />
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-60' : 'max-h-0'}`}>
          <div className="flex flex-col space-y-4 mt-4 px-2">
            <a href="#"  onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleHomeClick(); // Call your handler
            }} className="hover:text-green-300 py-2 border-b border-green-800">Home</a>
            <a
            onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleSquadClick(); // Call your handler
            }}
            href="#" className="hover:text-green-300 py-2 border-b border-green-800">Squad</a>
            <a href="#" 
              onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleMatchClick(); // Call your handler
            }}
            className="hover:text-green-300 py-2 border-b border-green-800">Match</a>
            <a href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevents default anchor behavior
                handleMarketplaceClick(); // Call your handler
              }}
            className="hover:text-green-300 py-2 border-b border-green-800">Marketplace</a>
            <a href="#"
              onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleTournamentClick();
            }}
                     
            className="hover:text-green-300 py-2 border-b border-green-800">Tournaments</a>
            <a href="#"
              onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleCommunityClick();
            }}
            className="hover:text-green-300 py-2 border-b border-green-800">Community</a>
            <WalletButton />
          </div>
        </div>
      </nav>
    </div>
  )
}
