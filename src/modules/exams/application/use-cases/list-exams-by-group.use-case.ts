import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { ExamEntity } from '../../domain/entities/exam.entity';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export interface ListExamsByGroupInput {
  groupId: string;
  page?: number;
  limit?: number;
}

export class ListExamsByGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: ListExamsByGroupInput): Promise<PaginatedResult<ExamEntity>> {
    this.logger.log(
      ListExamsByGroupUseCase.name,
      `Listing exams for group ${input.groupId}`,
    );

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const pagination = resolvePagination(input);
    const [items, total] = await Promise.all([
      this.examsRepository.findManyByGroup(input.groupId, pagination),
      this.examsRepository.countByGroup(input.groupId),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }
}
