import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';
import { normalizeTagName } from '../utils/normalize-tag-name.util';

export interface CreateTagInput {
  name: string;
}

export class CreateTagUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: CreateTagInput): Promise<TagEntity> {
    this.logger.log(CreateTagUseCase.name, `Creating tag: ${input.name}`);

    if (!normalizeTagName(input.name)) {
      this.exceptionsService.badRequestException({
        message: 'Tag name is required',
      });
    }

    return this.tagsRepository.create(input.name);
  }
}
