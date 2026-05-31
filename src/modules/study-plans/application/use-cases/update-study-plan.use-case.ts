import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { StudyPlanEntity } from '../../domain/entities/study-plan.entity';
import { StudyPlansRepository } from '../../domain/repositories/study-plans.repository';

export interface UpdateStudyPlanInput {
  planId: string;
  userId: string;
  title: string;
}

export class UpdateStudyPlanUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly studyPlansRepository: StudyPlansRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: UpdateStudyPlanInput): Promise<StudyPlanEntity> {
    this.logger.log(UpdateStudyPlanUseCase.name, `Updating study plan: ${input.planId}`);

    const existing = await this.studyPlansRepository.findById(input.planId);
    if (!existing) {
      this.exceptionsService.notFoundException({ message: 'Study plan not found' });
    }

    if (existing.userId !== input.userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Study plan does not belong to this user',
      });
    }

    const updated = new StudyPlanEntity(
      existing.id,
      existing.userId,
      existing.groupId,
      input.title,
      existing.createdAt,
    );

    return this.studyPlansRepository.update(updated);
  }
}
