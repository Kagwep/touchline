use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Card {
    #[key]
    pub id: u128,
    pub player_name: felt252,
    pub team: felt252,
    pub position: Position,
    pub attack: u8,
    pub defense: u8,
    pub special: u8,
    pub rarity: Rarity,
    pub season: felt252,
}


#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct SpecialAbility {
    #[key]
    pub card_id: u128,
    #[key]
    pub ability_id: u8,
    pub name: felt252,
    pub description: felt252,
    pub bonus_value: u8
}


#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct PositionToCard {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub squad_id: u8,
    #[key]
    pub position_index: u8,
    pub card_id: u128,
}



// Position enum
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum Position {
    Goalkeeper,
    Defender,
    Midfielder,
    Forward
}

// Rarity enum
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum Rarity {
    Common,
    Rare,
    Epic,
    Legendary,
    Icon
}

#[generate_trait]
pub impl CardImpl of CardTrait {
    #[inline(always)]
    fn new(
        id: u128, 
        player_name: felt252, 
        team: felt252, 
        position: Position, 
        attack: u8, 
        defense: u8, 
        special: u8, 
        rarity: Rarity, 
        season: felt252
    ) -> Card {
        Card {
            id,
            player_name,
            team,
            position,
            attack,
            defense,
            special,
            rarity,
            season
        }
    }

    #[inline(always)]
    fn get_total_rating(self: Card) -> u8 {
        // Calculate overall rating based on stats
        let mut base_rating = self.attack + self.defense + self.special;
        
        // Adjust rating based on rarity
        match self.rarity {
            Rarity::Common => base_rating,
            Rarity::Rare => base_rating + 5,
            Rarity::Epic => base_rating + 10,
            Rarity::Legendary => base_rating + 15,
            Rarity::Icon => base_rating + 20,
        }
    }

    #[inline(always)]
    fn update_stats(ref self: Card, attack: u8, defense: u8, special: u8) {
        self.attack = attack;
        self.defense = defense;
        self.special = special;
    }

    #[inline(always)]
    fn upgrade_rarity(ref self: Card) -> bool {
        match self.rarity {
            Rarity::Common => {
                self.rarity = Rarity::Rare;
                true
            },
            Rarity::Rare => {
                self.rarity = Rarity::Epic;
                true
            },
            Rarity::Epic => {
                self.rarity = Rarity::Legendary;
                true
            },
            Rarity::Legendary => {
                self.rarity = Rarity::Icon;
                true
            },
            Rarity::Icon => {
                // Already at max rarity
                false
            }
        }
    }

    #[inline(always)]
    fn get_position_bonus(self: Card) -> u8 {
        // Different positions get different bonuses
        match self.position {
            Position::Goalkeeper => 5,
            Position::Defender => 3,
            Position::Midfielder => 2,
            Position::Forward => 4,
        }
    }

    #[inline(always)]
    fn is_same_team(self: Card, other: Card) -> bool {
        self.team == other.team
    }

    #[inline(always)]
    fn is_same_season(self: Card, other: Card) -> bool {
        self.season == other.season
    }

     #[inline(always)]
    fn is_special_card(self: Card) -> bool {
        self.special >= 12 || self.special <= 15
    }
}


#[generate_trait]
pub impl SpecialAbilityImpl of SpecialAbilityTrait {
    #[inline(always)]
    fn new(
        card_id: u128,
        ability_id: u8,
        name: felt252,
        description: felt252,
        bonus_value: u8
    ) -> SpecialAbility {
        SpecialAbility {
            card_id,
            ability_id,
            name,
            description,
            bonus_value
        }
    }

    #[inline(always)]
    fn apply_bonus(self: SpecialAbility, base_value: u8) -> u8 {
        base_value + self.bonus_value
    }

    #[inline(always)]
    fn update_description(ref self: SpecialAbility, new_description: felt252) {
        self.description = new_description;
    }

    #[inline(always)]
    fn update_bonus(ref self: SpecialAbility, new_bonus: u8) {
        self.bonus_value = new_bonus;
    }

    #[inline(always)]
    fn is_for_card(self: SpecialAbility, card_id: u128) -> bool {
        self.card_id == card_id
    }

    #[inline(always)]
    fn get_full_description(self: SpecialAbility) -> felt252 {
        // In a real implementation, you might want to concatenate
        // the name and description, but felt252 string operations
        // are limited in Cairo, so this is just a placeholder
        self.description
    }
}