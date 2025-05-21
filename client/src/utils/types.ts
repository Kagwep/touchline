import { Card } from "../dojogen/models.gen";

export type CardWithPosition = Card & { 
    positionIndex: number;
    chemistryBonus: number;
  };

  export const MatchStatus = {
      CREATED: "Created",
      WAITING_FOR_AWAY: "WaitingForAway",
      WAITING_TO_START:"WaitingToStart",
      IN_PROGRESS: "InProgress",
      HOME_WIN: "HomeWin",
      AWAY_WIN: "AwayWin",
      DRAW: "Draw",
      ABANDONED: "Abandoned",
      PENDINGREVEAL:"PendingReveal"
    };
  
export const ActionType = {
  NONE: "None",
  ATTACK: "Attack",
  DEFEND: "Defend",
  SPECIAL: "Special",
  SUBSTITUTE: "Substitute"
};
