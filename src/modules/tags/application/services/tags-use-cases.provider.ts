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
  QUESTIONS_REPOSITORY,
  QuestionsRepository,
} from '../../../questions/domain/repositories/questions.repository';
import {
  TAGS_REPOSITORY,
  TagsRepository,
} from '../../domain/repositories/tags.repository';
import { AttachTagToGroupUseCase } from '../use-cases/attach-tag-to-group.use-case';
import { AttachTagToQuestionUseCase } from '../use-cases/attach-tag-to-question.use-case';
import { CreateTagUseCase } from '../use-cases/create-tag.use-case';
import { DeleteTagUseCase } from '../use-cases/delete-tag.use-case';
import { DetachTagFromGroupUseCase } from '../use-cases/detach-tag-from-group.use-case';
import { DetachTagFromQuestionUseCase } from '../use-cases/detach-tag-from-question.use-case';
import { GetTagUseCase } from '../use-cases/get-tag.use-case';
import { ListGroupTagsUseCase } from '../use-cases/list-group-tags.use-case';
import { ListQuestionTagsUseCase } from '../use-cases/list-question-tags.use-case';
import { ListTagsUseCase } from '../use-cases/list-tags.use-case';
import { SyncGroupTagsUseCase } from '../use-cases/sync-group-tags.use-case';
import { SyncQuestionTagsUseCase } from '../use-cases/sync-question-tags.use-case';

export const tagsUseCasesProviders: Provider[] = [
  {
    provide: CreateTagUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      exceptionsService: ExceptionsService,
    ) => new CreateTagUseCase(logger, tagsRepository, exceptionsService),
    inject: [LOGGER, TAGS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: ListTagsUseCase,
    useFactory: (logger: Logger, tagsRepository: TagsRepository) =>
      new ListTagsUseCase(logger, tagsRepository),
    inject: [LOGGER, TAGS_REPOSITORY],
  },
  {
    provide: GetTagUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      exceptionsService: ExceptionsService,
    ) => new GetTagUseCase(logger, tagsRepository, exceptionsService),
    inject: [LOGGER, TAGS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DeleteTagUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      exceptionsService: ExceptionsService,
    ) => new DeleteTagUseCase(logger, tagsRepository, exceptionsService),
    inject: [LOGGER, TAGS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: AttachTagToQuestionUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      questionsRepository: QuestionsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new AttachTagToQuestionUseCase(
        logger,
        tagsRepository,
        questionsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, TAGS_REPOSITORY, QUESTIONS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: AttachTagToGroupUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new AttachTagToGroupUseCase(
        logger,
        tagsRepository,
        groupsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, TAGS_REPOSITORY, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DetachTagFromQuestionUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new DetachTagFromQuestionUseCase(logger, tagsRepository, exceptionsService),
    inject: [LOGGER, TAGS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DetachTagFromGroupUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      exceptionsService: ExceptionsService,
    ) => new DetachTagFromGroupUseCase(logger, tagsRepository, exceptionsService),
    inject: [LOGGER, TAGS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: SyncQuestionTagsUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      questionsRepository: QuestionsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new SyncQuestionTagsUseCase(
        logger,
        tagsRepository,
        questionsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, TAGS_REPOSITORY, QUESTIONS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: SyncGroupTagsUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new SyncGroupTagsUseCase(
        logger,
        tagsRepository,
        groupsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, TAGS_REPOSITORY, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: ListQuestionTagsUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      questionsRepository: QuestionsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new ListQuestionTagsUseCase(
        logger,
        tagsRepository,
        questionsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, TAGS_REPOSITORY, QUESTIONS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: ListGroupTagsUseCase,
    useFactory: (
      logger: Logger,
      tagsRepository: TagsRepository,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new ListGroupTagsUseCase(
        logger,
        tagsRepository,
        groupsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, TAGS_REPOSITORY, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
];
