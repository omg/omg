export enum GroupStickRespect {
  IGNORE_GROUP_STICK,
  RESPECT_GROUP_STICK
}

export enum PickOrder {
  RANDOM,
  LATEST_PLAYERS // this means that the latest players to join teams will be the first to be picked randomly
}

export enum PlayerAbductionSetting {
  ANY_PLAYER,
  NON_TEAMED,
}

export enum TeamJoinSetting {
  JOINABLE,
  QUEUEABLE,
  LOCKED
}

export enum WeightType {
  PERCENTAGE,
  WEIGHT
}

export type TeamSettings = {
  name?: string;
  color?: number;

  joinSetting?: TeamJoinSetting;

  balanceType?: WeightType;
  balanceWeight?: number;

  requiredPlayersType?: WeightType;
  requiredPlayersWeight?: number;

  maxPlayersType?: WeightType;
  maxPlayersWeight?: number;
  
  playerAbductionSetting?: PlayerAbductionSetting;
  pickOrder?: PickOrder;
  groupStickRespect?: GroupStickRespect;
  
  hiddenPlayers?: boolean;
  canTeamChat?: boolean;

  ephemeral?: boolean;
}