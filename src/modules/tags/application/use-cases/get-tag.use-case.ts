import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export class GetTagUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<TagEntity> {
    this.logger.log(GetTagUseCase.name, `Getting tag: ${id}`);

    const tag = await this.tagsRepository.findById(id);
    if (!tag) {
      this.exceptionsService.notFoundException({ message: 'Tag not found' });
    }

    return tag;
  }
}
