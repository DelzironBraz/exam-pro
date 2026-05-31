import { QuestionAnswer as PrismaQuestionAnswer } from '../../../../generated/prisma';
import { QuestionAnswerEntity } from '../../domain/entities/question-answer.entity';

export class QuestionAnswerMapper {
  static toDomain(record: PrismaQuestionAnswer): QuestionAnswerEntity {
    return new QuestionAnswerEntity(
      record.id,
      record.userId,
      record.questionId,
      record.selectedAlternativeId,
      record.timeSpentSeconds,
      record.isCorrect,
      record.createdAt,
    );
  }
}
