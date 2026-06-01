import {
  PaginationParams,
  PaginatedResult,
} from '../../../../shared/application/types/pagination.types';
import { FlashcardEntity } from '../entities/flashcard.entity';
import { FlashcardReviewEntity } from '../entities/flashcard-review.entity';

export interface FindPendingReviewsFilters {
  userId: string;
  groupId?: string;
}

export abstract class FlashcardReviewsRepository {
  abstract create(review: FlashcardReviewEntity): Promise<void>;

  abstract findPendingReviews(
    filters: FindPendingReviewsFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<FlashcardEntity>>;
}

export const FLASHCARD_REVIEWS_REPOSITORY = Symbol('FLASHCARD_REVIEWS_REPOSITORY');
