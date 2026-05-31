import { Provider } from '@nestjs/common';
import {
  EXCEPTIONS_SERVICE,
  ExceptionsService,
} from '../../../../shared/domain/exceptions/exceptions.interface';
import {
  LOGGER,
  Logger,
} from '../../../../shared/domain/logger/logger.interface';
import { GROUPS_REPOSITORY, GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import {
  QUESTIONS_REPOSITORY,
  QuestionsRepository,
} from '../../../questions/domain/repositories/questions.repository';
import {
  GROUP_ANALYTICS_REPOSITORY,
  GroupAnalyticsRepository,
} from '../../domain/repositories/group-analytics.repository';
import {
  QUESTION_ANALYTICS_REPOSITORY,
  QuestionAnalyticsRepository,
} from '../../domain/repositories/question-analytics.repository';
import {
  USER_ANALYTICS_REPOSITORY,
  UserAnalyticsRepository,
} from '../../domain/repositories/user-analytics.repository';
import { GetDashboardUseCase } from '../use-cases/get-dashboard.use-case';
import { GetGroupAnalyticsUseCase } from '../use-cases/get-group-analytics.use-case';
import { GetQuestionAnalyticsUseCase } from '../use-cases/get-question-analytics.use-case';

export const analyticsUseCasesProviders: Provider[] = [
  {
    provide: GetDashboardUseCase,
    useFactory: (logger: Logger, userAnalyticsRepository: UserAnalyticsRepository) =>
      new GetDashboardUseCase(logger, userAnalyticsRepository),
    inject: [LOGGER, USER_ANALYTICS_REPOSITORY],
  },
  {
    provide: GetGroupAnalyticsUseCase,
    useFactory: (
      logger: Logger,
      groupAnalyticsRepository: GroupAnalyticsRepository,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new GetGroupAnalyticsUseCase(
        logger,
        groupAnalyticsRepository,
        groupsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      GROUP_ANALYTICS_REPOSITORY,
      GROUPS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: GetQuestionAnalyticsUseCase,
    useFactory: (
      logger: Logger,
      questionAnalyticsRepository: QuestionAnalyticsRepository,
      questionsRepository: QuestionsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new GetQuestionAnalyticsUseCase(
        logger,
        questionAnalyticsRepository,
        questionsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      QUESTION_ANALYTICS_REPOSITORY,
      QUESTIONS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
];
