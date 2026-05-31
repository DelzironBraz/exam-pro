export interface QuestionAnalyticsSnapshot {
  questionId: string;
  totalAnswers: number;
  totalCorrect: number;
  totalWrong: number;
  averageTimeSeconds: number;
  accuracy: number;
}

export abstract class QuestionAnalyticsRepository {
  abstract getQuestionAnalytics(questionId: string): Promise<QuestionAnalyticsSnapshot>;
}

export const QUESTION_ANALYTICS_REPOSITORY = Symbol('QUESTION_ANALYTICS_REPOSITORY');
