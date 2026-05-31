import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { AlternativesRepository } from '../../../questions/domain/repositories/alternatives.repository';
import { ExamAttemptAnswerEntity } from '../../domain/entities/exam-attempt-answer.entity';
import { ExamAttemptAnswersRepository } from '../../domain/repositories/exam-attempt-answers.repository';
import { ExamAttemptsRepository } from '../../domain/repositories/exam-attempts.repository';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export interface SubmitExamAnswerInput {
  attemptId: string;
  userId: string;
  questionId: string;
  selectedAlternativeId: string;
  timeSpentSeconds: number;
}

export class SubmitExamAnswerUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly examAttemptsRepository: ExamAttemptsRepository,
    private readonly examAttemptAnswersRepository: ExamAttemptAnswersRepository,
    private readonly alternativesRepository: AlternativesRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: SubmitExamAnswerInput): Promise<{ isCorrect: boolean }> {
    this.logger.log(SubmitExamAnswerUseCase.name, `Submitting exam answer`);

    if (input.timeSpentSeconds < 0) {
      this.exceptionsService.badRequestException({
        message: 'timeSpentSeconds must be non-negative',
      });
    }

    const attempt = await this.examAttemptsRepository.findById(input.attemptId);
    if (!attempt) {
      this.exceptionsService.notFoundException({ message: 'Attempt not found' });
    }

    if (attempt.userId !== input.userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Attempt does not belong to this user',
      });
    }

    if (attempt.finishedAt) {
      this.exceptionsService.badRequestException({
        message: 'Exam attempt is already finished',
      });
    }

    const questionIds = await this.examsRepository.findQuestionIds(attempt.examId);
    if (!questionIds.includes(input.questionId)) {
      this.exceptionsService.badRequestException({
        message: 'Question does not belong to this exam',
      });
    }

    const alternatives = await this.alternativesRepository.findByQuestionId(
      input.questionId,
    );
    const selected = alternatives.find((a) => a.id === input.selectedAlternativeId);
    if (!selected) {
      this.exceptionsService.badRequestException({
        message: 'Selected alternative does not belong to this question',
      });
    }

    await this.examAttemptAnswersRepository.upsert(
      new ExamAttemptAnswerEntity(
        randomUUID(),
        input.attemptId,
        input.questionId,
        input.selectedAlternativeId,
        input.timeSpentSeconds,
        selected.isCorrect,
        new Date(),
      ),
    );

    return { isCorrect: selected.isCorrect };
  }
}
