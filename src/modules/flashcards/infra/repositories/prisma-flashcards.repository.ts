import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { FlashcardsRepository } from '../../domain/repositories/flashcards.repository';
import { FlashcardMapper } from '../prisma/flashcard.mapper';

@Injectable()
export class PrismaFlashcardsRepository
  extends PrismaRepository
  implements FlashcardsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(flashcard: FlashcardEntity): Promise<FlashcardEntity> {
    const created = await this.prisma.flashcard.create({
      data: {
        id: flashcard.id,
        groupId: flashcard.groupId,
        frontContent: flashcard.frontContent,
        backContent: flashcard.backContent,
        difficulty: flashcard.difficulty,
        createdBy: flashcard.createdBy,
        createdAt: flashcard.createdAt,
      },
    });
    return FlashcardMapper.toDomain(created);
  }

  async findById(id: string): Promise<FlashcardEntity | null> {
    const flashcard = await this.prisma.flashcard.findUnique({ where: { id } });
    return flashcard ? FlashcardMapper.toDomain(flashcard) : null;
  }

  async findManyByGroup(groupId: string): Promise<FlashcardEntity[]> {
    const flashcards = await this.prisma.flashcard.findMany({
      where: { groupId },
      orderBy: { createdAt: 'desc' },
    });
    return flashcards.map(FlashcardMapper.toDomain);
  }

  async update(flashcard: FlashcardEntity): Promise<FlashcardEntity> {
    const updated = await this.prisma.flashcard.update({
      where: { id: flashcard.id },
      data: {
        frontContent: flashcard.frontContent,
        backContent: flashcard.backContent,
        difficulty: flashcard.difficulty,
      },
    });
    return FlashcardMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.flashcard.delete({ where: { id } });
  }
}
