import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, BigNumberish } from 'starknet';

// Type definition for `touchline::models::card::Card` struct
export interface Card {
	id: BigNumberish;
	player_name: BigNumberish;
	team: BigNumberish;
	position: PositionEnum;
	attack: BigNumberish;
	defense: BigNumberish;
	special: BigNumberish;
	rarity: RarityEnum;
	season: BigNumberish;
}

// Type definition for `touchline::models::card::CardValue` struct
export interface CardValue {
	player_name: BigNumberish;
	team: BigNumberish;
	position: PositionEnum;
	attack: BigNumberish;
	defense: BigNumberish;
	special: BigNumberish;
	rarity: RarityEnum;
	season: BigNumberish;
}

// Type definition for `touchline::models::card::PositionToCard` struct
export interface PositionToCard {
	player: string;
	squad_id: BigNumberish;
	position_index: BigNumberish;
	card_id: BigNumberish;
}

// Type definition for `touchline::models::card::PositionToCardValue` struct
export interface PositionToCardValue {
	card_id: BigNumberish;
}

// Type definition for `touchline::models::card::SpecialAbility` struct
export interface SpecialAbility {
	card_id: BigNumberish;
	ability_id: BigNumberish;
	name: BigNumberish;
	description: BigNumberish;
	bonus_value: BigNumberish;
}

// Type definition for `touchline::models::card::SpecialAbilityValue` struct
export interface SpecialAbilityValue {
	name: BigNumberish;
	description: BigNumberish;
	bonus_value: BigNumberish;
}

// Type definition for `touchline::models::squad::Squad` struct
export interface Squad {
	player_id: string;
	squad_id: BigNumberish;
	name: BigNumberish;
	formation: FormationEnum;
	team_chemistry: BigNumberish;
}

// Type definition for `touchline::models::squad::SquadCardUsed` struct
export interface SquadCardUsed {
	player_id: string;
	squad_id: BigNumberish;
	match_id: BigNumberish;
	card_id: BigNumberish;
}

// Type definition for `touchline::models::squad::SquadCardUsedValue` struct
export interface SquadCardUsedValue {
	card_id: BigNumberish;
}

// Type definition for `touchline::models::squad::SquadPosition` struct
export interface SquadPosition {
	player_id: string;
	squad_id: BigNumberish;
	card_id: BigNumberish;
	position_index: BigNumberish;
	chemistry_bonus: BigNumberish;
}

// Type definition for `touchline::models::squad::SquadPositionValue` struct
export interface SquadPositionValue {
	position_index: BigNumberish;
	chemistry_bonus: BigNumberish;
}

// Type definition for `touchline::models::squad::SquadValue` struct
export interface SquadValue {
	name: BigNumberish;
	formation: FormationEnum;
	team_chemistry: BigNumberish;
}

// Type definition for `touchline::models::tmatch::CardMatchCommitHash` struct
export interface CardMatchCommitHash {
	match_id: BigNumberish;
	player_id: string;
	card_hash: BigNumberish;
}

// Type definition for `touchline::models::tmatch::CardMatchCommitHashValue` struct
export interface CardMatchCommitHashValue {
	card_hash: BigNumberish;
}

// Type definition for `touchline::models::tmatch::CardMatchCommitReveal` struct
export interface CardMatchCommitReveal {
	match_id: BigNumberish;
	player_id: string;
	card_id: BigNumberish;
	reveal_no: BigNumberish;
}

// Type definition for `touchline::models::tmatch::CardMatchCommitRevealValue` struct
export interface CardMatchCommitRevealValue {
	card_id: BigNumberish;
	reveal_no: BigNumberish;
}

// Type definition for `touchline::models::tmatch::CardMatchStatus` struct
export interface CardMatchStatus {
	match_id: BigNumberish;
	card_id: BigNumberish;
	stamina_remaining: BigNumberish;
	yellow_cards: BigNumberish;
	red_card: boolean;
	goals_scored: BigNumberish;
	special_ability_used: boolean;
}

// Type definition for `touchline::models::tmatch::CardMatchStatusValue` struct
export interface CardMatchStatusValue {
	stamina_remaining: BigNumberish;
	yellow_cards: BigNumberish;
	red_card: boolean;
	goals_scored: BigNumberish;
	special_ability_used: boolean;
}

