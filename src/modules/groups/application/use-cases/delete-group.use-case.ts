import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../domain/repositories/groups.repository';

export class DeleteGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(DeleteGroupUseCase.name, `Deleting group: ${id}`);

    const existing = await this.groupsRepository.findById(id);
    if (!existing) {
      this.exceptionsService.notFoundException({
        message: 'Group not found',
      });
    }

    await this.groupsRepository.delete(id);
  }
}
