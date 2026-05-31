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
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository.interface';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../use-cases/delete-user.use-case';
import { GetUserUseCase } from '../use-cases/get-user.use-case';
import { GetUsersUseCase } from '../use-cases/get-users.use-case';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';

export const usersUseCasesProviders: Provider[] = [
  {
    provide: CreateUserUseCase,
    useFactory: (
      logger: Logger,
      userRepository: UserRepository,
      exceptionsService: ExceptionsService,
    ) => new CreateUserUseCase(logger, userRepository, exceptionsService),
    inject: [LOGGER, USER_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: GetUserUseCase,
    useFactory: (
      logger: Logger,
      userRepository: UserRepository,
      exceptionsService: ExceptionsService,
    ) => new GetUserUseCase(logger, userRepository, exceptionsService),
    inject: [LOGGER, USER_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: GetUsersUseCase,
    useFactory: (logger: Logger, userRepository: UserRepository) =>
      new GetUsersUseCase(logger, userRepository),
    inject: [LOGGER, USER_REPOSITORY],
  },
  {
    provide: UpdateUserUseCase,
    useFactory: (
      logger: Logger,
      userRepository: UserRepository,
      exceptionsService: ExceptionsService,
    ) => new UpdateUserUseCase(logger, userRepository, exceptionsService),
    inject: [LOGGER, USER_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DeleteUserUseCase,
    useFactory: (
      logger: Logger,
      userRepository: UserRepository,
      exceptionsService: ExceptionsService,
    ) => new DeleteUserUseCase(logger, userRepository, exceptionsService),
    inject: [LOGGER, USER_REPOSITORY, EXCEPTIONS_SERVICE],
  },
];