// Type definition for `touchline::models::tmatch::Match` struct
export interface Match {
	match_id: BigNumberish;
	home_player_id: string;
	away_player_id: string;
	home_squad_id: BigNumberish;
	away_squad_id: BigNumberish;
	home_score: BigNumberish;
	away_score: BigNumberish;
	status: MatchStatusEnum;
	current_turn: BigNumberish;
	turn_deadline: BigNumberish;
	created_at: BigNumberish;
	last_action_type: ActionTypeEnum;
	last_action_timestamp: BigNumberish;
}

// Type definition for `touchline::models::tmatch::MatchValue` struct
export interface MatchValue {
	home_player_id: string;
	away_player_id: string;
	home_squad_id: BigNumberish;
	away_squad_id: BigNumberish;
	home_score: BigNumberish;
	away_score: BigNumberish;
	status: MatchStatusEnum;
	current_turn: BigNumberish;
	turn_deadline: BigNumberish;
	created_at: BigNumberish;
	last_action_type: ActionTypeEnum;
	last_action_timestamp: BigNumberish;
}

// Type definition for `touchline::models::tmatch::PrevRoundWinner` struct
export interface PrevRoundWinner {
	match_id: BigNumberish;
	player_id: string;
}

// Type definition for `touchline::models::tmatch::PrevRoundWinnerValue` struct
export interface PrevRoundWinnerValue {
	player_id: string;
}

// Type definition for `touchline::models::tmatch::SpecialCardUse` struct
export interface SpecialCardUse {
	match_id: BigNumberish;
	player_id: string;
	special_no: BigNumberish;
	count: BigNumberish;
}

// Type definition for `touchline::models::tmatch::SpecialCardUseValue` struct
export interface SpecialCardUseValue {
	special_no: BigNumberish;
	count: BigNumberish;
}

// Type definition for `touchline::models::tmatch::TacticCardUse` struct
export interface TacticCardUse {
	match_id: BigNumberish;
	player_id: string;
	tactic_no: BigNumberish;
	valid: boolean;
	count: BigNumberish;
}

// Type definition for `touchline::models::tmatch::TacticCardUseValue` struct
export interface TacticCardUseValue {
	tactic_no: BigNumberish;
	valid: boolean;
	count: BigNumberish;
}

// Type definition for `touchline::models::tmatch::TurnAction` struct
export interface TurnAction {
	match_id: BigNumberish;
	player_id: string;
	action_type: ActionTypeEnum;
	attacking_card_id: BigNumberish;
	defending_card_id: BigNumberish;
	special_ability_used: boolean;
	outcome: ActionOutcomeEnum;
	timestamp: BigNumberish;
}

// Type definition for `touchline::models::tmatch::TurnActionValue` struct
export interface TurnActionValue {
	action_type: ActionTypeEnum;
	attacking_card_id: BigNumberish;
	defending_card_id: BigNumberish;
	special_ability_used: boolean;
	outcome: ActionOutcomeEnum;
	timestamp: BigNumberish;
}

