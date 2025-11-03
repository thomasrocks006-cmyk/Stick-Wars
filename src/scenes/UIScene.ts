import Phaser from 'phaser';
import { Button } from '@/ui/Button';
import { Economy } from '@/systems/Economy';
import { UnitFactory } from '@/systems/UnitFactory';
import { WaveSystem } from '@/systems/WaveSystem';
import { GameScene } from './GameScene';

export class UIScene extends Phaser.Scene {
  private goldText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private unitButtons: Button[] = [];
  private economy!: Economy;
  private unitFactory!: UnitFactory;
  private waveSystem!: WaveSystem;
  private gameScene!: GameScene;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get references from registry
    this.economy = this.registry.get('economy');
    this.unitFactory = this.registry.get('unitFactory');
    this.gameScene = this.registry.get('gameScene');
    this.waveSystem = this.registry.get('waveSystem');

    // UI Background panel
    const panelHeight = 120;
    this.add.rectangle(0, height - panelHeight, width, panelHeight, 0x16213e, 0.9).setOrigin(0, 0);

    // Gold display
    this.goldText = this.add.text(20, height - panelHeight + 20, '', {
      fontSize: '24px',
      color: '#FFD700',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    });

    // Wave display
    this.waveText = this.add.text(20, height - panelHeight + 55, '', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });

    // Unit spawn buttons
    const units = this.unitFactory.getAllUnits();
    const buttonSpacing = 10;
    const buttonWidth = 140;
    const buttonHeight = 70;
    const startX = 250;

    units.slice(0, 5).forEach((unit, index) => {
      const x = startX + (buttonWidth + buttonSpacing) * index;
      const y = height - panelHeight / 2;

      const button = new Button(
        this,
        x,
        y,
        buttonWidth,
        buttonHeight,
        `${unit.name}\n${unit.cost}G`,
        () => {
          this.gameScene.spawnPlayerUnit(unit.id);
        },
        unit.color
      );

      this.unitButtons.push(button);
    });

    // Info text
    this.add.text(width - 200, height - panelHeight + 20, 'Controls:', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });

    this.add.text(width - 200, height - panelHeight + 45, 'Click buttons to\nspawn units', {
      fontSize: '12px',
      color: '#aaaaaa',
      fontFamily: 'Arial'
    });
  }

  update(): void {
    // Update gold display
    const gold = this.economy.getGold();
    const goldPerTick = this.economy.getGoldPerTick();
    this.goldText.setText(`Gold: ${Math.floor(gold)} (+${goldPerTick}/tick)`);

    // Update wave display
    const waveNumber = this.waveSystem.getCurrentWaveNumber();
    const waveActive = this.waveSystem.isWaveActive();
    const remainingBudget = this.waveSystem.getRemainingBudget();
    
    if (waveActive) {
      this.waveText.setText(`Wave ${waveNumber} - Remaining: ${Math.floor(remainingBudget)}`);
    } else {
      this.waveText.setText(`Wave ${waveNumber} - Next wave incoming...`);
    }

    // Update button states based on gold
    const units = this.unitFactory.getAllUnits();
    units.slice(0, 5).forEach((unit, index) => {
      if (this.unitButtons[index]) {
        const canAfford = this.economy.canAfford(unit.cost);
        this.unitButtons[index].setEnabled(canAfford);
      }
    });
  }
}
