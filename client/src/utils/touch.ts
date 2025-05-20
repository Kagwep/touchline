import { TouchlineSoccerSchemaType, ModelsMapping, Match } from '../dojogen/models.gen';
import { ClauseBuilder, KeysClause, ParsedEntity, ToriiQueryBuilder } from '@dojoengine/sdk';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { useEffect, useRef } from 'react';
import { useGameStore } from './touchlineStore';
import { hexToUtf8 } from './unpack';
import { useTouchlineStore} from './touchline';
import { AccountInterface } from 'starknet';
import { useNetworkAccount } from '../context/WalletContex';
import { removeLeadingZeros } from './sanitizer';
import { match } from 'node:assert';

let intervalId: NodeJS.Timeout | null = null; // Keep polling alive across components
// Helper to extract primitive value
const getPrimitiveValue = (field: any) => {
   
    if (field?.type === 'primitive') {
       
        switch (field.type_name) {
            case 'ContractAddress':
                return field.value;
            case 'u256':
            case 'u64':
                return BigInt(field.value).toString();
            case 'felt252':
                const utf8Value = hexToUtf8(field.value);
                if (utf8Value) return utf8Value;
                
                // If it's not a string, convert the hex to a number
                // Remove '0x' prefix and convert from hex to decimal
                return BigInt(field.value).toString();
            case 'bool':
                return field.value;
            default:
                return Number(field.value);
        }
    }

    // Handle struct types
    if (field?.type === 'struct') {
        // If the struct has a nested value object, process each field recursively
        //console.log(field.value)
        if (typeof field.value === 'object') {
           // console.log(".mlknkl")
            const result: Record<string, any> = {};
            for (const [key, value] of Object.entries(field.value)) {
               // console.log(key, value)
                result[key] = getPrimitiveValue(value);
            }
            return result;
        }
        // If it's a simple struct, process it like a primitive
        return getPrimitiveValue({
            type: 'primitive',
            type_name: field.type_name,
            value: field.value
        });
    }

    if (field?.type === 'enum') {
        return field.value.option;
    }
    return field;
};


// Transform functions
const transformMatch = (rawData: any) => {
    const matchData = rawData['touchline-Match'];
    if (!matchData) return null;

    //console.log(matchData)

    return {
        fieldOrder: [],
        match_id: getPrimitiveValue(matchData.match_id),
        home_player_id: getPrimitiveValue(matchData.home_player_id),
        away_player_id: getPrimitiveValue(matchData.away_player_id),
        home_squad_id: getPrimitiveValue(matchData.home_squad_id),
        away_squad_id: getPrimitiveValue(matchData.away_squad_id),
        home_score: getPrimitiveValue(matchData.home_score),
        away_score: getPrimitiveValue(matchData.away_score),
        status: getPrimitiveValue(matchData.status), 
        current_turn: getPrimitiveValue(matchData.current_turn),
        turn_deadline: getPrimitiveValue(matchData.turn_deadline),
        created_at:getPrimitiveValue(matchData.created_ate),
        last_action_type: getPrimitiveValue(matchData.last_action_type),
        last_action_timestamp: getPrimitiveValue(matchData.last_action_timestamp)
    };
};


const transformCard = (rawData: any) => {
    const cardData = rawData['touchline-Card'];
    if (!cardData) return null;

    return {
        fieldOrder: [], 
        id: getPrimitiveValue(cardData.id),
        player_name: getPrimitiveValue(cardData.player_name),
        team: getPrimitiveValue(cardData.team),
        position: getPrimitiveValue(cardData.position), 
        attack: getPrimitiveValue(cardData.attack),
        defense: getPrimitiveValue(cardData.defense),
        special: getPrimitiveValue(cardData.special),
        rarity: getPrimitiveValue(cardData.rarity), 
        season: getPrimitiveValue(cardData.season)
    };
};


const transformSquad = (rawData: any) => {
    const squadData = rawData['touchline-Squad'];
    if (!squadData) return null;

    return {
        fieldOrder: [], 
        player_id: getPrimitiveValue(squadData.player_id),
        squad_id: getPrimitiveValue(squadData.squad_id),
        name: getPrimitiveValue(squadData.name),
        formation: getPrimitiveValue(squadData.formation), 
        team_chemistry: getPrimitiveValue(squadData.team_chemistry)
    };
};

const transformCardMatchCommitReveal = (rawData: any) => {
    const cardMatchCommitRevealData = rawData['touchline-CardMatchCommitReveal'];
    if (!cardMatchCommitRevealData) return null;
    
    return {
        fieldOrder: [], // If you need to maintain a specific field order
        match_id: getPrimitiveValue(cardMatchCommitRevealData.match_id),
        player_id: getPrimitiveValue(cardMatchCommitRevealData.player_id),
        card_id: getPrimitiveValue(cardMatchCommitRevealData.card_id),
        reveal_no: getPrimitiveValue(cardMatchCommitRevealData.reveal_no)
    };
};

const transformTurnAction = (rawData: any) => {
    const turnActionData = rawData['touchline-TurnAction'];
    if (!turnActionData) return null;
    
    return {
        fieldOrder: [], // If you need to maintain a specific field order
        match_id: getPrimitiveValue(turnActionData.match_id),
        player_id: getPrimitiveValue(turnActionData.player_id),
        action_type: getPrimitiveValue(turnActionData.action_type),
        attacking_card_id: getPrimitiveValue(turnActionData.attacking_card_id),
        defending_card_id: getPrimitiveValue(turnActionData.defending_card_id),
        special_ability_used: getPrimitiveValue(turnActionData.special_ability_used),
        outcome: getPrimitiveValue(turnActionData.outcome),
        timestamp: getPrimitiveValue(turnActionData.timestamp)
    };
};


