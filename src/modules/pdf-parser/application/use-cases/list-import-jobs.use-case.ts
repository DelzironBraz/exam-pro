import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ImportJobEntity } from '../../domain/entities/import-job.entity';
import { ImportJobsRepository } from '../../domain/repositories/import-jobs.repository';

export interface ListImportJobsInput {
  userId: string;
  page?: number;
  limit?: number;
}

export class ListImportJobsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly importJobsRepository: ImportJobsRepository,
  ) {}

  async execute(input: ListImportJobsInput): Promise<PaginatedResult<ImportJobEntity>> {
    this.logger.log(ListImportJobsUseCase.name, `Listing import jobs for ${input.userId}`);

    const pagination = resolvePagination(input);
    const [items, total] = await Promise.all([
      this.importJobsRepository.findByUser(input.userId, pagination),
      this.importJobsRepository.countByUser(input.userId),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }
}
