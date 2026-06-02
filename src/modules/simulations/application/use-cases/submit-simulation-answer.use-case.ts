import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import {
  evaluateQuestionAnswer,
  validateAnswerPayload,
} from '../../../questions/application/utils/evaluate-question-answer.util';
import { QuestionType } from '../../../questions/domain/enums/question-type.enum';
import { AlternativesRepository } from '../../../questions/domain/repositories/alternatives.repository';
import { QuestionsRepository } from '../../../questions/domain/repositories/questions.repository';
import { SimulationAttemptAnswerEntity } from '../../domain/entities/simulation-attempt-answer.entity';
import { SimulationAttemptAnswersRepository } from '../../domain/repositories/simulation-attempt-answers.repository';
import { SimulationAttemptsRepository } from '../../domain/repositories/simulation-attempts.repository';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export interface SubmitSimulationAnswerInput {
  attemptId: string;
  userId: string;
  questionId: string;
  selectedAlternativeId?: string;
  textAnswer?: string;
  timeSpentSeconds: number;
}

export interface SubmitSimulationAnswerOutput {
  isCorrect: boolean;
  similarityScore?: number;
}

export class SubmitSimulationAnswerUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly simulationAttemptsRepository: SimulationAttemptsRepository,
    private readonly simulationAttemptAnswersRepository: SimulationAttemptAnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
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

    const question = await this.questionsRepository.findById(input.questionId);
    if (!question) {
      this.exceptionsService.notFoundException({ message: 'Question not found' });
    }

    const validationError = validateAnswerPayload(question, input);
    if (validationError) {
      this.exceptionsService.badRequestException({ message: validationError });
    }

    const alternatives = await this.alternativesRepository.findByQuestionId(
      input.questionId,
    );

    if (question.type === QuestionType.MULTIPLE_CHOICE) {
      const selected = alternatives.find((a) => a.id === input.selectedAlternativeId);
      if (!selected) {
        this.exceptionsService.badRequestException({
          message: 'Selected alternative does not belong to this question',
        });
      }
    }

    const evaluated = evaluateQuestionAnswer({
      question,
      alternatives,
      selectedAlternativeId: input.selectedAlternativeId,
      textAnswer: input.textAnswer,
    });

    await this.simulationAttemptAnswersRepository.upsert(
      new SimulationAttemptAnswerEntity(
        randomUUID(),
        input.attemptId,
        input.questionId,
        evaluated.selectedAlternativeId,
        evaluated.textAnswer,
        evaluated.similarityScore,
        input.timeSpentSeconds,
        evaluated.isCorrect,
        new Date(),
      ),
    );

    return {
      isCorrect: evaluated.isCorrect,
      similarityScore: evaluated.similarityScore ?? undefined,
    };
  }
}
