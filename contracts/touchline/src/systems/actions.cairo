use touchline::models::tmatch::{Match,MatchTrait,TurnAction,CardMatchCommitHash,
    CardMatchCommitHashTrait,CardMatchCommitReveal,PrevRoundWinner,MatchStatus,
    TacticCardUse ,ActionType,SpecialCardUse};
use touchline::models::card::{Card,Rarity,Position};
use touchline::models::squad::{SquadPosition,SquadPositionTrait,SquadCardUsed};
use core::poseidon::poseidon_hash_span;
use core::poseidon::PoseidonTrait;
use core::hash::HashStateTrait;

// define the interface
#[starknet::interface]
pub trait IActions<T> {
    fn commit(ref self: T,match_id:u128, commit_hash: u256,sub_action_type: ActionType);
    fn reveal(ref self: T,
        match_id:u128,
        card_id: u128,
        secret_key: felt252,
        squad_id:u8,
        sub_hash: u256
        );
    fn substitute_player(ref self: T,match_id:u128,prev_card: u128,card_id: u128,squad_id: u128);
    fn use_tactic_card(ref self: T,match_id:u128,card_id: u128);
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use super::{
        IActions, Match,MatchTrait,TurnAction,CardMatchCommitHash,CardMatchCommitHashTrait,
        compute_hash_on_card,hash_card_sequential,CardMatchCommitReveal,PrevRoundWinner,MatchStatus,SquadPosition,position_to_felt,rarity_to_felt,
        SquadPositionTrait,TacticCardUse,Card,Rarity,Position,ActionType,SpecialCardUse,SquadCardUsed
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};

    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;

    use touchline::constants::{TURN_DURATION};

    use core::poseidon::poseidon_hash_span;
    use core::poseidon::PoseidonTrait;
    use core::hash::HashStateTrait;

