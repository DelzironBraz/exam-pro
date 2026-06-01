import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import { resolvePagination } from '../../../../shared/application/utils/pagination.util';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { FlashcardReviewsRepository } from '../../domain/repositories/flashcard-reviews.repository';

export interface GetPendingFlashcardsInput {
  userId: string;
  groupId?: string;
  page?: number;
  limit?: number;
}

export class GetPendingFlashcardsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly flashcardReviewsRepository: FlashcardReviewsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(
    input: GetPendingFlashcardsInput,
  ): Promise<PaginatedResult<FlashcardEntity>> {
    this.logger.log(
      GetPendingFlashcardsUseCase.name,
      `Getting pending flashcards for user ${input.userId}`,
    );

    if (input.groupId) {
      const group = await this.groupsRepository.findById(input.groupId);
      if (!group) {
        this.exceptionsService.notFoundException({ message: 'Group not found' });
      }
    }

    const pagination = resolvePagination(input);
    return this.flashcardReviewsRepository.findPendingReviews(
      {
        userId: input.userId,
        groupId: input.groupId,
      },
      pagination,
    );
  }
}
