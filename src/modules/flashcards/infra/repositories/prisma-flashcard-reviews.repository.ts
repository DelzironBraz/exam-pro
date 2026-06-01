import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import { paginateInMemory } from '../../../../shared/application/utils/pagination.util';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { FlashcardReviewEntity } from '../../domain/entities/flashcard-review.entity';
import {
  FindPendingReviewsFilters,
  FlashcardReviewsRepository,
} from '../../domain/repositories/flashcard-reviews.repository';
import { FlashcardMapper } from '../prisma/flashcard.mapper';

/** Horas até revisar novamente quando o score da última revisão foi bom (>= 3). */
const REVIEW_INTERVAL_HOURS = 24;

@Injectable()
export class PrismaFlashcardReviewsRepository
  extends PrismaRepository
  implements FlashcardReviewsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(review: FlashcardReviewEntity): Promise<void> {
    await this.prisma.flashcardReview.create({
      data: {
        id: review.id,
        flashcardId: review.flashcardId,
        userId: review.userId,
        score: review.score,
        reviewedAt: review.reviewedAt,
      },
    });
  }

  async findPendingReviews(
    filters: FindPendingReviewsFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<FlashcardEntity>> {
    const flashcards = await this.prisma.flashcard.findMany({
      where: { groupId: filters.groupId },
      include: {
        reviews: {
          where: { userId: filters.userId },
          orderBy: { reviewedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const now = Date.now();

    const pending = flashcards
      .filter((card) => this.isPending(card.reviews[0], now))
      .map((card) => FlashcardMapper.toDomain(card));

    return paginateInMemory(pending, pagination);
  }

  private isPending(
    lastReview: { score: number; reviewedAt: Date } | undefined,
    now: number,
  ): boolean {
    if (!lastReview) {
      return true;
    }

    if (lastReview.score < 3) {
      return true;
    }

    const hoursSince =
      (now - lastReview.reviewedAt.getTime()) / (1000 * 60 * 60);

    return hoursSince >= REVIEW_INTERVAL_HOURS;
  }
}
