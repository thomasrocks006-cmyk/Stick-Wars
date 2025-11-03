export interface UnitData {
  id: string;
  name: string;
  cost: number;
  health: number;
  damage: number;
  speed: number;
  attackRange: number;
  attackSpeed: number;
  color: number;
}

export interface WaveData {
  id: number;
  budget: number;
  spawnInterval: number;
  difficulty: number;
}

export interface EconomyData {
  startingGold: number;
  goldTickRate: number;
  goldPerTick: number;
  baseHealth: number;
}

export interface UpgradeData {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: {
    type: string;
    value: number;
  };
}

export enum Team {
  PLAYER = 'player',
  ENEMY = 'enemy'
}

export interface GameConfig {
  width: number;
  height: number;
  laneY: number;
  playerBaseX: number;
  enemyBaseX: number;
}
