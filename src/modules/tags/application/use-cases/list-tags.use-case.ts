import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export class ListTagsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
  ) {}

  async execute(): Promise<TagEntity[]> {
    this.logger.log(ListTagsUseCase.name, 'Listing tags');
    return this.tagsRepository.findMany();
  }
}
