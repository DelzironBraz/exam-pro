import { ExamAttempt as PrismaExamAttempt } from '../../../../generated/prisma';
import { ExamAttemptEntity } from '../../domain/entities/exam-attempt.entity';

export class ExamAttemptMapper {
  static toDomain(record: PrismaExamAttempt): ExamAttemptEntity {
    return new ExamAttemptEntity(
      record.id,
      record.examId,
      record.userId,
      record.startedAt,
      record.finishedAt,
      record.score,
      record.totalCorrect,
      record.totalWrong,
      record.totalTimeSeconds,
    );
  }
}
