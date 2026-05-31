import { Question as PrismaQuestion } from '../../../../generated/prisma';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';

export class QuestionMapper {
  static toDomain(record: PrismaQuestion): QuestionEntity {
    return new QuestionEntity(
      record.id,
      record.statement,
      record.groupId,
      record.discipline,
      record.topic,
      record.difficulty as DifficultyLevel,
      record.explanation,
      record.createdBy,
      record.createdAt,
    );
  }
}
