import { ExamAttemptAnswer as PrismaExamAttemptAnswer } from '../../../../generated/prisma';
import { ExamAttemptAnswerEntity } from '../../domain/entities/exam-attempt-answer.entity';

export class ExamAttemptAnswerMapper {
  static toDomain(record: PrismaExamAttemptAnswer): ExamAttemptAnswerEntity {
    return new ExamAttemptAnswerEntity(
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
