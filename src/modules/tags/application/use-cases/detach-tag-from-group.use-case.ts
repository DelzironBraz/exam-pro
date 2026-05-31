import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export interface DetachTagFromGroupInput {
  tagId: string;
  groupId: string;
}

export class DetachTagFromGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: DetachTagFromGroupInput): Promise<void> {
    this.logger.log(
      DetachTagFromGroupUseCase.name,
      `Detaching tag ${input.tagId} from group ${input.groupId}`,
    );

    const tag = await this.tagsRepository.findById(input.tagId);
    if (!tag) {
      this.exceptionsService.notFoundException({ message: 'Tag not found' });
    }

    await this.tagsRepository.detachFromGroup(input.tagId, input.groupId);
  }
}
