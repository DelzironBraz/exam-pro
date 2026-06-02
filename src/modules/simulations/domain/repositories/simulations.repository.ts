import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { SimulationEntity } from '../entities/simulation.entity';

export interface SimulationQuestionLinkRow {
  questionId: string;
  sortOrder: number;
}

export abstract class SimulationsRepository {
  abstract create(simulation: SimulationEntity): Promise<SimulationEntity>;

  abstract findById(id: string): Promise<SimulationEntity | null>;

  abstract update(simulation: SimulationEntity): Promise<SimulationEntity>;

  abstract delete(id: string): Promise<void>;

  abstract findManyByGroup(
    groupId: string,
    pagination: PaginationParams,
  ): Promise<SimulationEntity[]>;

  abstract countByGroup(groupId: string): Promise<number>;

  abstract countQuestionsBySimulationIds(simulationIds: string[]): Promise<Map<string, number>>;

  abstract setQuestions(simulationId: string, questionIds: string[]): Promise<void>;

  abstract findQuestionIds(simulationId: string): Promise<string[]>;

  abstract findQuestionLinksPaginated(
    simulationId: string,
    pagination: PaginationParams,
  ): Promise<SimulationQuestionLinkRow[]>;

  abstract countQuestions(simulationId: string): Promise<number>;
}

export const SIMULATIONS_REPOSITORY = Symbol('SIMULATIONS_REPOSITORY');