const transformSquadCardUsed = (rawData: any) => {
    const squadCardUsedData = rawData['touchline-SquadCardUsed'];
    if (!squadCardUsedData) return null;
    
    return {
        fieldOrder: [], // If you need to maintain a specific field order
        player_id: getPrimitiveValue(squadCardUsedData.player_id),
        squad_id: getPrimitiveValue(squadCardUsedData.squad_id),
        match_id: getPrimitiveValue(squadCardUsedData.match_id),
        card_id: getPrimitiveValue(squadCardUsedData.card_id)
    };
};

const transformSquadPosition = (rawData: any) => {
    const squadPositionData = rawData['touchline-SquadPosition'];
    if (!squadPositionData) return null;

    return {
        fieldOrder: [],
        player_id: getPrimitiveValue(squadPositionData.player_id),
        squad_id: getPrimitiveValue(squadPositionData.squad_id),
        card_id: getPrimitiveValue(squadPositionData.card_id),
        position_index: getPrimitiveValue(squadPositionData.position_index),
        chemistry_bonus: getPrimitiveValue(squadPositionData.chemistry_bonus)
    };
};



const transformCardMatchCommitHash = (rawData: any) => {
    const commitsData = rawData['touchline-CardMatchCommitHash'];
    if (!commitsData) return null;
  
    return {
        fieldOrder: [], 
        match_id: getPrimitiveValue(commitsData.match_id),
        player_id: getPrimitiveValue(commitsData.player_id),
        card_hash: getPrimitiveValue(commitsData.card_hash),
        sub_hash: getPrimitiveValue(commitsData.sub_hash)
    };
};

const transformEntities = (rawEntities: any[], transformFn: (data: any) => any) => {
    return rawEntities
        .map(entity => transformFn(entity))
        .filter(entity => entity !== null);
};



export const useAllEntities = (pollInterval = 5000) => {
    const { useDojoStore, client, sdk } = useDojoSDK();
    const state = useDojoStore((state) => state);
    const { setMatch, setCard, setSquadPosition, setSquad,setCommit,setPlayerSquad, loadPlayerCards,loadUsedCards,setSquadCardsUsed} = useGameStore();
  
    const {  match_id,squad_id } = useTouchlineStore((state) => state);
    const { account, address, status, isConnected } = useNetworkAccount();



    const fetchAllEntities = async () => {
        try {

            let queryBuilder;

            const modelsToQuery = [
                ModelsMapping.Match,
                ModelsMapping.Card, 
                ModelsMapping.Squad,
                ModelsMapping.SquadPosition,
                ModelsMapping.CardMatchCommitHash
            ];
                
                queryBuilder = new ToriiQueryBuilder()
                .withClause(
                    new ClauseBuilder()
                        .keys([], [undefined], "VariableLen")
                        .build()
                );
                
                const res = await sdk.client.getEntities(queryBuilder.build());
                
            // const res = await sdk.client.getEntities(
            //     new ToriiQueryBuilder()
            //         .withClause(
            //             new ClauseBuilder()
            //                 .keys([], [undefined], "VariableLen")
            //                 .build()
            //         )
            //         .build()
            // );
            
            console.log("Raw entities:", res);

            // Group entities by type
            const entities = {
                matches: [],
                cards: [],
                squads: [],
                squadPositions: [],
                commitss: []
            };

              // Convert object to array if it's not already
              const entityArray = Array.isArray(res) ? res : Object.values(res);
                          
              entityArray.forEach((entity) => {
                if ('touchline-Match' in entity) {
                    const match = transformMatch(entity);
                    if (match) setMatch(match);
                }
                if ('touchline-Card' in entity) {
                    const card = transformCard(entity);
                    if (card) setCard(card);
                }
                if ('touchline-Squad' in entity) {
                    const squad = transformSquad(entity);
                    if (squad) setSquad(squad);
                    if (removeLeadingZeros(squad.player_id) === account.address) setPlayerSquad(squad);
                }
                if ('touchline-SquadPosition' in entity) {
                    const squadPosition = transformSquadPosition(entity);
                    if (squadPosition) setSquadPosition(squadPosition);
                }
                if ('touchline-CardMatchCommitHash' in entity) {
                    const commits = transformCardMatchCommitHash(entity);
                    if (commits) setCommit(commits);
                }
             if ('touchline-SquadCardUsed' in entity) {
                    const squadCardUsed = transformSquadCardUsed(entity);
                    if (squadCardUsed) setSquadCardsUsed(squadCardUsed);
                }
            });

            // Transform each type of entity
            const transformed = {
                matches: transformEntities(entities.matches, transformMatch),
                cards: transformEntities(entities.cards, transformCard),
                squadPositions: transformEntities(entities.squadPositions, transformSquadPosition),
                squads: transformEntities(entities.squads, transformSquad),
                commitss: transformEntities(entities.commitss, transformCardMatchCommitHash),
               
            };

          

            if (squad_id > 0){
                loadPlayerCards(account.address,squad_id);
            }

            

            if(squad_id > 0 && match_id > 0){
                loadUsedCards(account.address, squad_id, match_id);
            }

           // console.log(transformed)


            return transformed;
        } catch (error) {
            console.error("Error fetching entities:", error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        let intervalId: NodeJS.Timeout;
  
        const startPolling = async () => {
            if (!sdk?.client) return;
            
            // Initial fetch
            await fetchAllEntities();
  
            // Set up polling only if component is still mounted
            if (isMounted) {
                intervalId = setInterval(fetchAllEntities, pollInterval);
            }
        };
  
        startPolling();
  
        // Cleanup
        return () => {
            isMounted = false;
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [pollInterval]); // Only depend on sdk.client and pollInterval

    return {
      state: useGameStore(),
        refetch: fetchAllEntities
    };
};