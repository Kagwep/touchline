use touchline::models::squad::{Squad,SquadTrait, Formation, SquadPosition};
use touchline::models::card::{Position,Card,PositionToCard};
use touchline::models::tmatch::{SpecialCardUse,TacticCardUse};

#[starknet::interface]
pub trait ISquad<T> {
    fn create_squad(ref self: T, name: felt252,squad_id:u8, formation: Formation);
    fn change_formation(ref self: T, squad_id: u8, new_formation: Formation);
    fn add_card_to_position(ref self: T, squad_id: u8, position_index: u8, card_id: u128);
    fn replace_card_to_position(ref self: T, squad_id: u8, card_id_one: u128, card_id_two: u128);
    fn remove_card_from_position(ref self: T, squad_id: u8,card_id: u128);
    fn rename_squad(ref self: T, squad_id: u8, new_name: felt252);
    fn calculate_chemistry(ref self: T, squad_id: u8) -> u8;
}

#[dojo::contract]
pub mod squad {
    use super::{ISquad,Squad,SquadTrait, Formation, SquadPosition,Position,SpecialCardUse,TacticCardUse,Card,PositionToCard};
    use starknet::{ContractAddress, get_caller_address};


    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct SquadCreated {
        #[key]
        pub player: ContractAddress,
        pub squad_id: u8,
        pub name: felt252,
        pub formation: Formation,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct CardAssigned {
        #[key]
        pub player: ContractAddress,
        pub squad_id: u8,
        pub position_index: u8,
        pub card_id: u128,
    }

    #[abi(embed_v0)]
    impl SquadImpl of ISquad<ContractState> {
        fn create_squad(ref self: ContractState, name: felt252,squad_id:u8, formation: Formation) {
            let mut world = self.world_default();
            let player = get_caller_address();
            
            // Create new squad
            let squad = Squad {
                player_id: player,
                squad_id,
                name,
                formation,
                team_chemistry: 0
            };
            
            // Write squad to world
            world.write_model(@squad);
            
            // Emit creation event
            world.emit_event(@SquadCreated { 
                player, 
                squad_id,
                name,
                formation 
            });
        }
        
        fn change_formation(ref self: ContractState, squad_id: u8, new_formation: Formation) {
            let mut world = self.world_default();
            let player = get_caller_address();
            
            // Read current squad
            let mut squad: Squad = world.read_model((player, squad_id));
            
            // Update formation
            squad.formation = new_formation;
            
            // Write updated squad to world
            world.write_model(@squad);
            
            
        }
        
        fn add_card_to_position(
            ref self: ContractState, 
            squad_id: u8, 
            position_index: u8, 
            card_id: u128
        ) {
            let mut world = self.world_default();
            let player = get_caller_address();
            
            // Verify the squad exists
            let squad: Squad = world.read_model((player, squad_id));

            assert(position_index <= 23 || position_index == 0 , 'Position Invalid');

            let position_to_card:PositionToCard =  world.read_model((player, squad_id,position_index));

            assert(position_to_card.card_id != card_id, 'Position Occupied');


            let card: Card = world.read_model(card_id);

            if card.special == 2 || card.special == 3 {
                assert(position_index == 12 || position_index == 13, 'Invalid Position');

            }

        
            if card.special == 5 || card.special == 4 {
                assert(position_index == 14 || position_index == 15, 'Invalid Position');
            }
            
        
            // Create squad position entry
            let squad_position = SquadPosition {
                player_id: player,
                squad_id,
                position_index,
                card_id,
                chemistry_bonus: 0 // Calculate this based on team/position fit
            };


            let card_to_pos = PositionToCard {
                player,
                squad_id,
                position_index,
                card_id
            };

            world.write_model(@card_to_pos);

          
            // Write to world
            world.write_model(@squad_position);
   
            // Emit event
            world.emit_event(@CardAssigned {
                player,
                squad_id,
                position_index,
                card_id
            });
            
            
        }

        fn replace_card_to_position(ref self: ContractState, squad_id: u8, card_id_one: u128, card_id_two: u128){
            let mut world = self.world_default();
            let player = get_caller_address();
            
            // Verify the  exists
            let mut squad_position_one: SquadPosition = world.read_model((player, squad_id,card_id_one));
            let mut squad_position_two: SquadPosition = world.read_model((player, squad_id,card_id_two));

            let mut position_to_card:PositionToCard =  world.read_model((player, squad_id,squad_position_one.position_index));
            let mut position_to_card_two:PositionToCard =  world.read_model((player, squad_id,squad_position_two.position_index));

            let replacing_position_index = squad_position_two.position_index;

            squad_position_two.position_index = squad_position_one.position_index;
            squad_position_one.position_index = replacing_position_index;

            position_to_card.card_id = card_id_two;
            position_to_card_two.card_id = card_id_one;

            world.write_model(@squad_position_one);
            world.write_model(@squad_position_two);
            world.write_model(@position_to_card);
            world.write_model(@position_to_card_two);
        }
        
        fn remove_card_from_position(
            ref self: ContractState,
            squad_id: u8,
            card_id: u128
        ) {
            let mut world = self.world_default();
            let player = get_caller_address();
            
            // Verify the  exists
            let mut squad_position: SquadPosition = world.read_model((player, squad_id,card_id));

            let mut position_to_card:PositionToCard =  world.read_model((player, squad_id,squad_position.position_index));

            position_to_card.card_id = 50;

            squad_position.position_index = 50;
           

            world.write_model(@squad_position);
            world.write_model(@position_to_card);
        }
        
        fn rename_squad(
            ref self: ContractState,
            squad_id: u8,
            new_name: felt252
        ) {
            let mut world = self.world_default();
            let player = get_caller_address();
            
            // Verify the squad exists
            let mut squad: Squad = world.read_model((player, squad_id));

            squad.rename(new_name);

            world.write_model(@squad);

        }
        
        fn calculate_chemistry(ref self: ContractState, squad_id: u8) -> u8 {
          
            0 
        }
    }
    
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"touchline")
        }
    }
}