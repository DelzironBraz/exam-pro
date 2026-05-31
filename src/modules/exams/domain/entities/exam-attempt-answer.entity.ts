export class ExamAttemptAnswerEntity {
  constructor(
    readonly id: string,
    readonly attemptId: string,
    readonly questionId: string,
    readonly selectedAlternativeId: string,
    readonly timeSpentSeconds: number,
    readonly isCorrect: boolean,
    readonly answeredAt: Date,
  ) {}
}
