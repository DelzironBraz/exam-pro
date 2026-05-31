import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import {
  QuestionAnalyticsRepository,
  QuestionAnalyticsSnapshot,
} from '../../domain/repositories/question-analytics.repository';
import { accuracy, aggregateStats } from '../helpers/answer-stats.helper';
import { loadQuestionAnswerRows } from '../helpers/prisma-answer-rows.loader';

@Injectable()
export class PrismaQuestionAnalyticsRepository
  extends PrismaRepository
  implements QuestionAnalyticsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async getQuestionAnalytics(questionId: string): Promise<QuestionAnalyticsSnapshot> {
    const rows = await loadQuestionAnswerRows(this.prisma, questionId);
    const stats = aggregateStats(rows);

    return {
      questionId,
      totalAnswers: stats.total,
      totalCorrect: stats.correct,
      totalWrong: stats.wrong,
      averageTimeSeconds: Math.round(stats.averageTimeSeconds * 100) / 100,
      accuracy: accuracy(stats.correct, stats.total),
    };
  }
}
