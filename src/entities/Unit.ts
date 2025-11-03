import Phaser from 'phaser';
import { UnitData, Team } from '@/core/types';
import { Projectile } from './Projectile';

export class Unit extends Phaser.GameObjects.Container {
  private unitData: UnitData;
  private team: Team;
  private health: number;
  private maxHealth: number;
  private target: Unit | null = null;
  private lastAttackTime: number = 0;
  private bodyGraphics: Phaser.GameObjects.Graphics;
  private healthBar: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    unitData: UnitData,
    team: Team
  ) {
    super(scene, x, y);

    this.unitData = unitData;
    this.team = team;
    this.health = unitData.health;
    this.maxHealth = unitData.health;

    // Create unit visual (stick figure style)
    this.bodyGraphics = scene.add.graphics();
    this.bodyGraphics.fillStyle(unitData.color, 1);
    this.bodyGraphics.fillCircle(0, -20, 8); // Head
    this.bodyGraphics.lineStyle(3, unitData.color);
    this.bodyGraphics.lineBetween(0, -12, 0, 5); // Body
    this.bodyGraphics.lineBetween(0, -5, -8, 5); // Left arm
    this.bodyGraphics.lineBetween(0, -5, 8, 5); // Right arm
    this.bodyGraphics.lineBetween(0, 5, -6, 20); // Left leg
    this.bodyGraphics.lineBetween(0, 5, 6, 20); // Right leg
    this.add(this.bodyGraphics);

    // Create health bar
    this.healthBar = scene.add.graphics();
    this.add(this.healthBar);
    this.updateHealthBar();

    scene.add.existing(this);
  }

  update(time: number, delta: number, enemies: Unit[], enemyBase?: any): void {
    if (this.health <= 0) return;

    // Find target
    if (!this.target || this.target.isDead()) {
      this.findTarget(enemies, enemyBase);
    }

    if (this.target) {
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.target.x,
        this.target.y
      );

      if (distance <= this.unitData.attackRange) {
        // Attack
        if (time - this.lastAttackTime >= this.unitData.attackSpeed) {
          this.attack(this.target);
          this.lastAttackTime = time;
        }
      } else {
        // Move towards target
        this.moveTowards(this.target, delta);
      }
    } else if (enemyBase) {
      // Move towards enemy base
      this.moveTowards(enemyBase, delta);
      
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        enemyBase.x,
        enemyBase.y
      );

      if (distance <= this.unitData.attackRange) {
        if (time - this.lastAttackTime >= this.unitData.attackSpeed) {
          this.attackBase(enemyBase);
          this.lastAttackTime = time;
        }
      }
    } else {
      // Move forward
      const direction = this.team === Team.PLAYER ? 1 : -1;
      this.x += (this.unitData.speed * delta * direction) / 1000;
    }
  }

  private findTarget(enemies: Unit[], _enemyBase?: any): void {
    let closestEnemy: Unit | null = null;
    let closestDistance = Infinity;

    for (const enemy of enemies) {
      if (enemy.isDead()) continue;
      
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        enemy.x,
        enemy.y
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = enemy;
      }
    }

    this.target = closestEnemy;
  }

  private moveTowards(_target: any, delta: number): void {
    const direction = this.team === Team.PLAYER ? 1 : -1;
    
    // Only move horizontally in the lane
    this.x += (this.unitData.speed * delta * direction) / 1000;
  }

  private attack(target: Unit): void {
    if (this.unitData.attackRange > 50) {
      // Ranged attack - spawn projectile
      const projectile = new Projectile(
        this.scene,
        this.x,
        this.y,
        new Phaser.Math.Vector2(target.x, target.y),
        this.unitData.damage,
        this.team
      );
      (this.scene as any).projectiles?.push(projectile);
    } else {
      // Melee attack - instant damage
      target.takeDamage(this.unitData.damage);
    }
  }

  private attackBase(base: any): void {
    base.takeDamage(this.unitData.damage);
  }

  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health < 0) this.health = 0;
    this.updateHealthBar();

    if (this.health <= 0) {
      this.die();
    }
  }

  private updateHealthBar(): void {
    this.healthBar.clear();
    
    // Background
    this.healthBar.fillStyle(0x000000, 0.5);
    this.healthBar.fillRect(-15, -30, 30, 4);

    // Health
    const healthPercent = this.health / this.maxHealth;
    const healthColor = healthPercent > 0.5 ? 0x00FF00 : healthPercent > 0.25 ? 0xFFFF00 : 0xFF0000;
    this.healthBar.fillStyle(healthColor, 1);
    this.healthBar.fillRect(-15, -30, 30 * healthPercent, 4);
  }

  private die(): void {
    this.setAlpha(0.3);
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  getTeam(): Team {
    return this.team;
  }

  getData(): UnitData {
    return this.unitData;
  }
}
