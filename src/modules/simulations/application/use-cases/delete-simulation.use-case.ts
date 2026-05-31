import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export class DeleteSimulationUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(DeleteSimulationUseCase.name, `Deleting simulation: ${id}`);

    const existing = await this.simulationsRepository.findById(id);
    if (!existing) {
      this.exceptionsService.notFoundException({ message: 'Simulation not found' });
    }

    await this.simulationsRepository.delete(id);
  }
}
