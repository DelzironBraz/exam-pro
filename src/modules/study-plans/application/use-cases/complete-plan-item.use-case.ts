import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { StudyPlanItemEntity } from '../../domain/entities/study-plan-item.entity';
import { StudyPlanItemsRepository } from '../../domain/repositories/study-plan-items.repository';
import { StudyPlansRepository } from '../../domain/repositories/study-plans.repository';

export interface CompletePlanItemInput {
  itemId: string;
  userId: string;
}

export class CompletePlanItemUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly studyPlansRepository: StudyPlansRepository,
    private readonly studyPlanItemsRepository: StudyPlanItemsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: CompletePlanItemInput): Promise<StudyPlanItemEntity> {
    this.logger.log(CompletePlanItemUseCase.name, `Completing item ${input.itemId}`);

    const item = await this.studyPlanItemsRepository.findById(input.itemId);
    if (!item) {
      this.exceptionsService.notFoundException({ message: 'Plan item not found' });
    }

    const plan = await this.studyPlansRepository.findById(item.studyPlanId);
    if (!plan) {
      this.exceptionsService.notFoundException({ message: 'Study plan not found' });
    }

    if (plan.userId !== input.userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Study plan does not belong to this user',
      });
    }

    if (item.completed) {
      return item;
    }

    await this.studyPlanItemsRepository.markAsCompleted(input.itemId);

    return new StudyPlanItemEntity(
      item.id,
      item.studyPlanId,
      item.title,
      item.description,
      item.estimatedHours,
      item.order,
      true,
    );
  }
}
