import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { QuestionAnswerEntity } from '../../domain/entities/question-answer.entity';
import { QuestionType } from '../../domain/enums/question-type.enum';
import { AlternativesRepository } from '../../domain/repositories/alternatives.repository';
import { QuestionAnswersRepository } from '../../domain/repositories/question-answers.repository';
import { QuestionsRepository } from '../../domain/repositories/questions.repository';
import {
  evaluateQuestionAnswer,
  validateAnswerPayload,
} from '../utils/evaluate-question-answer.util';

export interface AnswerQuestionInput {
  userId: string;
  questionId: string;
  selectedAlternativeId?: string;
  textAnswer?: string;
  timeSpentSeconds: number;
}

export interface AnswerQuestionOutput {
  isCorrect: boolean;
  correctAlternativeId?: string;
  referenceAnswer?: string;
  similarityScore?: number;
  explanation?: string;
}

export class AnswerQuestionUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly questionsRepository: QuestionsRepository,
    private readonly alternativesRepository: AlternativesRepository,
    private readonly questionAnswersRepository: QuestionAnswersRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
    this.logger.log(AnswerQuestionUseCase.name, `Answering question: ${input.questionId}`);

    if (input.timeSpentSeconds < 0) {
      this.exceptionsService.badRequestException({
        message: 'timeSpentSeconds must be non-negative',
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

      const correct = alternatives.find((a) => a.isCorrect);
      if (!correct) {
        this.exceptionsService.internalServerErrorException({
          message: 'Question has no correct alternative configured',
        });
      }
    }

    const evaluated = evaluateQuestionAnswer({
      question,
      alternatives,
      selectedAlternativeId: input.selectedAlternativeId,
      textAnswer: input.textAnswer,
    });

    await this.questionAnswersRepository.create(
      new QuestionAnswerEntity(
        randomUUID(),
        input.userId,
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
      correctAlternativeId: evaluated.correctAlternativeId,
      referenceAnswer: evaluated.referenceAnswer,
      similarityScore: evaluated.similarityScore ?? undefined,
      explanation: question.explanation ?? undefined,
    };
  }
}
