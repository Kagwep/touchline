use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Match {
    #[key]
    pub match_id: u128,
    pub home_player_id: ContractAddress,
    pub away_player_id: ContractAddress,
    pub home_squad_id: u8,
    pub away_squad_id: u8,
    pub home_score: u8,
    pub away_score: u8,
    pub status: MatchStatus,
    pub current_turn: u8,
    pub turn_deadline: u64,
    pub created_at: u64,
    pub last_action_type: ActionType,
    pub last_action_timestamp: u64,
    pub commit_count: u64,
    pub reveal_count: u64,
}


#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum MatchStatus {
    Created,
    WaitingForAWay,
    WaitingToStart,
    InProgress,
    HomeWin,
    AwayWin,
    Draw,
    Abandoned,
    PendingReveal
}

// Turn action component
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct TurnAction {
    #[key]
    pub match_id: u128,
    #[key]
    pub player_id: ContractAddress,
    pub action_type: ActionType,
    pub attacking_card_id: u128,
    pub defending_card_id: u128,
    pub special_ability_used: bool,
    pub outcome: ActionOutcome,
    pub timestamp: u64
}

// Action type enum
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum ActionType {
    None,
    Attack,
    Defend,
    Special,
    Substitute
}

// Action outcome enum
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum ActionOutcome {
    None,
    Success,
    Failure,
    Critical,
    Blocked
}

// Card status in match (tracks condition, cards used, etc)
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct CardMatchStatus {
    #[key]
    pub match_id: u128,
    #[key]
    pub card_id: u128,
    pub stamina_remaining: u8,
    pub yellow_cards: u8,
    pub red_card: bool,
    pub goals_scored: u8,
    pub special_ability_used: bool
}


#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct CardMatchCommitHash {
    #[key]
    pub match_id: u128,
    #[key]
    pub player_id:  ContractAddress,
    pub card_hash: u256,
    pub sub_hash: u256,

}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct CardMatchCommitReveal {
    #[key]
    pub match_id: u128,
    #[key]
    pub player_id:  ContractAddress,
    pub card_id: u128,
    pub reveal_no:u8,

}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct PrevRoundWinner {
    #[key]
    pub match_id: u128,
    pub player_id:  ContractAddress,
    
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct TacticCardUse {
    #[key]
    pub match_id: u128,
    #[key]
    pub player_id:  ContractAddress,
    pub tactic_no:u8,
    pub valid: bool,
    pub count: u8,
}


#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct SpecialCardUse {
    #[key]
    pub match_id: u128,
    #[key]
    pub player_id:  ContractAddress,
    pub special_no:u8,
    pub count: u8,

}


#[generate_trait]
pub impl MatchImpl of MatchTrait {
    #[inline(always)]
    fn new(
        match_id: u128,
        home_player_id: ContractAddress,
        away_player_id: ContractAddress,
        home_squad_id: u8,
        away_squad_id: u8,
        time: u64
    ) -> Match {
        Match {
            match_id,
            home_player_id,
            away_player_id,
            home_squad_id,
            away_squad_id,
            home_score: 0,
            away_score: 0,
            status: MatchStatus::Created,
            current_turn: 0,
            turn_deadline: 0,
            created_at: time,
            last_action_type:ActionType::None,
            last_action_timestamp: 0,
            commit_count: 0,
            reveal_count: 0,
        }
    }

    #[inline(always)]
    fn start_match(ref self: Match, timestamp: u64, turn_duration: u64) {
        self.status = MatchStatus::InProgress;
        self.current_turn = 1;
        self.last_action_timestamp = timestamp;
        self.turn_deadline = timestamp + turn_duration;
    }


    #[inline(always)]
    fn advance_turn(ref self: Match, timestamp: u64, turn_duration: u64) {
        self.current_turn += 1;
        self.last_action_timestamp = timestamp;
        self.turn_deadline = timestamp + turn_duration;
    }

    #[inline(always)]
    fn add_score(ref self: Match, is_home_team: bool) {
        assert(self.status == MatchStatus::InProgress, 'Match not in progress');
        
        if is_home_team {
            self.home_score += 1;
        } else {
            self.away_score += 1;
        }
    }

    #[inline(always)]
    fn end_match(ref self: Match) {
        assert(self.status == MatchStatus::InProgress, 'Match not in progress');
        
        if self.home_score > self.away_score {
            self.status = MatchStatus::HomeWin;
        } else if self.away_score > self.home_score {
            self.status = MatchStatus::AwayWin;
        } else {
            self.status = MatchStatus::Draw;
        }
    }

