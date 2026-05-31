import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { SimulationEntity } from '../../domain/entities/simulation.entity';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export class ListSimulationsByGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(groupId: string): Promise<SimulationEntity[]> {
    this.logger.log(ListSimulationsByGroupUseCase.name, `Listing simulations for group ${groupId}`);

    const group = await this.groupsRepository.findById(groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    return this.simulationsRepository.findManyByGroup(groupId);
  }
}
