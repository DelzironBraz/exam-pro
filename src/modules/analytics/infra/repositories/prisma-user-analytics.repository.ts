import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { TopicPerformanceEntity } from '../../domain/entities/topic-performance.entity';
import { UserPerformanceEntity } from '../../domain/entities/user-performance.entity';
import { UserAnalyticsRepository } from '../../domain/repositories/user-analytics.repository';
import {
  accuracy,
  aggregateStats,
  groupByTopic,
  MIN_TOPIC_SAMPLE,
  STRONG_TOPIC_ACCURACY_THRESHOLD,
  WEAK_TOPIC_ACCURACY_THRESHOLD,
} from '../helpers/answer-stats.helper';
import { loadUserAnswerRows } from '../helpers/prisma-answer-rows.loader';

@Injectable()
export class PrismaUserAnalyticsRepository
  extends PrismaRepository
  implements UserAnalyticsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async getPerformance(userId: string): Promise<UserPerformanceEntity> {
    const rows = await loadUserAnswerRows(this.prisma, userId);
    const stats = aggregateStats(rows);

    return new UserPerformanceEntity(
      userId,
      stats.total,
      stats.correct,
      stats.wrong,
      Math.round(stats.averageTimeSeconds * 100) / 100,
    );
  }

  async getWeakTopics(userId: string): Promise<TopicPerformanceEntity[]> {
    return this.getTopicsByThreshold(userId, 'weak');
  }

  async getStrongTopics(userId: string): Promise<TopicPerformanceEntity[]> {
    return this.getTopicsByThreshold(userId, 'strong');
  }

  private async getTopicsByThreshold(
    userId: string,
    mode: 'weak' | 'strong',
  ): Promise<TopicPerformanceEntity[]> {
    const rows = await loadUserAnswerRows(this.prisma, userId);
    const byTopic = groupByTopic(rows);

    const topics: TopicPerformanceEntity[] = [];

    for (const [topic, acc] of byTopic.entries()) {
      if (acc.total < MIN_TOPIC_SAMPLE) {
        continue;
      }

      const topicAccuracy = accuracy(acc.correct, acc.total);

      if (
        mode === 'weak'
          ? topicAccuracy < WEAK_TOPIC_ACCURACY_THRESHOLD
          : topicAccuracy >= STRONG_TOPIC_ACCURACY_THRESHOLD
      ) {
        topics.push(new TopicPerformanceEntity(topic, acc.total, topicAccuracy));
      }
    }

    topics.sort((a, b) =>
      mode === 'weak' ? a.accuracy - b.accuracy : b.accuracy - a.accuracy,
    );

    return topics.slice(0, 10);
  }
}
