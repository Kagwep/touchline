use touchline::models::tournament::{
    Tournament, TournamentType, TournamentStatus, TournamentParticipant,
    TournamentBracket, TournamentRound, TournamentPrize, RoundStatus,
    TournamentTrait, TournamentParticipantTrait, TournamentBracketTrait,
    TournamentRoundTrait
};
use touchline::models::tmatch::{Match, MatchTrait, MatchStatus};

#[starknet::interface]
pub trait ITournament<T> {
    fn create_tournament(
        ref self: T,
        tournament_id: u64,
        name: felt252,
        tournament_type: TournamentType,
        max_participants: u8,
        entry_fee: u256,
        registration_deadline: u64,
        start_time: u64
    );
    fn open_registration(ref self: T, tournament_id: u64);
    fn register_participant(ref self: T, tournament_id: u64, squad_id: u8);
    fn start_tournament(ref self: T, tournament_id: u64);
    fn advance_round(ref self: T, tournament_id: u64);
    fn complete_tournament(ref self: T, tournament_id: u64);
    fn cancel_tournament(ref self: T, tournament_id: u64);
    fn create_bracket_match(ref self: T, tournament_id: u64, round: u8, position: u8);
    fn update_bracket_result(ref self: T, tournament_id: u64, round: u8, position: u8, winner: starknet::ContractAddress);
}

