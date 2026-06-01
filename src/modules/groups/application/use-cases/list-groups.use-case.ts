import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupEntity } from '../../domain/entities/group.entity';
import { GroupType } from '../../domain/enums/group-type.enum';
import { GroupVisibility } from '../../domain/enums/group-visibility.enum';
import { GroupsRepository } from '../../domain/repositories/groups.repository';

export interface ListGroupsInput {
  type?: GroupType;
  visibility?: GroupVisibility;
  ownerId?: string;
  page?: number;
  limit?: number;
}

export class ListGroupsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly groupsRepository: GroupsRepository,
  ) {}

  async execute(input?: ListGroupsInput): Promise<PaginatedResult<GroupEntity>> {
    this.logger.log(ListGroupsUseCase.name, 'Listing groups');

    const pagination = resolvePagination(input);
    const filters = {
      type: input?.type,
      visibility: input?.visibility,
      ownerId: input?.ownerId,
    };

    const [items, total] = await Promise.all([
      this.groupsRepository.findMany(filters, pagination),
      this.groupsRepository.count(filters),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }
}