// Type definition for `touchline::systems::actions::actions::GoalScored` struct
export interface GoalScored {
	match_id: BigNumberish;
	player_id: string;
	card_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `touchline::systems::actions::actions::GoalScoredValue` struct
export interface GoalScoredValue {
	player_id: string;
	card_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `touchline::systems::actions::actions::MatchEnded` struct
export interface MatchEnded {
	match_id: BigNumberish;
	home_score: BigNumberish;
	away_score: BigNumberish;
	status: MatchStatusEnum;
	timestamp: BigNumberish;
}

// Type definition for `touchline::systems::actions::actions::MatchEndedValue` struct
export interface MatchEndedValue {
	home_score: BigNumberish;
	away_score: BigNumberish;
	status: MatchStatusEnum;
	timestamp: BigNumberish;
}

// Type definition for `touchline::systems::actions::actions::TurnActionSubmitted` struct
export interface TurnActionSubmitted {
	match_id: BigNumberish;
	turn: BigNumberish;
	player_id: string;
	action_type: ActionTypeEnum;
	timestamp: BigNumberish;
}

// Type definition for `touchline::systems::actions::actions::TurnActionSubmittedValue` struct
export interface TurnActionSubmittedValue {
	turn: BigNumberish;
	player_id: string;
	action_type: ActionTypeEnum;
	timestamp: BigNumberish;
}

// Type definition for `touchline::systems::squad::squad::CardAssigned` struct
export interface CardAssigned {
	player: string;
	squad_id: BigNumberish;
	position_index: BigNumberish;
	card_id: BigNumberish;
}

// Type definition for `touchline::systems::squad::squad::CardAssignedValue` struct
export interface CardAssignedValue {
	squad_id: BigNumberish;
	position_index: BigNumberish;
	card_id: BigNumberish;
}

// Type definition for `touchline::systems::squad::squad::SquadCreated` struct
export interface SquadCreated {
	player: string;
	squad_id: BigNumberish;
	name: BigNumberish;
	formation: FormationEnum;
}

// Type definition for `touchline::systems::squad::squad::SquadCreatedValue` struct
export interface SquadCreatedValue {
	squad_id: BigNumberish;
	name: BigNumberish;
	formation: FormationEnum;
}

// Type definition for `touchline::systems::tmatch::tmatch::MatchCreated` struct
export interface MatchCreated {
	match_id: BigNumberish;
	home_player_id: string;
	away_player_id: string;
	home_squad_id: BigNumberish;
	away_squad_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `touchline::systems::tmatch::tmatch::MatchCreatedValue` struct
export interface MatchCreatedValue {
	home_player_id: string;
	away_player_id: string;
	home_squad_id: BigNumberish;
	away_squad_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `touchline::systems::tmatch::tmatch::MatchStarted` struct
export interface MatchStarted {
	match_id: BigNumberish;
	timestamp: BigNumberish;
}

// Type definition for `touchline::systems::tmatch::tmatch::MatchStartedValue` struct
export interface MatchStartedValue {
	timestamp: BigNumberish;
}

// Type definition for `touchline::models::card::Position` enum
export const position = [
	'Goalkeeper',
	'Defender',
	'Midfielder',
	'Forward',
] as const;
export type Position = { [key in typeof position[number]]: string };
export type PositionEnum = CairoCustomEnum;

// Type definition for `touchline::models::card::Rarity` enum
export const rarity = [
	'Common',
	'Rare',
	'Epic',
	'Legendary',
	'Icon',
] as const;
export type Rarity = { [key in typeof rarity[number]]: string };
export type RarityEnum = CairoCustomEnum;

// Type definition for `touchline::models::squad::Formation` enum
export const formation = [
	'F442',
	'F433',
	'F352',
	'F532',
	'F343',
] as const;
export type Formation = { [key in typeof formation[number]]: string };
export type FormationEnum = CairoCustomEnum;

// Type definition for `touchline::models::tmatch::ActionOutcome` enum
export const actionOutcome = [
	'None',
	'Success',
	'Failure',
	'Critical',
	'Blocked',
] as const;
export type ActionOutcome = { [key in typeof actionOutcome[number]]: string };
export type ActionOutcomeEnum = CairoCustomEnum;

// Type definition for `touchline::models::tmatch::ActionType` enum
export const actionType = [
	'None',
	'Attack',
	'Defend',
	'Special',
	'Substitute',
] as const;
export type ActionType = { [key in typeof actionType[number]]: string };
export type ActionTypeEnum = CairoCustomEnum;

// Type definition for `touchline::models::tmatch::MatchStatus` enum
export const matchStatus = [
	'Created',
	'WaitingForAWay',
	'InProgress',
	'HomeWin',
	'AwayWin',
	'Draw',
	'Abandoned',
	'PendingReveal',
] as const;
export type MatchStatus = { [key in typeof matchStatus[number]]: string };
export type MatchStatusEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	touchline: {
		Card: Card,
		CardValue: CardValue,
		PositionToCard: PositionToCard,
		PositionToCardValue: PositionToCardValue,
		SpecialAbility: SpecialAbility,
		SpecialAbilityValue: SpecialAbilityValue,
		Squad: Squad,
		SquadCardUsed: SquadCardUsed,
		SquadCardUsedValue: SquadCardUsedValue,
		SquadPosition: SquadPosition,
		SquadPositionValue: SquadPositionValue,
		SquadValue: SquadValue,
		CardMatchCommitHash: CardMatchCommitHash,
		CardMatchCommitHashValue: CardMatchCommitHashValue,
		CardMatchCommitReveal: CardMatchCommitReveal,
		CardMatchCommitRevealValue: CardMatchCommitRevealValue,
		CardMatchStatus: CardMatchStatus,
		CardMatchStatusValue: CardMatchStatusValue,
		Match: Match,
		MatchValue: MatchValue,
		PrevRoundWinner: PrevRoundWinner,
		PrevRoundWinnerValue: PrevRoundWinnerValue,
		SpecialCardUse: SpecialCardUse,
		SpecialCardUseValue: SpecialCardUseValue,
		TacticCardUse: TacticCardUse,
		TacticCardUseValue: TacticCardUseValue,
		TurnAction: TurnAction,
		TurnActionValue: TurnActionValue,
		GoalScored: GoalScored,
		GoalScoredValue: GoalScoredValue,
		MatchEnded: MatchEnded,
		MatchEndedValue: MatchEndedValue,
		TurnActionSubmitted: TurnActionSubmitted,
		TurnActionSubmittedValue: TurnActionSubmittedValue,
		CardAssigned: CardAssigned,
		CardAssignedValue: CardAssignedValue,
		SquadCreated: SquadCreated,
		SquadCreatedValue: SquadCreatedValue,
		MatchCreated: MatchCreated,
		MatchCreatedValue: MatchCreatedValue,
		MatchStarted: MatchStarted,
		MatchStartedValue: MatchStartedValue,
	},
}
export const schema: SchemaType = {
	touchline: {
		Card: {
			id: 0,
			player_name: 0,
			team: 0,
		position: new CairoCustomEnum({ 
					Goalkeeper: "",
				Defender: undefined,
				Midfielder: undefined,
				Forward: undefined, }),
			attack: 0,
			defense: 0,
			special: 0,
		rarity: new CairoCustomEnum({ 
					Common: "",
				Rare: undefined,
				Epic: undefined,
				Legendary: undefined,
				Icon: undefined, }),
			season: 0,
		},
		CardValue: {
			player_name: 0,
			team: 0,
		position: new CairoCustomEnum({ 
					Goalkeeper: "",
				Defender: undefined,
				Midfielder: undefined,
				Forward: undefined, }),
			attack: 0,
			defense: 0,
			special: 0,
		rarity: new CairoCustomEnum({ 
					Common: "",
				Rare: undefined,
				Epic: undefined,
				Legendary: undefined,
				Icon: undefined, }),
			season: 0,
		},
		PositionToCard: {
			player: "",
			squad_id: 0,
			position_index: 0,
			card_id: 0,
		},
		PositionToCardValue: {
			card_id: 0,
		},
		SpecialAbility: {
			card_id: 0,
			ability_id: 0,
			name: 0,
			description: 0,
			bonus_value: 0,
		},
		SpecialAbilityValue: {
			name: 0,
			description: 0,
			bonus_value: 0,
		},
		Squad: {
			player_id: "",
			squad_id: 0,
			name: 0,
		formation: new CairoCustomEnum({ 
					F442: "",
				F433: undefined,
				F352: undefined,
				F532: undefined,
				F343: undefined, }),
			team_chemistry: 0,
		},
		SquadCardUsed: {
			player_id: "",
			squad_id: 0,
			match_id: 0,
			card_id: 0,
		},
		SquadCardUsedValue: {
			card_id: 0,
		},
		SquadPosition: {
			player_id: "",
			squad_id: 0,
			card_id: 0,
			position_index: 0,
			chemistry_bonus: 0,
		},
		SquadPositionValue: {
			position_index: 0,
			chemistry_bonus: 0,
		},
		SquadValue: {
			name: 0,
		formation: new CairoCustomEnum({ 
					F442: "",
				F433: undefined,
				F352: undefined,
				F532: undefined,
				F343: undefined, }),
			team_chemistry: 0,
		},
		CardMatchCommitHash: {
			match_id: 0,
			player_id: "",
		card_hash: 0,
		},
		CardMatchCommitHashValue: {
		card_hash: 0,
		},
		CardMatchCommitReveal: {
			match_id: 0,
			player_id: "",
			card_id: 0,
			reveal_no: 0,
		},
		CardMatchCommitRevealValue: {
			card_id: 0,
			reveal_no: 0,
		},
		CardMatchStatus: {
			match_id: 0,
			card_id: 0,
			stamina_remaining: 0,
			yellow_cards: 0,
			red_card: false,
			goals_scored: 0,
			special_ability_used: false,
		},
		CardMatchStatusValue: {
			stamina_remaining: 0,
			yellow_cards: 0,
			red_card: false,
			goals_scored: 0,
			special_ability_used: false,
		},
		Match: {
			match_id: 0,
			home_player_id: "",
			away_player_id: "",
			home_squad_id: 0,
			away_squad_id: 0,
			home_score: 0,
			away_score: 0,
		status: new CairoCustomEnum({ 
					Created: "",
				WaitingForAWay: undefined,
				InProgress: undefined,
				HomeWin: undefined,
				AwayWin: undefined,
				Draw: undefined,
				Abandoned: undefined,
				PendingReveal: undefined, }),
			current_turn: 0,
			turn_deadline: 0,
			created_at: 0,
		last_action_type: new CairoCustomEnum({ 
					None: "",
				Attack: undefined,
				Defend: undefined,
				Special: undefined,
				Substitute: undefined, }),
			last_action_timestamp: 0,
		},
		MatchValue: {
			home_player_id: "",
			away_player_id: "",
			home_squad_id: 0,
			away_squad_id: 0,
			home_score: 0,
			away_score: 0,
		status: new CairoCustomEnum({ 
					Created: "",
				WaitingForAWay: undefined,
				InProgress: undefined,
				HomeWin: undefined,
				AwayWin: undefined,
				Draw: undefined,
				Abandoned: undefined,
				PendingReveal: undefined, }),
			current_turn: 0,
			turn_deadline: 0,
			created_at: 0,
		last_action_type: new CairoCustomEnum({ 
					None: "",
				Attack: undefined,
				Defend: undefined,
				Special: undefined,
				Substitute: undefined, }),
			last_action_timestamp: 0,
		},
		PrevRoundWinner: {
			match_id: 0,
			player_id: "",
		},
		PrevRoundWinnerValue: {
			player_id: "",
		},
		SpecialCardUse: {
			match_id: 0,
			player_id: "",
			special_no: 0,
			count: 0,
		},
		SpecialCardUseValue: {
			special_no: 0,
			count: 0,
		},
		TacticCardUse: {
			match_id: 0,
			player_id: "",
			tactic_no: 0,
			valid: false,
			count: 0,
		},
		TacticCardUseValue: {
			tactic_no: 0,
			valid: false,
			count: 0,
		},
		TurnAction: {
			match_id: 0,
			player_id: "",
		action_type: new CairoCustomEnum({ 
					None: "",
				Attack: undefined,
				Defend: undefined,
				Special: undefined,
				Substitute: undefined, }),
			attacking_card_id: 0,
			defending_card_id: 0,
			special_ability_used: false,
		outcome: new CairoCustomEnum({ 
					None: "",
				Success: undefined,
				Failure: undefined,
				Critical: undefined,
				Blocked: undefined, }),
			timestamp: 0,
		},
		TurnActionValue: {
		action_type: new CairoCustomEnum({ 
					None: "",
				Attack: undefined,
				Defend: undefined,
				Special: undefined,
				Substitute: undefined, }),
			attacking_card_id: 0,
			defending_card_id: 0,
			special_ability_used: false,
		outcome: new CairoCustomEnum({ 
					None: "",
				Success: undefined,
				Failure: undefined,
				Critical: undefined,
				Blocked: undefined, }),
			timestamp: 0,
		},
		GoalScored: {
			match_id: 0,
			player_id: "",
			card_id: 0,
			timestamp: 0,
		},
		GoalScoredValue: {
			player_id: "",
			card_id: 0,
			timestamp: 0,
		},
		MatchEnded: {
			match_id: 0,
			home_score: 0,
			away_score: 0,
		status: new CairoCustomEnum({ 
					Created: "",
				WaitingForAWay: undefined,
				InProgress: undefined,
				HomeWin: undefined,
				AwayWin: undefined,
				Draw: undefined,
				Abandoned: undefined,
				PendingReveal: undefined, }),
			timestamp: 0,
		},
		MatchEndedValue: {
			home_score: 0,
			away_score: 0,
		status: new CairoCustomEnum({ 
					Created: "",
				WaitingForAWay: undefined,
				InProgress: undefined,
				HomeWin: undefined,
				AwayWin: undefined,
				Draw: undefined,
				Abandoned: undefined,
				PendingReveal: undefined, }),
			timestamp: 0,
		},
		TurnActionSubmitted: {
			match_id: 0,
			turn: 0,
			player_id: "",
		action_type: new CairoCustomEnum({ 
					None: "",
				Attack: undefined,
				Defend: undefined,
				Special: undefined,
				Substitute: undefined, }),
			timestamp: 0,
		},
		TurnActionSubmittedValue: {
			turn: 0,
			player_id: "",
		action_type: new CairoCustomEnum({ 
					None: "",
				Attack: undefined,
				Defend: undefined,
				Special: undefined,
				Substitute: undefined, }),
			timestamp: 0,
		},
		CardAssigned: {
			player: "",
			squad_id: 0,
			position_index: 0,
			card_id: 0,
		},
		CardAssignedValue: {
			squad_id: 0,
			position_index: 0,
			card_id: 0,
		},
		SquadCreated: {
			player: "",
			squad_id: 0,
			name: 0,
		formation: new CairoCustomEnum({ 
					F442: "",
				F433: undefined,
				F352: undefined,
				F532: undefined,
				F343: undefined, }),
		},
		SquadCreatedValue: {
			squad_id: 0,
			name: 0,
		formation: new CairoCustomEnum({ 
					F442: "",
				F433: undefined,
				F352: undefined,
				F532: undefined,
				F343: undefined, }),
		},
		MatchCreated: {
			match_id: 0,
			home_player_id: "",
			away_player_id: "",
			home_squad_id: 0,
			away_squad_id: 0,
			timestamp: 0,
		},
		MatchCreatedValue: {
			home_player_id: "",
			away_player_id: "",
			home_squad_id: 0,
			away_squad_id: 0,
			timestamp: 0,
		},
		MatchStarted: {
			match_id: 0,
			timestamp: 0,
		},
		MatchStartedValue: {
			timestamp: 0,
		},
	},
};
export enum ModelsMapping {
	Card = 'touchline-Card',
	CardValue = 'touchline-CardValue',
	Position = 'touchline-Position',
	PositionToCard = 'touchline-PositionToCard',
	PositionToCardValue = 'touchline-PositionToCardValue',
	Rarity = 'touchline-Rarity',
	SpecialAbility = 'touchline-SpecialAbility',
	SpecialAbilityValue = 'touchline-SpecialAbilityValue',
	Formation = 'touchline-Formation',
	Squad = 'touchline-Squad',
	SquadCardUsed = 'touchline-SquadCardUsed',
	SquadCardUsedValue = 'touchline-SquadCardUsedValue',
	SquadPosition = 'touchline-SquadPosition',
	SquadPositionValue = 'touchline-SquadPositionValue',
	SquadValue = 'touchline-SquadValue',
	ActionOutcome = 'touchline-ActionOutcome',
	ActionType = 'touchline-ActionType',
	CardMatchCommitHash = 'touchline-CardMatchCommitHash',
	CardMatchCommitHashValue = 'touchline-CardMatchCommitHashValue',
	CardMatchCommitReveal = 'touchline-CardMatchCommitReveal',
	CardMatchCommitRevealValue = 'touchline-CardMatchCommitRevealValue',
	CardMatchStatus = 'touchline-CardMatchStatus',
	CardMatchStatusValue = 'touchline-CardMatchStatusValue',
	Match = 'touchline-Match',
	MatchStatus = 'touchline-MatchStatus',
	MatchValue = 'touchline-MatchValue',
	PrevRoundWinner = 'touchline-PrevRoundWinner',
	PrevRoundWinnerValue = 'touchline-PrevRoundWinnerValue',
	SpecialCardUse = 'touchline-SpecialCardUse',
	SpecialCardUseValue = 'touchline-SpecialCardUseValue',
	TacticCardUse = 'touchline-TacticCardUse',
	TacticCardUseValue = 'touchline-TacticCardUseValue',
	TurnAction = 'touchline-TurnAction',
	TurnActionValue = 'touchline-TurnActionValue',
	GoalScored = 'touchline-GoalScored',
	GoalScoredValue = 'touchline-GoalScoredValue',
	MatchEnded = 'touchline-MatchEnded',
	MatchEndedValue = 'touchline-MatchEndedValue',
	TurnActionSubmitted = 'touchline-TurnActionSubmitted',
	TurnActionSubmittedValue = 'touchline-TurnActionSubmittedValue',
	CardAssigned = 'touchline-CardAssigned',
	CardAssignedValue = 'touchline-CardAssignedValue',
	SquadCreated = 'touchline-SquadCreated',
	SquadCreatedValue = 'touchline-SquadCreatedValue',
	MatchCreated = 'touchline-MatchCreated',
	MatchCreatedValue = 'touchline-MatchCreatedValue',
	MatchStarted = 'touchline-MatchStarted',
	MatchStartedValue = 'touchline-MatchStartedValue',
}