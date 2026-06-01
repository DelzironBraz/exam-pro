import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { QuestionsRepository } from '../../../questions/domain/repositories/questions.repository';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export interface ListQuestionTagsInput {
  questionId: string;
  page?: number;
  limit?: number;
}

export class ListQuestionTagsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: ListQuestionTagsInput): Promise<PaginatedResult<TagEntity>> {
    this.logger.log(
      ListQuestionTagsUseCase.name,
      `Listing tags for question ${input.questionId}`,
    );

    const question = await this.questionsRepository.findById(input.questionId);
    if (!question) {
      this.exceptionsService.notFoundException({ message: 'Question not found' });
    }

    const pagination = resolvePagination(input);
    const [items, total] = await Promise.all([
      this.tagsRepository.findByQuestionId(input.questionId, pagination),
      this.tagsRepository.countByQuestionId(input.questionId),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }

  async executeAll(questionId: string): Promise<TagEntity[]> {
    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      this.exceptionsService.notFoundException({ message: 'Question not found' });
    }

    return this.tagsRepository.findAllByQuestionId(questionId);
  }
}
