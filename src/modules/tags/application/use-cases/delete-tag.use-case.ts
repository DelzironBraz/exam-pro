import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export class DeleteTagUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(DeleteTagUseCase.name, `Deleting tag: ${id}`);

    const existing = await this.tagsRepository.findById(id);
    if (!existing) {
      this.exceptionsService.notFoundException({ message: 'Tag not found' });
    }

    await this.tagsRepository.delete(id);
  }
}
