import { Card } from "../dojogen/models.gen";

export type CardWithPosition = Card & { 
    positionIndex: number;
    chemistryBonus: number;
  };

  export const MatchStatus = {
      CREATED: "Created",
      WAITING_FOR_AWAY: "WaitingForAway",
      IN_PROGRESS: "InProgress",
      HOME_WIN: "HomeWin",
      AWAY_WIN: "AwayWin",
      DRAW: "Draw",
      ABANDONED: "Abandoned"
    };
  