import Phaser from 'phaser';
import { Team } from '@/core/types';

export class BaseStructure extends Phaser.GameObjects.Container {
  private health: number;
  private maxHealth: number;
  private team: Team;
  private healthBar: Phaser.GameObjects.Graphics;
  private bodyGraphics: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    team: Team,
    health: number = 500
  ) {
    super(scene, x, y);

    this.team = team;
    this.health = health;
    this.maxHealth = health;

    // Create base visual
    this.bodyGraphics = scene.add.graphics();
    const color = team === Team.PLAYER ? 0x4CAF50 : 0xF44336;
    this.bodyGraphics.fillStyle(color, 1);
    this.bodyGraphics.fillRect(-30, -80, 60, 160);
    this.add(this.bodyGraphics);

    // Create health bar
    this.healthBar = scene.add.graphics();
    this.add(this.healthBar);
    this.updateHealthBar();

    scene.add.existing(this);
  }

  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health < 0) this.health = 0;
    this.updateHealthBar();
  }

  private updateHealthBar(): void {
    this.healthBar.clear();
    
    // Background
    this.healthBar.fillStyle(0x000000, 0.5);
    this.healthBar.fillRect(-30, -100, 60, 10);

    // Health
    const healthPercent = this.health / this.maxHealth;
    const healthColor = healthPercent > 0.5 ? 0x00FF00 : healthPercent > 0.25 ? 0xFFFF00 : 0xFF0000;
    this.healthBar.fillStyle(healthColor, 1);
    this.healthBar.fillRect(-30, -100, 60 * healthPercent, 10);
  }

  isDestroyed(): boolean {
    return this.health <= 0;
  }

  getTeam(): Team {
    return this.team;
  }

  getHealth(): number {
    return this.health;
  }
}
