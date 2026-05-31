import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { StudyPlanItemEntity } from '../../../study-plans/domain/entities/study-plan-item.entity';
import { StudyPlanEntity } from '../../../study-plans/domain/entities/study-plan.entity';
import { StudyPlanItemsRepository } from '../../../study-plans/domain/repositories/study-plan-items.repository';
import { StudyPlansRepository } from '../../../study-plans/domain/repositories/study-plans.repository';
import { randomUUID } from 'crypto';
import { ImportStatus } from '../../domain/enums/import-status.enum';
import { ImportType } from '../../domain/enums/import-type.enum';
import { ImportJobsRepository } from '../../domain/repositories/import-jobs.repository';
import {
  deserializeParsedStudyPlan,
  StudyPlanParsePayload,
} from '../utils/parsed-payload.serializer';

export interface ApproveParsedStudyPlanInput {
  jobId: string;
  userId: string;
  groupId: string;
  title?: string;
}

export class ApproveParsedStudyPlanUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly importJobsRepository: ImportJobsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly studyPlansRepository: StudyPlansRepository,
    private readonly studyPlanItemsRepository: StudyPlanItemsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: ApproveParsedStudyPlanInput): Promise<{ studyPlanId: string }> {
    this.logger.log(ApproveParsedStudyPlanUseCase.name, `Approving study plan ${input.jobId}`);

    const job = await this.importJobsRepository.findById(input.jobId);
    if (!job) {
      this.exceptionsService.notFoundException({ message: 'Import job not found' });
    }

    if (job.uploadedBy !== input.userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Import job does not belong to this user',
      });
    }

    if (job.type !== ImportType.STUDY_PLAN) {
      this.exceptionsService.badRequestException({ message: 'Job is not a study plan import' });
    }

    if (job.status !== ImportStatus.COMPLETED) {
      this.exceptionsService.badRequestException({
        message: 'Job must be processed before approval',
      });
    }

    const payload = job.parsedPayload as StudyPlanParsePayload | null;
    if (!payload || payload.kind !== 'study_plan') {
      this.exceptionsService.badRequestException({ message: 'Invalid parsed payload' });
    }

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const parsed = deserializeParsedStudyPlan(payload.plan);

    const plan = await this.studyPlansRepository.create(
      new StudyPlanEntity(
        randomUUID(),
        input.userId,
        input.groupId,
        input.title ?? parsed.title,
        new Date(),
      ),
    );

    const items = parsed.items.map(
      (item, index) =>
        new StudyPlanItemEntity(
          randomUUID(),
          plan.id,
          item.title,
          item.description,
          item.estimatedHours,
          index,
          false,
        ),
    );

    await this.studyPlanItemsRepository.createMany(items);

    await this.importJobsRepository.markApproved(input.jobId, plan.id);

    return { studyPlanId: plan.id };
  }
}
