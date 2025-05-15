import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ChevronRight, 
  Plus, 
  X, 
  Check, 
  Play, 
  Clock, 
  RefreshCw, 
  User, 
  Users, 
  Home,
  Globe,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Shield,
  AlertTriangle,
  BetweenHorizontalStart
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNetworkAccount } from '../context/WalletContex';
import { useAllEntities } from '../utils/touch';
import GameState from '../utils/gamestate';
import { useTouchlineStore } from '../utils/touchline';
import WalletButton from '../components/WalletButton';
import { MatchStatus } from '../utils/types';
import { getMatchStatusText, getStatusColorClass, parseStarknetError } from '../utils';
import { useDojo } from '../dojo/useDojo';
import { Account } from 'starknet';
import { removeLeadingZeros } from '../utils/sanitizer';

// Enum for match status



const MatchesPage = () => {
  const { account, address } = useNetworkAccount();
  const { state, refetch } = useAllEntities();
  const { set_game_state ,set_match_id,set_squad_id} = useTouchlineStore();

    const {
      setup: {
        client
      },
    } = useDojo();
  

//   const [filteredMatches, setFilteredMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [myMatchesOnly, setMyMatchesOnly] = useState(false);
  
  // State for new match modal
  const [showNewMatchModal, setShowNewMatchModal] = useState(false);
  const [selectedHomeSquad, setSelectedHomeSquad] = useState(null);
  const [creatingMatch, setCreatingMatch] = useState(false);
  
  // State for joining match
  const [joiningMatch, setJoiningMatch] = useState(false);
  const [selectedAwaySquad, setSelectedAwaySquad] = useState(null);
  const [selectedMatchToJoin, setSelectedMatchToJoin] = useState(null);
  
  // State for squads
  const playerSquads = state.playerSquads;
  const matches = state.matches;

const filteredMatches = matches;


console.log(filteredMatches)

  

  
  // Refresh matches
  const refreshMatches = async () => {
 
    await refetch();
    // setRefreshing(false);
    toast.success("Matches refreshed");
  };
  
  // Filter and sort matches
//   useEffect(() => {
//     let filtered = [...matches];
    
//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter(match => 
//         (match.home_player_name && match.home_player_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (match.away_player_name && match.away_player_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (match.home_squad_name && match.home_squad_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (match.away_squad_name && match.away_squad_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         match.match_id.toString().includes(searchTerm)
//       );
//     }
    
//     // Filter by status
//     if (statusFilter !== 'all') {
//       const statusValue = parseInt(statusFilter);
//       filtered = filtered.filter(match => match.status === statusValue);
//     }
    
//     // Filter by my matches
//     if (myMatchesOnly) {
//       filtered = filtered.filter(match => 
//         match.home_player_id === account.address || 
//         match.away_player_id === account.address
//       );
//     }
    
//     // Sort matches
//     if (sortBy === 'newest') {
//       filtered.sort((a, b) => b.created_at - a.created_at);
//     } else if (sortBy === 'oldest') {
//       filtered.sort((a, b) => a.created_at - b.created_at);
//     } else if (sortBy === 'status') {
//       filtered.sort((a, b) => a.status - b.status);
//     }
    
//     setFilteredMatches(filtered);
//   }, [matches, searchTerm, statusFilter, sortBy, myMatchesOnly, account.address]);
  

  
  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  // Handle creating a new match
  const handleCreateMatch = async () => {


    console.log(Object.keys(matches).length + 1,selectedHomeSquad)

    if (!selectedHomeSquad) {
      toast.error("Please select a squad for the match");
      return;
    }
    
    setCreatingMatch(true);
    
    try {
      // In a real implementation, this would call your contract
      // For now, we'll simulate a delay and success

    //   home_squad_id: u8, 
    //   match_id: u128,

    

    let result = await (await client).tmatch.createMatch(
        account as Account,
        selectedHomeSquad.contract_squad_id,
        Object.keys(matches).length + 1
      );

      if (result && result.transaction_hash){
        setShowNewMatchModal(false);
        setSelectedHomeSquad(null);
        toast.success("Match created successfully!")
      }

    } catch (error: any) {
      const errorParsed = parseStarknetError(error);

      if (errorParsed){
        toast.error(errorParsed);
      }else{
        toast.error("Failed to create match");
      }
      
    }
      finally {
      setCreatingMatch(false);
    }
  };
  
  // Handle joining a match
  const handleJoinMatch = async (match) => {
    setSelectedMatchToJoin(match);
  };
  
  // Confirm joining a match
  const confirmJoinMatch = async () => {
    if (!selectedAwaySquad) {
      toast.error("Please select a squad to join the match");
      return;
    }
    
    setJoiningMatch(true);
    
    
  // match_id: u128, away_squad_id: u8
    try {
    let result = await (await client).tmatch.joinMatch(
        account as Account,
        selectedMatchToJoin.match_id,
        selectedAwaySquad.contract_squad_id
      );

      if (result && result.transaction_hash){
        setShowNewMatchModal(false);
        setSelectedHomeSquad(null);
        setSelectedMatchToJoin(null);
        toast.success("Joined successfully!")
      }
    } catch (error) {

      const errorParsed = parseStarknetError(error);

      if (errorParsed){
        toast.error(errorParsed);
      }else{
        console.error("Error joining match:", error);
      toast.error("Failed to join match");
      }
      

    } finally {
      setJoiningMatch(false);
    }
  };
  
  // Handle cancelling a match
  const handleCancelMatch = async (match) => {
    if (!window.confirm("Are you sure you want to cancel this match?")) {
      return;
    }
    
    try {
      // In a real implementation, this would call your contract
      // For now, we'll simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
  

      toast.success("Match cancelled successfully");
    } catch (error) {
      const errorParsed = parseStarknetError(error);

      if (errorParsed){
        toast.error(errorParsed);
      }else{
         toast.error("Failed to cancel match");
      }
      
    }
  };


  const handleStartMatch = async (match) =>{
    try {
    let result = await (await client).tmatch.startMatch(
        account as Account,
        match.match_id
      );

      if (result && result.transaction_hash){
        setShowNewMatchModal(false);
        setSelectedHomeSquad(null);
        toast.success("Match Started!")
      }
    } catch (error) {
      const errorParsed = parseStarknetError(error);
      if (errorParsed){
        toast.error(errorParsed);
      }else{
        console.error("Error starting match:", error);
        toast.error("Failed to start match");
      }

    }
  }
  
  // Handle viewing a match
  const handleViewMatch = (match) => {
    // In a real implementation, this would navigate to the match page
    toast.info(`Navigating to match ${match.match_id}`);
    set_game_state(GameState.Arena);
    set_match_id(match.match_id);
    if (removeLeadingZeros(match.home_player_id) === account.address){
      set_squad_id(match.home_squad_id);
    }else{
      set_squad_id(match.away_squad_id);
    }
    
    
  };
  
  // Handle going back to home
  const handleHomeClick = () => {
    set_game_state(GameState.MainMenu);
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
                e.preventDefault();
                handleHomeClick();
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
        {/* Page Header */}
        <div className="bg-green-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-2 text-green-300">
                <Globe size={24} />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-100">Match Finder</span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={refreshMatches}
                className="bg-green-700 hover:bg-green-600 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                disabled={refreshing}
              >
                <RefreshCw size={18} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button
                onClick={() => setShowNewMatchModal(true)}
                className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg font-bold flex items-center justify-center transition-colors"
              >
                <Plus size={18} className="mr-1" />
                New Match
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-green-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-green-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by player, squad, or match ID"
                className="w-full pl-10 pr-4 py-2 bg-green-900 rounded-lg text-white placeholder-green-500 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            
            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-green-900 rounded-lg text-white border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="all">All Statuses</option>
                <option value="0">Waiting for Opponent</option>
                <option value="1">In Progress</option>
                <option value="2">Waiting for Home</option>
                <option value="3">Waiting for Away</option>
                <option value="4">Complete</option>
                <option value="5">Cancelled</option>
              </select>
            </div>
            
            {/* Sort By */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-green-900 rounded-lg text-white border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status">By Status</option>
              </select>
            </div>
            
            {/* My Matches Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={myMatchesOnly}
                    onChange={() => setMyMatchesOnly(!myMatchesOnly)}
                  />
                  <div className={`block w-10 h-6 rounded-full ${myMatchesOnly ? 'bg-green-400' : 'bg-green-900'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${myMatchesOnly ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-white">My Matches Only</div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Matches Table */}
        <div className="bg-green-800 rounded-xl overflow-hidden mb-6">
  {isLoading ? (
    <div className="flex items-center justify-center p-12">
      <RefreshCw size={36} className="animate-spin text-green-400" />
      <span className="ml-3 text-lg">Loading matches...</span>
    </div>
  ) : Object.keys(filteredMatches).length === 0 ? (
    <div className="text-center py-12">
      <Globe size={48} className="mx-auto mb-4 text-green-600 opacity-50" />
      <h3 className="text-xl font-bold text-white">No matches found</h3>
      <p className="text-green-300 mt-2">Try adjusting your filters or create a new match</p>
      <button
        onClick={() => setShowNewMatchModal(true)}
        className="mt-4 bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg font-bold"
      >
        <Plus size={18} className="inline mr-1" />
        Create Match
      </button>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-green-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
              Home Team
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
              Away Team
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-700">
                {Object.entries(filteredMatches).map(([matchId, match]) => (
                    <tr key={matchId} className="hover:bg-green-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{matchId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-green-900 rounded-full flex items-center justify-center">
                            <User size={16} className="text-green-300" />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium">
                            {removeLeadingZeros(match.home_player_id) === account.address ? 
                                <span className="text-green-300">You</span> : 
                                match.home_player_id.slice(0, 6) + '...'
                            }
                            </div>
                            <div className="text-xs text-green-400">{ `Squad #${match.home_squad_id}`}</div>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {match.away_player_id ? (
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-green-900 rounded-full flex items-center justify-center">
                            <User size={16} className="text-green-300" />
                            </div>
                            <div className="ml-3">
                            <div className="text-sm font-medium">
                                {removeLeadingZeros(match.away_player_id) === account.address ? 
                                <span className="text-green-300">You</span> : 
                                match.away_player_id.slice(0, 6) + '...'
                                }
                            </div>
                            <div className="text-xs text-green-400">{ `Squad #${match.away_squad_id}`}</div>
                            </div>
                        </div>
                        ) : (
                        <div className="text-sm text-gray-400 italic">Waiting for opponent</div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">
                        {match.status as unknown as string === MatchStatus.CREATED ? 
                            '—' : 
                            `${match.home_score} - ${match.away_score}`
                        }
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium flex items-center ${getStatusColorClass(match.status)}`}>
                        <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                        {getMatchStatusText(match.status)}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-300">{formatTimeAgo(match.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                        {/* Join button (only for Created matches where user is not already involved) */}
                        {match.status as unknown as string === MatchStatus.CREATED && 
                        removeLeadingZeros(match.home_player_id) !== account.address && 
                            removeLeadingZeros(match.away_player_id) !== account.address && (
                            <button
                            onClick={() => handleJoinMatch({...match, match_id: matchId})}
                            className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white flex items-center"
                            >
                            <Plus size={16} className="mr-1" />
                            Join
                            </button>
                        )}
                        
                        {/* Cancel button (only for the creator of Created matches) */}
                        {match.status as unknown as string === MatchStatus.CREATED && 
                        removeLeadingZeros(match.home_player_id) === account.address && (
                            <button
                            onClick={() => handleStartMatch({...match, match_id: matchId})}
                            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white flex items-center"
                            >
                            <BetweenHorizontalStart size={16} className="mr-1"/>
                             Start
                            </button>
                        )}

                        {/* {(() => {
                        if (
                          match.status as unknown as string === MatchStatus.IN_PROGRESS &&
                          removeLeadingZeros(match.home_player_id) === account.address
                        ) {
                          set_game_state(GameState.Arena);
                        }
                        return null; // because JSX expects a return value
                      })()} */}
                        
                        {/* View match button (for all matches) */}
                        <button
                            onClick={() => handleViewMatch({...match, match_id: matchId})}
                            className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-white flex items-center"
                        >
                            {match.status as unknown as string === MatchStatus.IN_PROGRESS &&
                            (removeLeadingZeros(match.home_player_id) === account.address || removeLeadingZeros(match.away_player_id) === account.address) ? (
                            <>
                                <Play size={16} className="mr-1" />
                                Play
                            </>
                            ) : (
                            <>
                                <ChevronRight size={16} className="mr-1" />
                                View
                            </>
                            )}
                        </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
        
        {/* Footer */}
        <div className="bg-green-900 rounded-xl p-4 text-center">
          <p className="text-sm text-green-300">
            {Object.keys(filteredMatches).length} match{Object.keys(filteredMatches).length === 1 ? '' : 'es'} found
          </p>
          <p className="text-xs text-green-400 mt-1">
            Click on "New Match" to create a match and invite others to play against you
          </p>
        </div>
      </div>
      
      {/* New Match Modal */}
      {showNewMatchModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-green-800 rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-green-300 flex items-center">
                <Globe size={20} className="mr-2 text-green-400" />
                Create New Match
              </h3>
              <button 
                onClick={() => setShowNewMatchModal(false)}
                className="text-green-300 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-green-300 text-sm mb-2">Select Squad</label>
              
              {Object.keys(playerSquads).length === 0 ? (
                    <div className="bg-green-900 rounded-lg p-4 text-center">
                        <AlertTriangle size={24} className="mx-auto mb-2 text-yellow-400" />
                        <p className="text-white">You don't have any squads yet.</p>
                        <p className="text-sm text-green-400 mt-1">Create a squad before creating a match.</p>
                        <button
                        onClick={() => {
                            setShowNewMatchModal(false);
                            // Navigate to squad creation page
                            // For now, just show a toast
                            toast.info("Redirecting to squad creation...");
                            set_game_state(GameState.Squad);
                        }}
                        className="mt-3 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-bold"
                        >
                        Create Squad
                        </button>
                    </div>
                                    ) : (
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2">
                    {Object.entries(playerSquads).map(([squadId, squad]) => (
                    <div 
                        key={squadId}
                        className={`bg-green-900 rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedHomeSquad && selectedHomeSquad.squad_id === squadId 
                            ? 'ring-2 ring-green-400' 
                            : 'hover:bg-green-700'
                        }`}
                        onClick={() => setSelectedHomeSquad({...squad, squad_id: squadId,contract_squad_id: squad.squad_id})}
                    >
                        <div className="flex justify-between items-center">
                        <div>
                            <div className="font-bold">{squad.name}</div>
                            <div className="text-sm text-green-400 flex items-center mt-1">
                            <Shield size={14} className="mr-1" />
                            Formation: {squad.formation as unknown as string === 'F442' ? '4-4-2' : 
                                        squad.formation  as unknown as string=== 'F433' ? '4-3-3' : 
                                        squad.formation as unknown as string}
                            </div>
                        </div>
                        
                        {selectedHomeSquad && selectedHomeSquad.squad_id === squadId && (
                            <div className="text-green-400">
                            <Check size={20} />
                            </div>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewMatchModal(false)}
                className="px-4 py-2 bg-green-900 hover:bg-green-700 rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleCreateMatch}
                disabled={!selectedHomeSquad || creatingMatch}
                className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded-lg font-bold transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingMatch ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Play size={18} className="mr-2" />
                    Create Match
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Join Match Modal */}
      {selectedMatchToJoin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-green-800 rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-green-300 flex items-center">
                <Users size={20} className="mr-2 text-green-400" />
                Join Match #{selectedMatchToJoin.match_id}
              </h3>
              <button 
                onClick={() => setSelectedMatchToJoin(null)}
                className="text-green-300 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 bg-green-900 rounded-lg p-4">
              <div className="text-sm text-green-300 mb-1">Hosted by</div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 bg-green-700 rounded-full flex items-center justify-center">
                  <User size={16} className="text-green-300" />
                </div>
                <div className="ml-3">
                  <div className="text-md font-medium">
                    {selectedMatchToJoin.home_player_name || selectedMatchToJoin.home_player_id.slice(0, 6) + '...'}
                  </div>
                  <div className="text-sm text-green-400">
                    {selectedMatchToJoin.home_squad_name || `Squad #${selectedMatchToJoin.home_squad_id}`}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-green-300 text-sm mb-2">Select Your Squad</label>
              
              {Object.keys(playerSquads).length === 0 ? (
                    <div className="bg-green-900 rounded-lg p-4 text-center">
                        <AlertTriangle size={24} className="mx-auto mb-2 text-yellow-400" />
                        <p className="text-white">You don't have any squads yet.</p>
                        <p className="text-sm text-green-400 mt-1">Create a squad before joining a match.</p>
                        <button
                        onClick={() => {
                            setSelectedMatchToJoin(null);
                            // Navigate to squad creation page
                            // For now, just show a toast
                            toast.info("Redirecting to squad creation...");
                            // set_game_state(GameState.SquadManagement);
                        }}
                        className="mt-3 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-bold"
                        >
                        Create Squad
                        </button>
                    </div>
                ) : (
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2">
                    {Object.entries(playerSquads).map(([squadId, squad]) => (
                    <div 
                        key={squadId}
                        className={`bg-green-900 rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedAwaySquad && selectedAwaySquad.squad_id === squadId 
                            ? 'ring-2 ring-green-400' 
                            : 'hover:bg-green-700'
                        }`}
                        onClick={() => setSelectedAwaySquad({...squad, squad_id: squadId,contract_squad_id: squad.squad_id})}
                    >
                        <div className="flex justify-between items-center">
                        <div>
                            <div className="font-bold">{squad.name}</div>
                            <div className="text-sm text-green-400 flex items-center mt-1">
                            <Shield size={14} className="mr-1" />
                            Formation: {squad.formation as unknown as string === 'F442' ? '4-4-2' : 
                                        squad.formation as unknown as string === 'F433' ? '4-3-3' : 
                                        squad.formation as unknown as string}
                            </div>
                        </div>
                        
                        {selectedAwaySquad && selectedAwaySquad.squad_id === squadId && (
                            <div className="text-green-400">
                            <Check size={20} />
                            </div>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedMatchToJoin(null)}
                className="px-4 py-2 bg-green-900 hover:bg-green-700 rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={confirmJoinMatch}
                disabled={!selectedAwaySquad || joiningMatch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joiningMatch ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Play size={18} className="mr-2" />
                    Join Match
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;