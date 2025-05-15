use touchline::models::card::{Card,SpecialAbility,SpecialAbilityTrait,Rarity,Position,CardTrait};

// define the interface
#[starknet::interface]
pub trait IPlayers<T> {
    fn create_card(ref self: T,
        id: u128, 
        player_name: felt252, 
        team: felt252, 
        position: Position, 
        attack: u8, 
        defense: u8, 
        special: u8, 
        rarity: Rarity, 
        season: felt252
    );
    fn update_stats(ref self: T,card_id:u128, attack: u8, defense: u8, special: u8);
    fn update_rarity(ref self:T,card_id:u128);
    fn create_special_ability(ref self: T,
         card_id:u128,
         ability_id: u8,
         name: felt252,
         description: felt252,
         bonus_value: u8
        );

    
}

// dojo decorator
#[dojo::contract]
pub mod players {
    use super::{IPlayers, Card,CardTrait,SpecialAbility,SpecialAbilityTrait,Rarity, Position};
    use starknet::{ContractAddress, get_caller_address};
    

    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;

    use core::num::traits::Zero;

    #[abi(embed_v0)]
    impl PlayerssImpl of IPlayers<ContractState> {
        fn create_card(ref self: ContractState,
            id: u128, 
            player_name: felt252, 
            team: felt252, 
            position: Position, 
            attack: u8, 
            defense: u8, 
            special: u8, 
            rarity: Rarity, 
            season: felt252
        ) {
            // Get the default world.
            let mut world = self.world_default();

            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();
            // Retrieve the player's current position from the world.

            let new_card: Card = CardTrait::new(
                id: id, 
                player_name: player_name, 
                team: team, 
                position: position, 
                attack: attack, 
                defense: defense, 
                special: special, 
                rarity: rarity, 
                season: season
                );

            // Write the new card to the world.
            world.write_model(@new_card);

        }

        
        fn update_stats(ref self: ContractState,card_id: u128,
            attack: u8, defense: u8, special: u8
            
             ) {
            // Get the address of the current caller, possibly the player's address.

            let mut world = self.world_default();

            let player = get_caller_address();

            
            let mut card: Card = world.read_model(card_id);
            
            card.update_stats(attack,defense,special);
            
            // Write the new position to the world.
            world.write_model(@card);

            
        }

       
        fn update_rarity(ref self: ContractState,card_id:u128) {
            // Get the address of the current caller, possibly the player's address.

            let mut world = self.world_default();

            let player = get_caller_address();

            
            let mut card: Card = world.read_model(card_id);
            
            card.upgrade_rarity();
            
            // Write the new position to the world.
            world.write_model(@card);

            
        }

        fn create_special_ability(ref self: ContractState,
            card_id:u128,
            ability_id: u8,
            name: felt252,
            description: felt252,
            bonus_value: u8
           ){
            let mut world = self.world_default();

            let player = get_caller_address();
            
            let player_card_special_ability: SpecialAbility =  SpecialAbilityTrait::new(
                card_id: card_id,
                ability_id: ability_id,
                name: name,
                description: description,
                bonus_value: bonus_value
            );

            // Write the new card to the world.
            world.write_model(@player_card_special_ability);

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

