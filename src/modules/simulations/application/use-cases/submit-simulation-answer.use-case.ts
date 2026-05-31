import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { AlternativesRepository } from '../../../questions/domain/repositories/alternatives.repository';
import { SimulationAttemptAnswerEntity } from '../../domain/entities/simulation-attempt-answer.entity';
import { SimulationAttemptAnswersRepository } from '../../domain/repositories/simulation-attempt-answers.repository';
import { SimulationAttemptsRepository } from '../../domain/repositories/simulation-attempts.repository';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export interface SubmitSimulationAnswerInput {
  attemptId: string;
  userId: string;
  questionId: string;
  selectedAlternativeId: string;
  timeSpentSeconds: number;
}

export interface SubmitSimulationAnswerOutput {
  isCorrect: boolean;
}

export class SubmitSimulationAnswerUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly simulationAttemptsRepository: SimulationAttemptsRepository,
    private readonly simulationAttemptAnswersRepository: SimulationAttemptAnswersRepository,
    private readonly alternativesRepository: AlternativesRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: SubmitSimulationAnswerInput): Promise<SubmitSimulationAnswerOutput> {
    this.logger.log(
      SubmitSimulationAnswerUseCase.name,
      `Submitting answer for attempt ${input.attemptId}`,
    );

    if (input.timeSpentSeconds < 0) {
      this.exceptionsService.badRequestException({
        message: 'timeSpentSeconds must be non-negative',
      });
    }

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

    const questionIds = await this.simulationsRepository.findQuestionIds(
      attempt.simulationId,
    );

    if (!questionIds.includes(input.questionId)) {
      this.exceptionsService.badRequestException({
        message: 'Question does not belong to this simulation',
      });
    }

    const alternatives = await this.alternativesRepository.findByQuestionId(
      input.questionId,
    );

    const selected = alternatives.find((a) => a.id === input.selectedAlternativeId);
    if (!selected) {
      this.exceptionsService.badRequestException({
        message: 'Selected alternative does not belong to this question',
      });
    }

    await this.simulationAttemptAnswersRepository.upsert(
      new SimulationAttemptAnswerEntity(
        randomUUID(),
        input.attemptId,
        input.questionId,
        input.selectedAlternativeId,
        input.timeSpentSeconds,
        selected.isCorrect,
        new Date(),
      ),
    );

    return { isCorrect: selected.isCorrect };
  }
}
