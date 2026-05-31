import { GroupRankingEntryEntity } from '../../domain/entities/group-ranking-entry.entity';
import { TopicPerformanceEntity } from '../../domain/entities/topic-performance.entity';
import { DashboardOutput } from '../../application/use-cases/get-dashboard.use-case';
import { GroupAnalyticsOutput } from '../../application/use-cases/get-group-analytics.use-case';
import { QuestionAnalyticsOutput } from '../../application/use-cases/get-question-analytics.use-case';

export class TopicPerformanceResponse {
  topic: string;
  totalQuestions: number;
  accuracy: number;

  constructor(entity: TopicPerformanceEntity) {
    this.topic = entity.topic;
    this.totalQuestions = entity.totalQuestions;
    this.accuracy = entity.accuracy;
  }
}

export class GroupRankingResponse {
  userId: string;
  totalAnswers: number;
  accuracy: number;
  rank: number;

  constructor(entity: GroupRankingEntryEntity) {
    this.userId = entity.userId;
    this.totalAnswers = entity.totalAnswers;
    this.accuracy = entity.accuracy;
    this.rank = entity.rank;
  }
}

export class DashboardResponse {
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  averageTime: number;
  weakTopics: string[];
  strongTopics: string[];
  recommendations: string[];

  constructor(output: DashboardOutput) {
    this.totalQuestions = output.totalQuestions;
    this.totalCorrect = output.totalCorrect;
    this.totalWrong = output.totalWrong;
    this.accuracy = output.accuracy;
    this.averageTime = output.averageTime;
    this.weakTopics = output.weakTopics;
    this.strongTopics = output.strongTopics;
    this.recommendations = output.recommendations;
  }
}

export class GroupAnalyticsResponse {
  groupId: string;
  totalQuestions: number;
  totalAnswers: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  averageTimeSeconds: number;
  topicBreakdown: TopicPerformanceResponse[];
  ranking: GroupRankingResponse[];
  recommendations: string[];

  constructor(output: GroupAnalyticsOutput) {
    this.groupId = output.groupId;
    this.totalQuestions = output.totalQuestions;
    this.totalAnswers = output.totalAnswers;
    this.totalCorrect = output.totalCorrect;
    this.totalWrong = output.totalWrong;
    this.accuracy = output.accuracy;
    this.averageTimeSeconds = output.averageTimeSeconds;
    this.topicBreakdown = output.topicBreakdown.map((t) => new TopicPerformanceResponse(t));
    this.ranking = output.ranking.map((r) => new GroupRankingResponse(r));
    this.recommendations = output.recommendations;
  }
}

export class QuestionAnalyticsResponse {
  totalAnswers: number;
  totalCorrect: number;
  totalWrong: number;
  averageTime: number;
  accuracy: number;

  constructor(output: QuestionAnalyticsOutput) {
    this.totalAnswers = output.totalAnswers;
    this.totalCorrect = output.totalCorrect;
    this.totalWrong = output.totalWrong;
    this.averageTime = output.averageTime;
    this.accuracy = output.accuracy;
  }
}
