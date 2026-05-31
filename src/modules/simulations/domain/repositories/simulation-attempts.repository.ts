import { SimulationAttemptEntity } from '../entities/simulation-attempt.entity';

export interface FinishSimulationInput {
  attemptId: string;
  totalCorrect: number;
  totalWrong: number;
  totalTimeSeconds: number;
}

export abstract class SimulationAttemptsRepository {
  abstract create(attempt: SimulationAttemptEntity): Promise<SimulationAttemptEntity>;

  abstract findById(id: string): Promise<SimulationAttemptEntity | null>;

  abstract finish(attemptId: string, result: FinishSimulationInput): Promise<SimulationAttemptEntity>;
}

export const SIMULATION_ATTEMPTS_REPOSITORY = Symbol('SIMULATION_ATTEMPTS_REPOSITORY');
