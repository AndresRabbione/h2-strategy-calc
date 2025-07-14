import { Objective } from "./classDefinitions";

export type Cost = {
  id: string;
  itemMixId: number;
  targetValue: number;
  currentValue: number;
  deltaPerSecond: number;
  maxDonationAmount: number;
  maxDonationPeriodSeconds: number;
};

export type TacticalAction = {
  id32: number;
  mediaId32: number;
  name: string;
  description: string;
  strategicDescription: string;
  status: number;
  statusExpireAtWarTimeSeconds: number;
  cost: Cost[];
  effectIds: number[];
  activeEffectIds: number[];
};

export type SpaceStation = {
  id32: number;
  planetIndex: number;
  lastElectionId: string;
  currentElectionId: string;
  currentElectionEndWarTime: number;
  flags: 1;
  tacticalActions: TacticalAction[];
};

export type Reward = {
  type: number;
  id32: number;
  amount: number;
};

export type Task = {
  type: number;
  values: number[];
  valueTypes: number[];
};

export type MOSetting = {
  type: number;
  overrideTitle: string;
  overrideBrief: string;
  tasks: Task[];
  rewards: Reward[];
  reward: Reward;
  flags: number;
};

export type MajorOrder = {
  id32: number;
  startTime: number;
  progress: number[];
  expiresIn: number;
  setting: MOSetting;
};

export enum Factions {
  // Confirmed, used for planet data as the v1 endpoints use the names instead of ids
  HUMANS = "Humans",
  TERMINIDS = "Terminids",
  AUTOMATONS = "Automaton",
  ILLUMINATE = "Illuminate",
}

export enum FactionIDs {
  //Confirmed, used for MO parsing as the /raw endpoints use ids, not names
  HUMANS = 1,
  TERMINIDS = 2,
  AUTOMATONS = 3,
  ILLUMINATE = 4,
}

export enum RegionSizes {
  SETTLEMENT = "Settlement",
  TOWN = "Town",
  CITY = "City",
  MEGACITY = "MegaCity",
}

export type SupplyLines = {
  [planetName: string]: {
    index: number;
    links: { name: string; index: number }[];
    disabled: boolean;
  };
};

export type Biome = {
  name: string;
  description: string;
};

export type Hazard = {
  name: string;
  description: string;
};

export type GameEvent = {
  id: number;
  eventType: number;
  faction: string;
  health: number;
  maxHealth: number;
  startTime: string;
  endTime: string;
  campaignId: number;
  jointOperationIds: number[];
};

export type Statistics = {
  missionsWon: number;
  missionsLost: number;
  missionTime: number;
  terminidKills: number;
  automatonKills: number;
  illuminateKills: number;
  bulletsFired: number;
  bulletsHit: number;
  timePlayed: number;
  deaths: number;
  revives: number;
  friendlies: number;
  missionSuccessRate: number;
  accuracy: number;
  playerCount: number;
};

export type Region = {
  id: number;
  hash: number;
  name: string;
  description: number;
  health: number;
  maxHealth: number;
  size: RegionSizes;
  regenPerSecond: number;
  availabilityFactor: number | null;
  isAvailable: boolean;
  players: number;
};

export type Planet = {
  index: number;
  name: string;
  sector: string;
  biome: Biome;
  hazards: Hazard[];
  hash: number;
  position: { x: number; y: number };
  waypoints: number[];
  maxHealth: number;
  health: number;
  disabled: boolean;
  initialOwner: Factions;
  currentOwner: Factions;
  regenPerSecond: number;
  event: GameEvent | null;
  statistics: Statistics;
  attacking: number[];
  regions: Region[];
};

export type PriorityTable = {};

export enum ObjectiveTypes {
  //TODO: FIND THE IDS
  HOLD = 13,
  LIBERATE = 11, //Not sure about this one
  OPERATIONS = 9,
  KILL = 3, //Not sure about this one
  COLLECT,
  DEFEND_AMOUNT,
  LIBERATE_MORE,
  DEFEND = 12, //Not sure about this one
}

export enum ValueTypes {
  TARGET_FACTION = 1, //Not sure about this one
  AMOUNT = 3,
  LIBERATION_REQUIRED = 11, //Not sure about this one
  PLANET_ID = 12,
  DIFFICULTY = 9,
  ENEMY,
  ITEM,
}

export enum Enemies {
  CHARGER,
  BILE_TITAN,
  HULK,
}

export enum EnemyIds {
  CHARGER,
  BILE_TITAN,
  HULK,
}
//TODO: Needs filling as data comes in, in the future

export enum Items {
  COMMON,
  RARE,
  SUPER_RARE,
}

export enum ItemIds {
  COMMON,
  RARE,
  SUPER_RARE,
}

export type ParsedMO = {
  id: number;
  endDate: Date;
  timeRemaining: number;
  objectives: Objective[];
};
