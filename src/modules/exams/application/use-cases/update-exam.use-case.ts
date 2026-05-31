import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ExamEntity } from '../../domain/entities/exam.entity';
import { ExamsRepository } from '../../domain/repositories/exams.repository';

export interface UpdateExamInput {
  examId: string;
  title?: string;
  institution?: string;
  organization?: string;
  year?: number;
  roleName?: string;
  durationMinutes?: number;
}

export class UpdateExamUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly examsRepository: ExamsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: UpdateExamInput): Promise<ExamEntity> {
    this.logger.log(UpdateExamUseCase.name, `Updating exam: ${input.examId}`);

    const existing = await this.examsRepository.findById(input.examId);
    if (!existing) {
      this.exceptionsService.notFoundException({ message: 'Exam not found' });
    }

    if (input.durationMinutes !== undefined && input.durationMinutes < 1) {
      this.exceptionsService.badRequestException({
        message: 'durationMinutes must be at least 1',
      });
    }

    const updated = new ExamEntity(
      existing.id,
      existing.groupId,
      input.title ?? existing.title,
      input.institution ?? existing.institution,
      input.organization ?? existing.organization,
      input.year ?? existing.year,
      input.roleName ?? existing.roleName,
      input.durationMinutes ?? existing.durationMinutes,
      existing.createdAt,
    );

    return this.examsRepository.update(updated);
  }
}
