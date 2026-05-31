import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { TagsRepository } from '../../../tags/domain/repositories/tags.repository';
import { GroupEntity } from '../../domain/entities/group.entity';
import { GroupsRepository } from '../../domain/repositories/groups.repository';

export interface GetGroupOutput {
  group: GroupEntity;
  tags: string[];
}

export class GetGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly groupsRepository: GroupsRepository,
    private readonly tagsRepository: TagsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<GetGroupOutput> {
    this.logger.log(GetGroupUseCase.name, `Getting group: ${id}`);

    const group = await this.groupsRepository.findById(id);
    if (!group) {
      this.exceptionsService.notFoundException({
        message: 'Group not found',
      });
    }

    const tags = await this.tagsRepository.findNamesByGroupId(id);

    return { group, tags };
  }
}
