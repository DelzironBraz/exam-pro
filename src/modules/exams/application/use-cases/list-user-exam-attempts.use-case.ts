import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamAttemptEntity } from '../../domain/entities/exam-attempt.entity';
import { ExamAttemptsRepository } from '../../domain/repositories/exam-attempts.repository';

export class ListUserExamAttemptsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examAttemptsRepository: ExamAttemptsRepository,
  ) {}

  async execute(userId: string): Promise<ExamAttemptEntity[]> {
    this.logger.log(ListUserExamAttemptsUseCase.name, `Listing attempts for user ${userId}`);
    return this.examAttemptsRepository.findByUser(userId);
  }
}
