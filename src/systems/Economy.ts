import { EconomyData } from '@/core/types';
import economyDataJson from '@/data/economy.json';

export class Economy {
  private gold: number;
  private goldPerTick: number;
  private goldTickRate: number;
  private lastTickTime: number = 0;

  constructor(_scene: Phaser.Scene) {
    const economyData = economyDataJson as EconomyData;
    this.gold = economyData.startingGold;
    this.goldPerTick = economyData.goldPerTick;
    this.goldTickRate = economyData.goldTickRate;
  }

  update(time: number): void {
    if (time - this.lastTickTime >= this.goldTickRate) {
      this.gold += this.goldPerTick;
      this.lastTickTime = time;
    }
  }

  canAfford(cost: number): boolean {
    return this.gold >= cost;
  }

  spend(cost: number): boolean {
    if (this.canAfford(cost)) {
      this.gold -= cost;
      return true;
    }
    return false;
  }

  addGold(amount: number): void {
    this.gold += amount;
  }

  getGold(): number {
    return this.gold;
  }

  getGoldPerTick(): number {
    return this.goldPerTick;
  }

  increaseGoldPerTick(amount: number): void {
    this.goldPerTick += amount;
  }
}
