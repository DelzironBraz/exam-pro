import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamAttemptAnswerEntity } from '../../domain/entities/exam-attempt-answer.entity';
import { ExamAttemptEntity } from '../../domain/entities/exam-attempt.entity';
import { ExamEntity } from '../../domain/entities/exam.entity';
import { ExamAttemptAnswersRepository } from '../../domain/repositories/exam-attempt-answers.repository';
import { ExamAttemptsRepository } from '../../domain/repositories/exam-attempts.repository';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export interface GetExamAttemptOutput {
  attempt: ExamAttemptEntity;
  exam: ExamEntity;
  answers: ExamAttemptAnswerEntity[];
  totalQuestions: number;
}

export class GetExamAttemptUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examAttemptsRepository: ExamAttemptsRepository,
    private readonly examsRepository: ExamsRepository,
    private readonly examAttemptAnswersRepository: ExamAttemptAnswersRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(attemptId: string, userId: string): Promise<GetExamAttemptOutput> {
    this.logger.log(GetExamAttemptUseCase.name, `Getting exam attempt ${attemptId}`);

    const attempt = await this.examAttemptsRepository.findById(attemptId);
    if (!attempt) {
      this.exceptionsService.notFoundException({ message: 'Attempt not found' });
    }

    if (attempt.userId !== userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Attempt does not belong to this user',
      });
    }

    const exam = await this.examsRepository.findById(attempt.examId);
    if (!exam) {
      this.exceptionsService.notFoundException({ message: 'Exam not found' });
    }

    const [answers, totalQuestions] = await Promise.all([
      this.examAttemptAnswersRepository.findByAttemptId(attemptId),
      this.examsRepository.countQuestions(attempt.examId),
    ]);

    return { attempt, exam, answers, totalQuestions };
  }
}
