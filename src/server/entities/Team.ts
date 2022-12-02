import { GroupStickRespect, PickOrder, PlayerAbductionSetting, TeamJoinSetting, TeamSettings, WeightType } from "shared/teams/TeamTypes";
import { Entity } from "./Entity";
import { Player } from "./Player";

const DEFAULT_MERGE_SETTINGS: TeamSettings = {
  name: "Players",
  color: 0x2afa23,

  joinSetting: TeamJoinSetting.JOINABLE,

  balanceType: WeightType.WEIGHT,
  balanceWeight: 1,

  requiredPlayersType: WeightType.WEIGHT,
  requiredPlayersWeight: 0,

  maxPlayersType: WeightType.PERCENTAGE,
  maxPlayersWeight: 1,

  playerAbductionSetting: PlayerAbductionSetting.NON_TEAMED,
  pickOrder: PickOrder.LATEST_PLAYERS,
  groupStickRespect: GroupStickRespect.RESPECT_GROUP_STICK,

  hiddenPlayers: false,
  canTeamChat: true,

  ephemeral: false
}

export const DEFAULT_TEAM_SETTINGS: TeamSettings = {
  name: "Players",
  color: 0x2afa23,

  canTeamChat: false
}

export class Team implements Entity, TeamSettings {
  name: string;
  color: number;
  joinSetting: TeamJoinSetting;
  balanceType: WeightType;
  balanceWeight: number;
  requiredPlayersType: WeightType;
  requiredPlayersWeight: number;
  maxPlayersType: WeightType;
  maxPlayersWeight: number;
  playerAbductionSetting: PlayerAbductionSetting;
  pickOrder: PickOrder;
  groupStickRespect: GroupStickRespect;
  hiddenPlayers: boolean;
  canTeamChat: boolean;
  ephemeral: boolean;

  players: Player[];
  queue: Player[];

  constructor(teamSettings: TeamSettings) {
    // is this really the best way to do this?
    this.name = teamSettings.name || DEFAULT_MERGE_SETTINGS.name;
    this.color = teamSettings.color || DEFAULT_MERGE_SETTINGS.color;
    this.joinSetting = teamSettings.joinSetting || DEFAULT_MERGE_SETTINGS.joinSetting;
    this.balanceType = teamSettings.balanceType || DEFAULT_MERGE_SETTINGS.balanceType;
    this.balanceWeight = teamSettings.balanceWeight || DEFAULT_MERGE_SETTINGS.balanceWeight;
    this.requiredPlayersType = teamSettings.requiredPlayersType || DEFAULT_MERGE_SETTINGS.requiredPlayersType;
    this.requiredPlayersWeight = teamSettings.requiredPlayersWeight || DEFAULT_MERGE_SETTINGS.requiredPlayersWeight;
    this.maxPlayersType = teamSettings.maxPlayersType || DEFAULT_MERGE_SETTINGS.maxPlayersType;
    this.maxPlayersWeight = teamSettings.maxPlayersWeight || DEFAULT_MERGE_SETTINGS.maxPlayersWeight;
    this.playerAbductionSetting = teamSettings.playerAbductionSetting || DEFAULT_MERGE_SETTINGS.playerAbductionSetting;
    this.pickOrder = teamSettings.pickOrder || DEFAULT_MERGE_SETTINGS.pickOrder;
    this.groupStickRespect = teamSettings.groupStickRespect || DEFAULT_MERGE_SETTINGS.groupStickRespect;
    this.hiddenPlayers = teamSettings.hiddenPlayers || DEFAULT_MERGE_SETTINGS.hiddenPlayers;
    this.canTeamChat = teamSettings.canTeamChat || DEFAULT_MERGE_SETTINGS.canTeamChat;
    this.ephemeral = teamSettings.ephemeral || DEFAULT_MERGE_SETTINGS.ephemeral;

    this.players = [];
    this.queue = [];
  }

  getPlayers(): Player[] {
    return this.players;
  }

  hasPlayer(player: Player) {
    return this.players.includes(player);
  }

  unsafeAddPlayer(player: Player) {
    this.players.push(player);
  }

  unsafeRemovePlayer(player: Player) {
    let index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
    }
  }

  isInQueue(player: Player) {
    return this.queue.includes(player);
  }

  unsafeAddToQueue(player: Player) {
    this.queue.push(player);
  }

  unsafeRemoveFromQueue(player: Player) {
    let index = this.queue.indexOf(player);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
  }

  // partials might be cool, but i don't think they're worth it.
  // they would function as so:
  /*
  {
    data: {
      name: this.name,
      color: this.color,
      joinSetting: this.joinSetting
    },
    partial: [
      {
        users: (player) => {
          reutnr player.isHost(); or some shit
        },
        data: {
          balanceType: this.balanceType,
          balanceWeight: this.balanceWeight,
          requiredPlayersType: ... etc
        }
      }
    ]
  }
  */

  getJSON() {
    return {
      name: this.name,
      color: this.color,

      joinSetting: this.joinSetting,
      balanceType: this.balanceType,
      balanceWeight: this.balanceWeight,
      requiredPlayersType: this.requiredPlayersType,
      requiredPlayersWeight: this.requiredPlayersWeight,
      maxPlayersType: this.maxPlayersType,
      maxPlayersWeight: this.maxPlayersWeight,
      playerAbductionSetting: this.playerAbductionSetting,
      pickOrder: this.pickOrder,
      groupStickRespect: this.groupStickRespect,
      hiddenPlayers: this.hiddenPlayers,
      canTeamChat: this.canTeamChat,
      ephemeral: this.ephemeral,

      // old one didn't send balance percentage - only send client relevant data
      // i guess the host does need to know it though

      players: this.hiddenPlayers ? undefined : this.players.length,
      queue: this.hiddenPlayers ? undefined : this.queue.length
    }
  }
}