    use core::integer::u256;
    use core::num::traits::Zero;



    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct TurnActionSubmitted {
        #[key]
        pub match_id: u128,
        pub turn: u8,
        pub player_id: ContractAddress,
        pub action_type: ActionType,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct GoalScored {
        #[key]
        pub match_id: u128,
        pub player_id: ContractAddress,
        pub card_id: u128,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct MatchEnded {
        #[key]
        pub match_id: u128,
        pub home_score: u8,
        pub away_score: u8,
        pub status: MatchStatus,
        pub timestamp: u64,
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {

        fn commit(ref self: ContractState,match_id:u128, commit_hash: u256, sub_action_type: ActionType) {
            // Get the default world.
            let mut world = self.world_default();

            let player = get_caller_address();

            let timestamp = get_block_timestamp();

            let mut tmatch: Match = world.read_model(match_id);

            assert(tmatch.status == MatchStatus::InProgress, 'Match not in progress');

            assert(sub_action_type != ActionType::None,'Action cant none');

            let mut prev_action: TurnAction  = world.read_model((match_id,player));

            let opp_action: TurnAction =  if tmatch.home_player_id == player {
                world.read_model((match_id, tmatch.away_player_id))
            }else{
                world.read_model((match_id, tmatch.home_player_id))
            };

            let prev_winner:PrevRoundWinner = world.read_model(match_id);

            if prev_winner.player_id != player {
                    assert(opp_action.action_type != sub_action_type, 'Invalid Move');
            }
            
            if tmatch.home_player_id == player {
                assert(tmatch.current_turn  % 2 == 1, 'Not Your Turn');
            }else{
                assert(tmatch.current_turn  % 2 == 0, 'Not Your Turn');
            }

            if tmatch.turn_deadline < timestamp {
                if tmatch.home_player_id == player {
                    tmatch.away_score += 1;
                   }else{
                    tmatch.home_score += 1;
                   } 
            }



            let mut card_commit_hash: CardMatchCommitHash =  world.read_model((match_id,player));

            card_commit_hash.card_hash = commit_hash;
            
            world.write_model(@card_commit_hash);


            prev_action.action_type = sub_action_type;
            prev_action.timestamp = timestamp;

            world.write_model(@prev_action);

            tmatch.last_action_type = sub_action_type;


            tmatch.advance_turn(timestamp, turn_duration: TURN_DURATION);

            tmatch.commit_count += 1;

            if tmatch.commit_count % 2 == 0  {
                tmatch.status = MatchStatus::PendingReveal;
            }

            // Write the new tmatch to the world.
            world.write_model(@tmatch);
        }

        // Implementation of the reveal function for the ContractState struct.
        fn reveal(ref self: ContractState, 
            match_id:u128,
            card_id: u128,
            secret_key: felt252,
            squad_id:u8,
            sub_hash: u256
        ) {
            // Get the address of the current caller, possibly the player's address.

            let mut world = self.world_default();

            let player = get_caller_address();

            let mut tmatch: Match = world.read_model(match_id);

            assert(tmatch.status == MatchStatus::PendingReveal, 'Match not in progress');

            let timestamp = get_block_timestamp();

            if tmatch.home_player_id == player {
                assert(tmatch.current_turn  % 2 == 1, 'Not Your Turn');
            }else{
                assert(tmatch.current_turn  % 2 == 0, 'Not Your Turn');
            }

              let player_card: Card = world.read_model(card_id);

              //let re_ahs: felt252 = hash_card_sequential(sample,secret_key);// TODO: Why not work in dojo ?

              let mut prev_commit: CardMatchCommitHash = world.read_model((match_id,player));

              assert(prev_commit.card_hash == sub_hash, 'Wrong card');

              prev_commit.sub_hash = sub_hash;


              let mut revealed_card:CardMatchCommitReveal = world.read_model((match_id,player));


              revealed_card.card_id = card_id;



            //   if (tmatch.reveal_count + 1)  % 2 == 0 {

            //     // Shadow original player with away_player_id since logic expects away player
            //     let player = tmatch.away_player_id;
            //     // Read all necessary game state
            //     let prev_action: TurnAction = world.read_model((match_id, player));
            //     let player_card: Card = world.read_model(card_id);
            //     let opp_reveal: CardMatchCommitReveal = world.read_model((match_id, tmatch.home_player_id));
            //     let opp_card: Card = world.read_model(opp_reveal.card_id);
            //     let mut prev_winner: PrevRoundWinner = world.read_model(match_id);
            //     let mut tactic_card:TacticCardUse = world.read_model((match_id,player));
            //     let mut opp_tactic_card:TacticCardUse = world.read_model((match_id,tmatch.home_player_id));
            //     let mut special_card:SpecialCardUse = world.read_model((match_id,player));
            //     let mut op_special_card:SpecialCardUse = world.read_model((match_id,tmatch.home_player_id));

            //     // Calculate tactic card bonuses
            //     let (tactic_card_val_one, tactic_card_val_two) = if (tactic_card.valid && opp_tactic_card.valid) || (!tactic_card.valid && !opp_tactic_card.valid) {
            //         (0, 0) // Both have or neither have tactic cards - no advantage
            //     } else if tactic_card.valid && !opp_tactic_card.valid {
            //         (5, 0) // Only player has tactic card
            //     } else {
            //         (0, 5) // Only opponent has tactic card
            //     };
            
            //     // Compare stats based on action type
            //     let player_wins = match prev_action.action_type {
            //         ActionType::Attack => (player_card.attack + tactic_card_val_one) > (opp_card.defense + tactic_card_val_two),
            //         ActionType::Defend => (player_card.defense + tactic_card_val_one) > (opp_card.attack + tactic_card_val_two),
            //         _ => false, // Handle unexpected action types
            //     };
                
            //     let tie = match prev_action.action_type {
            //         ActionType::Attack => (player_card.attack + tactic_card_val_one) == (opp_card.defense + tactic_card_val_two),
            //         ActionType::Defend => (player_card.defense + tactic_card_val_one) == (opp_card.attack + tactic_card_val_two),
            //         _ => false,
            //     };



            
            //     // Update scores and winner based on outcome
            //     if player_wins {
            //         tmatch.away_score += 1;
            //         if tmatch.current_turn % 2 == 0{
            //             tmatch.advance_turn(timestamp, turn_duration: TURN_DURATION);
            //         }
            //         prev_winner.player_id = player;
            //         if player_card.special == 2  {
            //             tmatch.away_score += 1;
            //             special_card.special_no +=1;
            //         }
            //     } else if !tie {
            //         tmatch.home_score += 1;
            //         prev_winner.player_id = tmatch.home_player_id;
            //         if tmatch.current_turn % 2 == 1{
            //             tmatch.advance_turn(timestamp, turn_duration: TURN_DURATION);
            //         }
            //         if opp_card.special == 2  {
            //             tmatch.home_score += 1;
            //             op_special_card.special_no +=1;
            //         }
            //     } else if tie && prev_winner.player_id == get_caller_address() {
            //         // On tie, previous winner gets advantage
            //         tmatch.advance_turn(timestamp, turn_duration: TURN_DURATION);
            //     }

            //     if player_card.special == 3 {
            //         special_card.special_no +=1;
            //     }

            //     if opp_card.special == 3 {
            //         op_special_card.special_no +=1;
            //     }

            //     tactic_card.valid = false;
            //     opp_tactic_card.valid = false;

            //     tmatch.reveal_count += 1;
            
            //     // Save updated state
            //     world.write_model(@prev_winner);
            //     world.write_model(@tactic_card);
            //     world.write_model(@opp_tactic_card);
            //     tmatch.status = MatchStatus::InProgress;



            //    world.write_model(@prev_commit);


            // }

            let card_used: SquadCardUsed = world.read_model((player,squad_id,match_id,player_card.id));

            if card_used.turn > 0 {
                 if tmatch.home_player_id == player {
                    tmatch.status = MatchStatus::AwayWin;
                    tmatch.away_score = 3;
                    tmatch.home_score = 0;
                }else{
                    tmatch.status  = MatchStatus::HomeWin;
                    tmatch.home_score = 3;
                    tmatch.away_score = 0;
                }
            }

            if (tmatch.reveal_count + 1) % 2 == 0 {
                    // Determine active and passive players explicitly
                    let (active_player, passive_player) = if tmatch.current_turn % 2 == 1 {
                        (tmatch.home_player_id, tmatch.away_player_id) 
                    } else {
                        (tmatch.away_player_id, tmatch.home_player_id)  
                    };

                    // Read game state for active player
                    let active_action: TurnAction = world.read_model((match_id, active_player));
                    let active_card: Card = world.read_model(card_id); // Assuming card_id is for active player
                    
                    // Read game state for passive player
                    let passive_reveal: CardMatchCommitReveal = world.read_model((match_id, passive_player));
                    let passive_card: Card = world.read_model(passive_reveal.card_id);
                    
                    // Read other game state
                    let mut prev_winner: PrevRoundWinner = world.read_model(match_id);
                    let mut active_tactic: TacticCardUse = world.read_model((match_id, active_player));
                    let mut passive_tactic: TacticCardUse = world.read_model((match_id, passive_player));
                    let mut active_special: SpecialCardUse = world.read_model((match_id, active_player));
                    let mut passive_special: SpecialCardUse = world.read_model((match_id, passive_player));

                    // Calculate tactic card bonuses
                    let (active_bonus, passive_bonus) = if (active_tactic.valid && passive_tactic.valid) || 
                                                        (!active_tactic.valid && !passive_tactic.valid) {
                        (0, 0) // Both have or neither have tactic cards - no advantage
                    } else if active_tactic.valid && !passive_tactic.valid {
                        (5, 0) // Only active player has tactic card
                    } else {
                        (0, 5) // Only passive player has tactic card
                    };

                    // Compare stats based on action type
                    let active_wins = match active_action.action_type {
                        ActionType::Attack => (active_card.attack + active_bonus) > (passive_card.defense + passive_bonus),
                        ActionType::Defend => (active_card.defense + active_bonus) > (passive_card.attack + passive_bonus),
                        _ => false, // Handle unexpected action types
                    };
                    
                    let tie = match active_action.action_type {
                        ActionType::Attack => (active_card.attack + active_bonus) == (passive_card.defense + passive_bonus),
                        ActionType::Defend => (active_card.defense + active_bonus) == (passive_card.attack + passive_bonus),
                        _ => false,
                    };

                    // Update scores and winner based on outcome
                    if active_wins {
                        // Award points to the correct player
                        if active_player == tmatch.home_player_id {
                            tmatch.home_score += 1;
                            if active_card.special == 2 {
                                tmatch.home_score += 1;
                                active_special.special_no += 1;
                            }
                        } else {
                            tmatch.away_score += 1;
                            if active_card.special == 2 {
                                tmatch.away_score += 1;
                                active_special.special_no += 1;
                            }
                        }
                        

                        tmatch.advance_turn(timestamp, TURN_DURATION);

                        
                        prev_winner.player_id = active_player;
                    } else if !tie {
                        // Passive player wins
                        if passive_player == tmatch.home_player_id {
                            tmatch.home_score += 1;
                            if passive_card.special == 2 {
                                tmatch.home_score += 1;
                                passive_special.special_no += 1;
                            }
                        } else {
                            tmatch.away_score += 1;
                            if passive_card.special == 2 {
                                tmatch.away_score += 1;
                                passive_special.special_no += 1;
                            }
                        }
                        
                        
                        prev_winner.player_id = passive_player;

                    } else if tie && prev_winner.player_id == player {
                        // On tie, previous winner gets advantage if they are the caller
                        tmatch.advance_turn(timestamp, TURN_DURATION);
                    }

                    // Process special cards
                    if active_card.special == 3 {
                        active_special.special_no += 1;
                    }
                    
                    if passive_card.special == 3 {
                        passive_special.special_no += 1;
                    }

                    // Reset tactic cards
                    active_tactic.valid = false;
                    passive_tactic.valid = false;


                    // Save updated state
                    world.write_model(@prev_winner);
                    world.write_model(@active_tactic);
                    world.write_model(@passive_tactic);
                    world.write_model(@active_special);
                    world.write_model(@passive_special);
                    tmatch.status = MatchStatus::InProgress;
                    world.write_model(@prev_commit);
                }
              
            tmatch.advance_turn(timestamp, turn_duration: TURN_DURATION);

            revealed_card.reveal_no += 1;

            world.write_model(@revealed_card);

            if tmatch.turn_deadline < (timestamp + TURN_DURATION){
                if tmatch.home_player_id == player {
                    tmatch.away_score += 1;
                   }else{
                    tmatch.home_score += 1;
                   } 
            }

            if revealed_card.reveal_no > 10 {

                let player_result = if tmatch.away_score > tmatch.home_score {
                    tmatch.status = MatchStatus::HomeWin;
                }else if  tmatch.away_score < tmatch.home_score{
                    tmatch.status  = MatchStatus::AwayWin;
                }else{
                    tmatch.status = MatchStatus::Draw;
                };                
            }

            world.write_model(@SquadCardUsed{
                    player_id: player,
                    squad_id,
                    match_id,
                    card_id: player_card.id,
                    turn: tmatch.current_turn
                });
            tmatch.reveal_count += 1;

            world.write_model(@tmatch);

        }

        fn substitute_player(ref self: ContractState,match_id:u128,prev_card: u128,card_id: u128,squad_id: u128){

            let mut world = self.world_default();

            let player = get_caller_address();

            let tmatch: Match = world.read_model(match_id);

            let timestamp = get_block_timestamp();



            let mut  prev_squad_pos_one:SquadPosition = world.read_model((player,squad_id,prev_card));
            let mut prev_squad_pos_two:SquadPosition = world.read_model((player,squad_id,card_id));

            // Check if positions are in the reserved range (12-15)
            assert(prev_squad_pos_one.position_index < 12 || prev_squad_pos_one.position_index > 15, 'Cannot sub');
            assert(prev_squad_pos_two.position_index < 12 || prev_squad_pos_two.position_index > 15, 'Cannot sub');

            //Todo Validate position and formation

            let card_one_index =prev_squad_pos_one.position_index;

            prev_squad_pos_one.position_index = prev_squad_pos_two.position_index;
            prev_squad_pos_two.position_index = card_one_index;

            world.write_model(@prev_squad_pos_one);
            world.write_model(@prev_squad_pos_two);

        }

        fn use_tactic_card(ref self: ContractState,match_id:u128,card_id: u128){

            let mut world = self.world_default();

            let player = get_caller_address();

            let mut tactic_card:TacticCardUse = world.read_model((match_id,player));

            assert(tactic_card.tactic_no < 2, 'Used all Options');

            tactic_card.tactic_no += 1;

            world.write_model(@tactic_card);

        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "touchline". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"touchline")
        }
    }
}

// Convert Position enum to felt252
fn position_to_felt(position: Position) -> felt252 {
    match position {
        Position::Goalkeeper => 0,
        Position::Defender => 1,
        Position::Midfielder => 2,
        Position::Forward => 3,
    }
}

// Convert Rarity enum to felt252
fn rarity_to_felt(rarity: Rarity) -> felt252 {
    match rarity {
        Rarity::Common => 0,
        Rarity::Rare => 1,
        Rarity::Epic => 2,
        Rarity::Legendary => 3,
        Rarity::Icon => 4,
    }
}



fn compute_hash_on_card(card: Card, secret_key: felt252) -> u256 {
    // Create an array with all elements
    let mut elements = ArrayTrait::new();
    elements.append(secret_key);
    elements.append(card.id.into());
    elements.append(card.player_name);
    elements.append(card.team);
    elements.append(position_to_felt(card.position));
    elements.append(card.attack.into());
    elements.append(card.defense.into());
    elements.append(card.special.into());
    elements.append(rarity_to_felt(card.rarity));
    elements.append(card.season);

    // Use poseidon hash span to compute the hash
    poseidon_hash_span(elements.span()).into()
}

fn hash_card_sequential(card: Card, secret_key: felt252) -> felt252 {
    // Start hashing with the secret key
    let mut state = PoseidonTrait::new();
    state = state.update('moshi');
    state = state.update('1747686439293');
    state = state.update('Brun');
    state = state.update('Bet');
    state = state.update('3');
    state = state.update('75');
    state = state.update('75');
    state = state.update('1');
    state = state.update('0');
    state = state.update('2025');

    let hash = state.finalize();

    // Finalize and return the hash
    assert(hash != 0, 'Hashed to zero');

    hash
    

    
}