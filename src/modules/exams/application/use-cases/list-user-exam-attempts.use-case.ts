import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamAttemptEntity } from '../../domain/entities/exam-attempt.entity';
import { ExamAttemptsRepository } from '../../domain/repositories/exam-attempts.repository';

export interface ListUserExamAttemptsInput {
  userId: string;
  page?: number;
  limit?: number;
}

export class ListUserExamAttemptsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examAttemptsRepository: ExamAttemptsRepository,
  ) {}

  async execute(input: ListUserExamAttemptsInput): Promise<PaginatedResult<ExamAttemptEntity>> {
    this.logger.log(
      ListUserExamAttemptsUseCase.name,
      `Listing attempts for user ${input.userId}`,
    );

    const pagination = resolvePagination(input);
    const [items, total] = await Promise.all([
      this.examAttemptsRepository.findByUser(input.userId, pagination),
      this.examAttemptsRepository.countByUser(input.userId),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }
}
