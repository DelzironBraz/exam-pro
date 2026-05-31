import { Module, forwardRef } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { QuestionsModule } from '../questions/questions.module';
import { analyticsUseCasesProviders } from './application/services/analytics-use-cases.provider';
import { GROUP_ANALYTICS_REPOSITORY } from './domain/repositories/group-analytics.repository';
import { QUESTION_ANALYTICS_REPOSITORY } from './domain/repositories/question-analytics.repository';
import { USER_ANALYTICS_REPOSITORY } from './domain/repositories/user-analytics.repository';
import { PrismaGroupAnalyticsRepository } from './infra/repositories/prisma-group-analytics.repository';
import { PrismaQuestionAnalyticsRepository } from './infra/repositories/prisma-question-analytics.repository';
import { PrismaUserAnalyticsRepository } from './infra/repositories/prisma-user-analytics.repository';
import { AnalyticsController } from './presentation/controllers/analytics.controller';

@Module({
  imports: [GroupsModule, forwardRef(() => QuestionsModule)],
  controllers: [AnalyticsController],
  providers: [
    PrismaUserAnalyticsRepository,
    { provide: USER_ANALYTICS_REPOSITORY, useExisting: PrismaUserAnalyticsRepository },
    PrismaGroupAnalyticsRepository,
    { provide: GROUP_ANALYTICS_REPOSITORY, useExisting: PrismaGroupAnalyticsRepository },
    PrismaQuestionAnalyticsRepository,
    {
      provide: QUESTION_ANALYTICS_REPOSITORY,
      useExisting: PrismaQuestionAnalyticsRepository,
    },
    ...analyticsUseCasesProviders,
  ],
  exports: [
    USER_ANALYTICS_REPOSITORY,
    GROUP_ANALYTICS_REPOSITORY,
    QUESTION_ANALYTICS_REPOSITORY,
  ],
})
export class AnalyticsModule {}
