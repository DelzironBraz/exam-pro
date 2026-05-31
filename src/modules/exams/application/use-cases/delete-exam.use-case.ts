import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export class DeleteExamUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(DeleteExamUseCase.name, `Deleting exam: ${id}`);

    const existing = await this.examsRepository.findById(id);
    if (!existing) {
      this.exceptionsService.notFoundException({ message: 'Exam not found' });
    }

    await this.examsRepository.delete(id);
  }
}
