import { Provider } from '@nestjs/common';
import {
  EXCEPTIONS_SERVICE,
  ExceptionsService,
} from '../../../../shared/domain/exceptions/exceptions.interface';
import {
  LOGGER,
  Logger,
} from '../../../../shared/domain/logger/logger.interface';
import {
  GROUPS_REPOSITORY,
  GroupsRepository,
} from '../../../groups/domain/repositories/groups.repository';
import {
  STUDY_PLAN_ITEMS_REPOSITORY,
  StudyPlanItemsRepository,
} from '../../domain/repositories/study-plan-items.repository';
import {
  STUDY_PLANS_REPOSITORY,
  StudyPlansRepository,
} from '../../domain/repositories/study-plans.repository';
import { AddPlanItemUseCase } from '../use-cases/add-plan-item.use-case';
import { CompletePlanItemUseCase } from '../use-cases/complete-plan-item.use-case';
import { CreateStudyPlanUseCase } from '../use-cases/create-study-plan.use-case';
import { DeleteStudyPlanUseCase } from '../use-cases/delete-study-plan.use-case';
import { GetStudyPlanUseCase } from '../use-cases/get-study-plan.use-case';
import { ListStudyPlansUseCase } from '../use-cases/list-study-plans.use-case';
import { UpdateStudyPlanUseCase } from '../use-cases/update-study-plan.use-case';

export const studyPlansUseCasesProviders: Provider[] = [
  {
    provide: CreateStudyPlanUseCase,
    useFactory: (
      logger: Logger,
      studyPlansRepository: StudyPlansRepository,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new CreateStudyPlanUseCase(
        logger,
        studyPlansRepository,
        groupsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, STUDY_PLANS_REPOSITORY, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: GetStudyPlanUseCase,
    useFactory: (
      logger: Logger,
      studyPlansRepository: StudyPlansRepository,
      studyPlanItemsRepository: StudyPlanItemsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new GetStudyPlanUseCase(
        logger,
        studyPlansRepository,
        studyPlanItemsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      STUDY_PLANS_REPOSITORY,
      STUDY_PLAN_ITEMS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: ListStudyPlansUseCase,
    useFactory: (logger: Logger, studyPlansRepository: StudyPlansRepository) =>
      new ListStudyPlansUseCase(logger, studyPlansRepository),
    inject: [LOGGER, STUDY_PLANS_REPOSITORY],
  },
  {
    provide: UpdateStudyPlanUseCase,
    useFactory: (
      logger: Logger,
      studyPlansRepository: StudyPlansRepository,
      exceptionsService: ExceptionsService,
    ) => new UpdateStudyPlanUseCase(logger, studyPlansRepository, exceptionsService),
    inject: [LOGGER, STUDY_PLANS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DeleteStudyPlanUseCase,
    useFactory: (
      logger: Logger,
      studyPlansRepository: StudyPlansRepository,
      exceptionsService: ExceptionsService,
    ) => new DeleteStudyPlanUseCase(logger, studyPlansRepository, exceptionsService),
    inject: [LOGGER, STUDY_PLANS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: AddPlanItemUseCase,
    useFactory: (
      logger: Logger,
      studyPlansRepository: StudyPlansRepository,
      studyPlanItemsRepository: StudyPlanItemsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new AddPlanItemUseCase(
        logger,
        studyPlansRepository,
        studyPlanItemsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      STUDY_PLANS_REPOSITORY,
      STUDY_PLAN_ITEMS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: CompletePlanItemUseCase,
    useFactory: (
      logger: Logger,
      studyPlansRepository: StudyPlansRepository,
      studyPlanItemsRepository: StudyPlanItemsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new CompletePlanItemUseCase(
        logger,
        studyPlansRepository,
        studyPlanItemsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      STUDY_PLANS_REPOSITORY,
      STUDY_PLAN_ITEMS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
];
