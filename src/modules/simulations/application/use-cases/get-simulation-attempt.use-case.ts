import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { SimulationAttemptAnswerEntity } from '../../domain/entities/simulation-attempt-answer.entity';
import { SimulationAttemptEntity } from '../../domain/entities/simulation-attempt.entity';
import { SimulationEntity } from '../../domain/entities/simulation.entity';
import { SimulationAttemptAnswersRepository } from '../../domain/repositories/simulation-attempt-answers.repository';
import { SimulationAttemptsRepository } from '../../domain/repositories/simulation-attempts.repository';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export interface GetSimulationAttemptOutput {
  attempt: SimulationAttemptEntity;
  simulation: SimulationEntity;
  answers: SimulationAttemptAnswerEntity[];
  totalQuestions: number;
}

export class GetSimulationAttemptUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationAttemptsRepository: SimulationAttemptsRepository,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly simulationAttemptAnswersRepository: SimulationAttemptAnswersRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(attemptId: string, userId: string): Promise<GetSimulationAttemptOutput> {
    this.logger.log(GetSimulationAttemptUseCase.name, `Getting attempt ${attemptId}`);

    const attempt = await this.simulationAttemptsRepository.findById(attemptId);
    if (!attempt) {
      this.exceptionsService.notFoundException({ message: 'Attempt not found' });
    }

    if (attempt.userId !== userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Attempt does not belong to this user',
      });
    }

    const simulation = await this.simulationsRepository.findById(attempt.simulationId);
    if (!simulation) {
      this.exceptionsService.notFoundException({ message: 'Simulation not found' });
    }

    const [answers, questionIds] = await Promise.all([
      this.simulationAttemptAnswersRepository.findByAttemptId(attemptId),
      this.simulationsRepository.findQuestionIds(attempt.simulationId),
    ]);

    return {
      attempt,
      simulation,
      answers,
      totalQuestions: questionIds.length,
    };
  }
}
