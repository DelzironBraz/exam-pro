import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import { AssessmentQuestionItem } from '../../../../shared/application/types/assessment-question-item.type';
import {
  AttemptAnswerRow,
  buildAssessmentQuestionItems,
} from '../../../../shared/application/utils/build-assessment-question-items.util';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { AlternativesRepository } from '../../../questions/domain/repositories/alternatives.repository';
import { QuestionsRepository } from '../../../questions/domain/repositories/questions.repository';
import { SimulationAttemptAnswersRepository } from '../../domain/repositories/simulation-attempt-answers.repository';
import { SimulationAttemptsRepository } from '../../domain/repositories/simulation-attempts.repository';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export interface ListSimulationQuestionsInput {
  simulationId: string;
  userId: string;
  attemptId?: string;
  page?: number;
  limit?: number;
}

export class ListSimulationQuestionsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly alternativesRepository: AlternativesRepository,
    private readonly simulationAttemptsRepository: SimulationAttemptsRepository,
    private readonly simulationAttemptAnswersRepository: SimulationAttemptAnswersRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(
    input: ListSimulationQuestionsInput,
  ): Promise<PaginatedResult<AssessmentQuestionItem>> {
    this.logger.log(
      ListSimulationQuestionsUseCase.name,
      `Listing questions for simulation ${input.simulationId}`,
    );

    const simulation = await this.simulationsRepository.findById(input.simulationId);
    if (!simulation) {
      this.exceptionsService.notFoundException({ message: 'Simulation not found' });
    }

    if (input.attemptId) {
      await this.validateAttempt(input.attemptId, input.simulationId, input.userId);
    }

    const pagination = resolvePagination(input);
    const [links, total] = await Promise.all([
      this.simulationsRepository.findQuestionLinksPaginated(input.simulationId, pagination),
      this.simulationsRepository.countQuestions(input.simulationId),
    ]);

    const questionIds = links.map((link) => link.questionId);
    const [questions, alternativesByQuestionId, answersByQuestionId] = await Promise.all([
      this.questionsRepository.findByIds(questionIds),
      this.alternativesRepository.findByQuestionIds(questionIds),
      this.loadAnswers(input.attemptId, questionIds),
    ]);

    const items = buildAssessmentQuestionItems(
      links,
      questions,
      alternativesByQuestionId,
      answersByQuestionId,
    );

    return buildPaginatedResult(items, total, pagination);
  }

  private async validateAttempt(
    attemptId: string,
    simulationId: string,
    userId: string,
  ): Promise<void> {
    const attempt = await this.simulationAttemptsRepository.findById(attemptId);
    if (!attempt) {
      this.exceptionsService.notFoundException({ message: 'Attempt not found' });
    }

    if (attempt.userId !== userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Attempt does not belong to this user',
      });
    }

    if (attempt.simulationId !== simulationId) {
      this.exceptionsService.badRequestException({
        message: 'Attempt does not belong to this simulation',
      });
    }
  }

  private async loadAnswers(
    attemptId: string | undefined,
    questionIds: string[],
  ): Promise<Map<string, AttemptAnswerRow>> {
    const map = new Map<string, AttemptAnswerRow>();
    if (!attemptId || questionIds.length === 0) {
      return map;
    }

    const answers = await this.simulationAttemptAnswersRepository.findByAttemptId(attemptId);
    const questionIdSet = new Set(questionIds);

    for (const answer of answers) {
      if (questionIdSet.has(answer.questionId) && !map.has(answer.questionId)) {
        map.set(answer.questionId, {
          questionId: answer.questionId,
          selectedAlternativeId: answer.selectedAlternativeId,
          textAnswer: answer.textAnswer,
          similarityScore: answer.similarityScore,
          answeredAt: answer.answeredAt,
        });
      }
    }

    return map;
  }
}
