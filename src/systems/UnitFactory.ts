import { UnitData } from '@/core/types';
import unitsDataJson from '@/data/units.json';

export class UnitFactory {
  private unitsData: UnitData[];

  constructor() {
    this.unitsData = (unitsDataJson as any).units;
  }

  getUnitData(unitId: string): UnitData | undefined {
    return this.unitsData.find(unit => unit.id === unitId);
  }

  getAllUnits(): UnitData[] {
    return this.unitsData;
  }
}