    #[inline(always)]
    fn abandon_match(ref self: Match) {
        self.status = MatchStatus::Abandoned;
    }

    #[inline(always)]
    fn is_player_turn(self: Match, player_id: ContractAddress) -> bool {
        // Simple turn-based logic - even turns for home, odd for away
        let is_home_turn = self.current_turn % 2 == 0;
        
        (is_home_turn && player_id == self.home_player_id) || 
        (!is_home_turn && player_id == self.away_player_id)
    }

    #[inline(always)]
    fn is_turn_expired(self: Match, current_timestamp: u64) -> bool {
        current_timestamp > self.turn_deadline
    }
}

#[generate_trait]
pub impl TurnActionImpl of TurnActionTrait {
    #[inline(always)]
    fn new(
        match_id: u128,
        player_id: ContractAddress,
        action_type: ActionType,
        attacking_card_id: u128,
        defending_card_id: u128,
        special_ability_used: bool,
        outcome: ActionOutcome,
        timestamp: u64
    ) -> TurnAction {
        TurnAction {
            match_id,
            player_id,
            action_type,
            attacking_card_id,
            defending_card_id,
            special_ability_used,
            outcome,
            timestamp
        }
    }

    #[inline(always)]
    fn is_successful(self: TurnAction) -> bool {
        self.outcome == ActionOutcome::Success || self.outcome == ActionOutcome::Critical
    }

    #[inline(always)]
    fn is_critical(self: TurnAction) -> bool {
        self.outcome == ActionOutcome::Critical
    }

    #[inline(always)]
    fn update_outcome(ref self: TurnAction, new_outcome: ActionOutcome) {
        self.outcome = new_outcome;
    }
}

#[generate_trait]
pub impl CardMatchStatusImpl of CardMatchStatusTrait {
    #[inline(always)]
    fn new(
        match_id: u128,
        card_id: u128
    ) -> CardMatchStatus {
        CardMatchStatus {
            match_id,
            card_id,
            stamina_remaining: 100,
            yellow_cards: 0,
            red_card: false,
            goals_scored: 0,
            special_ability_used: false
        }
    }

    #[inline(always)]
    fn reduce_stamina(ref self: CardMatchStatus, amount: u8) {
        if amount > self.stamina_remaining {
            self.stamina_remaining = 0;
        } else {
            self.stamina_remaining -= amount;
        }
    }

    #[inline(always)]
    fn restore_stamina(ref self: CardMatchStatus, amount: u8) {
        let new_stamina = self.stamina_remaining + amount;
        if new_stamina > 100 {
            self.stamina_remaining = 100;
        } else {
            self.stamina_remaining = new_stamina;
        }
    }

    #[inline(always)]
    fn add_yellow_card(ref self: CardMatchStatus) {
        self.yellow_cards += 1;
        if self.yellow_cards >= 2 {
            self.red_card = true;
        }
    }

    #[inline(always)]
    fn add_red_card(ref self: CardMatchStatus) {
        self.red_card = true;
    }

    #[inline(always)]
    fn add_goal(ref self: CardMatchStatus) {
        self.goals_scored += 1;
    }

    #[inline(always)]
    fn use_special_ability(ref self: CardMatchStatus) {
        self.special_ability_used = true;
    }

    #[inline(always)]
    fn is_playable(self: CardMatchStatus) -> bool {
        self.stamina_remaining > 0 && !self.red_card
    }
}

#[generate_trait]
pub impl CardMatchCommitHashImpl of CardMatchCommitHashTrait {
    #[inline(always)]
    fn new(
        match_id: u128,
        player_id: ContractAddress,
        card_hash: u256,
        sub_hash:u256
    ) -> CardMatchCommitHash {
        CardMatchCommitHash {
            match_id,
            player_id,
            card_hash,
            sub_hash
        }
    }

    #[inline(always)]
    fn update_hash(ref self: CardMatchCommitHash, new_hash: u256) {
        self.card_hash = new_hash;
    }

    #[inline(always)]
    fn verify_hash(self: CardMatchCommitHash, card_ids: Array<u128>, salt: felt252) -> bool {
        // In a real implementation, this would create a hash from the card_ids and salt
        // and compare it with the stored hash
        // This is a placeholder implementation
        true
    }
}