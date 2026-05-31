import { SimulationAttemptAnswerEntity } from '../entities/simulation-attempt-answer.entity';

export abstract class SimulationAttemptAnswersRepository {
  abstract upsert(answer: SimulationAttemptAnswerEntity): Promise<SimulationAttemptAnswerEntity>;

  abstract findByAttemptId(attemptId: string): Promise<SimulationAttemptAnswerEntity[]>;

  abstract countByAttemptId(attemptId: string): Promise<{ correct: number; wrong: number; totalTimeSeconds: number }>;
}

export const SIMULATION_ATTEMPT_ANSWERS_REPOSITORY = Symbol(
  'SIMULATION_ATTEMPT_ANSWERS_REPOSITORY',
);
