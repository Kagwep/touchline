use starknet::ContractAddress;

use touchline::models::card::{Position};

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Squad {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub squad_id: u8,
    pub name: felt252,
    pub formation: Formation,
    pub team_chemistry: u8
}


#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct SquadCardUsed {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub squad_id: u8,
    #[key]
    pub match_id: u128,
    pub card_id: u128,
}


// Formation enum
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum Formation {
    F442,   // 4-4-2
    F433,   // 4-3-3
    F352,   // 3-5-2
    F532,   // 5-3-2
    F343    // 3-4-3
}


#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct SquadPosition {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub squad_id: u8,
    #[key]
    pub card_id: u128,
    pub position_index: u8,
    pub chemistry_bonus: u8  
}


#[generate_trait]
pub impl SquadImpl of SquadTrait {
    #[inline(always)]
    fn new(
        player_id: ContractAddress,
        squad_id: u8,
        name: felt252,
        formation: Formation
    ) -> Squad {
        Squad {
            player_id,
            squad_id,
            name,
            formation,
            team_chemistry: 0
        }
    }

    #[inline(always)]
    fn rename(ref self: Squad, new_name: felt252) {
        self.name = new_name;
    }

    #[inline(always)]
    fn change_formation(ref self: Squad, new_formation: Formation) {
        self.formation = new_formation;
    }

    #[inline(always)]
    fn update_chemistry(ref self: Squad, chemistry: u8) {
        self.team_chemistry = chemistry;
    }

    #[inline(always)]
    fn get_formation_positions_count(self: Squad) -> u8 {
        match self.formation {
            Formation::F442 => 10, // 10 field players (excluding goalkeeper)
            Formation::F433 => 10,
            Formation::F352 => 10,
            Formation::F532 => 10,
            Formation::F343 => 10
        }
    }

    #[inline(always)]
    fn get_defenders_count(self: Squad) -> u8 {
        match self.formation {
            Formation::F442 => 4,
            Formation::F433 => 4,
            Formation::F352 => 3,
            Formation::F532 => 5,
            Formation::F343 => 3
        }
    }

    #[inline(always)]
    fn get_midfielders_count(self: Squad) -> u8 {
        match self.formation {
            Formation::F442 => 4,
            Formation::F433 => 3,
            Formation::F352 => 5,
            Formation::F532 => 3,
            Formation::F343 => 4
        }
    }

    #[inline(always)]
    fn get_forwards_count(self: Squad) -> u8 {
        match self.formation {
            Formation::F442 => 2,
            Formation::F433 => 3,
            Formation::F352 => 2,
            Formation::F532 => 2,
            Formation::F343 => 3
        }
    }
}

#[generate_trait]
pub impl SquadPositionImpl of SquadPositionTrait {
    #[inline(always)]
    fn new(
        player_id: ContractAddress,
        squad_id: u8,
        position_index: u8,
        card_id: u128
    ) -> SquadPosition {
        SquadPosition {
            player_id,
            squad_id,
            position_index,
            card_id,
            chemistry_bonus: 0
        }
    }

    #[inline(always)]
    fn set_card(ref self: SquadPosition, new_card_id: u128) {
        self.card_id = new_card_id;
    }

    #[inline(always)]
    fn update_chemistry_bonus(ref self: SquadPosition, bonus: u8) {
        self.chemistry_bonus = bonus;
    }

    #[inline(always)]
    fn get_position_type(self: SquadPosition, squad: Squad) -> Position {
        let position_index = self.position_index;
        
        // Position 0 is always goalkeeper
        if position_index == 0 {
            return Position::Goalkeeper;
        }
        
        // Determine position type based on formation and index
        let defenders = squad.get_defenders_count();
        let midfielders = squad.get_midfielders_count();
        
        if position_index <= defenders {
            return Position::Defender;
        } else if position_index <= defenders + midfielders {
            return Position::Midfielder;
        } else {
            return Position::Forward;
        }
    }

    #[inline(always)]
    fn is_valid_position(self: SquadPosition, squad: Squad) -> bool {
        // Check if the position index is valid for the formation
        let max_positions = 1 + squad.get_formation_positions_count(); // Including goalkeeper
        self.position_index < max_positions
    }
}