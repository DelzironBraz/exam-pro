import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { UserAnalyticsRepository } from '../../domain/repositories/user-analytics.repository';
import { buildUserRecommendations } from '../utils/build-recommendations.util';

export interface GetDashboardInput {
  userId: string;
}

export interface DashboardOutput {
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  averageTime: number;
  weakTopics: string[];
  strongTopics: string[];
  recommendations: string[];
}

export class GetDashboardUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly userAnalyticsRepository: UserAnalyticsRepository,
  ) {}

  async execute(input: GetDashboardInput): Promise<DashboardOutput> {
    this.logger.log(GetDashboardUseCase.name, `Dashboard for user ${input.userId}`);

    const [performance, weakTopics, strongTopics] = await Promise.all([
      this.userAnalyticsRepository.getPerformance(input.userId),
      this.userAnalyticsRepository.getWeakTopics(input.userId),
      this.userAnalyticsRepository.getStrongTopics(input.userId),
    ]);

    const accuracy =
      performance.totalQuestions === 0
        ? 0
        : Math.round((performance.totalCorrect / performance.totalQuestions) * 10000) /
          10000;

    const recommendations = buildUserRecommendations(accuracy, weakTopics);

    return {
      totalQuestions: performance.totalQuestions,
      totalCorrect: performance.totalCorrect,
      totalWrong: performance.totalWrong,
      accuracy,
      averageTime: performance.averageTimeSeconds,
      weakTopics: weakTopics.map((t) => t.topic),
      strongTopics: strongTopics.map((t) => t.topic),
      recommendations,
    };
  }
}
