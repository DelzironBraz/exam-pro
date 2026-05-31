import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { SimulationAttemptAnswerEntity } from '../../domain/entities/simulation-attempt-answer.entity';
import { SimulationAttemptAnswersRepository } from '../../domain/repositories/simulation-attempt-answers.repository';
import { SimulationAttemptAnswerMapper } from '../prisma/simulation-attempt-answer.mapper';

@Injectable()
export class PrismaSimulationAttemptAnswersRepository
  extends PrismaRepository
  implements SimulationAttemptAnswersRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async upsert(
    answer: SimulationAttemptAnswerEntity,
  ): Promise<SimulationAttemptAnswerEntity> {
    const saved = await this.prisma.simulationAttemptAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId: answer.attemptId,
          questionId: answer.questionId,
        },
      },
      create: {
        id: answer.id,
        attemptId: answer.attemptId,
        questionId: answer.questionId,
        selectedAlternativeId: answer.selectedAlternativeId,
        timeSpentSeconds: answer.timeSpentSeconds,
        isCorrect: answer.isCorrect,
        answeredAt: answer.answeredAt,
      },
      update: {
        selectedAlternativeId: answer.selectedAlternativeId,
        timeSpentSeconds: answer.timeSpentSeconds,
        isCorrect: answer.isCorrect,
        answeredAt: answer.answeredAt,
      },
    });
    return SimulationAttemptAnswerMapper.toDomain(saved);
  }

  async findByAttemptId(attemptId: string): Promise<SimulationAttemptAnswerEntity[]> {
    const answers = await this.prisma.simulationAttemptAnswer.findMany({
      where: { attemptId },
      orderBy: { answeredAt: 'asc' },
    });
    return answers.map(SimulationAttemptAnswerMapper.toDomain);
  }

  async countByAttemptId(attemptId: string): Promise<{
    correct: number;
    wrong: number;
    totalTimeSeconds: number;
  }> {
    const answers = await this.prisma.simulationAttemptAnswer.findMany({
      where: { attemptId },
    });

    return {
      correct: answers.filter((a) => a.isCorrect).length,
      wrong: answers.filter((a) => !a.isCorrect).length,
      totalTimeSeconds: answers.reduce((sum, a) => sum + a.timeSpentSeconds, 0),
    };
  }
}
