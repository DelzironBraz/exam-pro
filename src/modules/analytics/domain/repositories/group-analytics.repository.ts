import { GroupRankingEntryEntity } from '../entities/group-ranking-entry.entity';
import { TopicPerformanceEntity } from '../entities/topic-performance.entity';

export interface GroupAnalyticsSnapshot {
  groupId: string;
  totalQuestions: number;
  totalAnswers: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  averageTimeSeconds: number;
  topicBreakdown: TopicPerformanceEntity[];
  ranking: GroupRankingEntryEntity[];
}

export abstract class GroupAnalyticsRepository {
  abstract getGroupAnalytics(groupId: string): Promise<GroupAnalyticsSnapshot>;
}

export const GROUP_ANALYTICS_REPOSITORY = Symbol('GROUP_ANALYTICS_REPOSITORY');
