import Phaser from 'phaser';
import { Team } from '@/core/types';

export class Projectile extends Phaser.GameObjects.Graphics {
  private target: Phaser.Math.Vector2;
  private speed: number = 300;
  private damage: number;
  private team: Team;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Phaser.Math.Vector2,
    damage: number,
    team: Team
  ) {
    super(scene);
    
    this.x = x;
    this.y = y;
    this.target = target;
    this.damage = damage;
    this.team = team;

    // Draw projectile
    const color = team === Team.PLAYER ? 0xFFFF00 : 0xFF0000;
    this.fillStyle(color, 1);
    this.fillCircle(0, 0, 4);

    scene.add.existing(this);
  }

  update(_time: number, delta: number): void {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      this.destroy();
      return;
    }

    const moveDistance = (this.speed * delta) / 1000;
    const ratio = moveDistance / distance;

    this.x += dx * ratio;
    this.y += dy * ratio;
  }

  getDamage(): number {
    return this.damage;
  }

  getTeam(): Team {
    return this.team;
  }
}
