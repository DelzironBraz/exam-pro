import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { StudyPlanItemEntity } from '../../domain/entities/study-plan-item.entity';
import { StudyPlanEntity } from '../../domain/entities/study-plan.entity';
import { StudyPlanItemsRepository } from '../../domain/repositories/study-plan-items.repository';
import { StudyPlansRepository } from '../../domain/repositories/study-plans.repository';

export interface GetStudyPlanOutput {
  plan: StudyPlanEntity;
  items: StudyPlanItemEntity[];
  progress: {
    totalItems: number;
    completedItems: number;
    totalEstimatedHours: number;
    completedEstimatedHours: number;
  };
}

export class GetStudyPlanUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly studyPlansRepository: StudyPlansRepository,
    private readonly studyPlanItemsRepository: StudyPlanItemsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(planId: string, userId: string): Promise<GetStudyPlanOutput> {
    this.logger.log(GetStudyPlanUseCase.name, `Getting study plan: ${planId}`);

    const plan = await this.studyPlansRepository.findById(planId);
    if (!plan) {
      this.exceptionsService.notFoundException({ message: 'Study plan not found' });
    }

    if (plan.userId !== userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Study plan does not belong to this user',
      });
    }

    const items = await this.studyPlanItemsRepository.findByPlan(planId);
    const completedItems = items.filter((item) => item.completed);

    return {
      plan,
      items,
      progress: {
        totalItems: items.length,
        completedItems: completedItems.length,
        totalEstimatedHours: items.reduce((sum, i) => sum + i.estimatedHours, 0),
        completedEstimatedHours: completedItems.reduce(
          (sum, i) => sum + i.estimatedHours,
          0,
        ),
      },
    };
  }
}
