import { create } from 'zustand';
import { Match, Card, Squad, SquadPosition, CardMatchCommitHash, CardMatchCommitReveal, TurnAction,SquadCardUsed } from '../dojogen/models.gen';
import { removeLeadingZeros } from './sanitizer';

// Store types
type GameState = {
    matches: Record<string, Match>;
    cards: Record<string, Card>;
    squad: Record<string, Squad>;
    playerSquads: Record<string, Squad>;
    commits: Record<string, CardMatchCommitHash>;
    squadPosition: Record<string, SquadPosition>;
    reveals: Record<string, CardMatchCommitReveal>;
    used: Record<string, SquadCardUsed>;
    turnActions: Record<string, TurnAction>;
    lineup: Record<string,Card & { positionIndex: number, chemistryBonus: number, squadId: number }>;
    lineupSups: Record<string,Card & { positionIndex: number, chemistryBonus: number, squadId: number }>;
    playerSquadCards: Record<string, Card & { positionIndex: number, chemistryBonus: number, squadId: number }>;
    specialCards: Record<string, Card & { positionIndex: number, chemistryBonus: number, squadId: number }>;
    tacticCards: Record<string, Card & { positionIndex: number, chemistryBonus: number, squadId: number }>;
    
    setMatch: (match: Match) => void;
    setCard: (card: Card) => void;
    setCommit: (commit: CardMatchCommitHash) => void;
    setReveal: (reveal: CardMatchCommitReveal) => void;
    setSquad: (squad: Squad) => void;
    setSquadCardsUsed: (squad:SquadCardUsed) => void;
    setSquadPosition: (squadPosition: SquadPosition) => void;
    setTurnAction: (turnAction: TurnAction) => void;
    setPlayerSquad: (squad: Squad) => void;
    setPlayerSquadCards: (squad_d: number, scard: Card & { positionIndex: number, chemistryBonus: number, squadId: number }) => void;
    removeManager: (playerAddress: string) => void;
    setLineupPlayer: (positionIndex, scard: Card & { positionIndex: number, chemistryBonus: number, squadId: number }) => void;
    setLineupPlayerSups: (positionIndex, scard: Card & { positionIndex: number, chemistryBonus: number, squadId: number }) => void;
    loadPlayerCards: (playerAddress: string, squadId: number) => void;
    loadUsedCards: (playerAddress: string, squadId: number, matchId: number) => void;
    isCardUsed: (playerAddress:string, cardId: number, matchId: number, squadId: number) => boolean;
    clear: () => void;

};