#[dojo::contract]
pub mod tournament {
    use super::{
        ITournament, Tournament, TournamentType, TournamentStatus, TournamentParticipant,
        TournamentBracket, TournamentRound, TournamentPrize, RoundStatus,
        TournamentTrait, TournamentParticipantTrait, TournamentBracketTrait,
        TournamentRoundTrait, Match, MatchTrait, MatchStatus
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use touchline::models::squad::{Squad};
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;
    use touchline::constants::{TURN_DURATION};
    use core::num::traits::Zero;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct TournamentCreated {
        #[key]
        pub tournament_id: u64,
        pub organizer_id: ContractAddress,
        pub name: felt252,
        pub tournament_type: TournamentType,
        pub max_participants: u8,
        pub entry_fee: u256,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct TournamentRegistrationOpened {
        #[key]
        pub tournament_id: u64,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct ParticipantRegistered {
        #[key]
        pub tournament_id: u64,
        #[key]
        pub participant_id: ContractAddress,
        pub squad_id: u8,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct TournamentStarted {
        #[key]
        pub tournament_id: u64,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct RoundAdvanced {
        #[key]
        pub tournament_id: u64,
        pub new_round: u8,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct TournamentCompleted {
        #[key]
        pub tournament_id: u64,
        pub winner_id: ContractAddress,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct BracketMatchCreated {
        #[key]
        pub tournament_id: u64,
        #[key]
        pub match_id: u128,
        pub round: u8,
        pub position: u8,
        pub participant_1: ContractAddress,
        pub participant_2: ContractAddress,
        pub timestamp: u64,
    }

    #[abi(embed_v0)]
    impl TournamentImpl of ITournament<ContractState> {
        fn create_tournament(
            ref self: ContractState,
            tournament_id: u64,
            name: felt252,
            tournament_type: TournamentType,
            max_participants: u8,
            entry_fee: u256,
            registration_deadline: u64,
            start_time: u64
        ) {
            let mut world = self.world_default();
            let organizer_id = get_caller_address();
            let timestamp = get_block_timestamp();

            // Validate input parameters
            assert(max_participants > 1, 'Min 2 participants required');
            assert(registration_deadline > timestamp, 'Invalid registration deadline');
            assert(start_time > registration_deadline, 'Invalid start time');

            // Create tournament
            let new_tournament = TournamentTrait::new(
                tournament_id,
                name,
                organizer_id,
                tournament_type,
                max_participants,
                entry_fee,
                registration_deadline,
                start_time,
                timestamp
            );

            // Write to world
            world.write_model(@new_tournament);

            // Emit event
            world.emit_event(@TournamentCreated {
                tournament_id,
                organizer_id,
                name,
                tournament_type,
                max_participants,
                entry_fee,
                timestamp
            });
        }

        fn open_registration(ref self: ContractState, tournament_id: u64) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Read tournament
            let mut tournament: Tournament = world.read_model(tournament_id);

            // Verify caller is organizer
            assert(caller == tournament.organizer_id, 'Only organizer can open registration');

            // Open registration
            tournament.open_registration();

            // Write updated tournament
            world.write_model(@tournament);

            // Emit event
            world.emit_event(@TournamentRegistrationOpened {
                tournament_id,
                timestamp
            });
        }

        fn register_participant(ref self: ContractState, tournament_id: u64, squad_id: u8) {
            let mut world = self.world_default();
            let participant_id = get_caller_address();
            let timestamp = get_block_timestamp();

            // Read tournament
            let mut tournament: Tournament = world.read_model(tournament_id);

            // Verify registration is open
            assert(tournament.is_registration_open(timestamp), 'Registration not open');

            // Verify squad exists
            let _squad: Squad = world.read_model((participant_id, squad_id));

            // Check if participant already registered
            let existing_participant: TournamentParticipant = world.read_model((tournament_id, participant_id));
            assert(existing_participant.participant_id == Zero::zero(), 'Already registered');

            // Add participant to tournament
            tournament.add_participant(tournament.entry_fee);

            // Create participant record
            let participant = TournamentParticipantTrait::new(
                tournament_id,
                participant_id,
                squad_id,
                timestamp
            );

            // Write models
            world.write_model(@tournament);
            world.write_model(@participant);

            // Emit event
            world.emit_event(@ParticipantRegistered {
                tournament_id,
                participant_id,
                squad_id,
                timestamp
            });
        }

        fn start_tournament(ref self: ContractState, tournament_id: u64) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Read tournament
            let mut tournament: Tournament = world.read_model(tournament_id);

            // Verify caller is organizer
            assert(caller == tournament.organizer_id, 'Only organizer can start');

            // Verify tournament can start
            assert(tournament.can_start(timestamp), 'Tournament cannot start');

            // Start tournament
            tournament.start_tournament(timestamp);

            // Create first round
            let first_round = TournamentRoundTrait::new(
                tournament_id,
                1,
                self._calculate_matches_in_round(tournament.tournament_type, tournament.current_participants, 1),
                timestamp,
                timestamp + TURN_DURATION * 10 // Give time for round completion
            );

            // Write models
            world.write_model(@tournament);
            world.write_model(@first_round);

            // Generate initial brackets/pairings
            self._generate_round_brackets(tournament_id, 1, tournament.tournament_type, tournament.current_participants);

            // Emit event
            world.emit_event(@TournamentStarted {
                tournament_id,
                timestamp
            });
        }

        fn advance_round(ref self: ContractState, tournament_id: u64) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Read tournament
            let mut tournament: Tournament = world.read_model(tournament_id);

            // Verify caller is organizer
            assert(caller == tournament.organizer_id, 'Only organizer can advance');

            // Verify tournament is in progress
            assert(tournament.status == TournamentStatus::InProgress, 'Tournament not in progress');

            // Verify current round is complete
            let current_round: TournamentRound = world.read_model((tournament_id, tournament.current_round));
            assert(current_round.is_round_complete(), 'Current round not complete');

            // Check if tournament is finished
            if tournament.current_round >= tournament.total_rounds {
                // Determine winner and complete tournament
                let winner = self._determine_tournament_winner(tournament_id, tournament.tournament_type);
                tournament.complete_tournament(winner, timestamp);
                
                world.write_model(@tournament);
                
                world.emit_event(@TournamentCompleted {
                    tournament_id,
                    winner_id: winner,
                    timestamp
                });
                return;
            }

            // Advance to next round
            tournament.advance_round();
            let next_round_number = tournament.current_round;

            // Create next round
            let next_round = TournamentRoundTrait::new(
                tournament_id,
                next_round_number,
                self._calculate_matches_in_round(tournament.tournament_type, tournament.current_participants, next_round_number),
                timestamp,
                timestamp + TURN_DURATION * 10
            );

            // Write models
            world.write_model(@tournament);
            world.write_model(@next_round);

            // Generate brackets for next round
            self._generate_round_brackets(tournament_id, next_round_number, tournament.tournament_type, tournament.current_participants);

            // Emit event
            world.emit_event(@RoundAdvanced {
                tournament_id,
                new_round: next_round_number,
                timestamp
            });
        }

        fn complete_tournament(ref self: ContractState, tournament_id: u64) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Read tournament
            let mut tournament: Tournament = world.read_model(tournament_id);

            // Verify caller is organizer
            assert(caller == tournament.organizer_id, 'Only organizer can complete');

            // Determine winner
            let winner = self._determine_tournament_winner(tournament_id, tournament.tournament_type);

            // Complete tournament
            tournament.complete_tournament(winner, timestamp);

            // Write model
            world.write_model(@tournament);

            // Emit event
            world.emit_event(@TournamentCompleted {
                tournament_id,
                winner_id: winner,
                timestamp
            });
        }

        fn cancel_tournament(ref self: ContractState, tournament_id: u64) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read tournament
            let mut tournament: Tournament = world.read_model(tournament_id);

            // Verify caller is organizer
            assert(caller == tournament.organizer_id, 'Only organizer can cancel');

            // Cancel tournament
            tournament.cancel_tournament();

            // Write model
            world.write_model(@tournament);
        }

        fn create_bracket_match(ref self: ContractState, tournament_id: u64, round: u8, position: u8) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Read tournament
            let tournament: Tournament = world.read_model(tournament_id);

            // Verify caller is organizer
            assert(caller == tournament.organizer_id, 'Only organizer can create matches');

            // Read bracket
            let bracket: TournamentBracket = world.read_model((tournament_id, round, position));
            assert(bracket.participant_1 != Zero::zero() && bracket.participant_2 != Zero::zero(), 'Invalid participants');

            // Generate unique match ID
            let match_id: u128 = (tournament_id.into() * 1000000) + (round.into() * 1000) + position.into();

            // Create match using existing match system
            let new_match = MatchTrait::new(
                match_id,
                bracket.participant_1,
                bracket.participant_2,
                0, // Will be set when participants join with their squads
                0,
                timestamp
            );

            // Update bracket with match ID
            let mut updated_bracket = bracket;
            updated_bracket.match_id = match_id;

            // Write models
            world.write_model(@new_match);
            world.write_model(@updated_bracket);

            // Emit event
            world.emit_event(@BracketMatchCreated {
                tournament_id,
                match_id,
                round,
                position,
                participant_1: bracket.participant_1,
                participant_2: bracket.participant_2,
                timestamp
            });
        }

        fn update_bracket_result(ref self: ContractState, tournament_id: u64, round: u8, position: u8, winner: ContractAddress) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read tournament
            let tournament: Tournament = world.read_model(tournament_id);

            // Verify caller is organizer
            assert(caller == tournament.organizer_id, 'Only organizer can update results');

            // Read and update bracket
            let mut bracket: TournamentBracket = world.read_model((tournament_id, round, position));
            bracket.set_winner(winner);

            // Update round completion
            let mut round_data: TournamentRound = world.read_model((tournament_id, round));
            round_data.complete_match();

            // Update participant stats
            self._update_participant_stats(tournament_id, bracket.match_id, winner);

            // Write models
            world.write_model(@bracket);
            world.write_model(@round_data);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"touchline")
        }

