import { TopicPerformanceEntity } from '../entities/topic-performance.entity';
import { UserPerformanceEntity } from '../entities/user-performance.entity';

export abstract class UserAnalyticsRepository {
  abstract getPerformance(userId: string): Promise<UserPerformanceEntity>;

  abstract getWeakTopics(userId: string): Promise<TopicPerformanceEntity[]>;

  abstract getStrongTopics(userId: string): Promise<TopicPerformanceEntity[]>;
}

export const USER_ANALYTICS_REPOSITORY = Symbol('USER_ANALYTICS_REPOSITORY');
