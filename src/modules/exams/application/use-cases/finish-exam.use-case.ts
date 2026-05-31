import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamAttemptEntity } from '../../domain/entities/exam-attempt.entity';
import { ExamAttemptAnswersRepository } from '../../domain/repositories/exam-attempt-answers.repository';
import { ExamAttemptsRepository } from '../../domain/repositories/exam-attempts.repository';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export interface FinishExamInput {
  attemptId: string;
  userId: string;
  totalCorrect: number;
  totalWrong: number;
  totalTimeSeconds: number;
}

export class FinishExamUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly examAttemptsRepository: ExamAttemptsRepository,
    private readonly examAttemptAnswersRepository: ExamAttemptAnswersRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: FinishExamInput): Promise<ExamAttemptEntity> {
    this.logger.log(FinishExamUseCase.name, `Finishing exam attempt ${input.attemptId}`);

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

    const exam = await this.examsRepository.findById(attempt.examId);
    if (!exam) {
      this.exceptionsService.notFoundException({ message: 'Exam not found' });
    }

    if (input.totalTimeSeconds > exam.durationMinutes * 60) {
      this.exceptionsService.badRequestException({
        message: `Total time exceeds exam limit of ${exam.durationMinutes} minutes`,
      });
    }

    const storedAnswers =
      await this.examAttemptAnswersRepository.findByAttemptId(input.attemptId);

    let totalCorrect = input.totalCorrect;
    let totalWrong = input.totalWrong;
    let totalTimeSeconds = input.totalTimeSeconds;

    if (storedAnswers.length > 0) {
      const stats =
        await this.examAttemptAnswersRepository.countByAttemptId(input.attemptId);
      totalCorrect = stats.correct;
      totalWrong = stats.wrong;
      totalTimeSeconds = stats.totalTimeSeconds;
    }

    const totalQuestions = await this.examsRepository.countQuestions(attempt.examId);
    const score =
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 10000) / 100
        : 0;

    return this.examAttemptsRepository.finish(input.attemptId, {
      attemptId: input.attemptId,
      totalCorrect,
      totalWrong,
      totalTimeSeconds,
      score,
    });
  }
}
