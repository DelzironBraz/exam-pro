import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { GroupRankingEntryEntity } from '../../domain/entities/group-ranking-entry.entity';
import { TopicPerformanceEntity } from '../../domain/entities/topic-performance.entity';
import {
  GroupAnalyticsRepository,
  GroupAnalyticsSnapshot,
} from '../../domain/repositories/group-analytics.repository';
import {
  accuracy,
  aggregateStats,
  groupByTopic,
  groupByUser,
  MIN_TOPIC_SAMPLE,
} from '../helpers/answer-stats.helper';
import { loadGroupAnswerRows } from '../helpers/prisma-answer-rows.loader';

const MIN_RANKING_SAMPLE = 5;
const MAX_RANKING_SIZE = 20;

@Injectable()
export class PrismaGroupAnalyticsRepository
  extends PrismaRepository
  implements GroupAnalyticsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async getGroupAnalytics(groupId: string): Promise<GroupAnalyticsSnapshot> {
    const [rows, totalQuestions] = await Promise.all([
      loadGroupAnswerRows(this.prisma, groupId),
      this.prisma.question.count({ where: { groupId } }),
    ]);

    const stats = aggregateStats(rows);
    const topicMap = groupByTopic(rows);

    const topicBreakdown: TopicPerformanceEntity[] = [];

    for (const [topic, acc] of topicMap.entries()) {
      if (acc.total < MIN_TOPIC_SAMPLE) {
        continue;
      }

      topicBreakdown.push(
        new TopicPerformanceEntity(topic, acc.total, accuracy(acc.correct, acc.total)),
      );
    }

    topicBreakdown.sort((a, b) => a.accuracy - b.accuracy);

    const userMap = groupByUser(rows);
    const rankingCandidates: GroupRankingEntryEntity[] = [];

    for (const [userId, acc] of userMap.entries()) {
      if (acc.total < MIN_RANKING_SAMPLE) {
        continue;
      }

      rankingCandidates.push(
        new GroupRankingEntryEntity(
          userId,
          acc.total,
          accuracy(acc.correct, acc.total),
          0,
        ),
      );
    }

    rankingCandidates.sort((a, b) => {
      if (b.accuracy !== a.accuracy) {
        return b.accuracy - a.accuracy;
      }
      return b.totalAnswers - a.totalAnswers;
    });

    const ranking = rankingCandidates
      .slice(0, MAX_RANKING_SIZE)
      .map(
        (entry, index) =>
          new GroupRankingEntryEntity(
            entry.userId,
            entry.totalAnswers,
            entry.accuracy,
            index + 1,
          ),
      );

    return {
      groupId,
      totalQuestions,
      totalAnswers: stats.total,
      totalCorrect: stats.correct,
      totalWrong: stats.wrong,
      accuracy: accuracy(stats.correct, stats.total),
      averageTimeSeconds: Math.round(stats.averageTimeSeconds * 100) / 100,
      topicBreakdown,
      ranking,
    };
  }
}
