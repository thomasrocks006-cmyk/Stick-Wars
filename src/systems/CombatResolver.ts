import { Unit } from '@/entities/Unit';
import { BaseStructure } from '@/entities/BaseStructure';
import { Projectile } from '@/entities/Projectile';

export class CombatResolver {
  resolveUnitCombat(
    playerUnits: Unit[],
    enemyUnits: Unit[],
    time: number,
    delta: number,
    playerBase: BaseStructure,
    enemyBase: BaseStructure
  ): void {
    // Update player units
    for (const unit of playerUnits) {
      if (!unit.isDead()) {
        unit.update(time, delta, enemyUnits, enemyBase);
      }
    }

    // Update enemy units
    for (const unit of enemyUnits) {
      if (!unit.isDead()) {
        unit.update(time, delta, playerUnits, playerBase);
      }
    }
  }

  resolveProjectileCombat(
    projectiles: Projectile[],
    playerUnits: Unit[],
    enemyUnits: Unit[],
    time: number,
    delta: number
  ): void {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const projectile = projectiles[i];
      projectile.update(time, delta);

      // Check if projectile is destroyed or out of bounds
      if (!projectile.active || projectile.x < 0 || projectile.x > 1200) {
        projectiles.splice(i, 1);
        continue;
      }

      // Check collision with units
      const targetUnits = projectile.getTeam() === 'player' ? enemyUnits : playerUnits;
      for (const unit of targetUnits) {
        if (unit.isDead()) continue;

        const distance = Phaser.Math.Distance.Between(
          projectile.x,
          projectile.y,
          unit.x,
          unit.y
        );

        if (distance < 20) {
          unit.takeDamage(projectile.getDamage());
          projectile.destroy();
          projectiles.splice(i, 1);
          break;
        }
      }
    }
  }

  cleanupDeadUnits(units: Unit[]): void {
    for (let i = units.length - 1; i >= 0; i--) {
      if (units[i].isDead()) {
        units[i].destroy();
        units.splice(i, 1);
      }
    }
  }
}
