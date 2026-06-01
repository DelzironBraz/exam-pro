import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export interface ListTagsInput {
  page?: number;
  limit?: number;
}

export class ListTagsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
  ) {}

  async execute(input?: ListTagsInput): Promise<PaginatedResult<TagEntity>> {
    this.logger.log(ListTagsUseCase.name, 'Listing tags');

    const pagination = resolvePagination(input);
    const [items, total] = await Promise.all([
      this.tagsRepository.findMany(pagination),
      this.tagsRepository.count(),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }
}
