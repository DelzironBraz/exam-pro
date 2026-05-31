import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamAttemptEntity } from '../../domain/entities/exam-attempt.entity';
import { ExamAttemptsRepository } from '../../domain/repositories/exam-attempts.repository';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export interface StartExamInput {
  examId: string;
  userId: string;
}

export class StartExamUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly examAttemptsRepository: ExamAttemptsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: StartExamInput): Promise<ExamAttemptEntity> {
    this.logger.log(StartExamUseCase.name, `Starting exam ${input.examId}`);

    const exam = await this.examsRepository.findById(input.examId);
    if (!exam) {
      this.exceptionsService.notFoundException({ message: 'Exam not found' });
    }

    const attempt = new ExamAttemptEntity(
      randomUUID(),
      input.examId,
      input.userId,
      new Date(),
      null,
      0,
      0,
      0,
      0,
    );

    return this.examAttemptsRepository.create(attempt);
  }
}
