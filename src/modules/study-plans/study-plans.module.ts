import { Module, forwardRef } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { STUDY_PLAN_ITEMS_REPOSITORY } from './domain/repositories/study-plan-items.repository';
import { STUDY_PLANS_REPOSITORY } from './domain/repositories/study-plans.repository';
import { studyPlansUseCasesProviders } from './application/services/study-plans-use-cases.provider';
import { PrismaStudyPlanItemsRepository } from './infra/repositories/prisma-study-plan-items.repository';
import { PrismaStudyPlansRepository } from './infra/repositories/prisma-study-plans.repository';
import { StudyPlansController } from './presentation/controllers/study-plans.controller';

@Module({
  imports: [forwardRef(() => GroupsModule)],
  controllers: [StudyPlansController],
  providers: [
    PrismaStudyPlansRepository,
    {
      provide: STUDY_PLANS_REPOSITORY,
      useExisting: PrismaStudyPlansRepository,
    },
    PrismaStudyPlanItemsRepository,
    {
      provide: STUDY_PLAN_ITEMS_REPOSITORY,
      useExisting: PrismaStudyPlanItemsRepository,
    },
    ...studyPlansUseCasesProviders,
  ],
  exports: [STUDY_PLANS_REPOSITORY, STUDY_PLAN_ITEMS_REPOSITORY],
})
export class StudyPlansModule {}
