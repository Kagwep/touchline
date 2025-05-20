import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function client(provider: DojoProvider) {

	const build_actions_commit_calldata = (matchId: BigNumberish, commitHash: BigNumberish, subActionType: CairoCustomEnum): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "commit",
			calldata: [matchId, commitHash, subActionType],
		};
	};

	const actions_commit = async (snAccount: Account | AccountInterface, matchId: BigNumberish, commitHash: BigNumberish, subActionType: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_actions_commit_calldata(matchId, commitHash, subActionType),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_reveal_calldata = (matchId: BigNumberish, cardId: BigNumberish, secretKey: BigNumberish, squadId: BigNumberish, subHash: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "reveal",
			calldata: [matchId, cardId, secretKey, squadId, subHash],
		};
	};

	const actions_reveal = async (snAccount: Account | AccountInterface, matchId: BigNumberish, cardId: BigNumberish, secretKey: BigNumberish, squadId: BigNumberish, subHash: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_actions_reveal_calldata(matchId, cardId, secretKey, squadId, subHash),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_substitutePlayer_calldata = (matchId: BigNumberish, prevCard: BigNumberish, cardId: BigNumberish, squadId: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "substitute_player",
			calldata: [matchId, prevCard, cardId, squadId],
		};
	};

	const actions_substitutePlayer = async (snAccount: Account | AccountInterface, matchId: BigNumberish, prevCard: BigNumberish, cardId: BigNumberish, squadId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_actions_substitutePlayer_calldata(matchId, prevCard, cardId, squadId),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_useTacticCard_calldata = (matchId: BigNumberish, cardId: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "use_tactic_card",
			calldata: [matchId, cardId],
		};
	};

	const actions_useTacticCard = async (snAccount: Account | AccountInterface, matchId: BigNumberish, cardId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_actions_useTacticCard_calldata(matchId, cardId),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_players_createCard_calldata = (id: BigNumberish, playerName: BigNumberish, team: BigNumberish, position: CairoCustomEnum, attack: BigNumberish, defense: BigNumberish, special: BigNumberish, rarity: CairoCustomEnum, season: BigNumberish): DojoCall => {
		return {
			contractName: "players",
			entrypoint: "create_card",
			calldata: [id, playerName, team, position, attack, defense, special, rarity, season],
		};
	};

	const players_createCard = async (snAccount: Account | AccountInterface, id: BigNumberish, playerName: BigNumberish, team: BigNumberish, position: CairoCustomEnum, attack: BigNumberish, defense: BigNumberish, special: BigNumberish, rarity: CairoCustomEnum, season: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_players_createCard_calldata(id, playerName, team, position, attack, defense, special, rarity, season),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_players_createSpecialAbility_calldata = (cardId: BigNumberish, abilityId: BigNumberish, name: BigNumberish, description: BigNumberish, bonusValue: BigNumberish): DojoCall => {
		return {
			contractName: "players",
			entrypoint: "create_special_ability",
			calldata: [cardId, abilityId, name, description, bonusValue],
		};
	};

	const players_createSpecialAbility = async (snAccount: Account | AccountInterface, cardId: BigNumberish, abilityId: BigNumberish, name: BigNumberish, description: BigNumberish, bonusValue: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_players_createSpecialAbility_calldata(cardId, abilityId, name, description, bonusValue),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_players_updateRarity_calldata = (cardId: BigNumberish): DojoCall => {
		return {
			contractName: "players",
			entrypoint: "update_rarity",
			calldata: [cardId],
		};
	};

	const players_updateRarity = async (snAccount: Account | AccountInterface, cardId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_players_updateRarity_calldata(cardId),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_players_updateStats_calldata = (cardId: BigNumberish, attack: BigNumberish, defense: BigNumberish, special: BigNumberish): DojoCall => {
		return {
			contractName: "players",
			entrypoint: "update_stats",
			calldata: [cardId, attack, defense, special],
		};
	};

	const players_updateStats = async (snAccount: Account | AccountInterface, cardId: BigNumberish, attack: BigNumberish, defense: BigNumberish, special: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_players_updateStats_calldata(cardId, attack, defense, special),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_squad_addCardToPosition_calldata = (squadId: BigNumberish, positionIndex: BigNumberish, cardId: BigNumberish): DojoCall => {
		return {
			contractName: "squad",
			entrypoint: "add_card_to_position",
			calldata: [squadId, positionIndex, cardId],
		};
	};

	const squad_addCardToPosition = async (snAccount: Account | AccountInterface, squadId: BigNumberish, positionIndex: BigNumberish, cardId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_squad_addCardToPosition_calldata(squadId, positionIndex, cardId),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_squad_calculateChemistry_calldata = (squadId: BigNumberish): DojoCall => {
		return {
			contractName: "squad",
			entrypoint: "calculate_chemistry",
			calldata: [squadId],
		};
	};

	const squad_calculateChemistry = async (snAccount: Account | AccountInterface, squadId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_squad_calculateChemistry_calldata(squadId),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_squad_changeFormation_calldata = (squadId: BigNumberish, newFormation: CairoCustomEnum): DojoCall => {
		return {
			contractName: "squad",
			entrypoint: "change_formation",
			calldata: [squadId, newFormation],
		};
	};

	const squad_changeFormation = async (snAccount: Account | AccountInterface, squadId: BigNumberish, newFormation: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_squad_changeFormation_calldata(squadId, newFormation),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_squad_createSquad_calldata = (name: BigNumberish, squadId: BigNumberish, formation: CairoCustomEnum): DojoCall => {
		return {
			contractName: "squad",
			entrypoint: "create_squad",
			calldata: [name, squadId, formation],
		};
	};

	const squad_createSquad = async (snAccount: Account | AccountInterface, name: BigNumberish, squadId: BigNumberish, formation: CairoCustomEnum) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_squad_createSquad_calldata(name, squadId, formation),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_squad_removeCardFromPosition_calldata = (squadId: BigNumberish, cardId: BigNumberish): DojoCall => {
		return {
			contractName: "squad",
			entrypoint: "remove_card_from_position",
			calldata: [squadId, cardId],
		};
	};

	const squad_removeCardFromPosition = async (snAccount: Account | AccountInterface, squadId: BigNumberish, cardId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_squad_removeCardFromPosition_calldata(squadId, cardId),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_squad_renameSquad_calldata = (squadId: BigNumberish, newName: BigNumberish): DojoCall => {
		return {
			contractName: "squad",
			entrypoint: "rename_squad",
			calldata: [squadId, newName],
		};
	};

	const squad_renameSquad = async (snAccount: Account | AccountInterface, squadId: BigNumberish, newName: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_squad_renameSquad_calldata(squadId, newName),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_squad_replaceCardToPosition_calldata = (squadId: BigNumberish, cardIdOne: BigNumberish, cardIdTwo: BigNumberish): DojoCall => {
		return {
			contractName: "squad",
			entrypoint: "replace_card_to_position",
			calldata: [squadId, cardIdOne, cardIdTwo],
		};
	};

	const squad_replaceCardToPosition = async (snAccount: Account | AccountInterface, squadId: BigNumberish, cardIdOne: BigNumberish, cardIdTwo: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_squad_replaceCardToPosition_calldata(squadId, cardIdOne, cardIdTwo),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_tmatch_createMatch_calldata = (homeSquadId: BigNumberish, matchId: BigNumberish): DojoCall => {
		return {
			contractName: "tmatch",
			entrypoint: "create_match",
			calldata: [homeSquadId, matchId],
		};
	};

	const tmatch_createMatch = async (snAccount: Account | AccountInterface, homeSquadId: BigNumberish, matchId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_tmatch_createMatch_calldata(homeSquadId, matchId),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_tmatch_joinMatch_calldata = (matchId: BigNumberish, awaySquadId: BigNumberish): DojoCall => {
		return {
			contractName: "tmatch",
			entrypoint: "join_match",
			calldata: [matchId, awaySquadId],
		};
	};

	const tmatch_joinMatch = async (snAccount: Account | AccountInterface, matchId: BigNumberish, awaySquadId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_tmatch_joinMatch_calldata(matchId, awaySquadId),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_tmatch_startMatch_calldata = (matchId: BigNumberish): DojoCall => {
		return {
			contractName: "tmatch",
			entrypoint: "start_match",
			calldata: [matchId],
		};
	};

	const tmatch_startMatch = async (snAccount: Account | AccountInterface, matchId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount as any,
				build_tmatch_startMatch_calldata(matchId),
				"touchline",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		actions: {
			commit: actions_commit,
			buildCommitCalldata: build_actions_commit_calldata,
			reveal: actions_reveal,
			buildRevealCalldata: build_actions_reveal_calldata,
			substitutePlayer: actions_substitutePlayer,
			buildSubstitutePlayerCalldata: build_actions_substitutePlayer_calldata,
			useTacticCard: actions_useTacticCard,
			buildUseTacticCardCalldata: build_actions_useTacticCard_calldata,
		},
		players: {
			createCard: players_createCard,
			buildCreateCardCalldata: build_players_createCard_calldata,
			createSpecialAbility: players_createSpecialAbility,
			buildCreateSpecialAbilityCalldata: build_players_createSpecialAbility_calldata,
			updateRarity: players_updateRarity,
			buildUpdateRarityCalldata: build_players_updateRarity_calldata,
			updateStats: players_updateStats,
			buildUpdateStatsCalldata: build_players_updateStats_calldata,
		},
		squad: {
			addCardToPosition: squad_addCardToPosition,
			buildAddCardToPositionCalldata: build_squad_addCardToPosition_calldata,
			calculateChemistry: squad_calculateChemistry,
			buildCalculateChemistryCalldata: build_squad_calculateChemistry_calldata,
			changeFormation: squad_changeFormation,
			buildChangeFormationCalldata: build_squad_changeFormation_calldata,
			createSquad: squad_createSquad,
			buildCreateSquadCalldata: build_squad_createSquad_calldata,
			removeCardFromPosition: squad_removeCardFromPosition,
			buildRemoveCardFromPositionCalldata: build_squad_removeCardFromPosition_calldata,
			renameSquad: squad_renameSquad,
			buildRenameSquadCalldata: build_squad_renameSquad_calldata,
			replaceCardToPosition: squad_replaceCardToPosition,
			buildReplaceCardToPositionCalldata: build_squad_replaceCardToPosition_calldata,
		},
		tmatch: {
			createMatch: tmatch_createMatch,
			buildCreateMatchCalldata: build_tmatch_createMatch_calldata,
			joinMatch: tmatch_joinMatch,
			buildJoinMatchCalldata: build_tmatch_joinMatch_calldata,
			startMatch: tmatch_startMatch,
			buildStartMatchCalldata: build_tmatch_startMatch_calldata,
		},
	};
}