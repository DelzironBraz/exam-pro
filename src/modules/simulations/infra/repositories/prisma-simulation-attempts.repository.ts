import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { SimulationAttemptEntity } from '../../domain/entities/simulation-attempt.entity';
import {
  FinishSimulationInput,
  SimulationAttemptsRepository,
} from '../../domain/repositories/simulation-attempts.repository';
import { SimulationAttemptMapper } from '../prisma/simulation-attempt.mapper';

@Injectable()
export class PrismaSimulationAttemptsRepository
  extends PrismaRepository
  implements SimulationAttemptsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(attempt: SimulationAttemptEntity): Promise<SimulationAttemptEntity> {
    const created = await this.prisma.simulationAttempt.create({
      data: {
        id: attempt.id,
        simulationId: attempt.simulationId,
        userId: attempt.userId,
        startedAt: attempt.startedAt,
        totalCorrect: attempt.totalCorrect,
        totalWrong: attempt.totalWrong,
        totalTimeSeconds: attempt.totalTimeSeconds,
      },
    });
    return SimulationAttemptMapper.toDomain(created);
  }

  async findById(id: string): Promise<SimulationAttemptEntity | null> {
    const attempt = await this.prisma.simulationAttempt.findUnique({ where: { id } });
    return attempt ? SimulationAttemptMapper.toDomain(attempt) : null;
  }

  async finish(
    attemptId: string,
    result: FinishSimulationInput,
  ): Promise<SimulationAttemptEntity> {
    const updated = await this.prisma.simulationAttempt.update({
      where: { id: attemptId },
      data: {
        finishedAt: new Date(),
        totalCorrect: result.totalCorrect,
        totalWrong: result.totalWrong,
        totalTimeSeconds: result.totalTimeSeconds,
      },
    });
    return SimulationAttemptMapper.toDomain(updated);
  }
}
