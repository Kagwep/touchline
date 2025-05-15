import { hash, shortString, starknetId, Uint256 } from 'starknet';
import { BigNumberish } from 'starknet';
import { type ClassValue, clsx } from "clsx"
import * as starknetH from '@scure/starknet';
import { twMerge } from "tailwind-merge"
import { Card, Squad, SquadPosition } from '../dojogen/models.gen';
import { removeLeadingZeros } from './sanitizer';
import { MatchStatus } from './types';

const positionToInt = {
  "Goalkeeper": 0,
  "Defender": 1, 
  "Midfielder": 2,
  "Forward": 3
};

// Rarity mapping (string to int)
const rarityToInt = {
  "Common": 0,
  "Rare": 1,
  "Epic": 2,
  "Legendary": 3,
  "Icon": 4
};



// Secret key for adding entropy to the hash

export const stringToFelt = (v: string): string => (v ? shortString.encodeShortString(v) : '0x0')

const SECRET_KEY = stringToFelt("0xb79f5af6b");

const SECRET_KEY_FELT = BigInt(SECRET_KEY);

/**
 * Converts a string to a felt252 (bigint) representation in Cairo
 * @param str String to convert
 */
function stringToFelt252(str: string): bigint {
  // Convert string to bytes
  const bytes = new TextEncoder().encode(str);
  let result = 0n;
  
  // Convert bytes to a single felt252 (max 31 bytes for felt252)
  for (let i = 0; i < Math.min(bytes.length, 31); i++) {
    result = (result << 8n) | BigInt(bytes[i]);
  }
  
  return result;
}

/**
 * Converts a string to a bigint representation suitable for Poseidon
 * (Note: StarkNet's Poseidon operates on felts)
 * @param str String to convert
 */
function stringToBigint(str: string): bigint {
    const bytes = new TextEncoder().encode(str);
    let result = 0n;
    for (let i = 0; i < bytes.length; i++) {
      result = (result << 8n) | BigInt(bytes[i]);
    }
    return result;
  }

/**
 * Hash a Card struct using Poseidon hash via computeHashOnElements
 * @param card The card to hash
 * @param secretKey Secret key to add entropy
 */
export function hashCard(card: Card, secretKey: string): bigint {
  // Prepare all values as separate elements for the hash function
  const elements: bigint[] = [
    SECRET_KEY_FELT,
    BigInt(card.id),
    BigInt(stringToFelt(card.player_name as string)),
    BigInt(stringToFelt(card.team as string)),
    BigInt(positionToInt[card.position as unknown as string]),
    BigInt(card.attack),
    BigInt(card.defense),
    BigInt(card.special),
    BigInt(rarityToInt[card.rarity as unknown as string]),
    BigInt(stringToFelt(card.season as string)),
  ];
  const hashResult = starknetH.poseidonHashMany(elements);
  
  console.log(bigintToU256(hashResult))
  return hashResult
}



export const bigintToU256 = (v: BigNumberish): Uint256 => ({
    low: BigInt(v) & 0xffffffffffffffffffffffffffffffffn,
    high: BigInt(v) >> 128n,
  })

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }

  export const getPlayerSquads = (squads: Record<string, Squad>, playerAddress: string): Squad[] => {
    return Object.values(squads).filter(squad => 
      removeLeadingZeros(squad.player_id) === playerAddress
    );
  };



  export const getSquadById = (
    squads: Record<string, Squad>, 
    squadId: number, 
    playerAddress: string
  ): Squad | undefined => {
    const key = `${squadId}_${playerAddress}`;
    return squads[key];
  };

  export const getSquadCards = (
    squadPositions: Record<string, SquadPosition>,
    cards: Record<string, Card>,
    playerAddress: string,
    squadId: number
  ): Array<Card & { positionIndex: number, chemistryBonus: number, squadId: number }> => {
    
    // Step 1: Filter squad positions to get only those for this player and squad
    const squadPositionEntries = Object.entries(squadPositions).filter(([key, position]) => 
      removeLeadingZeros(position.player_id) === playerAddress && position.squad_id === squadId
    );
    
    // Step 2: Map the positions to cards with position info
    return squadPositionEntries.map(([key, position]) => {
      // Find the card for this position
      const card = cards[position.card_id.toString()];
      
      // If card exists, return it with position information
      if (card) {
        return {
          ...card,
          positionIndex: position.position_index as number,
          chemistryBonus: position.chemistry_bonus as number,
          squadId: position.squad_id as number
        };
      }
      
      // If card doesn't exist, return null (these will be filtered out)
      return null;
    }).filter(Boolean);
  };

  // Update the getMatchStatusText function
export const getMatchStatusText = (status) => {
  switch (status) {
    case MatchStatus.CREATED:
      return 'Waiting for opponent';
    case MatchStatus.WAITING_FOR_AWAY:
      return 'Waiting for away player';
    case MatchStatus.IN_PROGRESS:
      return 'Match in progress';
    case MatchStatus.HOME_WIN:
      return 'Home team won';
    case MatchStatus.AWAY_WIN:
      return 'Away team won';
    case MatchStatus.DRAW:
      return 'Match ended in draw';
    case MatchStatus.ABANDONED:
      return 'Match abandoned';
    default:
      return 'Unknown status';
  }
};

// Update the getStatusColorClass function
export const getStatusColorClass = (status) => {
  switch (status) {
    case MatchStatus.CREATED:
      return 'text-yellow-400';
    case MatchStatus.WAITING_FOR_AWAY:
      return 'text-orange-400';
    case MatchStatus.IN_PROGRESS:
      return 'text-blue-400';
    case MatchStatus.HOME_WIN:
    case MatchStatus.AWAY_WIN:
    case MatchStatus.DRAW:
      return 'text-green-400';
    case MatchStatus.ABANDONED:
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};


export function parseStarknetError(error: any): string {
    console.log(error);

    if (error?.message?.includes('RPC')) {
        try {
            const simpleMatch = error.message.match(/Failure reason: (0x[a-fA-F0-9]+) \('([^']+)'\)/);
            if (simpleMatch) {
                return simpleMatch[2];
            }

            const errorMatch = error.message.match(/execution_error":"([^"]+)"/);
            if (errorMatch) {
                const executionError = errorMatch[1];

                const hexMatch = executionError.match(/0x[a-fA-F0-9]+\s\('([^']+)'\)/);
                if (hexMatch) {
                    return hexMatch[1];
                }

                const readableMatch = executionError.match(/Failure reason: [^']*'([^']+)'/);
                if (readableMatch) {
                    return readableMatch[1];
                }

                const quotedMatch = executionError.match(/'([^']+)'/);
                if (quotedMatch) {
                    return quotedMatch[1];
                }
            }
        } catch (parseError) {
            console.error('Error parsing Starknet error:', parseError);
        }
    }

    return error?.message || 'Unknown Starknet error occurred';
}
