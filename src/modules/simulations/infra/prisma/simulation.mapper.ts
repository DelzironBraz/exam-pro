import { Simulation as PrismaSimulation } from '../../../../generated/prisma';
import { SimulationEntity } from '../../domain/entities/simulation.entity';
import { TimerMode } from '../../domain/enums/timer-mode.enum';

export class SimulationMapper {
  static toDomain(record: PrismaSimulation): SimulationEntity {
    return new SimulationEntity(
      record.id,
      record.title,
      record.description,
      record.groupId,
      record.timerMode as TimerMode,
      record.durationMinutes,
      record.createdBy,
      record.createdAt,
    );
  }
}
