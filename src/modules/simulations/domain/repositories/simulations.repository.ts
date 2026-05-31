import { SimulationEntity } from '../entities/simulation.entity';

export abstract class SimulationsRepository {
  abstract create(simulation: SimulationEntity): Promise<SimulationEntity>;

  abstract findById(id: string): Promise<SimulationEntity | null>;

  abstract update(simulation: SimulationEntity): Promise<SimulationEntity>;

  abstract delete(id: string): Promise<void>;

  abstract findManyByGroup(groupId: string): Promise<SimulationEntity[]>;

  abstract setQuestions(simulationId: string, questionIds: string[]): Promise<void>;

  abstract findQuestionIds(simulationId: string): Promise<string[]>;
}

export const SIMULATIONS_REPOSITORY = Symbol('SIMULATIONS_REPOSITORY');
