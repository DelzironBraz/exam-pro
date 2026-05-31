import { SimulationAttempt as PrismaSimulationAttempt } from '../../../../generated/prisma';
import { SimulationAttemptEntity } from '../../domain/entities/simulation-attempt.entity';

export class SimulationAttemptMapper {
  static toDomain(record: PrismaSimulationAttempt): SimulationAttemptEntity {
    return new SimulationAttemptEntity(
      record.id,
      record.simulationId,
      record.userId,
      record.startedAt,
      record.finishedAt,
      record.totalCorrect,
      record.totalWrong,
      record.totalTimeSeconds,
    );
  }
}
