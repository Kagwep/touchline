import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Star, Flame, Shield, Zap, Home, User } from 'lucide-react';
import { useNetworkAccount } from '../context/WalletContex';
import { Account, addAddressPadding, CairoCustomEnum } from "starknet";
import { useDojo } from '../dojo/useDojo';
import { toast } from 'react-toastify';
import { useAllEntities } from '../utils/touch';
import { getPlayerSquads, parseStarknetError } from '../utils';
import AddToSquadModal from './AddToSquadModalProps';
import GameState from '../utils/gamestate';
import { useTouchlineStore } from '../utils/touchline';
import WalletButton from './WalletButton';

// Enums matching the Rust struct
const Position = {
  GOALKEEPER: "Goalkeeper",
  DEFENDER: "Defender",
  MIDFIELDER: "Midfielder",
  FORWARD: "Forward"
};

const Rarity = {
  COMMON: "Common",
  RARE: "Rare",
  EPIC: "Epic",
  LEGENDARY: "Legendary",
  ICON:"Icon"
};

// Initial card data for demo purposes


const MarketPlacePage = () => {
  const [cards, setCards] = useState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState({ position: "", rarity: "", searchTerm: "" });
  const [newCard, setNewCard] = useState({
    id: Date.now(),
    player_name: "",
    team: "",
    position: Position.FORWARD,
    attack: 75,
    defense: 75,
    special: 1,
    rarity: Rarity.COMMON,
    season: "2025"
  });
  const [showAddToSquadModal, setShowAddToSquadModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const { account } = useNetworkAccount();
  const { set_game_state} = useTouchlineStore();

  const {
    setup: {
      client
    },
  } = useDojo();

  const { state, refetch } = useAllEntities();

  //console.log(state.cards)

  const playerSquads = getPlayerSquads(state.squad, account.address);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (["attack", "defense", "special"].includes(name)) {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) return;
      if (numValue > 99) return;
      
      setNewCard({ ...newCard, [name]: numValue });
    } else {
      setNewCard({ ...newCard, [name]: value });
    }
  };

    const handleHomeClick = () => {
      set_game_state(GameState.MainMenu)
  }

  // Add new card to MarketPlace
  const handleAddCard = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newCard.player_name || !newCard.team) {
      alert("Please fill out all required fields");
      return;
    }
    
    
    newCard.id = Date.now();

    try {

      // id: u128, 
      // player_name: felt252, 
      // team: felt252, 
      // position: Position, 
      // attack: u8, 
      // defense: u8, 
      // special: u8, 
      // rarity: Rarity, 
      // season: felt252
      
      let result = await (await client).players.createCard(
        account as Account,
        newCard.id,
        newCard.player_name,
        newCard.team,
        new CairoCustomEnum({ [newCard.position]: "()" }), // Fixed syntax with computed property
        newCard.attack,
        newCard.defense,
        newCard.special,
        new CairoCustomEnum({ [newCard.rarity]: "()" }), // Fixed syntax with computed property
        newCard.season
      );

      if (result && result.transaction_hash){
      toast.success(`${newCard.player_name} added to players`);
      }

    } catch (error: any) {
        const errorParsed = parseStarknetError(error);
  
      if (errorParsed){
          toast.error(errorParsed);
        }else{
          toast.error("Failed to create card");
        }
      
    }


    console.log(newCard);


    
    // Reset form
    setNewCard({
      id: Date.now(),
      player_name: "",
      team: "",
      position: Position.FORWARD,
      attack: 75,
      defense: 75,
      special: 1,
      rarity: Rarity.COMMON,
      season: "2025"
    });


    
    // Close form
    setShowAddForm(false);
  };


    const addToSquad = async (card) => {

      if (!account.address) {
        toast.error("Please connect your wallet to add cards to squads");
        return;
      }
      
      if (playerSquads.length === 0) {
        toast.error("Create a squad first before adding cards. Visit squad")
        return;
      }
      
      setSelectedCard(card);
      setShowAddToSquadModal(true);

    } 

