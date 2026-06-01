import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { StudyPlanEntity } from '../../domain/entities/study-plan.entity';
import { StudyPlansRepository } from '../../domain/repositories/study-plans.repository';

export interface ListStudyPlansInput {
  userId: string;
  page?: number;
  limit?: number;
}

export class ListStudyPlansUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly studyPlansRepository: StudyPlansRepository,
  ) {}

  async execute(input: ListStudyPlansInput): Promise<PaginatedResult<StudyPlanEntity>> {
    this.logger.log(
      ListStudyPlansUseCase.name,
      `Listing study plans for user ${input.userId}`,
    );

    const pagination = resolvePagination(input);
    const [items, total] = await Promise.all([
      this.studyPlansRepository.findByUser(input.userId, pagination),
      this.studyPlansRepository.countByUser(input.userId),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }
}
