export class ExamAttemptEntity {
  constructor(
    readonly id: string,
    readonly examId: string,
    readonly userId: string,
    readonly startedAt: Date,
    readonly finishedAt: Date | null,
    readonly score: number,
    readonly totalCorrect: number,
    readonly totalWrong: number,
    readonly totalTimeSeconds: number,
  ) {}
}
