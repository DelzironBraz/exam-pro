import { SimulationEntity } from '../../domain/entities/simulation.entity';

export interface SimulationListItem {
  simulation: SimulationEntity;
  totalQuestions: number;
}
