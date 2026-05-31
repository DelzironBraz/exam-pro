import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ImportJobEntity } from '../../domain/entities/import-job.entity';
import { ImportJobsRepository } from '../../domain/repositories/import-jobs.repository';

export class ListImportJobsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly importJobsRepository: ImportJobsRepository,
  ) {}

  async execute(userId: string): Promise<ImportJobEntity[]> {
    this.logger.log(ListImportJobsUseCase.name, `Listing import jobs for ${userId}`);
    return this.importJobsRepository.findByUser(userId);
  }
}