        fn _calculate_matches_in_round(self: @ContractState, tournament_type: TournamentType, participants: u8, round: u8) -> u8 {
            match tournament_type {
                TournamentType::SingleElimination => {
                    if round == 1 {
                        participants / 2
                    } else {
                        let remaining = participants / (2_u8.pow(round.into() - 1));
                        remaining / 2
                    }
                },
                TournamentType::RoundRobin => participants / 2,
                _ => participants / 2 // Simplified for other types
            }
        }

        fn _generate_round_brackets(self: @ContractState, tournament_id: u64, round: u8, tournament_type: TournamentType, participants: u8) {
            let mut world = self.world_default();
            
            // This is a simplified bracket generation
            // In a real implementation, you'd implement proper bracket logic for each tournament type
            let matches_in_round = self._calculate_matches_in_round(tournament_type, participants, round);
            
            let mut position = 0;
            while position < matches_in_round {
                let bracket = TournamentBracketTrait::new(
                    tournament_id,
                    round,
                    position,
                    Zero::zero(), // Would be populated with actual participants
                    Zero::zero(), // Would be populated with actual participants
                    0 // Match ID set when match is created
                );
                
                world.write_model(@bracket);
                position += 1;
            };
        }

        fn _determine_tournament_winner(self: @ContractState, tournament_id: u64, tournament_type: TournamentType) -> ContractAddress {
            // This is a simplified winner determination
            // In a real implementation, you'd check the final bracket or standings
            Zero::zero()
        }

        fn _update_participant_stats(self: @ContractState, tournament_id: u64, match_id: u128, winner: ContractAddress) {
            let mut world = self.world_default();
            
            // Read match to get scores
            let match_data: Match = world.read_model(match_id);
            
            // Update winner stats
            let mut winner_stats: TournamentParticipant = world.read_model((tournament_id, winner));
            winner_stats.update_match_result(
                if winner == match_data.home_player_id { match_data.home_score } else { match_data.away_score },
                if winner == match_data.home_player_id { match_data.away_score } else { match_data.home_score }
            );
            
            // Update loser stats
            let loser = if winner == match_data.home_player_id { match_data.away_player_id } else { match_data.home_player_id };
            let mut loser_stats: TournamentParticipant = world.read_model((tournament_id, loser));
            loser_stats.update_match_result(
                if loser == match_data.home_player_id { match_data.home_score } else { match_data.away_score },
                if loser == match_data.home_player_id { match_data.away_score } else { match_data.home_score }
            );
            
            // Write updated stats
            world.write_model(@winner_stats);
            world.write_model(@loser_stats);
        }
    }
}