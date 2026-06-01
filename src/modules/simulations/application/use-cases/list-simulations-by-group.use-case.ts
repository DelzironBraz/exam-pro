import { PaginatedResult } from '../../../../shared/application/types/pagination.types';
import {
  buildPaginatedResult,
  resolvePagination,
} from '../../../../shared/application/utils/pagination.util';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { SimulationEntity } from '../../domain/entities/simulation.entity';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export interface ListSimulationsByGroupInput {
  groupId: string;
  page?: number;
  limit?: number;
}

export class ListSimulationsByGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(
    input: ListSimulationsByGroupInput,
  ): Promise<PaginatedResult<SimulationEntity>> {
    this.logger.log(
      ListSimulationsByGroupUseCase.name,
      `Listing simulations for group ${input.groupId}`,
    );

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const pagination = resolvePagination(input);
    const [items, total] = await Promise.all([
      this.simulationsRepository.findManyByGroup(input.groupId, pagination),
      this.simulationsRepository.countByGroup(input.groupId),
    ]);

    return buildPaginatedResult(items, total, pagination);
  }
}
