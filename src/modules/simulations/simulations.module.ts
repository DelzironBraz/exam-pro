import { Module, forwardRef } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { QuestionsModule } from '../questions/questions.module';
import { SIMULATION_ATTEMPT_ANSWERS_REPOSITORY } from './domain/repositories/simulation-attempt-answers.repository';
import { SIMULATION_ATTEMPTS_REPOSITORY } from './domain/repositories/simulation-attempts.repository';
import { SIMULATIONS_REPOSITORY } from './domain/repositories/simulations.repository';
import { simulationsUseCasesProviders } from './application/services/simulations-use-cases.provider';
import { PrismaSimulationAttemptAnswersRepository } from './infra/repositories/prisma-simulation-attempt-answers.repository';
import { PrismaSimulationAttemptsRepository } from './infra/repositories/prisma-simulation-attempts.repository';
import { PrismaSimulationsRepository } from './infra/repositories/prisma-simulations.repository';
import { SimulationsController } from './presentation/controllers/simulations.controller';

@Module({
  imports: [forwardRef(() => GroupsModule), forwardRef(() => QuestionsModule)],
  controllers: [SimulationsController],
  providers: [
    PrismaSimulationsRepository,
    {
      provide: SIMULATIONS_REPOSITORY,
      useExisting: PrismaSimulationsRepository,
    },
    PrismaSimulationAttemptsRepository,
    {
      provide: SIMULATION_ATTEMPTS_REPOSITORY,
      useExisting: PrismaSimulationAttemptsRepository,
    },
    PrismaSimulationAttemptAnswersRepository,
    {
      provide: SIMULATION_ATTEMPT_ANSWERS_REPOSITORY,
      useExisting: PrismaSimulationAttemptAnswersRepository,
    },
    ...simulationsUseCasesProviders,
  ],
  exports: [SIMULATIONS_REPOSITORY, SIMULATION_ATTEMPTS_REPOSITORY],
})
export class SimulationsModule {}
