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
  ALTERNATIVES_REPOSITORY,
  AlternativesRepository,
} from '../../../questions/domain/repositories/alternatives.repository';
import {
  QUESTIONS_REPOSITORY,
  QuestionsRepository,
} from '../../../questions/domain/repositories/questions.repository';
import {
  SIMULATION_ATTEMPT_ANSWERS_REPOSITORY,
  SimulationAttemptAnswersRepository,
} from '../../domain/repositories/simulation-attempt-answers.repository';
import {
  SIMULATION_ATTEMPTS_REPOSITORY,
  SimulationAttemptsRepository,
} from '../../domain/repositories/simulation-attempts.repository';
import {
  SIMULATIONS_REPOSITORY,
  SimulationsRepository,
} from '../../domain/repositories/simulations.repository';
import { CreateSimulationUseCase } from '../use-cases/create-simulation.use-case';
import { DeleteSimulationUseCase } from '../use-cases/delete-simulation.use-case';
import { FinishSimulationUseCase } from '../use-cases/finish-simulation.use-case';
import { GetSimulationAttemptUseCase } from '../use-cases/get-simulation-attempt.use-case';
import { GetSimulationUseCase } from '../use-cases/get-simulation.use-case';
import { ListSimulationsByGroupUseCase } from '../use-cases/list-simulations-by-group.use-case';
import { StartSimulationUseCase } from '../use-cases/start-simulation.use-case';
import { SubmitSimulationAnswerUseCase } from '../use-cases/submit-simulation-answer.use-case';

export const simulationsUseCasesProviders: Provider[] = [
  {
    provide: CreateSimulationUseCase,
    useFactory: (
      logger: Logger,
      simulationsRepository: SimulationsRepository,
      groupsRepository: GroupsRepository,
      questionsRepository: QuestionsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new CreateSimulationUseCase(
        logger,
        simulationsRepository,
        groupsRepository,
        questionsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      SIMULATIONS_REPOSITORY,
      GROUPS_REPOSITORY,
      QUESTIONS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: GetSimulationUseCase,
    useFactory: (
      logger: Logger,
      simulationsRepository: SimulationsRepository,
      exceptionsService: ExceptionsService,
    ) => new GetSimulationUseCase(logger, simulationsRepository, exceptionsService),
    inject: [LOGGER, SIMULATIONS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: ListSimulationsByGroupUseCase,
    useFactory: (
      logger: Logger,
      simulationsRepository: SimulationsRepository,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new ListSimulationsByGroupUseCase(
        logger,
        simulationsRepository,
        groupsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, SIMULATIONS_REPOSITORY, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DeleteSimulationUseCase,
    useFactory: (
      logger: Logger,
      simulationsRepository: SimulationsRepository,
      exceptionsService: ExceptionsService,
    ) => new DeleteSimulationUseCase(logger, simulationsRepository, exceptionsService),
    inject: [LOGGER, SIMULATIONS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: StartSimulationUseCase,
    useFactory: (
      logger: Logger,
      simulationsRepository: SimulationsRepository,
      simulationAttemptsRepository: SimulationAttemptsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new StartSimulationUseCase(
        logger,
        simulationsRepository,
        simulationAttemptsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, SIMULATIONS_REPOSITORY, SIMULATION_ATTEMPTS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: SubmitSimulationAnswerUseCase,
    useFactory: (
      logger: Logger,
      simulationsRepository: SimulationsRepository,
      simulationAttemptsRepository: SimulationAttemptsRepository,
      simulationAttemptAnswersRepository: SimulationAttemptAnswersRepository,
      alternativesRepository: AlternativesRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new SubmitSimulationAnswerUseCase(
        logger,
        simulationsRepository,
        simulationAttemptsRepository,
        simulationAttemptAnswersRepository,
        alternativesRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      SIMULATIONS_REPOSITORY,
      SIMULATION_ATTEMPTS_REPOSITORY,
      SIMULATION_ATTEMPT_ANSWERS_REPOSITORY,
      ALTERNATIVES_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: FinishSimulationUseCase,
    useFactory: (
      logger: Logger,
      simulationsRepository: SimulationsRepository,
      simulationAttemptsRepository: SimulationAttemptsRepository,
      simulationAttemptAnswersRepository: SimulationAttemptAnswersRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new FinishSimulationUseCase(
        logger,
        simulationsRepository,
        simulationAttemptsRepository,
        simulationAttemptAnswersRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      SIMULATIONS_REPOSITORY,
      SIMULATION_ATTEMPTS_REPOSITORY,
      SIMULATION_ATTEMPT_ANSWERS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: GetSimulationAttemptUseCase,
    useFactory: (
      logger: Logger,
      simulationAttemptsRepository: SimulationAttemptsRepository,
      simulationsRepository: SimulationsRepository,
      simulationAttemptAnswersRepository: SimulationAttemptAnswersRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new GetSimulationAttemptUseCase(
        logger,
        simulationAttemptsRepository,
        simulationsRepository,
        simulationAttemptAnswersRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      SIMULATION_ATTEMPTS_REPOSITORY,
      SIMULATIONS_REPOSITORY,
      SIMULATION_ATTEMPT_ANSWERS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
];
