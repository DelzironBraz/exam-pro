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
import { ExamAttemptAnswersRepository } from '../../domain/repositories/exam-attempt-answers.repository';
import { ExamAttemptsRepository } from '../../domain/repositories/exam-attempts.repository';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export interface ListExamQuestionsInput {
  examId: string;
  userId: string;
  attemptId?: string;
  page?: number;
  limit?: number;
}

export class ListExamQuestionsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly alternativesRepository: AlternativesRepository,
    private readonly examAttemptsRepository: ExamAttemptsRepository,
    private readonly examAttemptAnswersRepository: ExamAttemptAnswersRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: ListExamQuestionsInput): Promise<PaginatedResult<AssessmentQuestionItem>> {
    this.logger.log(ListExamQuestionsUseCase.name, `Listing questions for exam ${input.examId}`);

    const exam = await this.examsRepository.findById(input.examId);
    if (!exam) {
      this.exceptionsService.notFoundException({ message: 'Exam not found' });
    }

    if (input.attemptId) {
      await this.validateAttempt(input.attemptId, input.examId, input.userId);
    }

    const pagination = resolvePagination(input);
    const [links, total] = await Promise.all([
      this.examsRepository.findQuestionLinksPaginated(input.examId, pagination),
      this.examsRepository.countQuestions(input.examId),
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
    examId: string,
    userId: string,
  ): Promise<void> {
    const attempt = await this.examAttemptsRepository.findById(attemptId);
    if (!attempt) {
      this.exceptionsService.notFoundException({ message: 'Attempt not found' });
    }

    if (attempt.userId !== userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Attempt does not belong to this user',
      });
    }

    if (attempt.examId !== examId) {
      this.exceptionsService.badRequestException({
        message: 'Attempt does not belong to this exam',
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

    const answers = await this.examAttemptAnswersRepository.findByAttemptId(attemptId);
    const questionIdSet = new Set(questionIds);

    for (const answer of answers) {
      if (questionIdSet.has(answer.questionId) && !map.has(answer.questionId)) {
        map.set(answer.questionId, {
          questionId: answer.questionId,
          selectedAlternativeId: answer.selectedAlternativeId,
          answeredAt: answer.answeredAt,
        });
      }
    }

    return map;
  }
}
