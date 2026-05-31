import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { TimerMode } from '../../domain/enums/timer-mode.enum';
import { SimulationAttemptEntity } from '../../domain/entities/simulation-attempt.entity';
import { SimulationAttemptAnswersRepository } from '../../domain/repositories/simulation-attempt-answers.repository';
import {
  FinishSimulationInput,
  SimulationAttemptsRepository,
} from '../../domain/repositories/simulation-attempts.repository';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export class FinishSimulationUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly simulationAttemptsRepository: SimulationAttemptsRepository,
    private readonly simulationAttemptAnswersRepository: SimulationAttemptAnswersRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: FinishSimulationInput & { userId: string }): Promise<SimulationAttemptEntity> {
    this.logger.log(
      FinishSimulationUseCase.name,
      `Finishing attempt ${input.attemptId}`,
    );

    const attempt = await this.simulationAttemptsRepository.findById(input.attemptId);
    if (!attempt) {
      this.exceptionsService.notFoundException({ message: 'Attempt not found' });
    }

    if (attempt.userId !== input.userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Attempt does not belong to this user',
      });
    }

    if (attempt.finishedAt) {
      this.exceptionsService.badRequestException({
        message: 'Simulation attempt is already finished',
      });
    }

    const simulation = await this.simulationsRepository.findById(attempt.simulationId);
    if (!simulation) {
      this.exceptionsService.notFoundException({ message: 'Simulation not found' });
    }

    if (simulation.timerMode === TimerMode.FIXED && simulation.durationMinutes) {
      const maxSeconds = simulation.durationMinutes * 60;
      if (input.totalTimeSeconds > maxSeconds) {
        this.exceptionsService.badRequestException({
          message: `Total time exceeds simulation limit of ${simulation.durationMinutes} minutes`,
        });
      }
    }

    const storedAnswers =
      await this.simulationAttemptAnswersRepository.findByAttemptId(input.attemptId);

    let totalCorrect = input.totalCorrect;
    let totalWrong = input.totalWrong;
    let totalTimeSeconds = input.totalTimeSeconds;

    if (storedAnswers.length > 0) {
      const stats =
        await this.simulationAttemptAnswersRepository.countByAttemptId(input.attemptId);
      totalCorrect = stats.correct;
      totalWrong = stats.wrong;
      totalTimeSeconds = stats.totalTimeSeconds;
    }

    return this.simulationAttemptsRepository.finish(input.attemptId, {
      attemptId: input.attemptId,
      totalCorrect,
      totalWrong,
      totalTimeSeconds,
    });
  }
}
