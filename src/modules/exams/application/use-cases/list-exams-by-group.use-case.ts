import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { ExamsRepository } from '../../domain/repositories/exams.repository';
import { ExamListItem } from '../types/exam-list-item.type';

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

  async execute(input: ListExamsByGroupInput): Promise<PaginatedResult<ExamListItem>> {
    this.logger.log(
      ListExamsByGroupUseCase.name,
      `Listing exams for group ${input.groupId}`,
    );

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const pagination = resolvePagination(input);
    const [exams, total] = await Promise.all([
      this.examsRepository.findManyByGroup(input.groupId, pagination),
      this.examsRepository.countByGroup(input.groupId),
    ]);

    const examIds = exams.map((exam) => exam.id);
    const questionCounts = await this.examsRepository.countQuestionsByExamIds(examIds);

    const items: ExamListItem[] = exams.map((exam) => ({
      exam,
      totalQuestions: questionCounts.get(exam.id) ?? 0,
    }));

    return buildPaginatedResult(items, total, pagination);
  }
}
