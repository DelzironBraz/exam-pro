import { Alternative as PrismaAlternative } from '../../../../generated/prisma';
import { AlternativeEntity } from '../../domain/entities/alternative.entity';

export class AlternativeMapper {
  static toDomain(record: PrismaAlternative): AlternativeEntity {
    return new AlternativeEntity(
      record.id,
      record.questionId,
      record.label,
      record.content,
      record.isCorrect,
    );
  }
}
