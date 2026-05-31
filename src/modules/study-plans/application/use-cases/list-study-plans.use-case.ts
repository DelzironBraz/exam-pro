import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { StudyPlanEntity } from '../../domain/entities/study-plan.entity';
import { StudyPlansRepository } from '../../domain/repositories/study-plans.repository';

export class ListStudyPlansUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly studyPlansRepository: StudyPlansRepository,
  ) {}

  async execute(userId: string): Promise<StudyPlanEntity[]> {
    this.logger.log(ListStudyPlansUseCase.name, `Listing study plans for user ${userId}`);
    return this.studyPlansRepository.findByUser(userId);
  }
}
