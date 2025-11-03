import Phaser from 'phaser';
import { Button } from '@/ui/Button';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // Title
    const title = this.add.text(width / 2, height / 3, 'LINE CLASH', {
      fontSize: '64px',
      color: '#4CAF50',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 3 + 70, 'Defend Your Base', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    subtitle.setOrigin(0.5);

    // Play button
    new Button(
      this,
      width / 2,
      height / 2 + 50,
      200,
      50,
      'PLAY',
      () => {
        this.scene.start('GameScene');
        this.scene.launch('UIScene');
      },
      0x4CAF50
    );

    // Instructions
    const instructions = this.add.text(
      width / 2,
      height - 100,
      'Spawn units to defend your base and destroy the enemy!\nEarn gold over time to spawn more units.',
      {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Arial',
        align: 'center'
      }
    );
    instructions.setOrigin(0.5);
  }
}
