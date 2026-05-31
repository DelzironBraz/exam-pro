import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { SimulationEntity } from '../../domain/entities/simulation.entity';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export interface GetSimulationOutput {
  simulation: SimulationEntity;
  questionIds: string[];
}

export class GetSimulationUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<GetSimulationOutput> {
    this.logger.log(GetSimulationUseCase.name, `Getting simulation: ${id}`);

    const simulation = await this.simulationsRepository.findById(id);
    if (!simulation) {
      this.exceptionsService.notFoundException({ message: 'Simulation not found' });
    }

    const questionIds = await this.simulationsRepository.findQuestionIds(id);

    return { simulation, questionIds };
  }
}
