import { UnitFactory } from './UnitFactory';
import { WaveSystem } from './WaveSystem';
import { Unit } from '@/entities/Unit';
import { Team } from '@/core/types';

export class EnemyAI {
  private unitFactory: UnitFactory;
  private waveSystem: WaveSystem;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, unitFactory: UnitFactory, waveSystem: WaveSystem) {
    this.scene = scene;
    this.unitFactory = unitFactory;
    this.waveSystem = waveSystem;
  }

  update(time: number, enemyUnits: Unit[], spawnX: number, spawnY: number): void {
    const spawnInfo = this.waveSystem.update(time);
    
    if (spawnInfo.shouldSpawn && spawnInfo.budget > 0) {
      this.spawnEnemyUnit(enemyUnits, spawnX, spawnY, spawnInfo.budget);
    }
  }

  private spawnEnemyUnit(enemyUnits: Unit[], x: number, y: number, budget: number): void {
    const availableUnits = this.unitFactory.getAllUnits().filter(u => u.cost <= budget);
    
    if (availableUnits.length === 0) return;

    // Simple AI: randomly pick from affordable units
    const selectedUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    
    if (this.waveSystem.spendBudget(selectedUnit.cost)) {
      const unit = new Unit(this.scene, x, y, selectedUnit, Team.ENEMY);
      enemyUnits.push(unit);
    }
  }

  startWave(): void {
    this.waveSystem.startWave();
  }

  isWaveActive(): boolean {
    return this.waveSystem.isWaveActive();
  }
}
