export class TopicPerformanceEntity {
  constructor(
    readonly topic: string,
    readonly totalQuestions: number,
    readonly accuracy: number,
  ) {}
}
