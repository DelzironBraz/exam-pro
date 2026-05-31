import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { StudyPlansRepository } from '../../domain/repositories/study-plans.repository';

export class DeleteStudyPlanUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly studyPlansRepository: StudyPlansRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(planId: string, userId: string): Promise<void> {
    this.logger.log(DeleteStudyPlanUseCase.name, `Deleting study plan: ${planId}`);

    const existing = await this.studyPlansRepository.findById(planId);
    if (!existing) {
      this.exceptionsService.notFoundException({ message: 'Study plan not found' });
    }

    if (existing.userId !== userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Study plan does not belong to this user',
      });
    }

    await this.studyPlansRepository.delete(planId);
  }
}
