import React, { useState, useEffect } from 'react';
import { Star, ChevronRight, Plus, Minus, Check, Zap, RotateCcw, Upload, Shield, Flame, Save, RefreshCw, User, Users, PlusCircle, Home, X } from 'lucide-react';
import { getPlayerSquads, getSquadCards, parseStarknetError } from '../utils';
import SquadModal from '../components/SquadModal';
import WalletButton from '../components/WalletButton';
import { useNetworkAccount } from '../context/WalletContex';
import { useAllEntities } from '../utils/touch';
import { toast } from 'react-toastify';
import GameState from '../utils/gamestate';
import { useTouchlineStore } from '../utils/touchline';
import { Account } from 'starknet';
import { useDojo } from '../dojo/useDojo';

const SquadManagementPage = () => {
  // Formation options based on your contract
  const formations = [
    { id: 'F442', name: '4-4-2', value: 'F442' },
    { id: 'F433', name: '4-3-3', value: 'F433' },
    { id: 'F352', name: '3-5-2', value: 'F352' },
    { id: 'F532', name: '5-3-2', value: 'F532' },
    { id: 'F343', name: '3-4-3', value: 'F343' }
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSquad, setEditingSquad] = useState(null);

  const [isreplace, setRepalce] = useState(false);

  // Squad state
  const [squad, setSquad] = useState({
    name: 'My Dream Team',
    formation: 'F442',
    team_chemistry: 85,
    squad_id: 1
  });

 const { account,address } = useNetworkAccount();

  // Selected cards for the squad
  const [squadCards, setSquadCards] = useState([]);
  const [squadCardsTotal, setSquadCardsTotal] = useState([]);
  const [squadCardsSup, setSquadCardsSup] = useState([]);


  const { set_game_state,set_squad_id,squad_id} = useTouchlineStore();

      const {
        setup: {
          client
        },
      } = useDojo();
 
  
  // Lineup positions (1-11)
  const [lineup, setLineup] = useState(Array(11).fill(null));
  
  // Currently selected card for lineup placement
  const [selectedCardForLineup, setSelectedCardForLineup] = useState(null);
  
  // Currently selected tab
  const [activeTab, setActiveTab] = useState('squad'); // 'squad' or 'lineup'
  
  // View mode: 'cards' for square display or 'pitch' for formation view
  const [viewMode, setViewMode] = useState('cards');

  const { state, refetch } = useAllEntities();

  //console.log(account)

  const playerSquads = getPlayerSquads(state.squad, account.address);


  const specialPlayerCards = state.specialCards;

  const tacticCards = state.tacticCards;




  const handleOpenModal = (squad = null) => {
    setEditingSquad(squad);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSquad(null);
  };

  const handleSaveSquad = (squadData) => {

  };

    // Select card for lineup placement
    const selectCardForLineup = (card) => {
      setSelectedCardForLineup(card);
      setRepalce(true);
    };
    
   const removeFromSquad = async (card) => {
      try {
      const result = await (await client).squad.removeCardFromPosition(
          account as Account,
          squad_id,
          card.id
        );

        if (result && result.transaction_hash){
          toast.success("removed successfully!")
        }
      } catch (error) {

        const errorParsed = parseStarknetError(error);

        if (errorParsed){
          toast.error(errorParsed);
        }
        console.error("Error reomving card:", error);
        toast.error("Failed to remove card");

      }
  };
  
  // Add card to squad
  const addSquadCards = (squad) => {
    // Check if card is already in squad


    const newChemistry = calculateChemistry();
    setSquad({ ...squad, team_chemistry: newChemistry });


    const sCards = getSquadCards(state.squadPosition,state.cards,account.address,squad.squad_id);

    if (sCards.length === 0){
      toast.info(`${squad.name} doenst have players visit market place to add`)
    }


    
    sCards.forEach(async card => {
      // Check if position index is less than or equal to 11
      if (card.positionIndex <= 11) {
        setSquadCards(
          prevCards =>{
            return [...prevCards,card]
          }
        );
        setSelectedCardForLineup(card);
        // console.log(card)
        await placeCardInLineup(card.positionIndex,card);
       // console.log(card)
       
      } 
      // Check if position index is between 16 and 22 inclusive
      else if (card.positionIndex >= 16 && card.positionIndex <= 22) {
        setSquadCardsSup(
          prevCards =>{
            return [...prevCards,card]
          }
        )
       
        state.setLineupPlayerSups(card.positionIndex,card);
        
      }
    });


    setSquadCardsTotal(sCards);
    set_squad_id(squad.squad_id);
    state.loadPlayerCards(account.address,squad.squad_id)
                                        

  };

 
  // runTest();
  // Remove card from squad
  const removeCardFromSquad = (cardId) => {
    // First remove from lineup if it's there
    const updatedLineup = lineup.map(card => {
      if (card !== null && card.id === cardId) {
        return null;
      }
      return card;
    });
    setLineup(updatedLineup);
    
    // Then remove from squad
    setSquadCards(squadCards.filter(card => card.id !== cardId));
  };
  

  // Place selected card in lineup position
 // Place selected card in lineup position
const placeCardInLineup = async (positionIndex, card) => {
  // Get current lineup from store
  const currentLineup = { ...state.lineup };
  const newPositionIndex = positionIndex - 1;

  if (currentLineup[newPositionIndex] === null && isreplace){
    toast("Please select card to replace");
    setRepalce(false);
    return
  }
  
  try {
    // Check if position is already occupied and we should replace
    if (currentLineup[newPositionIndex] !==null && isreplace) {

      
      const currentCard = currentLineup[positionIndex];

      // Call API to replace card
      const result = await (await client).squad.replaceCardToPosition(
        account as Account,
        squad.squad_id,
        currentCard.id,
        card.id
      );
      
      if (result && result.transaction_hash) {
        toast.success(`${card.player_name} replaced`);
        setRepalce(false);
              // Update UI optimistically
      state.setLineupPlayer(newPositionIndex, {
        ...card,
        positionIndex: newPositionIndex,
        chemistryBonus: card.chemistryBonus || 0,
        squadId: squad.squad_id
      });
      
      } else {
        state.setLineupPlayer(newPositionIndex, currentLineup[newPositionIndex]);
        toast.error("Failed to replace player");
        setRepalce(false);
      }
    } else {
      // Place card in empty position
      //console.log("placing in empty position", card, newPositionIndex);
      
      // Add the card to the lineup using the store's setter
      state.setLineupPlayer(newPositionIndex, {
        ...card,
        positionIndex: newPositionIndex,
        chemistryBonus: card.chemistryBonus || 0,
        squadId: squad.squad_id
      });
    }
  } catch (error) {
    // Revert the lineup on error
    if (currentLineup[newPositionIndex]) {
      state.setLineupPlayer(newPositionIndex, currentLineup[newPositionIndex]);
    } else {
      // If there was no card originally, we need to remove the card that was added
      const newLineup = { ...state.lineup };
      delete newLineup[newPositionIndex];
    }
    toast.error(error.message || "Failed to update lineup");
  } finally {
    // Clear selection regardless of outcome
    setSelectedCardForLineup(null);
  }
};
  
  // Remove card from lineup
  const removeCardFromLineup = (positionIndex) => {
    const newLineup = [...lineup];
    newLineup[positionIndex - 1] = null;
    setLineup(newLineup);
  };
  
  // Handle formation change
  const changeFormation = (formationValue) => {
    setSquad({...squad, formation: formationValue});
    // You might want to clear or adjust lineup when formation changes
    // depending on your game logic
  };
  
  // Handle squad name change
  const updateSquadName = (name) => {
    setSquad({...squad, name});
  };
  
  // Calculate chemistry based on player positions and other factors
  // This would be a placeholder for your actual chemistry calculation logic
  const calculateChemistry = () => {
    // Sample chemistry calculation logic
    let chemistry = 70; // Base chemistry
    
    // Adjust based on number of positions filled
    const filledPositions = lineup.filter(pos => pos !== null).length;
    chemistry += filledPositions * 2;
    
    // Cap at 100
    return Math.min(chemistry, 100);
  };
  
  // Update chemistry when lineup changes

  
  // Save squad to contract (would be connected to Starknet in a real implementation)
  const saveSquad = () => {
    // Prepare squad data for contract
    const squadData = {
      player_id: "0x123...", // Replace with actual wallet address
      squad_id: squad.squad_id,
      name: squad.name,
      formation: squad.formation,
      team_chemistry: squad.team_chemistry
    };
    
    // Prepare position data for contract
    const positionData = lineup.map((card, index) => {
      if (card === null) return null;
      
      return {
        player_id: "0x123...", // Replace with actual wallet address
        squad_id: squad.squad_id,
        position_index: index + 1, // 1-based index as per your contract
        card_id: card.id,
        chemistry_bonus: 0 // This would be calculated based on your game logic
      };
    }).filter(pos => pos !== null);
    
    console.log("Squad data for contract:", squadData);
    console.log("Position data for contract:", positionData);
    
    // Here you would call your Starknet contract
    alert("Squad saved successfully! (Contract call would happen here)");
  };

  const handleHomeClick = () => {
    set_game_state(GameState.MainMenu)
}
  
  // Get position name for lineup display based on formation
  const getPositionName = (index, formation) => {
    const positions = {
      'F442': ['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CM', 'CM', 'RM', 'ST', 'ST'],
      'F433': ['GK', 'LB', 'CB', 'CB', 'RB', 'CM', 'CDM', 'CM', 'LW', 'ST', 'RW'],
      'F352': ['GK', 'CB', 'CB', 'CB', 'LM', 'CM', 'CDM', 'CM', 'RM', 'ST', 'ST'],
      'F532': ['GK', 'LWB', 'CB', 'CB', 'CB', 'RWB', 'CM', 'CM', 'CM', 'ST', 'ST'],
      'F343': ['GK', 'CB', 'CB', 'CB', 'LM', 'CM', 'CM', 'RM', 'LW', 'ST', 'RW'],
    };
    
    return positions[formation][index] || `POS ${index + 1}`;
  };
  
  // Render the formation positions for the pitch view
  const renderFormationPositions = () => {
    const formationPositions = {
      'F442': [
        { top: '85%', left: '50%' }, // GK
        { top: '65%', left: '20%' }, // LB
        { top: '65%', left: '35%' }, // CB
        { top: '65%', left: '65%' }, // CB
        { top: '65%', left: '80%' }, // RB
        { top: '40%', left: '20%' }, // LM
        { top: '40%', left: '35%' }, // CM
        { top: '40%', left: '65%' }, // CM
        { top: '40%', left: '80%' }, // RM
        { top: '15%', left: '35%' }, // ST
        { top: '15%', left: '65%' }  // ST
      ],
      'F433': [
        { top: '85%', left: '50%' }, // GK
        { top: '65%', left: '20%' }, // LB
        { top: '65%', left: '35%' }, // CB
        { top: '65%', left: '65%' }, // CB
        { top: '65%', left: '80%' }, // RB
        { top: '40%', left: '35%' }, // CM
        { top: '40%', left: '50%' }, // CDM
        { top: '40%', left: '65%' }, // CM
        { top: '15%', left: '20%' }, // LW
        { top: '15%', left: '50%' }, // ST
        { top: '15%', left: '80%' }  // RW
      ],
      'F352': [
        { top: '85%', left: '50%' }, // GK
        { top: '65%', left: '30%' }, // CB
        { top: '65%', left: '50%' }, // CB
        { top: '65%', left: '70%' }, // CB
        { top: '40%', left: '15%' }, // LM
        { top: '40%', left: '35%' }, // CM
        { top: '40%', left: '50%' }, // CDM
        { top: '40%', left: '65%' }, // CM
        { top: '40%', left: '85%' }, // RM
        { top: '15%', left: '35%' }, // ST
        { top: '15%', left: '65%' }  // ST
      ],
      'F532': [
        { top: '85%', left: '50%' }, // GK
        { top: '65%', left: '15%' }, // LWB
        { top: '65%', left: '30%' }, // CB
        { top: '65%', left: '50%' }, // CB
        { top: '65%', left: '70%' }, // CB
        { top: '65%', left: '85%' }, // RWB
        { top: '40%', left: '30%' }, // CM
        { top: '40%', left: '50%' }, // CM
        { top: '40%', left: '70%' }, // CM
        { top: '15%', left: '35%' }, // ST
        { top: '15%', left: '65%' }  // ST
      ],
      'F343': [
        { top: '85%', left: '50%' }, // GK
        { top: '65%', left: '30%' }, // CB
        { top: '65%', left: '50%' }, // CB
        { top: '65%', left: '70%' }, // CB
        { top: '40%', left: '15%' }, // LM
        { top: '40%', left: '35%' }, // CM
        { top: '40%', left: '65%' }, // CM
        { top: '40%', left: '85%' }, // RM
        { top: '15%', left: '20%' }, // LW
        { top: '15%', left: '50%' }, // ST
        { top: '15%', left: '80%' }  // RW
      ]
    };
    
    const positions = formationPositions[squad.formation] || [];
    
    return (
      <div className="relative w-full h-96 bg-green-800 rounded-xl overflow-hidden">
        {/* Soccer field markings */}
        <div className="absolute inset-0 border-2 border-white border-opacity-30"></div>
        <div className="absolute w-36 h-16 border-2 border-white border-opacity-30 top-0 left-1/2 transform -translate-x-1/2"></div>
        <div className="absolute w-36 h-16 border-2 border-white border-opacity-30 bottom-0 left-1/2 transform -translate-x-1/2"></div>
        <div className="absolute w-36 h-36 rounded-full border-2 border-white border-opacity-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-1 h-full bg-white bg-opacity-30 top-0 left-1/2 transform -translate-x-1/2"></div>
        
        {/* Position markers */}
              {positions.map((position, index) => {
                // Get player from the state.lineup Record using index as the key
                const player = state.lineup[index.toString()];
                
                return (
                  <div 
                    key={index}
                    style={{ top: position.top, left: position.left }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div 
                      className={`w-14 h-14 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all ${
                        selectedCardForLineup && !player ? 'bg-green-600 scale-110 animate-pulse' : 
                        player ? 'bg-gradient-to-b from-green-500 to-green-700' : 'bg-green-700 bg-opacity-60'
                      }`}
                      onClick={async () => selectedCardForLineup ? await placeCardInLineup(index, selectedCardForLineup) : player && removeCardFromLineup(index)}
                    >
                      {player ? (
                        <>
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                            <img src="{player.image}" alt={player.player_name as string} className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute -bottom-5 bg-green-900 px-2 py-0.5 rounded text-xs">
                            {(player.player_name as string).split(' ')[0]}
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <div className="text-xs font-bold">{getPositionName(index, squad.formation)}</div>
                          {selectedCardForLineup && (
                            <div className="text-xs mt-1">Place here</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white">
      {/* Navigation */}
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
      
      {/* Main Container */}
      <div className="container mx-auto px-4 py-6">
        {/* Squad Details Panel */}
        <div className="bg-green-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-2 text-green-300">
              <Users size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-100">Squad Management</span>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div className="flex">
                <select
                  value={squad.formation}
                  onChange={(e) => changeFormation(e.target.value)}
                  className="bg-green-900 text-white px-3 py-2 rounded-lg border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {formations.map(formation => (
                    <option key={formation.id} value={formation.value}>
                      {formation.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={() => handleOpenModal()}
                className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center"
              >
                New Squad
              </button>
            </div>
          </div>
        </div>
        
            {/* Available Players Horizontal Scrolling Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">My Squads</h1>
          </div>
          {playerSquads.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>You haven't created any squads yet</p>
              <button
                onClick={() => handleOpenModal()}
                className="mt-4 text-blue-500 hover:underline"
              >
                Create your first squad
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playerSquads.map(squad => (
                <div 
                  key={squad.squad_id}
                  className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700"
                  onClick={() => addSquadCards(squad)}
                >
                  <h3 className="text-xl font-bold text-white mb-2">{squad.name}</h3>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400">Formation</span>
                    <span className="text-white">
                      {squad.formation as unknown as string === 'F442' && '4-4-2'}
                      {squad.formation as unknown as string === 'F433' && '4-3-3'}
                      {squad.formation as unknown as string === 'F352' && '3-5-2'}
                      {squad.formation as unknown as string === 'F532' && '5-3-2'}
                      {squad.formation as unknown as string === 'F343' && '3-4-3'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Chemistry</span>
                    <span className="text-white">{squad.team_chemistry}/100</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Tabs for Squad and Lineup */}
        <div className="bg-green-800 rounded-xl overflow-hidden mb-6">
          <div className="flex border-b border-green-700">
            <button 
              className={`px-6 py-3 font-bold text-lg flex-1 ${activeTab === 'squad' ? 'bg-green-700 text-white' : 'text-green-300 hover:bg-green-700 hover:bg-opacity-50'}`}
              onClick={() => setActiveTab('squad')}
            >
              Squad ({squadCardsTotal.length})
            </button>
            <button 
              className={`px-6 py-3 font-bold text-lg flex-1 ${activeTab === 'lineup' ? 'bg-green-700 text-white' : 'text-green-300 hover:bg-green-700 hover:bg-opacity-50'}`}
              onClick={() => setActiveTab('lineup')}
            >
              Lineup ({Object.keys(lineup).length}/11)
            </button>
          </div>
          
          {/* Squad Panel */}
          {activeTab === 'squad' && (
            <div className="p-4">
              {squadCardsTotal.length === 0 ? (
                <div className="text-center py-10 text-green-300">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-bold">Your squad is empty</p>
                  <p className="mt-2">Add players from the available players section above</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {squadCardsTotal.map(card => (
                        <div 
                          key={card.id}
                          className="w-40 rounded-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105"
                          // onClick={() => addToSquad(card)}
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
                              
                            </div>
                          </div>
                        </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Lineup Panel */}
          {activeTab === 'lineup' && (
            <div className="p-4">
              {/* View mode toggle */}
              <div className="flex justify-end mb-4">
                <div className="bg-green-900 rounded-lg p-1 flex">
                  <button 
                    className={`px-3 py-1 rounded-lg text-sm font-bold ${viewMode === 'cards' ? 'bg-green-600' : ''}`}
                    onClick={() => setViewMode('cards')}
                  >
                    Cards View
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-lg text-sm font-bold ${viewMode === 'pitch' ? 'bg-green-600' : ''}`}
                    onClick={() => setViewMode('pitch')}
                  >
                    Pitch View
                  </button>
                </div>
              </div>
              
              {/* Selected card indicator */}
              {selectedCardForLineup && (
                <div className="mb-4 bg-green-900 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img src={selectedCardForLineup.image} alt={selectedCardForLineup.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold">{selectedCardForLineup.name}</div>
                      <div className="text-xs text-green-300">Select a position below to place this player</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCardForLineup(null)}
                    className="bg-green-700 hover:bg-green-600 px-2 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
              
              {viewMode === 'pitch' ? (
                /* Pitch View */
                renderFormationPositions()
              ) : (
                /* Cards View */
                <div className="flex flex-wrap gap-4">
                        {Array(11).fill(null).map((_, index) => {
                          // Get player from state.lineup using index as string key
                          const player = state.lineup[index.toString()];
                          
                          return (
                            <div 
                              key={index}
                              className={`rounded-xl overflow-hidden cursor-pointer ${
                                selectedCardForLineup ? 'ring-2 ring-green-400 animate-pulse' : ''
                              }`}
                              onClick={async () => selectedCardForLineup ? await placeCardInLineup(index, selectedCardForLineup) : null}
                            >
                              {player ? (
                                <div 
                                  key={player.id}
                                  className="w-40 rounded-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105"
                                >
                                  <div 
                                    className="p-2"
                                    style={{
                                      background: player.rarity as unknown as string === 'Legendary' ? 'linear-gradient(145deg, #f59e0b, #b45309)' : // Gold/Amber 
                                      player.rarity as unknown as string === 'Epic' ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)' : // Purple
                                      player.rarity as unknown as string === 'Rare' ? 'linear-gradient(145deg, #3b82f6, #1d4ed8)' : // Blue
                                      player.rarity as unknown as string === 'Icon' ? 'linear-gradient(145deg, #ec4899, #be185d)' : // Pink
                                                'linear-gradient(145deg, #059669, #065f46)' // Green for Common
                                    }}
                                  >
                                    <div className="bg-black bg-opacity-30 rounded-lg p-2 flex flex-col"
                                      style={{
                                        background: player.rarity as unknown as string === 'Legendary' ? 'linear-gradient(145deg, #f59e0b, #b45309)' : // Gold/Amber 
                                        player.rarity as unknown as string === 'Epic' ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)' : // Purple
                                        player.rarity as unknown as string === 'Rare' ? 'linear-gradient(145deg, #3b82f6, #1d4ed8)' : // Blue
                                        player.rarity as unknown as string === 'Icon' ? 'linear-gradient(145deg, #ec4899, #be185d)' : // Pink
                                                  'linear-gradient(145deg, #059669, #065f46)' // Green for Common
                                      }}
                                    >
                                      <div className="flex justify-between">
                                        <div className="flex space-x-1">
                                          <span className="text-xs bg-white text-green-900 px-2 rounded-full font-bold">{player.attack}</span>
                                          <span className="text-xs bg-green-800 text-white px-2 rounded-full font-bold">{player.position as unknown as string}</span>
                                        </div>
                                        <div className="text-green-300">
                                          <Star size={16} fill="currentColor" />
                                        </div>
                                      </div>
                                      
                                      <div className="flex-grow flex justify-center items-center p-2">
                                        <img 
                                          src={"/roro1.png"} 
                                          alt={player.player_name as string} 
                                          className="h-24 rounded object-cover" 
                                        />
                                      </div>
                                      
                                      <div className="mt-1 text-center">
                                        <div className="font-bold text-sm">{player.player_name}</div>
                                        <div className="text-xs text-green-100">{player.team}</div>
                                      </div>
                                      
                                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                                        <div className="flex items-center">
                                          <Flame size={12} className="mr-1 text-red-400" />
                                          <span>{player.attack}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Shield size={12} className="mr-1 text-blue-400" />
                                          <span>{player.defense}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Zap size={12} className="mr-1 text-yellow-400" />
                                          <span>{player.special}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-green-800 p-4 min-h-32 flex flex-col items-center justify-center text-center">
                                  <div className="text-sm font-bold mb-1">Position {index + 1}</div>
                                  <div className="text-xs mb-2">{getPositionName(index, squad.formation)}</div>
                                  {selectedCardForLineup ? (
                                    <div className="bg-green-500 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                      Click to place player
                                    </div>
                                  ) : (
                                    <div className="text-green-400 text-xs">Empty position</div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
              )}
              
              {/* Squad selection reminder */}
              {!selectedCardForLineup ? (
                Object.keys(state.lineupSups).length > 0 ? (
                  <div className="mt-6 bg-green-900 p-3 rounded-lg text-center">
                    <p className="text-sm">
                      Select players from your squad and place them in your lineup to replace player.
                    </p>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {Object.values(state.lineupSups).map(card => (
                        <div
                          key={card.id}
                          onClick={() => selectCardForLineup(card)}
                          className="bg-green-800 hover:bg-green-700 p-2 rounded flex items-center cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                            <img src="/roro.png" alt={card.player_name as string} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-xs truncate">{card.player_name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 bg-green-900 p-3 rounded-lg text-center">
                    <p className="text-sm">
                      Please add more players to your squad if you need to replace players in your starting lineup.
                    </p>
                  </div>
                )
) : null}
            </div>
          )}
        </div>
  <div className="space-y-6">
      {/* Special Cards Section */}
      <div>
        <h3 className="text-lg font-bold mb-2">Special Cards</h3>
        <div className="flex flex-wrap gap-4">
          {Object.values(specialPlayerCards).map(card => (
            <div 
              key={card.id}
              className="w-40 rounded-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105 relative"
            >
              {/* Remove button */}
              <button 
                onClick={() => removeFromSquad(card)}
                className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                title="Remove from squad"
              >
                <X size={16} />
              </button>
              
              {/* Card content - keeping the exact same structure as original */}
              <div 
                className="p-2"
                style={{
                  background: card.rarity as unknown as string === 'Legendary' ? 'linear-gradient(145deg, #f59e0b, #b45309)' : 
                            card.rarity as unknown as string === 'Epic' ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)' : 
                            card.rarity as unknown as string === 'Rare' ? 'linear-gradient(145deg, #3b82f6, #1d4ed8)' : 
                            card.rarity as unknown as string === 'Icon' ? 'linear-gradient(145deg, #ec4899, #be185d)' : 
                            'linear-gradient(145deg, #059669, #065f46)'
                }}
              >
                <div className="bg-black bg-opacity-30 rounded-lg p-2 flex flex-col"
                  style={{
                    background: card.rarity as unknown as string === 'Legendary' ? 'linear-gradient(145deg, #f59e0b, #b45309)' : 
                              card.rarity as unknown as string === 'Epic' ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)' : 
                              card.rarity as unknown as string === 'Rare' ? 'linear-gradient(145deg, #3b82f6, #1d4ed8)' : 
                              card.rarity as unknown as string === 'Icon' ? 'linear-gradient(145deg, #ec4899, #be185d)' : 
                              'linear-gradient(145deg, #059669, #065f46)'
                  }}
                >
                  <div className="flex justify-between">
                    <div className="flex space-x-1">
                      <span className="text-xs bg-white text-green-900 px-2 rounded-full font-bold">{card.attack}</span>
                      <span className="text-xs bg-green-800 text-white px-2 rounded-full font-bold">{card.defense}</span>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tactic Cards Section */}
      <div>
        <h3 className="text-lg font-bold mb-2">Tactic Cards</h3>
        <div className="flex flex-wrap gap-4">
          {Object.values(tacticCards).map(card => (
            <div 
              key={card.id}
              className="w-40 rounded-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105 relative"
            >
              {/* Remove button */}
              <button 
                onClick={() => removeFromSquad(card)}
                className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                title="Remove from squad"
              >
                <X size={16} />
              </button>
              
              {/* Using the exact same card structure for tactic cards */}
              <div 
                className="p-2"
                style={{
                  background: card.rarity as unknown as string === 'Legendary' ? 'linear-gradient(145deg, #f59e0b, #b45309)' : 
                            card.rarity as unknown as string=== 'Epic' ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)' : 
                            card.rarity as unknown as string=== 'Rare' ? 'linear-gradient(145deg, #3b82f6, #1d4ed8)' : 
                            card.rarity as unknown as string === 'Icon' ? 'linear-gradient(145deg, #ec4899, #be185d)' : 
                            'linear-gradient(145deg, #059669, #065f46)'
                }}
              >
                <div className="bg-black bg-opacity-30 rounded-lg p-2 flex flex-col"
                  style={{
                    background: card.rarity as unknown as string === 'Legendary' ? 'linear-gradient(145deg, #f59e0b, #b45309)' : 
                              card.rarity as unknown as string === 'Epic' ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)' : 
                              card.rarity as unknown as string === 'Rare' ? 'linear-gradient(145deg, #3b82f6, #1d4ed8)' : 
                              card.rarity as unknown as string === 'Icon' ? 'linear-gradient(145deg, #ec4899, #be185d)' : 
                              'linear-gradient(145deg, #059669, #065f46)'
                  }}
                >
                  <div className="flex justify-between">
                    <div className="flex space-x-1">
                      <span className="text-xs bg-white text-green-900 px-2 rounded-full font-bold">{card.attack}</span>
                      <span className="text-xs bg-green-800 text-white px-2 rounded-full font-bold">{card.defense}</span>
                    </div>
                    <div className="text-green-300">
                      <Star size={16} fill="currentColor" />
                    </div>
                  </div>
                  
                  <div className="flex-grow flex justify-center items-center p-2">
                    <img 
                      src={"/roro1.png"} 
                      alt={card.player_name as string } 
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
        
        {/* Game Stats (Just for UI completeness) */}
       <div className="bg-green-800 rounded-xl p-4">
          <h2 className="text-xl font-bold mb-3">Team Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-900 p-3 rounded-lg text-center">
              <div className="text-green-300 text-sm mb-1">Attack Rating</div>
              <div className="text-2xl font-bold">
                {Object.keys(state.lineup).length > 0 
                  ? Math.floor(Object.values(state.lineup).reduce((sum, card) => sum + (card.attack as number), 0) / Object.keys(state.lineup).length)
                  : 0
                }
              </div>
            </div>
            <div className="bg-green-900 p-3 rounded-lg text-center">
              <div className="text-green-300 text-sm mb-1">Defense Rating</div>
              <div className="text-2xl font-bold">
                {Object.keys(state.lineup).length > 0 
                  ? Math.floor(Object.values(state.lineup).reduce((sum, card) => sum + (card.defense as number), 0) / Object.keys(state.lineup).length)
                  : 0
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <SquadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSquad}
        initialData={editingSquad}
        numSquads ={playerSquads.length}
      />
    </div>
  );
};

export default SquadManagementPage;