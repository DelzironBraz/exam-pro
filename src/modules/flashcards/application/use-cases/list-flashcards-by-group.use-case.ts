import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { FlashcardsRepository } from '../../domain/repositories/flashcards.repository';

export interface ListFlashcardsByGroupInput {
  groupId: string;
  page?: number;
  limit?: number;
}

export class ListFlashcardsByGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly flashcardsRepository: FlashcardsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: ListFlashcardsByGroupInput): Promise<PaginatedResult<FlashcardEntity>> {
    this.logger.log(
      ListFlashcardsByGroupUseCase.name,
      `Listing flashcards for group ${input.groupId}`,
    );

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const pagination = resolvePagination(input);
    const [items, total] = await Promise.all([
      this.flashcardsRepository.findManyByGroup(input.groupId, pagination),
      this.flashcardsRepository.countByGroup(input.groupId),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }
}
