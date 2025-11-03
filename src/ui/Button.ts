import Phaser from 'phaser';

export class Button extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private text: Phaser.GameObjects.Text;
  private callback: () => void;
  private enabled: boolean = true;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    callback: () => void,
    color: number = 0x4CAF50
  ) {
    super(scene, x, y);

    this.callback = callback;

    // Background
    this.background = scene.add.graphics();
    this.background.fillStyle(color, 1);
    this.background.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
    this.background.lineStyle(2, 0xffffff, 0.5);
    this.background.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);
    this.add(this.background);

    // Text
    this.text = scene.add.text(0, 0, text, {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    this.text.setOrigin(0.5);
    this.add(this.text);

    // Make interactive
    this.setSize(width, height);
    this.setInteractive({ useHandCursor: true });

    this.on('pointerdown', () => {
      if (this.enabled) {
        this.callback();
      }
    });

    this.on('pointerover', () => {
      if (this.enabled) {
        this.background.clear();
        this.background.fillStyle(color, 0.8);
        this.background.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
        this.background.lineStyle(2, 0xffffff, 1);
        this.background.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);
      }
    });

    this.on('pointerout', () => {
      this.background.clear();
      this.background.fillStyle(color, this.enabled ? 1 : 0.5);
      this.background.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
      this.background.lineStyle(2, 0xffffff, 0.5);
      this.background.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);
    });

    scene.add.existing(this);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    const width = this.width;
    const height = this.height;
    const color = 0x4CAF50;
    
    this.background.clear();
    this.background.fillStyle(color, enabled ? 1 : 0.5);
    this.background.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
    this.background.lineStyle(2, 0xffffff, 0.5);
    this.background.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);
    
    this.text.setAlpha(enabled ? 1 : 0.5);
  }

  setText(text: string): void {
    this.text.setText(text);
  }
}
