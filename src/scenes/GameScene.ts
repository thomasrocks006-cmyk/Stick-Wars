import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '@/core/config';
import { Unit } from '@/entities/Unit';
import { BaseStructure } from '@/entities/BaseStructure';
import { Projectile } from '@/entities/Projectile';
import { Team } from '@/core/types';
import { Economy } from '@/systems/Economy';
import { UnitFactory } from '@/systems/UnitFactory';
import { WaveSystem } from '@/systems/WaveSystem';
import { EnemyAI } from '@/systems/EnemyAI';
import { CombatResolver } from '@/systems/CombatResolver';

export class GameScene extends Phaser.Scene {
  private playerUnits: Unit[] = [];
  private enemyUnits: Unit[] = [];
  public projectiles: Projectile[] = [];
  
  private playerBase!: BaseStructure;
  private enemyBase!: BaseStructure;
  
  private economy!: Economy;
  private unitFactory!: UnitFactory;
  private waveSystem!: WaveSystem;
  private enemyAI!: EnemyAI;
  private combatResolver!: CombatResolver;
  
  private gameOver: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Background
    this.add.rectangle(0, 0, GAME_CONFIG.width, GAME_CONFIG.height, COLORS.BACKGROUND).setOrigin(0);

    // Lane
    this.add.rectangle(0, GAME_CONFIG.laneY - 40, GAME_CONFIG.width, 80, COLORS.LANE).setOrigin(0, 0);
    this.add.line(0, 0, 0, GAME_CONFIG.laneY - 40, GAME_CONFIG.width, GAME_CONFIG.laneY - 40, 0xffffff, 0.3).setOrigin(0);
    this.add.line(0, 0, 0, GAME_CONFIG.laneY + 40, GAME_CONFIG.width, GAME_CONFIG.laneY + 40, 0xffffff, 0.3).setOrigin(0);

    // Initialize systems
    this.economy = new Economy(this);
    this.unitFactory = new UnitFactory();
    this.waveSystem = new WaveSystem(this);
    this.enemyAI = new EnemyAI(this, this.unitFactory, this.waveSystem);
    this.combatResolver = new CombatResolver();

    // Create bases
    this.playerBase = new BaseStructure(
      this,
      GAME_CONFIG.playerBaseX,
      GAME_CONFIG.laneY,
      Team.PLAYER
    );

    this.enemyBase = new BaseStructure(
      this,
      GAME_CONFIG.enemyBaseX,
      GAME_CONFIG.laneY,
      Team.ENEMY
    );

    // Start first wave after a delay
    this.time.delayedCall(3000, () => {
      if (!this.gameOver) {
        this.enemyAI.startWave();
      }
    });

    // Expose scene data for UI
    this.registry.set('economy', this.economy);
    this.registry.set('unitFactory', this.unitFactory);
    this.registry.set('gameScene', this);
    this.registry.set('waveSystem', this.waveSystem);
  }

  update(time: number, delta: number): void {
    if (this.gameOver) return;

    // Update economy
    this.economy.update(time);

    // Update enemy AI
    this.enemyAI.update(time, this.enemyUnits, GAME_CONFIG.enemyBaseX, GAME_CONFIG.laneY);

    // Resolve combat
    this.combatResolver.resolveUnitCombat(
      this.playerUnits,
      this.enemyUnits,
      time,
      delta,
      this.playerBase,
      this.enemyBase
    );

    this.combatResolver.resolveProjectileCombat(
      this.projectiles,
      this.playerUnits,
      this.enemyUnits,
      time,
      delta
    );

    // Cleanup dead units
    this.combatResolver.cleanupDeadUnits(this.playerUnits);
    this.combatResolver.cleanupDeadUnits(this.enemyUnits);

    // Check win/loss conditions
    if (this.playerBase.isDestroyed()) {
      this.endGame(false);
    } else if (this.enemyBase.isDestroyed()) {
      this.endGame(true);
    }

    // Auto-start next wave when current wave is complete
    if (!this.enemyAI.isWaveActive() && this.enemyUnits.length === 0) {
      this.time.delayedCall(5000, () => {
        if (!this.gameOver && !this.enemyAI.isWaveActive()) {
          this.enemyAI.startWave();
        }
      });
    }
  }

  spawnPlayerUnit(unitId: string): void {
    const unitData = this.unitFactory.getUnitData(unitId);
    if (!unitData) return;

    if (this.economy.spend(unitData.cost)) {
      const unit = new Unit(
        this,
        GAME_CONFIG.playerBaseX + 50,
        GAME_CONFIG.laneY,
        unitData,
        Team.PLAYER
      );
      this.playerUnits.push(unit);
    }
  }

  private endGame(victory: boolean): void {
    this.gameOver = true;
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Dim overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0).setDepth(1000);

    // Result text
    const resultText = victory ? 'VICTORY!' : 'DEFEAT!';
    const resultColor = victory ? '#4CAF50' : '#F44336';
    
    const text = this.add.text(width / 2, height / 2 - 50, resultText, {
      fontSize: '64px',
      color: resultColor,
      fontFamily: 'Arial',
      fontStyle: 'bold'
    });
    text.setOrigin(0.5).setDepth(1001);

    // Return to menu button
    const returnText = this.add.text(width / 2, height / 2 + 50, 'Return to Menu', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    returnText.setOrigin(0.5).setDepth(1001);
    returnText.setInteractive({ useHandCursor: true });
    returnText.on('pointerdown', () => {
      this.scene.stop('UIScene');
      this.scene.start('MainMenuScene');
    });
  }

  getPlayerUnits(): Unit[] {
    return this.playerUnits;
  }

  getEnemyUnits(): Unit[] {
    return this.enemyUnits;
  }
}
