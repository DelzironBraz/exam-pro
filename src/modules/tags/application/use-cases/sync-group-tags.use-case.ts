import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export interface SyncGroupTagsInput {
  groupId: string;
  tagNames: string[];
}

export class SyncGroupTagsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: SyncGroupTagsInput): Promise<TagEntity[]> {
    this.logger.log(
      SyncGroupTagsUseCase.name,
      `Syncing tags for group ${input.groupId}`,
    );

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    await this.tagsRepository.syncGroupTags(input.groupId, input.tagNames);
    return this.tagsRepository.findAllByGroupId(input.groupId);
  }
}
