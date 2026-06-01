import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export interface ListGroupTagsInput {
  groupId: string;
  page?: number;
  limit?: number;
}

export class ListGroupTagsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: ListGroupTagsInput): Promise<PaginatedResult<TagEntity>> {
    this.logger.log(ListGroupTagsUseCase.name, `Listing tags for group ${input.groupId}`);

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const pagination = resolvePagination(input);
    const [items, total] = await Promise.all([
      this.tagsRepository.findByGroupId(input.groupId, pagination),
      this.tagsRepository.countByGroupId(input.groupId),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }

  async executeAll(groupId: string): Promise<TagEntity[]> {
    const group = await this.groupsRepository.findById(groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    return this.tagsRepository.findAllByGroupId(groupId);
  }
}
