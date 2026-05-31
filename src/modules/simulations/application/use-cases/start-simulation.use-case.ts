import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { SimulationAttemptEntity } from '../../domain/entities/simulation-attempt.entity';
import { SimulationAttemptsRepository } from '../../domain/repositories/simulation-attempts.repository';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export interface StartSimulationInput {
  simulationId: string;
  userId: string;
}

export class StartSimulationUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly simulationAttemptsRepository: SimulationAttemptsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: StartSimulationInput): Promise<SimulationAttemptEntity> {
    this.logger.log(
      StartSimulationUseCase.name,
      `Starting simulation ${input.simulationId} for user ${input.userId}`,
    );

    const simulation = await this.simulationsRepository.findById(input.simulationId);
    if (!simulation) {
      this.exceptionsService.notFoundException({ message: 'Simulation not found' });
    }

    const attempt = new SimulationAttemptEntity(
      randomUUID(),
      input.simulationId,
      input.userId,
      new Date(),
      null,
      0,
      0,
      0,
    );

    return this.simulationAttemptsRepository.create(attempt);
  }
}
