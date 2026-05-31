import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { QuestionsRepository } from '../../../questions/domain/repositories/questions.repository';
import { QuestionAnalyticsRepository } from '../../domain/repositories/question-analytics.repository';

export interface GetQuestionAnalyticsInput {
  questionId: string;
}

export interface QuestionAnalyticsOutput {
  totalAnswers: number;
  totalCorrect: number;
  totalWrong: number;
  averageTime: number;
  accuracy: number;
}

export class GetQuestionAnalyticsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly questionAnalyticsRepository: QuestionAnalyticsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: GetQuestionAnalyticsInput): Promise<QuestionAnalyticsOutput> {
    this.logger.log(
      GetQuestionAnalyticsUseCase.name,
      `Question analytics ${input.questionId}`,
    );

    const question = await this.questionsRepository.findById(input.questionId);
    if (!question) {
      this.exceptionsService.notFoundException({ message: 'Question not found' });
    }

    const snapshot = await this.questionAnalyticsRepository.getQuestionAnalytics(
      input.questionId,
    );

    return {
      totalAnswers: snapshot.totalAnswers,
      totalCorrect: snapshot.totalCorrect,
      totalWrong: snapshot.totalWrong,
      averageTime: snapshot.averageTimeSeconds,
      accuracy: snapshot.accuracy,
    };
  }
}
