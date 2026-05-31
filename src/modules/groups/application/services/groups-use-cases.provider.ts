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
  TAGS_REPOSITORY,
  TagsRepository,
} from '../../../tags/domain/repositories/tags.repository';
import {
  GROUPS_REPOSITORY,
  GroupsRepository,
} from '../../domain/repositories/groups.repository';
import { CreateGroupUseCase } from '../use-cases/create-group.use-case';
import { DeleteGroupUseCase } from '../use-cases/delete-group.use-case';
import { GetGroupUseCase } from '../use-cases/get-group.use-case';
import { ListGroupsUseCase } from '../use-cases/list-groups.use-case';
import { UpdateGroupUseCase } from '../use-cases/update-group.use-case';

export const groupsUseCasesProviders: Provider[] = [
  {
    provide: CreateGroupUseCase,
    useFactory: (
      logger: Logger,
      groupsRepository: GroupsRepository,
      tagsRepository: TagsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new CreateGroupUseCase(
        logger,
        groupsRepository,
        tagsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, GROUPS_REPOSITORY, TAGS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: GetGroupUseCase,
    useFactory: (
      logger: Logger,
      groupsRepository: GroupsRepository,
      tagsRepository: TagsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new GetGroupUseCase(
        logger,
        groupsRepository,
        tagsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, GROUPS_REPOSITORY, TAGS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: ListGroupsUseCase,
    useFactory: (logger: Logger, groupsRepository: GroupsRepository) =>
      new ListGroupsUseCase(logger, groupsRepository),
    inject: [LOGGER, GROUPS_REPOSITORY],
  },
  {
    provide: UpdateGroupUseCase,
    useFactory: (
      logger: Logger,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) => new UpdateGroupUseCase(logger, groupsRepository, exceptionsService),
    inject: [LOGGER, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DeleteGroupUseCase,
    useFactory: (
      logger: Logger,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) => new DeleteGroupUseCase(logger, groupsRepository, exceptionsService),
    inject: [LOGGER, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
];
