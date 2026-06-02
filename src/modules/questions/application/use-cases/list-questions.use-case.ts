import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { TagsRepository } from '../../../tags/domain/repositories/tags.repository';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';
import {
  QuestionFilters,
  QuestionsRepository,
} from '../../domain/repositories/questions.repository';
import { AlternativesRepository } from '../../domain/repositories/alternatives.repository';
import { QuestionAnswersRepository } from '../../domain/repositories/question-answers.repository';
import { ListQuestionItem } from '../types/list-question-item.type';

export interface ListQuestionsInput {
  userId: string;
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
    private readonly alternativesRepository: AlternativesRepository,
    private readonly questionAnswersRepository: QuestionAnswersRepository,
    private readonly tagsRepository: TagsRepository,
  ) {}

  async execute(input: ListQuestionsInput): Promise<PaginatedResult<ListQuestionItem>> {
    this.logger.log(ListQuestionsUseCase.name, 'Listing questions');

    const pagination = resolvePagination(input);
    const filters: QuestionFilters = {
      groupId: input.groupId,
      discipline: input.discipline,
      topic: input.topic,
      difficulty: input.difficulty,
      tags: input.tags,
    };

    const [questions, total] = await Promise.all([
      this.questionsRepository.findMany(filters, pagination),
      this.questionsRepository.count(filters),
    ]);

    const questionIds = questions.map((question) => question.id);

    const [alternativesByQuestionId, latestAnswers, tagsList] = await Promise.all([
      this.alternativesRepository.findByQuestionIds(questionIds),
      this.questionAnswersRepository.findLatestByUserForQuestions(
        input.userId,
        questionIds,
      ),
      Promise.all(
        questionIds.map((questionId) =>
          this.tagsRepository.findNamesByQuestionId(questionId),
        ),
      ),
    ]);

    const items: ListQuestionItem[] = questions.map((question, index) => {
      const lastAnswerEntity = latestAnswers.get(question.id);
      const alternatives = alternativesByQuestionId.get(question.id) ?? [];
      const correctAlternative = alternatives.find((alternative) => alternative.isCorrect);
      const lastAnswer = lastAnswerEntity
        ? {
            selectedAlternativeId: lastAnswerEntity.selectedAlternativeId,
            isCorrect: lastAnswerEntity.isCorrect,
            answeredAt: lastAnswerEntity.createdAt,
            correctAlternativeId: correctAlternative?.id,
          }
        : undefined;

      return {
        question,
        alternatives,
        tags: tagsList[index] ?? [],
        completed: latestAnswers.has(question.id),
        lastAnswer,
      };
    });

    return buildPaginatedResult(items, total, pagination);
  }
}
