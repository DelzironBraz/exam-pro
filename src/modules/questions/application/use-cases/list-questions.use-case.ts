import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';
import {
  QuestionFilters,
  QuestionsRepository,
} from '../../domain/repositories/questions.repository';

export interface ListQuestionsInput {
  groupId?: string;
  discipline?: string;
  topic?: string;
  difficulty?: DifficultyLevel;
  tags?: string[];
  page?: number;
  limit?: number;
}

export class ListQuestionsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async execute(input?: ListQuestionsInput): Promise<PaginatedResult<QuestionEntity>> {
    this.logger.log(ListQuestionsUseCase.name, 'Listing questions');

    const pagination = resolvePagination(input);
    const filters: QuestionFilters = {
      groupId: input?.groupId,
      discipline: input?.discipline,
      topic: input?.topic,
      difficulty: input?.difficulty,
      tags: input?.tags,
    };

    const [items, total] = await Promise.all([
      this.questionsRepository.findMany(filters, pagination),
      this.questionsRepository.count(filters),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }
}
