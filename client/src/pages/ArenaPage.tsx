import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Check, 
  Zap, 
  RotateCcw, 
  Shield, 
  Flame, 
  Timer, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  User, 
  Users, 
  PlusCircle, 
  Home, 
  Award, 
  Clock, 
  Globe,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNetworkAccount } from '../context/WalletContex';
import { useAllEntities } from '../utils/touch';
import GameState from '../utils/gamestate';
import { useTouchlineStore } from '../utils/touchline';
import WalletButton from '../components/WalletButton';
import { ensureHexZeroPrefix, removeLeadingZeros } from '../utils/sanitizer';
import { ActionType, MatchStatus } from '../utils/types';
import { Account, CairoCustomEnum, hash } from 'starknet';
import { flipActionType, getRandomPlayerImage, hashCard, parseStarknetError } from '../utils';
import { useDojo } from '../dojo/useDojo';
import SelectActionTypeModal from '../components/SelectActionTypeModal';
import { TouchlineNavigation } from './Navigation';




const ArenaPage = () => {
  const { account, address } = useNetworkAccount();
  const { state, refetch } = useAllEntities();
  const { set_game_state,squad_id,match_id } = useTouchlineStore();

        const {
          setup: {
            client
          },
        } = useDojo();

  const match = state.matches[`${match_id}`];
  const squad = state.playerSquads[`${squad_id}_${ensureHexZeroPrefix(account.address)}`]

  console.log(match,squad)

  console.log(`${squad_id}_${ensureHexZeroPrefix(account.address)}`)
  
  // State for the secret
  const [secret, setSecret] = useState('');
  const [secretVisible, setSecretVisible] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const specialCards = state.specialCards;
  const tacticalCards = state.tacticCards;

  console.log(state.commits)
  

  // State for card actions
  const [selectedCard, setSelectedCard] = useState(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  
  // Determine if user is home or away player
  const isHomePlayer = match && account.address === removeLeadingZeros(match.home_player_id);
  const isAwayPlayer = match && account.address === removeLeadingZeros(match.away_player_id);
  const isParticipant = isHomePlayer || isAwayPlayer;

  // Format match status for display
  const getMatchStatusText = (status) => {
    switch (status) {
      case MatchStatus.WAITING_FOR_AWAY:
        return 'Waiting for away player';
      case MatchStatus.IN_PROGRESS:
        return 'Match in progress';
      case MatchStatus.AWAY_WIN:
        return 'Away Won';
      case MatchStatus.HOME_WIN:
        return 'Home Won';
      case MatchStatus.DRAW:
        return 'Draw';
      case MatchStatus.ABANDONED:
        return 'Match cancelled';
      case MatchStatus.PENDINGREVEAL:
        return 'Pending Reveal';
      default:
        return 'Unknown status';
    }
  };

    const handleActionSelected = (actionType) => {

    // Execute the selected action with the card
    if (selectedCard) {
      console.log(actionType)
     commitCardAction(selectedCard,actionType)
    }
    
    toast.success(`${actionType} action selected`);
  };
  
  // Calculate time remaining in current turn
  const [timeRemaining, setTimeRemaining] = useState('');
  
  // Get position name based on index and formation
  const getPositionName = (index, formation) => {
    const formations = {
      'F442': ['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CM', 'CM', 'RM', 'ST', 'ST'],
      'F433': ['GK', 'LB', 'CB', 'CB', 'RB', 'CM', 'CDM', 'CM', 'LW', 'ST', 'RW'],
      'F352': ['GK', 'CB', 'CB', 'CB', 'LM', 'CM', 'CDM', 'CM', 'RM', 'ST', 'ST'],
      'F532': ['GK', 'LWB', 'CB', 'CB', 'CB', 'RWB', 'CM', 'CM', 'CM', 'ST', 'ST'],
      'F343': ['GK', 'CB', 'CB', 'CB', 'LM', 'CM', 'CM', 'RM', 'LW', 'ST', 'RW'],
    };
    
    // Default to F442 if formation is unknown
    const positionNames = formations[formation] || formations['F442'];
    return positionNames[index] || `POS ${index + 1}`;
  };
  
  const commitCardAction = async (card: any,last_action_type:any) => {
  try {
    const commitHash = hashCard(card, secret);
    console.log(commitHash,card,last_action_type)
    const result = await (await client).actions.commit(
      account as Account,
      match_id,
      commitHash,
      new CairoCustomEnum({ [last_action_type]: "()" }),
    );
    
    if (result && result.transaction_hash) {
      toast.success("Committed successfully!");
    }
    
    setSelectedCard(null);
  } catch (error) {
    const errorParsed = parseStarknetError(error);
    
    if (errorParsed) {
      toast.error(errorParsed);
    } else {
      console.error('Error committing action:', error);
      toast.error('Failed to commit action');
    }
  } finally {
    setIsCommitting(false);
  }
};

  // Handle committing a card action
  const handleCommit = async (card) => {
    if (!secret) {
      toast.error('You must enter a secret to commit your action');
      return;
    }

   if (match.status as unknown as string != MatchStatus.IN_PROGRESS) {
    toast.error('Match must be in progress');
    return
   };
    
    setIsCommitting(true);

    const last_action_type = match.last_action_type;

     if (last_action_type as unknown as string === ActionType.NONE) {
      setIsActionModalOpen(true);
    } else {
      const newAction =flipActionType(last_action_type as unknown as string);
      console.log(newAction)
        commitCardAction(card,newAction)
    }
    

  };
  
  // Handle revealing a card action
  const handleReveal = async (card) => {
    if (!secret) {
      toast.error('You must enter your secret to reveal your action');
      return;
    }

    if (match.status as unknown as string != MatchStatus.PENDINGREVEAL){
      toast.error('Must be in reveal phase');
      return
    };
    
    setIsRevealing(true);


    

    // (property) reveal: (snAccount: Account | AccountInterface, matchId: BigNumberish, cardId: BigNumberish, playerName: BigNumberish, team: BigNumberish, position: CairoCustomEnum, attack: BigNumberish, defense: BigNumberish, special: BigNumberish, rarity: CairoCustomEnum, season: BigNumberish, secretKey: BigNumberish, squadId: BigNumberish) => Promise<...>
    
    try {

      console.log(card,secret)
    const commitHash = hashCard(card, secret);
    
    const result = await (await client).actions.reveal(
      account as Account,
      match_id,
      card.id,
      secret,
      squad_id,
      commitHash,

    
    );
    
    if (result && result.transaction_hash) {
      toast.success("Reveal successfull!");
    }
    
    setSelectedCard(null);
  } catch (error) {
    const errorParsed = parseStarknetError(error);
    
    if (errorParsed) {
      toast.error(errorParsed);
    } else {
      console.error('Error revealing action:', error);
      toast.error('Failed to reveal action');
    }
  } finally {
      setIsRevealing(false);
    }
  };
  
  // Handle going back to home
  const handleHomeClick = () => {
    set_game_state(GameState.MainMenu);
  };

  console.log(state.used)
  
  // Render the formation positions visually
  const renderFormationPositions = (lineup, formation = 'F442', isHome = true) => {
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
      // Other formations...
    };
    
    // If away team, flip the positions horizontally
    let positions = formationPositions[formation] || formationPositions['F442'];
    
    if (!isHome) {
      // Invert the field for away team (top becomes bottom)
      positions = positions.map(pos => ({
        top: `${100 - parseFloat(pos.top)}%`,
        left: pos.left
      }));
    }
    
    return (
      <div className={`relative w-full h-60 ${isHome ? 'bg-green-800' : 'bg-green-900'} rounded-xl overflow-hidden`}>
        {/* Soccer field markings */}
        <div className="absolute inset-0 border-2 border-white border-opacity-30"></div>
        <div className="absolute w-24 h-12 border-2 border-white border-opacity-30 top-0 left-1/2 transform -translate-x-1/2"></div>
        <div className="absolute w-24 h-12 border-2 border-white border-opacity-30 bottom-0 left-1/2 transform -translate-x-1/2"></div>
        <div className="absolute w-24 h-24 rounded-full border-2 border-white border-opacity-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-1 h-full bg-white bg-opacity-30 top-0 left-1/2 transform -translate-x-1/2"></div>
        
        {/* Position markers */}
        {positions.map((position, index) => (
          <div 
            key={index}
            style={{ top: position.top, left: position.left }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
          >
            <div 
                className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all ${
                !lineup[index] ? `${isHome ? 'bg-green-800' : 'bg-green-900'} bg-opacity-60` :
                lineup[index] && state.isCardUsed(account.address,lineup[index].id, match_id, squad_id) ? 
                  'bg-gray-500 opacity-50 cursor-not-allowed' : // Used card styling
                  `${isHome ? 'bg-green-700' : 'bg-green-800'} shadow-lg cursor-pointer` // Available card styling
              }`}
                onClick={() => {
                // Only allow click if card exists and hasn't been used
                if (lineup[index] && !state.isCardUsed(account.address,lineup[index].id, match_id, squad_id)) {
                  setSelectedCard(lineup[index]);
                }
              }}
            >
              {lineup[index]  ? (
                <>
                  <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${isHome ? 'border-green-300' : 'border-green-500'}`}>
                    <img src={lineup[index].image || getRandomPlayerImage()} alt={lineup[index].player_name} className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-4 ${isHome ? 'bg-green-700' : 'bg-green-800'} px-2 py-0.5 rounded text-xs max-w-20 truncate`}>
                    {lineup[index].player_name.toString().split(' ')[0]}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-xs font-bold">{getPositionName(index, formation)}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render a card component
  const renderCard = (card, type = 'player', isHome = true) => {
    if (!card) return null;
    
    const isYourCard = (isHomePlayer && isHome) || (isAwayPlayer && !isHome);
    
    return (
      <div 
        className={`w-full rounded-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105 ${
          selectedCard && selectedCard.id === card.id ? 'ring-2 ring-yellow-400' : ''
        }`}
        onClick={() => isYourCard && setSelectedCard(card)}
      >
        <div 
          className="p-2"
          style={{
            background: card.rarity === 'Legendary' ? 'linear-gradient(145deg, #f59e0b, #b45309)' : // Gold/Amber 
                      card.rarity === 'Epic' ? 'linear-gradient(145deg, #8b5cf6, #6d28d9)' : // Purple
                      card.rarity === 'Rare' ? 'linear-gradient(145deg, #3b82f6, #1d4ed8)' : // Blue
                      card.rarity === 'Icon' ? 'linear-gradient(145deg, #ec4899, #be185d)' : // Pink
                      'linear-gradient(145deg, #059669, #065f46)' // Green for Common
          }}
        >
          <div className="bg-black bg-opacity-30 rounded-lg p-2 flex flex-col">
            <div className="flex justify-between">
              <div className="flex space-x-1">
                <span className="text-xs bg-white text-green-900 px-2 rounded-full font-bold">{card.attack}</span>
                <span className="text-xs bg-green-800 text-white px-2 rounded-full font-bold">{card.position}</span>
              </div>
              {type === 'special' && (
                <div className="text-yellow-300">
                  <Zap size={16} />
                </div>
              )}
              {type === 'tactical' && (
                <div className="text-blue-300">
                  <Shield size={16} />
                </div>
              )}
              {type === 'player' && (
                <div className="text-green-300">
                  <Star size={16} fill="currentColor" />
                </div>
              )}
            </div>
            
            <div className="flex-grow flex justify-center items-center p-2">
              <img 
                src={getRandomPlayerImage()} 
                alt={card.player_name} 
                className="h-16 rounded object-cover" 
              />
            </div>
            
            <div className="mt-1 text-center">
              <div className="font-bold text-sm">{card.player_name}</div>
              <div className="text-xs text-green-100">{card.team}</div>
            </div>
            
            <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
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
            
            {isYourCard && isParticipant &&  !state.isCardUsed(account.address,card.id, match_id, squad_id) && (
              <div className="mt-2 flex space-x-1">
                <button 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 py-1 rounded font-bold text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommit(card);
                  }}
                  disabled={isCommitting || isRevealing || !isParticipant}
                >
                  <Lock size={12} className="mr-1" />
                  Commit
                </button>
                <button 
                  className="flex-1 bg-green-600 hover:bg-green-500 py-1 rounded font-bold text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReveal(card);
                  }}
                  disabled={isCommitting || isRevealing || !isParticipant}
                >
                  <Unlock size={12} className="mr-1" />
                  Reveal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white">
      {/* Navigation */}
      <TouchlineNavigation />
      
      {/* Main Container */}
      <div className="container mx-auto px-4 py-6">
        {/* Match Header */}
        <div className="bg-green-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-2 text-green-300">
                <Globe size={24} />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-100">Match Arena</span>
            </div>
            
            <div className="flex space-x-6 items-center">

                            {/* Match Action */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-green-300">Match Action</div>
                <div className="font-bold">{match ? (match.last_action_type as unknown as string) : 'Loading...'}</div>
              </div>


              {/* Match Status */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-green-300">Match Status</div>
                <div className="font-bold">{match ? getMatchStatusText(match.status as unknown as string) : 'Loading...'}</div>
              </div>
              
              {/* Current Turn */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-green-300">Current Turn</div>
                <div className="font-bold">{match ? match.current_turn.toString() : '0'}</div>
              </div>
              
              {/* Time Remaining */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-green-300">Time Remaining</div>
                <div className="font-bold flex items-center">
                  <Clock size={16} className="mr-1 text-yellow-400" />
                  {timeRemaining || '--:--'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Score Display */}
        <div className="bg-green-900 rounded-xl p-6 mb-6 text-center">
          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center mx-4">
              <div className="text-green-300 mb-1">Home</div>
              <div className="text-4xl font-bold">{match ? match.home_score.toString() : '0'}</div>
            </div>
            
            <div className="mx-8 flex items-center">
              <div className="bg-green-800 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-3xl font-bold">VS</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center mx-4">
              <div className="text-green-300 mb-1">Away</div>
              <div className="text-4xl font-bold">{match ? match.away_score.toString() : '0'}</div>
            </div>
          </div>
          
          {/* Secret input (only shown for participants) */}
          {isParticipant && (
            <div className="mt-6 max-w-md mx-auto">
              <div className="relative">
                <input
                  type={secretVisible ? "text" : "password"}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter your secret key"
                  className="w-full px-4 py-2 bg-green-800 rounded-lg text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={() => setSecretVisible(!secretVisible)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300"
                >
                  {secretVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-green-400 mt-1">Enter your secret key for committing and revealing actions</p>
            </div>
          )}
        </div>
        
        {/* Home Team Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Users size={20} className="mr-2" />
              Home Team
              {isHomePlayer && <span className="ml-2 text-sm bg-green-500 px-2 py-0.5 rounded-full">(You)</span>}
            </h2>
            <div className="text-sm text-green-300">{match ? `ID: ${match.home_player_id.slice(0, 6)}...` : ''}</div>
          </div>
          
          {/* Home formation display */}
          {renderFormationPositions(state.lineup, squad?.formation as unknown as string, account.address === removeLeadingZeros(match.home_player_id))}
          
          {/* Home special and tactical cards */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-md font-bold text-green-300 mb-2 flex items-center">
                <Zap size={16} className="mr-1" />
                Special Cards
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(specialCards).map((card, index) => (
                  <div key={`away-special-${index}`} className="w-full">
                    {card ? renderCard(card, 'special', account.address === removeLeadingZeros(match.home_player_id)) : (
                      <div className="w-full h-32 bg-green-800 bg-opacity-50 rounded-xl flex items-center justify-center text-green-400 text-sm">
                        Empty Slot
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-bold text-green-300 mb-2 flex items-center">
                <Shield size={16} className="mr-1" />
                Tactical Cards
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(tacticalCards).map((card, index) => (
                  <div key={`away-tactical-${index}`} className="w-full">
                    {card ? renderCard(card, 'tactical', removeLeadingZeros(account.address) === match.home_player_id) : (
                      <div className="w-full h-32 bg-green-800 bg-opacity-50 rounded-xl flex items-center justify-center text-green-400 text-sm">
                        Empty Slot
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Selected Card Details */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-green-800 rounded-xl p-6 max-w-lg w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-green-300 flex items-center">
                  <Star size={20} className="mr-2 text-yellow-400" />
                  Card Actions
                </h3>
                <button 
                  onClick={() => setSelectedCard(null)}
                  className="text-green-300 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Card display */}
                <div className="w-full md:w-1/3">
                  {renderCard(selectedCard, 'player', isHomePlayer)}
                </div>
                
                {/* Card actions */}
                <div className="w-full md:w-2/3">
                  <h4 className="text-lg font-bold mb-2">{selectedCard.player_name}</h4>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-green-900 p-2 rounded-lg text-center">
                      <div className="text-xs text-green-300 mb-1">Attack</div>
                      <div className="font-bold flex items-center justify-center">
                        <Flame size={14} className="mr-1 text-red-400" />
                        {selectedCard.attack}
                      </div>
                    </div>
                    <div className="bg-green-900 p-2 rounded-lg text-center">
                      <div className="text-xs text-green-300 mb-1">Defense</div>
                      <div className="font-bold flex items-center justify-center">
                        <Shield size={14} className="mr-1 text-blue-400" />
                        {selectedCard.defense}
                      </div>
                    </div>
                    <div className="bg-green-900 p-2 rounded-lg text-center">
                      <div className="text-xs text-green-300 mb-1">Special</div>
                      <div className="font-bold flex items-center justify-center">
                        <Zap size={14} className="mr-1 text-yellow-400" />
                        {selectedCard.special}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-green-300 text-sm mb-1">Secret</label>
                    <div className="relative">
                      <input
                        type={secretVisible ? "text" : "password"}
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="Enter your secret key"
                        className="w-full px-4 py-2 bg-green-900 rounded-lg text-white placeholder-green-500 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                      <button
                        onClick={() => setSecretVisible(!secretVisible)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300"
                      >
                        {secretVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
    
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleCommit(selectedCard)}
                      disabled={isCommitting || isRevealing || !secret || (selectedCard && state.isCardUsed(account.address,selectedCard.id, match_id, squad_id))}
                      className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCommitting ? (
                        <>
                          <RefreshCw size={18} className="mr-2 animate-spin" />
                          Committing...
                        </>
                      ) : (
                        <>
                          <Lock size={18} className="mr-2" />
                          Commit Action
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReveal(selectedCard)}
                      disabled={isRevealing || isCommitting || !secret || (selectedCard && state.isCardUsed(account.address,selectedCard.id, match_id, squad_id))}
                      className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isRevealing ? (
                        <>
                          <RefreshCw size={18} className="mr-2 animate-spin" />
                          Revealing...
                        </>
                      ) : (
                        <>
                          <Unlock size={18} className="mr-2" />
                          Reveal Action
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Game Log Section */}
        {/* <div className="bg-green-800 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Clock size={20} className="mr-2 text-green-300" />
            Match History
          </h2>
          
          <div className="bg-green-900 rounded-lg p-4 h-40 overflow-y-auto">
            
            <div className="mb-2 border-b border-green-800 pb-2">
              <div className="flex items-center">
                <div className="text-yellow-400 mr-2">
                  <Zap size={16} />
                </div>
                <div>
                  <span className="font-bold">Turn 3:</span> Home player revealed special card action
                </div>
                <div className="ml-auto text-xs text-green-400">2 min ago</div>
              </div>
            </div>
            
            <div className="mb-2 border-b border-green-800 pb-2">
              <div className="flex items-center">
                <div className="text-blue-400 mr-2">
                  <Shield size={16} />
                </div>
                <div>
                  <span className="font-bold">Turn 3:</span> Away player committed tactical card action
                </div>
                <div className="ml-auto text-xs text-green-400">5 min ago</div>
              </div>
            </div>
            
            <div className="mb-2 border-b border-green-800 pb-2">
              <div className="flex items-center">
                <div className="text-red-400 mr-2">
                  <Flame size={16} />
                </div>
                <div>
                  <span className="font-bold">Turn 2:</span> Home player scored a goal! (+1)
                </div>
                <div className="ml-auto text-xs text-green-400">8 min ago</div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex items-center">
                <div className="text-green-300 mr-2">
                  <RotateCcw size={16} />
                </div>
                <div>
                  <span className="font-bold">Turn 1:</span> Match started
                </div>
                <div className="ml-auto text-xs text-green-400">10 min ago</div>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Footer */}
        <div className="bg-green-900 rounded-xl p-4 text-center">
          <p className="text-sm text-green-300">
            Match ID: {match ? match.match_id.toString() : 'Loading...'}
          </p>
          <p className="text-xs text-green-400 mt-1">
            Last Action: {match ? new Date(Number(match.last_action_timestamp) * 1000).toLocaleString() : 'Unknown'}
          </p>
        </div>
      </div>
        <SelectActionTypeModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onActionSelected={handleActionSelected}
        card={selectedCard}
      />
    </div>
  );
};

export default ArenaPage; 
               