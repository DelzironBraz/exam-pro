import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { StudyPlanItemEntity } from '../../domain/entities/study-plan-item.entity';
import { StudyPlanItemsRepository } from '../../domain/repositories/study-plan-items.repository';
import { StudyPlansRepository } from '../../domain/repositories/study-plans.repository';

export interface AddPlanItemInput {
  studyPlanId: string;
  userId: string;
  title: string;
  description: string;
  estimatedHours: number;
}

export class AddPlanItemUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly studyPlansRepository: StudyPlansRepository,
    private readonly studyPlanItemsRepository: StudyPlanItemsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: AddPlanItemInput): Promise<StudyPlanItemEntity> {
    this.logger.log(AddPlanItemUseCase.name, `Adding item to plan ${input.studyPlanId}`);

    if (input.estimatedHours < 1) {
      this.exceptionsService.badRequestException({
        message: 'estimatedHours must be at least 1',
      });
    }

    const plan = await this.studyPlansRepository.findById(input.studyPlanId);
    if (!plan) {
      this.exceptionsService.notFoundException({ message: 'Study plan not found' });
    }

    if (plan.userId !== input.userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Study plan does not belong to this user',
      });
    }

    const order = await this.studyPlanItemsRepository.getNextOrder(input.studyPlanId);

    const item = new StudyPlanItemEntity(
      randomUUID(),
      input.studyPlanId,
      input.title,
      input.description,
      input.estimatedHours,
      order,
      false,
    );

    await this.studyPlanItemsRepository.createMany([item]);

    return item;
  }
}
