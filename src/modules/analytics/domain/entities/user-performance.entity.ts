export class UserPerformanceEntity {
  constructor(
    readonly userId: string,
    readonly totalQuestions: number,
    readonly totalCorrect: number,
    readonly totalWrong: number,
    readonly averageTimeSeconds: number,
  ) {}
}