// Create store
export const useGameStore = create<GameState>((set,get) => ({
    matches: {},
    cards: {},
    squad: {},
    commits: {},
    squadPosition: {},
    reveals: {},
    turnActions: {},
    playerSquads: {},
    lineup: {},
    lineupSups: {},
    playerSquadCards: {},
    specialCards: {},
    tacticCards: {},
    used: {},
    
    setMatch: (match: Match) => set((state) => ({
        matches: {
            ...state.matches,
            [`${match.match_id}`]: match 
        }
    })),
    
    setCard: (card: Card) => set((state) => ({
        cards: {
            ...state.cards,
            [`${card.id}`]: card  
        }
    })),
    
    setCommit: (commit: CardMatchCommitHash) => set((state) => ({
        commits: {
            ...state.commits,
            [`${commit.player_id}_${commit.match_id}`]: commit  
        }
    })),
    
    setReveal: (reveal: CardMatchCommitReveal) => set((state) => ({
        reveals: {
            ...state.reveals,
            [`${reveal.card_id}_${reveal.match_id}`]: reveal  
        }
    })),
    
    setSquad: (squad: Squad) => set((state) => ({
        squad: {
            ...state.squad,
            [`${squad.squad_id}_${squad.player_id}`]: squad
        }
    })),

    setSquadCardsUsed: (used: SquadCardUsed) => set((state) => ({
        used: {
            ...state.used,
            [`${used.squad_id}_${used.player_id}`]: used
        }
    })),

    setSquadPosition: (squadPosition: SquadPosition) => set((state) => ({
        squadPosition: {
            ...state.squadPosition,
            [`${squadPosition.squad_id}_${squadPosition.card_id}_${squadPosition.player_id}`]: squadPosition
        }
    })),

    setTurnAction: (turnAction: TurnAction) => set((state) => ({
        turnActions: {
            ...state.turnActions,
            [`${turnAction.match_id}_${turnAction.player_id}`]: turnAction
        }
    })),

    setPlayerSquad: (squad: Squad) => set((state) => ({
        
        playerSquads: {
            ...state.playerSquads,
            [`${squad.squad_id}_${squad.player_id}`]: squad
        }
    })),

    setPlayerSquadCards: (squad_id: number, scard: Card & { positionIndex: number, chemistryBonus: number, squadId: number }) => set((state) => ({
        
        playerSquadCards: {
            ...state.playerSquadCards,
            [`${squad_id}`]: scard
        }
    })),

    setLineupPlayer: (positionIndex, scard: Card & { positionIndex: number, chemistryBonus: number, squadId: number }) => set((state) => ({
        
        lineup: {
            ...state.lineup,
            [`${positionIndex}`]: scard
        }
    })),

        setLineupPlayerSups: (positionIndex, scard: Card & { positionIndex: number, chemistryBonus: number, squadId: number }) => set((state) => ({
        
        lineupSups: {
            ...state.lineupSups,
            [`${positionIndex}`]: scard
        }
    })),

    // Remove a specific manager by address
    removeManager: (playerAddress: string) => set((state) => {
        // This would need to be adjusted based on how your data is structured
        // For example, finding all squads owned by this manager and removing them
        const newSquad = { ...state.squad };
       
        return { squad: newSquad };
    }),

    loadPlayerCards: (playerAddress: string, squadId: number) => {
      
        const state = get();
        
        // Step 1: Filter squad positions to get only those for this player and squad
        const squadPositionEntries = Object.entries(state.squadPosition).filter(([key, position]) => 
            removeLeadingZeros(position.player_id) === playerAddress && position.squad_id === squadId
        );
        
        // Step 2: Process the positions and categorize cards
        const regularCards: Record<string, Card & { positionIndex: number, chemistryBonus: number, squadId: number }> = {};
        const specialCardsTemp: Record<string, Card & { positionIndex: number, chemistryBonus: number, squadId: number }> = {};
        const tacticCardsTemp: Record<string, Card & { positionIndex: number, chemistryBonus: number, squadId: number }> = {};
        
        squadPositionEntries.forEach(([key, position]) => {
            // Find the card for this position
            const card = state.cards[position.card_id.toString()];
            
            if (card) {
                const enhancedCard = {
                    ...card,
                    positionIndex: position.position_index as number,
                    chemistryBonus: position.chemistry_bonus as number || 0,
                    squadId: position.squad_id as number
                };
                
                const posIndex = position.position_index;
                
                // Categorize based on position index
                if (posIndex === 12 || posIndex === 13) {
                    // Special cards (positions 12-13)
                    specialCardsTemp[posIndex.toString()] = enhancedCard;
                } else if (posIndex === 14 || posIndex === 15) {
                    // Tactic cards (positions 14-15)
                    tacticCardsTemp[posIndex.toString()] = enhancedCard;
                } else {
                    // Regular player cards
                    regularCards[posIndex.toString()] = enhancedCard;

                    if (posIndex as number <= 11){
                        const newPositionIndex = posIndex as any - 1;
                        state.setLineupPlayer(newPositionIndex, {
                            ...card,
                            positionIndex: newPositionIndex,
                            chemistryBonus: position.chemistry_bonus as number || 0,
                            squadId: position.squad_id as number
                        });
                    }
                }
            }
        });

   
        
        // Update the state with all categorized cards
        set({
            playerSquadCards: regularCards,
            specialCards: specialCardsTemp,
            tacticCards: tacticCardsTemp
        });
    },

    loadUsedCards: (playerAddress: string, squadId: number, matchId: number) => {
    const state = get();
    
    // Filter reveals to find cards that have been revealed (used) in this match
    const revealEntries = Object.entries(state.reveals).filter(([key, reveal]) => 
        removeLeadingZeros(reveal.player_id) === playerAddress && 
        reveal.match_id.toString() === matchId.toString()
    );
    
    // Process the reveals to track used cards
    revealEntries.forEach(([key, reveal]) => {
        // Create a SquadCardUsed record for each revealed card
        const usedCard: SquadCardUsed = {
            player_id: playerAddress,
            squad_id: squadId,
            match_id: matchId,
            card_id: reveal.card_id
        };
        
        // Save this used card record
        state.setSquadCardsUsed(usedCard);
        
    });
    
    // You could also return a list of used card IDs if needed
    return revealEntries.map(([key, reveal]) => reveal.card_id);
},
isCardUsed: (playerAddress: string, cardId: number, matchId: number, squadId: number) => {
    const state = get();

    console.log('Checking if card is used:', {
        playerAddress,
        cardId,
        matchId,
        squadId,
        usedCards: state.used
    });

    const result = Object.values(state.used).some(usedCard => {
        const isUsed = 
            usedCard.card_id === cardId &&
            usedCard.match_id.toString() === matchId.toString() &&
            usedCard.squad_id === squadId &&
            removeLeadingZeros(usedCard.player_id) === playerAddress;

        console.log('Evaluating usedCard:', {
            usedCard,
            isMatch: isUsed,

        },usedCard.card_id===cardId,
            usedCard.match_id.toString(), matchId.toString(),usedCard.match_id.toString() === matchId.toString(),
            usedCard.squad_id === squadId ,
            removeLeadingZeros(usedCard.player_id)===playerAddress);

        return isUsed;
    });

    console.log('Final result:', result);
    return result;
},



    clear: () => set(() => ({
        matches: {},
        cards: {},
        squad: {},
        commits: {},
        squadPosition: {},
        reveals: {},
        turnActions: {}
    })),
}));