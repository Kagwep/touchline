
use touchline::models::tmatch::{
    ActionType, Match,ActionOutcome, MatchStatus,CardMatchStatus,
    CardMatchStatusTrait,MatchTrait,TurnAction,TurnActionTrait,CardMatchCommitReveal,
    PrevRoundWinner,TacticCardUse,SpecialCardUse,
    CardMatchCommitHash,CardMatchCommitHashTrait
};


#[starknet::interface]
pub trait ITMatch<T> {
    fn create_match(ref self: T,  home_squad_id: u8, match_id: u128);
    fn start_match(ref self: T, match_id: u128);
    fn join_match(ref self: T, match_id: u128, away_squad_id:u8);

}

#[dojo::contract]
pub mod tmatch {

    use super::{ITMatch,ActionType, ActionOutcome, MatchStatus,CardMatchStatus,
        CardMatchStatusTrait,MatchTrait,TurnAction,TurnActionTrait,SpecialCardUse,
        CardMatchCommitReveal,PrevRoundWinner,TacticCardUse,Match,CardMatchCommitHash,CardMatchCommitHashTrait };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use touchline::models::squad::{Squad, SquadPosition};
    use touchline::models::card::{Card};

    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;

    use touchline::constants::{TURN_DURATION};
    use core::num::traits::Zero;

    const MAX_TURNS: u8 = 20;       // Maximum number of turns in a match

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct MatchCreated {
        #[key]
        pub match_id: u128,
        pub home_player_id: ContractAddress,
        pub away_player_id: ContractAddress,
        pub home_squad_id: u8,
        pub away_squad_id: u8,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct MatchStarted {
        #[key]
        pub match_id: u128,
        pub timestamp: u64,
    }


    #[abi(embed_v0)]
    impl TMatchImpl of ITMatch<ContractState> {
        fn create_match(
            ref self: ContractState, 
            home_squad_id: u8, 
            match_id: u128,
        ) {
            let mut world = self.world_default();
            let home_player_id = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Verify both squads exist
            let _home_squad: Squad = world.read_model((home_player_id, home_squad_id));
            
            
            // Create the match
            let new_match: Match = MatchTrait::new(
                match_id,
                home_player_id,
                away_player_id: Zero::zero(),
                home_squad_id: home_squad_id,
                away_squad_id: 0,
                time:timestamp
            );
            
            // Write to world
            world.write_model(@new_match);
            
            // Emit event
            world.emit_event(@MatchCreated {
                match_id,
                home_player_id,
                away_player_id:Zero::zero(),
                home_squad_id,
                away_squad_id:0,
                timestamp
            });
        }


        fn join_match(ref self: ContractState, match_id: u128, away_squad_id: u8){

            let mut world = self.world_default();
            let mut tmatch: Match  = world.read_model(match_id);

            let player_id = get_caller_address();

            assert(tmatch.home_player_id != Zero::zero(), 'Match not created');
            assert(tmatch.away_player_id == Zero::zero(), 'Game Full');

            assert(tmatch.status == MatchStatus::Created, 'Match already started');

            tmatch.away_player_id = player_id;

            tmatch.away_squad_id = away_squad_id;

            tmatch.status = MatchStatus::WaitingToStart;

            world.write_model(@tmatch);

        }
        
        fn start_match(ref self: ContractState, match_id: u128) {

            let mut world = self.world_default();
            let player = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Read match
            let mut match_data: Match = world.read_model(match_id);

            assert(match_data.away_player_id != Zero::zero(), 'Wait for opponent');

            
            // Verify caller is one of the players
            assert(
                player == match_data.home_player_id || player == match_data.away_player_id, 
                'Only match players can start'
            );
            
            // Verify  in start state
            assert(match_data.status == MatchStatus::WaitingToStart, 'Match not Waiting');
            
            // Initialize match
            match_data.start_match(timestamp, turn_duration: TURN_DURATION);

            let player_one_commit: CardMatchCommitHash =  CardMatchCommitHashTrait::new(match_id,player_id: match_data.home_player_id, card_hash: 0,sub_hash: 0);
            let player_two_commit: CardMatchCommitHash =  CardMatchCommitHashTrait::new(match_id,player_id: match_data.away_player_id, card_hash: 0,sub_hash: 0);

            let player_one_action: TurnAction =  TurnActionTrait::new(
                match_id,
                player_id: match_data.home_player_id,
                action_type: ActionType::None,
                attacking_card_id: 0,
                defending_card_id: 0,
                special_ability_used: false,
                outcome: ActionOutcome::None,
                timestamp: timestamp
            );

            let player_two_action: TurnAction =  TurnActionTrait::new(
                match_id,
                player_id:match_data.away_player_id,
                action_type: ActionType::None,
                attacking_card_id: 0,
                defending_card_id: 0,
                special_ability_used: false,
                outcome: ActionOutcome::None,
                timestamp: timestamp
            );

            world.write_model(@CardMatchCommitReveal {
                match_id,player_id: match_data.home_player_id, card_id: 0,reveal_no:0
            });
            world.write_model(@CardMatchCommitReveal {
                match_id,player_id: match_data.away_player_id, card_id: 0,reveal_no:0
            });

            world.write_model(@PrevRoundWinner {
                match_id,
                player_id: Zero::zero()
            });

           world.write_model(@TacticCardUse {
                match_id,player_id: match_data.away_player_id,tactic_no:0,valid: false,count: 0
            });

           world.write_model(@TacticCardUse {
                match_id,player_id: match_data.home_player_id,tactic_no:0,valid: false,count: 0
            });


            world.write_model(@SpecialCardUse {
                match_id,player_id: match_data.away_player_id,special_no:0,count: 0
            });

           world.write_model(@SpecialCardUse {
                match_id,player_id: match_data.home_player_id,special_no:0,count: 0
            });

            world.write_model(@player_one_commit);

            world.write_model(@player_two_commit);

            world.write_model(@player_one_action);

            world.write_model(@player_two_action);

            // Write updated match
            world.write_model(@match_data);
            
            // Emit event
            world.emit_event(@MatchStarted { match_id, timestamp });
        }
        
    }
    
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"touchline")
        }
        
    }
}