// Filter cards from a record/object
const filteredCards = Object.values(state.cards).filter(card => {
  // Filter by position
  if (filter.position && card.position as unknown as string !== filter.position) {
    return false;
  }
  
  // Filter by rarity
  if (filter.rarity && card.rarity as unknown as string !== filter.rarity) {
    return false;
  }
  
  // Filter by search term (player name)
  if (filter.searchTerm && 
      !String(card.player_name).toLowerCase().includes(filter.searchTerm.toLowerCase())) {
    return false;
  }
  
  return true;
});

  // Get card background color based on rarity
  const getCardBackground = (rarity) => {
    switch(rarity) {
      case Rarity.LEGENDARY: return "bg-gradient-to-br from-purple-600 to-purple-900";
      case Rarity.EPIC: return "bg-gradient-to-br from-blue-600 to-blue-900";
      case Rarity.RARE: return "bg-gradient-to-br from-green-600 to-green-800";
      default: return "bg-gradient-to-br from-gray-600 to-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white">
      <nav className="p-4 bg-green-950">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2 text-green-300">
              <Home size={24} />
            </div>
            <a href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevents default anchor behavior
              handleHomeClick(); // Call your handler
            }}
            className="hover:text-green-300 transition-colors group relative">
              Home
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-100 group-hover:w-full"></span>
            </a>
          </div>
          
          <div className="flex space-x-4 items-center">
            <div className="bg-green-800 px-3 py-1 rounded-full flex items-center">
              <span className="text-green-300 mr-2">
                <User size={16} />
              </span>
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto flex justify-between items-center mb-8 mt-8">
        <div>
          <h1 className="text-3xl font-bold">MarketPlace</h1>
          <p className="text-green-200">Manage your player cards</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Card
        </button>
      </div>
      
      {/* Filters */}
      <div className="container mx-auto bg-green-800/50 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-green-300" />
            <input 
              type="text" 
              placeholder="Search players..." 
              className="w-full pl-10 py-2 bg-green-900/50 border border-green-700 rounded-lg"
              value={filter.searchTerm}
              onChange={(e) => setFilter({...filter, searchTerm: e.target.value})}
            />
          </div>
          
          {/* Position filter */}
          <select 
            className="px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg"
            value={filter.position}
            onChange={(e) => setFilter({...filter, position: e.target.value})}
          >
            <option value="">All Positions</option>
            {Object.values(Position).map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
          
          {/* Rarity filter */}
          <select 
            className="px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg"
            value={filter.rarity}
            onChange={(e) => setFilter({...filter, rarity: e.target.value})}
          >
            <option value="">All Rarities</option>
            {Object.values(Rarity).map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>
          
          {/* Clear filters */}
          <button 
            onClick={() => setFilter({ position: "", rarity: "", searchTerm: "" })}
            className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Cards grid */}
      <div className="container mx-auto">
      <div className="flex flex-wrap gap-4">
      {filteredCards.map(card => (
        <div 
          key={card.id}
          className="w-40 rounded-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105"
          onClick={() => addToSquad(card)}
        >
          <div 
            className="p-2"
            style={{
              background: card.rarity as unknown as string === 'Legendary' ? 'linear-gradient(145deg, #f59e0b, #b45309)' : // Gold/Amber 
                         card.rarity as unknown as string === 'Epic' ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)' : // Purple
                         card.rarity as unknown as string === 'Rare' ? 'linear-gradient(145deg, #3b82f6, #1d4ed8)' : // Blue
                         card.rarity as unknown as string === 'Icon' ? 'linear-gradient(145deg, #ec4899, #be185d)' : // Pink
                         'linear-gradient(145deg, #059669, #065f46)' // Green for Common
            }}
          >
            <div className="bg-black bg-opacity-30 rounded-lg p-2 flex flex-col"
            
            style={{
              background: card.rarity as unknown as string === 'Legendary' ? 'linear-gradient(145deg, #f59e0b, #b45309)' : // Gold/Amber 
                         card.rarity as unknown as string === 'Epic' ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)' : // Purple
                         card.rarity as unknown as string === 'Rare' ? 'linear-gradient(145deg, #3b82f6, #1d4ed8)' : // Blue
                         card.rarity as unknown as string === 'Icon' ? 'linear-gradient(145deg, #ec4899, #be185d)' : // Pink
                         'linear-gradient(145deg, #059669, #065f46)' // Green for Common
            }}
            >
              <div className="flex justify-between">
                <div className="flex space-x-1">
                  <span className="text-xs bg-white text-green-900 px-2 rounded-full font-bold">{ card.attack}</span>
                  <span className="text-xs bg-green-800 text-white px-2 rounded-full font-bold">{card.position as unknown as string}</span>
                </div>
                <div className="text-green-300">
                  <Star size={16} fill="currentColor" />
                </div>
              </div>
              
              <div className="flex-grow flex justify-center items-center p-2">
                <img 
                  src={"/roro1.png"} 
                  alt={card.player_name as string} 
                  className="h-24 rounded object-cover" 
                />
              </div>
              
              <div className="mt-1 text-center">
                <div className="font-bold text-sm">{card.player_name || card.player_name}</div>
                <div className="text-xs text-green-100">{card.team}</div>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center">
                  <Flame size={12} className="mr-1 text-red-400" />
                  <span>{card.attack}</span>
                </div>
                <div className="flex items-center">
                  <Shield size={12} className="mr-1 text-blue-400" />
                  <span>{card.defense}</span>
                </div>
                <div className="flex items-center">
                  <Zap size={12} className="mr-1 text-yellow-400" />
                  <span>{card.special}</span>
                </div>
              </div>
              
              <button 
                className="mt-2 bg-green-500 hover:bg-green-400 w-full py-1 rounded font-bold text-xs flex items-center justify-center"
              >
                <Plus size={14} className="mr-1" />
                Add to Squad
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
        
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2">No cards found</h3>
            <p>Try clearing your filters or add new cards to your MarketPlace</p>
          </div>
        )}
      </div>
      
      {/* Add card modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-green-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Card</h2>
              <button onClick={() => setShowAddForm(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Player name */}
              <div>
                <label className="block text-sm mb-1">Player Name *</label>
                <input 
                  type="text"
                  name="player_name"
                  required
                  value={newCard.player_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg"
                  placeholder="Enter player name"
                />
              </div>
              
              {/* Team */}
              <div>
                <label className="block text-sm mb-1">Team *</label>
                <input 
                  type="text"
                  name="team"
                  required
                  value={newCard.team}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg"
                  placeholder="Enter team name"
                />
              </div>
              
              {/* Position */}
              <div>
                <label className="block text-sm mb-1">Position</label>
                <select
                  name="position"
                  value={newCard.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg"
                >
                  {Object.values(Position).map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
              
              {/* Rarity */}
              <div>
                <label className="block text-sm mb-1">Rarity</label>
                <select
                  name="rarity"
                  value={newCard.rarity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg"
                >
                  {Object.values(Rarity).map(rarity => (
                    <option key={rarity} value={rarity}>{rarity}</option>
                  ))}
                </select>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Attack</label>
                  <input 
                    type="number"
                    name="attack"
                    min="0"
                    max="99"
                    value={newCard.attack}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Defense</label>
                  <input 
                    type="number"
                    name="defense"
                    min="0"
                    max="99"
                    value={newCard.defense}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Special</label>
                  <input 
                    type="number"
                    name="special"
                    min="1"
                    max="5"
                    value={newCard.special}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-green-900/50 border border-green-700 rounded-lg"
                  />
                </div>
              </div>
              
              {/* Submit */}
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddCard}
                  className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg"
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        <AddToSquadModal
          isOpen={showAddToSquadModal}
          onClose={() => setShowAddToSquadModal(false)}
          card={selectedCard}
          squads={playerSquads}
        />
    </div>
  );
};

export default MarketPlacePage;