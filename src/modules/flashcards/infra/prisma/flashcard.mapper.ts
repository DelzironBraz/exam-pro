import { Flashcard as PrismaFlashcard } from '../../../../generated/prisma';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';

export class FlashcardMapper {
  static toDomain(record: PrismaFlashcard): FlashcardEntity {
    return new FlashcardEntity(
      record.id,
      record.groupId,
      record.frontContent,
      record.backContent,
      record.difficulty,
      record.createdBy,
      record.createdAt,
    );
  }
}
