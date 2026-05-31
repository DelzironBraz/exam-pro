import { SimulationAttemptAnswer as PrismaSimulationAttemptAnswer } from '../../../../generated/prisma';
import { SimulationAttemptAnswerEntity } from '../../domain/entities/simulation-attempt-answer.entity';

export class SimulationAttemptAnswerMapper {
  static toDomain(
    record: PrismaSimulationAttemptAnswer,
  ): SimulationAttemptAnswerEntity {
    return new SimulationAttemptAnswerEntity(
      record.id,
      record.attemptId,
      record.questionId,
      record.selectedAlternativeId,
      record.timeSpentSeconds,
      record.isCorrect,
      record.answeredAt,
    );
  }
}
