import { WaveData } from '@/core/types';
import wavesDataJson from '@/data/waves.json';

export class WaveSystem {
  private waves: WaveData[];
  private currentWaveIndex: number = 0;
  private waveActive: boolean = false;
  private remainingBudget: number = 0;
  private lastSpawnTime: number = 0;

  constructor(_scene: Phaser.Scene) {
    this.waves = (wavesDataJson as any).waves;
  }

  startWave(): void {
    if (this.waveActive) return;
    
    const currentWave = this.getCurrentWave();
    if (!currentWave) return;

    this.waveActive = true;
    this.remainingBudget = currentWave.budget;
    this.lastSpawnTime = 0;
  }

  update(time: number): { shouldSpawn: boolean; budget: number } {
    if (!this.waveActive || this.remainingBudget <= 0) {
      return { shouldSpawn: false, budget: 0 };
    }

    const currentWave = this.getCurrentWave();
    if (!currentWave) {
      return { shouldSpawn: false, budget: 0 };
    }

    if (time - this.lastSpawnTime >= currentWave.spawnInterval) {
      this.lastSpawnTime = time;
      return { shouldSpawn: true, budget: this.remainingBudget };
    }

    return { shouldSpawn: false, budget: 0 };
  }

  spendBudget(cost: number): boolean {
    if (this.remainingBudget >= cost) {
      this.remainingBudget -= cost;
      if (this.remainingBudget <= 0) {
        this.endWave();
      }
      return true;
    }
    return false;
  }

  private endWave(): void {
    this.waveActive = false;
    this.currentWaveIndex++;
  }

  getCurrentWave(): WaveData | null {
    if (this.currentWaveIndex < this.waves.length) {
      return this.waves[this.currentWaveIndex];
    }
    // Loop back to first wave with increased difficulty
    return this.waves[this.currentWaveIndex % this.waves.length];
  }

  isWaveActive(): boolean {
    return this.waveActive;
  }

  getCurrentWaveNumber(): number {
    return this.currentWaveIndex + 1;
  }

  getRemainingBudget(): number {
    return this.remainingBudget;
  }
}
