import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export interface AttachTagToGroupInput {
  tagId: string;
  groupId: string;
}

export class AttachTagToGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: AttachTagToGroupInput): Promise<void> {
    this.logger.log(
      AttachTagToGroupUseCase.name,
      `Attaching tag ${input.tagId} to group ${input.groupId}`,
    );

    const [tag, group] = await Promise.all([
      this.tagsRepository.findById(input.tagId),
      this.groupsRepository.findById(input.groupId),
    ]);

    if (!tag) {
      this.exceptionsService.notFoundException({ message: 'Tag not found' });
    }

    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    await this.tagsRepository.attachToGroup(input.tagId, input.groupId);
  }
}
