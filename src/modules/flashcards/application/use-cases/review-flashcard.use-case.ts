import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { FlashcardReviewEntity } from '../../domain/entities/flashcard-review.entity';
import { FlashcardReviewsRepository } from '../../domain/repositories/flashcard-reviews.repository';
import { FlashcardsRepository } from '../../domain/repositories/flashcards.repository';
import {
  isValidReviewScore,
  reviewScoreRangeMessage,
} from '../utils/validate-review-score.util';

export interface ReviewFlashcardInput {
  flashcardId: string;
  userId: string;
  score: number;
}

export class ReviewFlashcardUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly flashcardsRepository: FlashcardsRepository,
    private readonly flashcardReviewsRepository: FlashcardReviewsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: ReviewFlashcardInput): Promise<void> {
    this.logger.log(
      ReviewFlashcardUseCase.name,
      `Reviewing flashcard ${input.flashcardId}`,
    );

    if (!isValidReviewScore(input.score)) {
      this.exceptionsService.badRequestException({
        message: reviewScoreRangeMessage(),
      });
    }

    const flashcard = await this.flashcardsRepository.findById(input.flashcardId);
    if (!flashcard) {
      this.exceptionsService.notFoundException({ message: 'Flashcard not found' });
    }

    await this.flashcardReviewsRepository.create(
      new FlashcardReviewEntity(
        randomUUID(),
        input.flashcardId,
        input.userId,
        input.score,
        new Date(),
      ),
    );
  }
}
