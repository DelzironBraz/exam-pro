import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { GroupRankingEntryEntity } from '../../domain/entities/group-ranking-entry.entity';
import { TopicPerformanceEntity } from '../../domain/entities/topic-performance.entity';
import { GroupAnalyticsRepository } from '../../domain/repositories/group-analytics.repository';
import { buildGroupRecommendations } from '../utils/build-recommendations.util';

export interface GetGroupAnalyticsInput {
  groupId: string;
}

export interface GroupAnalyticsOutput {
  groupId: string;
  totalQuestions: number;
  totalAnswers: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  averageTimeSeconds: number;
  topicBreakdown: TopicPerformanceEntity[];
  ranking: GroupRankingEntryEntity[];
  recommendations: string[];
}

export class GetGroupAnalyticsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly groupAnalyticsRepository: GroupAnalyticsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: GetGroupAnalyticsInput): Promise<GroupAnalyticsOutput> {
    this.logger.log(GetGroupAnalyticsUseCase.name, `Group analytics ${input.groupId}`);

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const snapshot = await this.groupAnalyticsRepository.getGroupAnalytics(input.groupId);

    const weakTopics = [...snapshot.topicBreakdown]
      .filter((t) => t.accuracy < 0.55)
      .sort((a, b) => a.accuracy - b.accuracy);

    const recommendations = buildGroupRecommendations(snapshot.accuracy, weakTopics);

    return {
      groupId: snapshot.groupId,
      totalQuestions: snapshot.totalQuestions,
      totalAnswers: snapshot.totalAnswers,
      totalCorrect: snapshot.totalCorrect,
      totalWrong: snapshot.totalWrong,
      accuracy: snapshot.accuracy,
      averageTimeSeconds: snapshot.averageTimeSeconds,
      topicBreakdown: snapshot.topicBreakdown,
      ranking: snapshot.ranking,
      recommendations,
    };
  }
}
