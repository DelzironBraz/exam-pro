import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { StudyPlanEntity } from '../../domain/entities/study-plan.entity';
import { StudyPlansRepository } from '../../domain/repositories/study-plans.repository';

export interface CreateStudyPlanInput {
  userId: string;
  groupId: string;
  title: string;
}

export class CreateStudyPlanUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly studyPlansRepository: StudyPlansRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: CreateStudyPlanInput): Promise<StudyPlanEntity> {
    this.logger.log(CreateStudyPlanUseCase.name, `Creating study plan: ${input.title}`);

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const plan = new StudyPlanEntity(
      randomUUID(),
      input.userId,
      input.groupId,
      input.title,
      new Date(),
    );

    return this.studyPlansRepository.create(plan);
  }
}
